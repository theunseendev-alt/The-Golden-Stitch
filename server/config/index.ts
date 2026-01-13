import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import Stripe from 'stripe';
import { OAuth2Client } from 'google-auth-library';

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

// Initialize Prisma
const prisma = new PrismaClient();

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2025-12-15.clover',
});

// Initialize Google OAuth client
const googleClient = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

export { prisma, stripe, googleClient, designs };