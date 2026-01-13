import express, { Router } from 'express';
import Stripe from 'stripe';
import { prisma, stripe } from '../config/index.js';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();

// Create payment intent endpoint (for card payments without full checkout)
router.post('/create-payment-intent', authenticateToken, async (req, res) => {
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
router.post('/confirm-payment', authenticateToken, async (req, res) => {
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
router.post('/create-checkout-session', async (req, res) => {
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
router.post('/create-connected-account', async (req, res) => {
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
router.post('/create-account-link', async (req, res) => {
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
router.get('/stripe/account-status', async (req, res) => {
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
router.post('/webhooks/stripe', express.raw({ type: 'application/json' }), async (req, res) => {
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

export default router;