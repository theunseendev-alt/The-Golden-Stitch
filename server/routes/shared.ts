import { Router } from 'express';

const router = Router();

// Basic health check
router.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'golden-stitch-backend' });
});

// Server shutdown endpoint (admin only)
router.post('/shutdown', (req, res) => {
  console.log('Shutdown requested by admin');
  res.json({ message: 'Server shutting down...' });
  setTimeout(() => {
    process.exit(0);
  }, 1000); // Give time for response
});

// Mock notifications endpoint
router.get('/notifications', (req, res) => {
  res.json({ notifications: [] });
});

// Mock notifications unread count endpoint
router.get('/notifications/unread-count', (req, res) => {
  res.json({ count: 0 });
});

// Create notification endpoint
router.post('/notifications', (req, res) => {
  const { userId, type, title, message } = req.body;
  console.log('Notification sent to user', userId, ':', title, '-', message);
  // In production, save to database and emit to user
  res.status(201).json({ message: 'Notification sent' });
});

// Saved designs endpoints - TODO: implement with database table
router.get('/saved-designs', (req, res) => {
  res.json({ savedDesigns: [] });
});

router.post('/saved-designs', (req, res) => {
  const { designId } = req.body;
  res.status(201).json({ message: 'Design saved' });
});

router.delete('/saved-designs/:id', (req, res) => {
  res.json({ message: 'Design removed from saved' });
});

export default router;