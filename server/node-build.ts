import express from 'express';
import cors from 'cors';
import * as path from 'path';
import * as fs from 'fs';
import { createServer } from 'http';
import { Server } from 'socket.io';

// Import modular components
import { prisma } from './config/index.js';
import { authenticateToken } from './middleware/auth.js';
import authRoutes from './routes/auth.js';
import paymentRoutes from './routes/payments.js';
import orderRoutes from './routes/orders.js';
import designRoutes from './routes/designs.js';
import seamstressRoutes from './routes/seamstresses.js';
import adminRoutes from './routes/admin.js';
import sharedRoutes from './routes/shared.js';
import { initializeSocket } from './socket/index.js';

const app = express();
const httpServer = createServer(app);

// Initialize Socket.IO server
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin) return callback(null, true);

    // Allow localhost in development
    if (origin.includes('localhost')) return callback(null, true);

    // Allow Netlify domains in production
    if (origin.includes('netlify.app')) return callback(null, true);

    // Allow custom domain if set in environment
    if (process.env.FRONTEND_URL && origin === process.env.FRONTEND_URL) return callback(null, true);

    callback(new Error('Not allowed by CORS'));
  },
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));
app.use(express.json({ limit: '50mb' })); // Increase limit for design uploads
app.use(express.urlencoded({ extended: true }));

// Serve static files from client/dist/spa
app.use(express.static(path.join(process.cwd(), 'client/dist/spa')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api', paymentRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/designs', designRoutes);
app.use('/api/seamstresses', seamstressRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api', sharedRoutes);

// Initialize Socket.IO
initializeSocket(io);

// Serve SPA for all non-API routes
const spaIndexPath = path.join(process.cwd(), 'client/dist/spa/index.html');
if (fs.existsSync(spaIndexPath)) {
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