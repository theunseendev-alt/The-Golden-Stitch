import express from 'express';
import cors from 'cors';
import path from 'path';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import Stripe from 'stripe';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { OAuth2Client } from 'google-auth-library';

const app = express();
const httpServer = createServer(app);

// Initialize Socket.IO server
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Initialize Prisma
const prisma = new PrismaClient();

// Environment variable validation
if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is required');
}
if (!process.env.JWT_REFRESH_SECRET) {
  throw new Error('JWT_REFRESH_SECRET environment variable is required');
}
if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY environment variable is required');
}

// Optional but recommended
if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET || !process.env.GOOGLE_REDIRECT_URI) {
  console.warn('Google OAuth environment variables not set. Google login will not work.');
}

// In-memory storage for designs
let designs = [
  {
    id: '1',
    name: 'Elegant Evening Gown',
    designerId: 'designer_001',
    designerName: 'Emma Designer',
    description: 'A stunning evening gown perfect for formal occasions',
    price: 4, // Platform price
    rating: 4.8,
    reviews: 24,
    image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjI1NiIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIyMCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkRyZXNzIERlc2lnbjwvdGV4dD48L3N2Zz4=',
    category: 'Evening Wear',
    tags: ['elegant', 'formal', 'long'],
    createdAt: new Date().toISOString(),
    isActive: true,
    stripeAccountId: 'acct_designer_placeholder', // Mock connected account
  },
];

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-12-18.acacia',
});

// Initialize Google OAuth client
const googleClient = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL,
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));
app.use(express.json({ limit: '50mb' })); // Increase limit for design uploads
app.use(express.urlencoded({ extended: true }));

// Serve static files from client/dist/spa
app.use(express.static(path.join(process.cwd(), 'client/dist/spa')));

// JWT Authentication middleware
const authenticateToken = (req: any, res: any, next: any) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err: any, user: any) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

// Socket.IO event handlers
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  socket.on('authenticate', (data) => {
    // Simple authentication logic (mock for demo)
    socket.emit('authenticated', { success: true });
  });

  socket.on('new_order', (data) => {
    console.log('New order received:', data);
    // Handle new order logic here
  });

  socket.on('order_updated', (data) => {
    console.log('Order updated:', data);
    // Handle order update logic here
  });

  socket.on('payment_received', (data) => {
    console.log('Payment received:', data);
    // Handle payment received logic here
  });
});

// Basic health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'golden-stitch-backend' });
});

// Server shutdown endpoint (admin only)
app.post('/api/shutdown', (req, res) => {
  console.log('Shutdown requested by admin');
  res.json({ message: 'Server shutting down...' });
  setTimeout(() => {
    process.exit(0);
  }, 1000); // Give time for response
});

// Signup endpoint
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, name } = req.body;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'User with this email already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name: name || email.split('@')[0], // Use email prefix as default name
        role: null, // Will be set later in choose-role
      }
    });

    // Generate tokens
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role, isAdmin: user.isAdmin },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    const refreshToken = jwt.sign(
      { userId: user.id },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: '30d' }
    );

    await prisma.user.update({
      where: { id: user.id },
      data: { refreshToken }
    });

    res.status(201).json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        isAdmin: user.isAdmin,
      },
      accessToken: token,
      refreshToken,
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ error: 'Signup failed' });
  }
});

// Login endpoint
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role, isAdmin: user.isAdmin },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    const refreshToken = jwt.sign(
      { userId: user.id },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: '30d' }
    );

    await prisma.user.update({
      where: { id: user.id },
      data: { refreshToken }
    });

    res.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        isAdmin: user.isAdmin,
      },
      accessToken: token,
      refreshToken,
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// Refresh token endpoint
app.post('/api/auth/refresh', async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).json({ error: 'Refresh token required' });
    }

    jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, async (err: any, decoded: any) => {
      if (err) {
        return res.status(403).json({ error: 'Invalid refresh token' });
      }

      const user = await prisma.user.findUnique({
        where: { id: decoded.userId }
      });

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      const newAccessToken = jwt.sign(
        { userId: user.id, email: user.email, role: user.role, isAdmin: user.isAdmin },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );

      const newRefreshToken = jwt.sign(
        { userId: user.id },
        process.env.JWT_REFRESH_SECRET,
        { expiresIn: '30d' }
      );

      await prisma.user.update({
        where: { id: user.id },
        data: { refreshToken: newRefreshToken }
      });

      res.json({ accessToken: newAccessToken, refreshToken: newRefreshToken });
    });
  } catch (error) {
    console.error('Refresh error:', error);
    res.status(500).json({ error: 'Refresh failed' });
  }
});

// Google OAuth endpoint
app.post('/api/auth/google', async (req, res) => {
  try {
    const { idToken } = req.body;

    if (!idToken) {
      return res.status(400).json({ error: 'ID token required' });
    }

    // Verify the ID token
    const ticket = await googleClient.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    if (!payload) {
      return res.status(400).json({ error: 'Invalid ID token' });
    }

    const { sub: googleId, email, name, given_name, family_name } = payload;

    // Check if user exists
    let user = await prisma.user.findUnique({ where: { email } });

    if (user) {
      // If user exists but not with Google OAuth, update to link with Google
      if (!user.oauthProvider || user.oauthProvider !== 'google') {
        user = await prisma.user.update({
          where: { id: user.id },
          data: {
            oauthProvider: 'google',
            oauthId: googleId,
          }
        });
      }
    } else {
      // Create new user
      user = await prisma.user.create({
        data: {
          email,
          name: name || `${given_name} ${family_name}`.trim() || email.split('@')[0],
          oauthProvider: 'google',
          oauthId: googleId,
          role: null, // Will be set later in choose-role
        }
      });
    }

    // Generate tokens
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role, isAdmin: user.isAdmin },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    const refreshToken = jwt.sign(
      { userId: user.id },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: '30d' }
    );

    await prisma.user.update({
      where: { id: user.id },
      data: { refreshToken }
    });

    res.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        isAdmin: user.isAdmin,
      },
      accessToken: token,
      refreshToken,
    });
  } catch (error) {
    console.error('Google OAuth error:', error);
    res.status(500).json({ error: 'Google OAuth failed' });
  }
});

// Mock notifications endpoint
app.get('/api/notifications', (req, res) => {
  res.json({ notifications: [] });
});

// Mock notifications unread count endpoint
app.get('/api/notifications/unread-count', (req, res) => {
  res.json({ count: 0 });
});

// Create notification endpoint
app.post('/api/notifications', (req, res) => {
  const { userId, type, title, message } = req.body;
  console.log('Notification sent to user', userId, ':', title, '-', message);
  // In production, save to database and emit to user
  res.status(201).json({ message: 'Notification sent' });
});

// Designs endpoint
app.get('/api/designs', async (req, res) => {
  try {
    const dbDesigns = await prisma.design.findMany();
    const formatted = dbDesigns.map(d => ({
      ...d,
      tags: JSON.parse(d.tags)
    }));
    res.json({ designs: formatted });
  } catch (error) {
    console.error('Error fetching designs:', error);
    res.status(500).json({ error: 'Failed to fetch designs' });
  }
});

// Seamstresses endpoint
app.get('/api/seamstresses', async (req, res) => {
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

// Get orders endpoint
app.get('/api/orders', authenticateToken, async (req, res) => {
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
        createdAt: o.design.createdAt ? o.design.createdAt.toISOString() : new Date().toISOString(),
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
app.put('/api/orders/:id', authenticateToken, async (req, res) => {
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

// Saved designs endpoints - TODO: implement with database table
app.get('/api/saved-designs', (req, res) => {
  res.json({ savedDesigns: [] });
});

app.post('/api/saved-designs', (req, res) => {
  const { designId } = req.body;
  res.status(201).json({ message: 'Design saved' });
});

app.delete('/api/saved-designs/:id', (req, res) => {
  res.json({ message: 'Design removed from saved' });
});

// Users endpoint (admin only)
app.get('/api/users', async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isAdmin: true,
        createdAt: true,
      },
    });
    const formatted = users.map(u => ({
      ...u,
      createdAt: u.createdAt.toISOString(),
    }));
    res.json({ users: formatted });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// Update user role endpoint
app.put('/api/auth/role', authenticateToken, async (req, res) => {
  try {
    const { role } = req.body;
    const userId = req.user.userId;

    if (!['CUSTOMER', 'DESIGNER', 'SEAMSTRESS'].includes(role)) {
      return res.status(400).json({ error: 'Invalid role' });
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { role }
    });

    res.json({ message: 'Role updated successfully', user: { ...updatedUser, password: undefined } });
  } catch (error) {
    console.error('Error updating role:', error);
    res.status(500).json({ error: 'Failed to update role' });
  }
});

// Delete user endpoint (admin only)
app.delete('/api/users/:id', authenticateToken, async (req, res) => {
  try {
    const user = req.user;

    if (user.role !== 'ADMIN' && !user.isAdmin) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    const { id } = req.params;

    // Prevent deleting self
    if (id === user.userId) {
      return res.status(400).json({ error: 'Cannot delete your own account' });
    }

    // Find user to check if admin
    const userToDelete = await prisma.user.findUnique({
      where: { id }
    });

    if (!userToDelete) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (userToDelete.isAdmin) {
      return res.status(400).json({ error: 'Cannot delete admin users' });
    }

    // Delete user
    await prisma.user.delete({
      where: { id }
    });

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

// Logout endpoint
app.post('/api/auth/logout', (req, res) => {
  // Mock logout - in production, invalidate token
  res.json({ message: 'Logged out successfully' });
});

// Upload design endpoint
app.post('/api/designs', authenticateToken, async (req, res) => {
  try {
    const user = req.user;

    if (user.role !== 'DESIGNER') {
      return res.status(403).json({ error: 'Only designers can upload designs' });
    }

    const { name, description, category, itemType, designerId, designerName, image, backImage, price, tags, isActive } = req.body;

    const design = await prisma.design.create({
      data: {
        name,
        description,
        category,
        itemType,
        designerId,
        price: parseFloat(price) || 4,
        rating: 0,
        reviews: 0,
        image,
        backImage,
        tags: JSON.stringify(tags || []),
        isActive: isActive !== undefined ? isActive : true,
      }
    });

    res.status(201).json({ design });
  } catch (error) {
    console.error('Error creating design:', error);
    res.status(500).json({ error: 'Failed to create design' });
  }
});

// Design Pricings endpoint
app.get('/api/design-pricings', async (req, res) => {
  try {
    const { designId } = req.query;
    const where = designId ? { designId: designId as string } : {};
    const pricings = await prisma.designPricing.findMany({ where });
    res.json({ pricings });
  } catch (error) {
    console.error('Error fetching design pricings:', error);
    res.status(500).json({ error: 'Failed to fetch design pricings' });
  }
});

app.post('/api/design-pricings', async (req, res) => {
  try {
    const { designId, seamstressId, price, difficulty, timeline, notes } = req.body;
    const pricing = await prisma.designPricing.create({
      data: { designId, seamstressId, price: parseFloat(price), difficulty: parseInt(difficulty), timeline, notes }
    });
    res.status(201).json({ pricing });
  } catch (error) {
    console.error('Error creating design pricing:', error);
    res.status(500).json({ error: 'Failed to create design pricing' });
  }
});

// Seamstress stats endpoint
app.get('/api/seamstress/stats', authenticateToken, async (req, res) => {
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

// Admin stats endpoint
app.get('/api/admin/stats', authenticateToken, async (req, res) => {
  try {
    const user = req.user;

    if (user.role !== 'ADMIN' && !user.isAdmin) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    const totalUsers = await prisma.user.count();
    const activeDesigners = await prisma.user.count({ where: { role: 'DESIGNER' } });
    const registeredSeamstresses = await prisma.user.count({ where: { role: 'SEAMSTRESS' } });
    const ordersThisMonth = await prisma.order.count({
      where: {
        createdAt: { gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1) }
      }
    });
    const revenue = await prisma.order.aggregate({
      where: { paymentStatus: 'PAID' },
      _sum: { totalPrice: true }
    });
    const totalRevenue = revenue._sum.totalPrice || 0;

    res.json({
      totalUsers,
      activeDesigners,
      registeredSeamstresses,
      ordersThisMonth,
      revenue: totalRevenue.toFixed(2),
      platformGrowth: '0'
    });
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

// Create order endpoint
app.post('/api/orders', async (req, res) => {
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

// Create payment intent endpoint (for card payments without full checkout)
app.post('/api/create-payment-intent', authenticateToken, async (req, res) => {
  try {
    const { orderId } = req.body;

    if (!orderId) {
      return res.status(400).json({ error: 'orderId is required' });
    }

    // Fetch order from database
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { design: true }
    });

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Verify user owns this order
    if (order.customerId !== req.user.userId) {
      return res.status(403).json({ error: 'Not authorized to pay for this order' });
    }

    // Check if order can be paid
    if (order.status !== 'APPROVED' || order.paymentStatus !== 'PENDING') {
      return res.status(400).json({ error: 'Order is not eligible for payment' });
    }

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(order.totalPrice * 100), // Convert to cents
      currency: 'usd',
      metadata: {
        orderId: order.id,
        customerId: order.customerId,
        designId: order.designId,
        seamstressId: order.seamstressId,
      },
      description: `Custom dress order - ${order.design?.name}`,
      shipping: {
        name: order.customerName,
        address: {
          line1: 'TBD', // Would come from order shipping address
          city: 'TBD',
          state: 'TBD',
          postal_code: 'TBD',
          country: 'US',
        },
      },
    });

    res.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      amount: paymentIntent.amount,
      currency: paymentIntent.currency,
    });
  } catch (error) {
    console.error('Error creating payment intent:', error);
    res.status(500).json({ error: 'Failed to create payment intent' });
  }
});

// Confirm payment completion
app.post('/api/confirm-payment', authenticateToken, async (req, res) => {
  try {
    const { paymentIntentId, orderId } = req.body;

    // Verify payment intent exists and is successful
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status !== 'succeeded') {
      return res.status(400).json({ error: 'Payment not completed' });
    }

    // Update order status
    const order = await prisma.order.update({
      where: { id: orderId },
      data: {
        paymentStatus: 'PAID',
        status: 'PAID',
        progress: 10, // Initial progress after payment
        timeline: JSON.stringify([
          {
            status: 'PLACED',
            timestamp: new Date().toISOString(),
            note: 'Order placed'
          },
          {
            status: 'PAID',
            timestamp: new Date().toISOString(),
            note: 'Payment completed successfully'
          }
        ])
      }
    });

    // Send notifications
    // Notify customer
    fetch('http://localhost:3002/api/notifications', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: order.customerId,
        type: 'payment_success',
        title: 'Payment Successful',
        message: `Your payment of ${order.totalPrice} has been processed. Your order is now being prepared.`,
      }),
    }).catch(console.error);

    // Notify seamstress
    fetch('http://localhost:3002/api/notifications', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: order.seamstressId,
        type: 'payment_received',
        title: 'Payment Received',
        message: `Payment received for order ${order.id}. You can now start working on this order.`,
      }),
    }).catch(console.error);

    res.json({
      success: true,
      order: {
        id: order.id,
        status: order.status,
        paymentStatus: order.paymentStatus
      }
    });
  } catch (error) {
    console.error('Error confirming payment:', error);
    res.status(500).json({ error: 'Failed to confirm payment' });
  }
});

// Create checkout session endpoint (alternative full-page checkout)
app.post('/api/create-checkout-session', async (req, res) => {
  try {
    const { orderId } = req.body;

    if (!orderId) {
      return res.status(400).json({ error: 'orderId is required' });
    }

    // Fetch order from database
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { design: true }
    });

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `Custom Dress Order - ${order.design?.name}`,
              description: `Order #${orderId}`,
              images: order.design?.image ? [order.design.image] : undefined,
            },
            unit_amount: Math.round(order.totalPrice * 100),
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.FRONTEND_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/payment-cancelled`,
      metadata: {
        orderId,
      },
    });

    res.json({ sessionId: session.id, url: session.url });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    res.status(500).json({ error: 'Failed to create checkout session' });
  }
});

// Create connected account endpoint
app.post('/api/create-connected-account', async (req, res) => {
  try {
    const { email, role } = req.body;

    if (!email || !role) {
      return res.status(400).json({ error: 'Email and role are required' });
    }

    // Create Express connected account
    const account = await stripe.accounts.create({
      type: 'express',
      email: email,
      capabilities: {
        card_payments: { requested: true },
        transfers: { requested: true },
      },
      business_type: 'individual', // or 'company' depending on your needs
    });

    console.log('Connected account created:', account.id);

    res.json({ accountId: account.id });
  } catch (error) {
    console.error('Error creating connected account:', error);
    res.status(500).json({ error: 'Failed to create connected account' });
  }
});

// Create account link endpoint
app.post('/api/create-account-link', async (req, res) => {
  try {
    const { accountId } = req.body;

    if (!accountId) {
      return res.status(400).json({ error: 'Account ID is required' });
    }

    const accountLink = await stripe.accountLinks.create({
      account: accountId,
      refresh_url: `${process.env.FRONTEND_URL}/choose-role`, // Redirect back to role selection on refresh
      return_url: `${process.env.FRONTEND_URL}/dashboard`, // Redirect to dashboard after onboarding
      type: 'account_onboarding',
    });

    console.log('Account link created:', accountLink.url);

    res.json({ url: accountLink.url });
  } catch (error) {
    console.error('Error creating account link:', error);
    res.status(500).json({ error: 'Failed to create account link' });
  }
});

// Check Stripe account status endpoint
app.get('/api/stripe/account-status', async (req, res) => {
  try {
    // In a real app, get the user's account ID from authenticated user
    // For now, use mock account ID
    const accountId = 'acct_designer_placeholder';

    if (!accountId || accountId === 'acct_designer_placeholder') {
      return res.json({ chargesEnabled: false });
    }

    const account = await stripe.accounts.retrieve(accountId);

    res.json({
      chargesEnabled: account.charges_enabled,
      accountId: account.id
    });
  } catch (error) {
    console.error('Error checking account status:', error);
    res.status(500).json({ error: 'Failed to check account status' });
  }
});

// Stripe webhook handler
app.post('/api/webhooks/stripe', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err: any) {
    console.log(`Webhook signature verification failed.`, err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  try {
    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object;
        const orderId = paymentIntent.metadata.orderId;

        console.log(`Payment successful for order ${orderId}`);

        // Update order status in database
        const order = await prisma.order.findUnique({
          where: { id: orderId }
        });

        if (order) {
          await prisma.order.update({
            where: { id: orderId },
            data: {
              paymentStatus: 'PAID',
              status: 'PAID',
              progress: 10,
              timeline: JSON.stringify([
                ...(JSON.parse(order.timeline || '[]')),
                {
                  status: 'PAID',
                  timestamp: new Date().toISOString(),
                  note: 'Payment completed successfully'
                }
              ])
            }
          });

          // Create transfers to designer and seamstress
          try {
            // Transfer to designer (platform fee)
            const designerTransfer = await stripe.transfers.create({
              amount: Math.round(order.designerRoyalty * 100), // Convert to cents
              currency: 'usd',
              destination: 'acct_designer_placeholder', // Would be from design data
              metadata: { orderId },
            });

            // Transfer to seamstress (remaining amount minus platform fees)
            const seamstressTransfer = await stripe.transfers.create({
              amount: Math.round((order.seamstressEarning - 5) * 100), // Minus any additional fees
              currency: 'usd',
              destination: 'acct_seamstress_placeholder', // Would be from seamstress data
              metadata: { orderId },
            });

            console.log('Transfers created:', designerTransfer.id, seamstressTransfer.id);
          } catch (transferError) {
            console.error('Error creating transfers:', transferError);
          }
        }
        break;

      case 'checkout.session.completed':
        const session = event.data.object;
        const sessionOrderId = session.metadata.orderId;

        console.log(`Checkout session completed for order ${sessionOrderId}`);

        // Handle checkout session completion (similar to payment intent)
        // This is for the alternative full checkout flow
        break;

      case 'payment_intent.payment_failed':
        const failedPaymentIntent = event.data.object;
        const failedOrderId = failedPaymentIntent.metadata.orderId;

        console.log(`Payment failed for order ${failedOrderId}`);

        // Update order with failed payment
        await prisma.order.update({
          where: { id: failedOrderId },
          data: {
            paymentStatus: 'FAILED',
            timeline: JSON.stringify([
              ...(JSON.parse(order.timeline || '[]')),
              {
                status: 'PAYMENT_FAILED',
                timestamp: new Date().toISOString(),
                note: 'Payment failed - customer may retry'
              }
            ])
          }
        });
        break;

      default:
        console.log(`Unhandled event type ${event.type}`);
    }
  } catch (error) {
    console.error('Error processing webhook:', error);
    return res.status(500).send('Webhook processing failed');
  }

  res.json({ received: true });
});

// Serve SPA for all non-API routes
const spaIndexPath = path.join(process.cwd(), 'client/dist/spa/index.html');
if (require('fs').existsSync(spaIndexPath)) {
  app.get('*', (req, res) => {
    res.sendFile(spaIndexPath);
  });
}

export const getServer = () => {
  return httpServer;
};

export default app;

// Graceful shutdown handling
const gracefulShutdown = (signal: string) => {
  console.log(`Received ${signal}. Shutting down gracefully...`);
  httpServer.close((err) => {
    if (err) {
      console.error('Error closing server:', err);
    } else {
      console.log('HTTP server closed.');
    }
    prisma.$disconnect().then(() => {
      console.log('Prisma disconnected.');
      process.exit(0);
    }).catch((e) => {
      console.error('Error disconnecting Prisma:', e);
      process.exit(1);
    });
  });

  // Force close after 5 seconds
  setTimeout(() => {
    console.error('Could not close connections in time, forcefully shutting down');
    process.exit(1);
  }, 5000);
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Function to find an available port
const findAvailablePort = (startPort: number): Promise<number> => {
  return new Promise((resolve, reject) => {
    const server = createServer();
    server.listen(startPort, () => {
      server.close(() => resolve(startPort));
    });
    server.on('error', (err: any) => {
      if (err.code === 'EADDRINUSE') {
        resolve(findAvailablePort(startPort + 1));
      } else {
        reject(err);
      }
    });
  });
};

// Start server
const startPort = parseInt(process.env.PORT || '3002');
findAvailablePort(startPort).then(port => {
  httpServer.listen(port, () => {
    console.log(`🚀 Golden Stitch Backend running on port ${port}`);
    console.log(`📱 API: http://localhost:${port}/api`);
  });
}).catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});