import { Router } from 'express';
import { prisma } from '../config/index.js';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();

// Get orders endpoint
router.get('/', authenticateToken, async (req, res) => {
  try {
    const user = req.user;
    let where: any = {};

    if (user.role === 'CUSTOMER') {
      where.customerId = user.userId;
    } else if (user.role === 'SEAMSTRESS') {
      where.seamstressId = user.userId;
    } else if (user.role === 'DESIGNER') {
      // For designers, show orders for their designs
      const designIds = await prisma.design.findMany({
        where: { designerId: user.userId },
        select: { id: true }
      });
      where.designId = { in: designIds.map(d => d.id) };
    }
    // Admin can see all

    const orders = await prisma.order.findMany({
      where,
      include: { design: true, seamstress: { include: { user: true } } }
    });

    // Map to expected format
    const formatted = orders.map(o => ({
      id: o.id,
      customerId: o.customerId,
      customerName: o.customerName,
      customerEmail: o.customerEmail,
      designId: o.designId,
      design: o.design ? {
        id: o.design.id,
        name: o.design.name,
        designerName: o.design.designerId, // TODO: get actual designer name
        description: o.design.description,
        price: o.design.price,
        image: o.design.image,
        category: o.design.category,
        tags: JSON.parse(o.design.tags),
        createdAt: new Date().toISOString(),
        isActive: o.design.isActive,
      } : null,
      seamstressId: o.seamstressId,
      seamstressName: o.seamstress ? o.seamstress.user.name : '',
      totalPrice: o.totalPrice,
      designerRoyalty: o.designerRoyalty,
      seamstressEarning: o.seamstressEarning,
      platformFee: 5, // Fixed for now
      status: o.status,
      paymentStatus: o.paymentStatus,
      createdAt: o.createdAt ? o.createdAt.toISOString() : new Date().toISOString(),
      updatedAt: o.updatedAt ? o.updatedAt.toISOString() : new Date().toISOString(),
      progress: o.progress,
      notes: o.notes,
    }));
    res.json({ orders: formatted });
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// Update order status endpoint
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const user = req.user;

    // Find the order to check permissions
    const order = await prisma.order.findUnique({
      where: { id },
      include: { seamstress: { include: { user: true } } }
    });

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Check permissions: only seamstress assigned to order can update status
    if (user.role !== 'SEAMSTRESS' || order.seamstressId !== user.userId) {
      return res.status(403).json({ error: 'Not authorized to update this order' });
    }

    // Update order status
    const updatedOrder = await prisma.order.update({
      where: { id },
      data: { status }
    });

    // Send notification to customer
    if (status === 'APPROVED') {
      fetch('http://localhost:3002/api/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: order.customerId,
          type: 'order_update',
          title: 'Inquiry Accepted',
          message: 'The seamstress has accepted your inquiry. You can now proceed with payment.',
        }),
      }).catch(console.error);
    } else if (status === 'REJECTED') {
      fetch('http://localhost:3002/api/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: order.customerId,
          type: 'order_update',
          title: 'Inquiry Declined',
          message: 'The seamstress has declined your inquiry. Please try another seamstress.',
        }),
      }).catch(console.error);
    }

    res.json({ message: 'Order status updated', order: updatedOrder });
  } catch (error) {
    console.error('Error updating order:', error);
    res.status(500).json({ error: 'Failed to update order' });
  }
});

// Create order endpoint
router.post('/', async (req, res) => {
  try {
    const { designId, seamstressId, customerId, itemType, measurements, specialInstructions } = req.body;

    // Get customer details
    const customer = await prisma.user.findUnique({
      where: { id: customerId }
    });

    if (!customer) {
      return res.status(404).json({ error: 'Customer not found' });
    }

    // Get design and pricing
    const design = await prisma.design.findUnique({
      where: { id: designId }
    });

    if (!design) {
      return res.status(404).json({ error: 'Design not found' });
    }

    const pricing = await prisma.designPricing.findFirst({
      where: { designId, seamstressId }
    });

    if (!pricing) {
      return res.status(400).json({ error: 'Seamstress pricing not found for this design' });
    }

    // Calculate prices
    const designPrice = design.price;
    const seamstressPrice = pricing.price;
    const platformFee = 5; // Fixed platform fee
    const designerRoyalty = designPrice * 0.1; // 10% royalty
    const totalPrice = designPrice + seamstressPrice + platformFee;

    const order = await prisma.order.create({
      data: {
        customerId,
        designId,
        seamstressId,
        customerName: customer.name,
        customerEmail: customer.email,
        totalPrice,
        designerRoyalty,
        seamstressEarning: seamstressPrice,
        status: 'PLACED',
        paymentStatus: 'PENDING',
        progress: 0,
        rushOrder: false,
        itemType,
        // Add measurements - for now, map the measurements object to db fields as needed
        dressSize: measurements.itemSize || measurements.dressSize,
        chestMeasurement: measurements.chest,
        waistMeasurement: measurements.waist,
        hipMeasurement: measurements.hip,
        length: measurements.length,
        notes: specialInstructions,
        timeline: '[]', // JSON array of status changes
      }
    });

    // Send notification to seamstress
    const seamstress = await prisma.seamstress.findUnique({
      where: { id: seamstressId },
      include: { user: true }
    });
    if (seamstress) {
      // Send notification via API
      fetch('http://localhost:3002/api/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: seamstress.userId,
          type: 'new_order',
          title: 'New Order Inquiry',
          message: `You have a new order inquiry for design ${designId}. Please check your dashboard to accept or decline.`,
        }),
      }).catch(console.error);
    }

    res.status(201).json({ order });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ error: 'Failed to create order' });
  }
});

export default router;