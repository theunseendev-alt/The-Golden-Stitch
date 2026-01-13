# Netlify Environment Variables Setup

Configure environment variables in the Netlify dashboard for production deployment. Do not hard-code sensitive values; use managed secrets only.

## Required Environment Variables

Map the following variables from your `.env.example` file to Netlify environment variables:

### Database
- **DATABASE_URL**: PostgreSQL connection string for hosted database

### JWT Secrets
- **JWT_SECRET**: Random string for JWT token signing (production only)
- **JWT_REFRESH_SECRET**: Random string for refresh token signing (production only)
- **JWT_EXPIRES_IN**: Token expiration time (e.g., "15m")
- **JWT_REFRESH_EXPIRES_IN**: Refresh token expiration time (e.g., "7d")

### Stripe Configuration
- **STRIPE_SECRET_KEY**: Your Stripe secret key (sk_live_... for production)
- **STRIPE_WEBHOOK_SECRET**: Stripe webhook endpoint secret

### Frontend Configuration
- **VITE_STRIPE_PUBLISHABLE_KEY**: Stripe publishable key (pk_live_... for production)
- **FRONTEND_URL**: Your production frontend URL (e.g., https://goldenstitch.com)

### Server Configuration
- **NODE_ENV**: Set to "production"
- **PORT**: Usually set automatically by Netlify, but can be configured if needed

### Google OAuth Configuration
- **GOOGLE_CLIENT_ID**: Google OAuth client ID
- **GOOGLE_CLIENT_SECRET**: Google OAuth client secret
- **GOOGLE_REDIRECT_URI**: OAuth redirect URI for production

### Optional Variables
- **SMTP_HOST**: Email SMTP host
- **SMTP_PORT**: SMTP port
- **SMTP_USER**: SMTP username
- **SMTP_PASS**: SMTP password
- **AWS_ACCESS_KEY_ID**: AWS access key
- **AWS_SECRET_ACCESS_KEY**: AWS secret key
- **AWS_REGION**: AWS region
- **AWS_S3_BUCKET**: S3 bucket name
- **REDIS_URL**: Redis connection URL

## Setup Steps

1. Go to your Netlify site dashboard
2. Navigate to Site settings > Environment variables
3. Click "Add variable" for each required variable
4. Use the same variable names as in your application code
5. Set the values to your production secrets

## Security Notes

- Never commit production secrets to version control
- Use different values for development and production
- Rotate secrets regularly
- Monitor for unauthorized access
- Use Netlify's environment variable scopes for different deploy contexts if needed

## Validation

Ensure your application properly validates required environment variables at startup. The server code includes checks for critical variables like JWT_SECRET and STRIPE_SECRET_KEY.