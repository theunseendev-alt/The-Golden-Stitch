import { Router } from 'express';
import { prisma } from '../config/index.js';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();

// Seamstresses endpoint
router.get('/', async (req, res) => {
  try {
    const seamstresses = await prisma.seamstress.findMany({
      include: { user: true }
    });
    // Map to expected format
    const formatted = seamstresses.map(s => ({
      id: s.id,
      name: s.user.name,
      email: s.user.email,
      specialty: JSON.parse(s.specialty),
      rating: s.rating,
      completedOrders: s.completedOrders,
      image: s.image,
      bio: s.bio,
      location: s.location,
      basePrice: s.basePrice,
      estimatedDays: s.estimatedDays,
      designs: [], // TODO: populate if needed
      isActive: s.isActive,
    }));
    res.json({ seamstresses: formatted });
  } catch (error) {
    console.error('Error fetching seamstresses:', error);
    res.status(500).json({ error: 'Failed to fetch seamstresses' });
  }
});

// Seamstress stats endpoint
router.get('/stats', authenticateToken, async (req, res) => {
  try {
    const user = req.user;

    if (user.role !== 'SEAMSTRESS') {
      return res.status(403).json({ error: 'Not authorized' });
    }

    const seamstressId = user.userId;

    // Get current month start
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    // Orders this month
    const ordersThisMonth = await prisma.order.count({
      where: {
        seamstressId,
        createdAt: { gte: startOfMonth }
      }
    });

    // Total earnings (sum of seamstressEarning for completed orders)
    const earningsResult = await prisma.order.aggregate({
      where: {
        seamstressId,
        status: 'COMPLETED',
        paymentStatus: 'PAID'
      },
      _sum: { seamstressEarning: true }
    });
    const totalEarnings = earningsResult._sum.seamstressEarning || 0;

    // Average rating - for now, get from seamstress table
    const seamstress = await prisma.seamstress.findUnique({
      where: { id: seamstressId }
    });
    const avgRating = seamstress?.rating || 0;

    // Response time - calculate average time between order creation and approval
    const approvedOrders = await prisma.order.findMany({
      where: {
        seamstressId,
        status: 'APPROVED'
      },
      select: { createdAt: true, updatedAt: true }
    });

    let avgResponseTime = 0;
    if (approvedOrders.length > 0) {
      const totalResponseTime = approvedOrders.reduce((sum, order) => {
        const responseTime = new Date(order.updatedAt).getTime() - new Date(order.createdAt).getTime();
        return sum + responseTime;
      }, 0);
      avgResponseTime = totalResponseTime / approvedOrders.length / (1000 * 60 * 60); // hours
    }

    res.json({
      ordersThisMonth,
      totalEarnings: totalEarnings.toFixed(2),
      avgRating: avgRating.toFixed(1),
      responseTime: avgResponseTime.toFixed(1) + 'h'
    });
  } catch (error) {
    console.error('Error fetching seamstress stats:', error);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

export default router;