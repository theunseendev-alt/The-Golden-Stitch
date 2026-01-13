import { Router } from 'express';
import { prisma } from '../config/index.js';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();

// Users endpoint (admin only)
router.get('/users', async (req, res) => {
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

// Delete user endpoint (admin only)
router.delete('/users/:id', authenticateToken, async (req, res) => {
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

// Admin stats endpoint
router.get('/stats', authenticateToken, async (req, res) => {
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

export default router;