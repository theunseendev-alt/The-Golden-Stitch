import serverless from "serverless-http";
import express from "express";
import cors from "cors";
import * as path from "path";
import * as fs from "fs";

// Import modular components
import { prisma } from "../../server/config/index.js";
import { authenticateToken } from "../../server/middleware/auth.js";
import authRoutes from "../../server/routes/auth.js";
import paymentRoutes from "../../server/routes/payments.js";
import orderRoutes from "../../server/routes/orders.js";
import designRoutes from "../../server/routes/designs.js";
import seamstressRoutes from "../../server/routes/seamstresses.js";
import adminRoutes from "../../server/routes/admin.js";
import sharedRoutes from "../../server/routes/shared.js";
import { initializeSocket } from "../../server/socket/index.js";

const app = express();

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

// Routes
app.use('/auth', authRoutes);
app.use('/payments', paymentRoutes);
app.use('/orders', orderRoutes);
app.use('/designs', designRoutes);
app.use('/seamstresses', seamstressRoutes);
app.use('/admin', adminRoutes);
app.use('/', sharedRoutes);

export const handler = serverless(app);
