# 🚀 Stripe Setup Guide for Golden Stitch

## Step 1: Create Stripe Account
1. Go to [Stripe Dashboard](https://dashboard.stripe.com/)
2. Sign up for a free account
3. Complete account verification

## Step 2: Get Your API Keys

### Test Keys (for development)
1. In Stripe Dashboard, go to **Developers** → **API Keys**
2. Copy your **Publishable key** (starts with `pk_test_`)
3. Copy your **Secret key** (starts with `sk_test_`)

### Live Keys (for production)
- Same process but switch to **Live mode** in the dashboard
- **Never share your secret keys publicly**

## Step 3: Configure Webhooks

### For Payment Processing
1. In Stripe Dashboard, go to **Developers** → **Webhooks**
2. Click **"Add endpoint"**
3. Set URL to: `https://yourdomain.com/api/webhooks/stripe`
4. Select events to listen for:
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
   - `checkout.session.completed` (if using checkout sessions)
5. Copy the **Webhook signing secret** (starts with `whsec_`)

## Step 4: Update Environment Variables

Copy `.env.example` to `.env` and fill in:

```env
# Stripe Keys
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# Frontend Key (expose to browser)
VITE_STRIPE_PUBLISHABLE_KEY="pk_test_..."
```

## Step 5: Test Payment Flow

### Using Stripe Test Cards
- **Success**: `4242 4242 4242 4242`
- **Decline**: `4000 0000 0000 0002`
- **Require Authentication**: `4000 0025 0000 3155`
- **Insufficient Funds**: `4000 0000 0000 9995`

### Test the Flow
1. Start the application: `pnpm dev`
2. Create an account and place an order
3. Use test card to complete payment
4. Check that order status updates to "PAID"

## Step 6: Go Live

### When Ready for Production
1. Switch Stripe dashboard to **Live mode**
2. Update environment variables with live keys
3. Update webhook URL to your production domain
4. Test thoroughly with real payment methods
5. Enable Stripe's radar fraud detection

## 🔧 Troubleshooting

### Common Issues

**"Invalid API Key"**
- Check that you're using the correct environment (test vs live)
- Ensure keys are copied correctly without extra spaces

**"Webhook signature verification failed"**
- Verify webhook secret matches the one from Stripe dashboard
- Ensure webhook URL is accessible from the internet

**Payments not processing**
- Check server logs for Stripe API errors
- Verify webhook events are being received
- Ensure order status is "APPROVED" before payment

### Webhook Testing
Use Stripe CLI for local webhook testing:
```bash
stripe listen --forward-to localhost:3002/api/webhooks/stripe
```

## 💰 Understanding Fees

### Stripe Fees (as of 2024)
- **Domestic cards**: 2.9% + $0.30 per transaction
- **International cards**: 3.4% + $0.30 per transaction
- **Currency conversion**: Additional 1-2%

### Golden Stitch Business Model
- Platform keeps percentage of transactions
- Designer gets royalty fee
- Seamstress gets remaining amount

## 📊 Monitoring Payments

### Stripe Dashboard
- View all transactions
- Track disputes and chargebacks
- Monitor failed payments
- Set up alerts for unusual activity

### Application Monitoring
- Order status changes
- Payment success/failure rates
- User payment flow completion
- Revenue tracking

## 🆘 Support

- **Stripe Documentation**: [stripe.com/docs](https://stripe.com/docs)
- **Stripe Support**: Available in dashboard
- **Golden Stitch Issues**: Check application logs and database

---

**Security Note**: Never commit Stripe keys to version control. Use environment variables and keep them secure.