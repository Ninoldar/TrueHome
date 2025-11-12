# Stripe Integration Setup Guide

This guide will help you set up Stripe payment processing for TrueHome.

## Prerequisites

1. A Stripe account (sandbox/test mode is fine for development)
2. Access to your Stripe Dashboard

## Environment Variables

Add the following environment variables to your `.env.local` file and Vercel:

### Required Variables

```bash
# Stripe Secret Key (from Stripe Dashboard)
STRIPE_SECRET_KEY=sk_test_...

# Stripe Webhook Secret (from Stripe Dashboard after creating webhook)
STRIPE_WEBHOOK_SECRET=whsec_...

# Your app URL (for redirects)
NEXT_PUBLIC_APP_URL=http://localhost:3000  # For local development
# NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app  # For production
```

## Step-by-Step Setup

### 1. Get Your Stripe API Keys

1. Go to [Stripe Dashboard](https://dashboard.stripe.com/)
2. Navigate to **Developers** → **API keys**
3. Copy your **Publishable key** (starts with `pk_test_` or `pk_live_`)
4. Copy your **Secret key** (starts with `sk_test_` or `sk_live_`)
   - **Important**: Never expose your secret key in client-side code!

### 2. Set Up Webhook Destination

1. In Stripe Dashboard, go to **Developers** → **Webhooks**
2. Click **Add destination** (or "Add endpoint" in older versions)
3. Set the endpoint URL:
   - **Local development**: Use Stripe CLI (see below)
   - **Production**: `https://your-domain.vercel.app/api/webhooks/stripe`
4. Select events to listen for:
   - `checkout.session.completed`
5. Copy the **Signing secret** (starts with `whsec_`) - this is your `STRIPE_WEBHOOK_SECRET`

### 3. Local Development with Stripe CLI

For local development, use Stripe CLI to forward webhooks:

```bash
# Install Stripe CLI (if not already installed)
# macOS: brew install stripe/stripe-cli/stripe
# Or download from: https://stripe.com/docs/stripe-cli

# Login to Stripe
stripe login

# Forward webhooks to your local server
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

The CLI will output a webhook signing secret. Use this as your `STRIPE_WEBHOOK_SECRET` in `.env.local`.

### 4. Test Payment Flow

1. Start your development server:
   ```bash
   pnpm dev
   ```

2. Use Stripe test cards:
   - **Success**: `4242 4242 4242 4242`
   - **Decline**: `4000 0000 0000 0002`
   - Use any future expiry date, any 3-digit CVC, and any ZIP code

3. Test the flow:
   - Go to `/pricing`
   - Select a pack
   - Complete checkout with test card
   - Verify credits are added to your account

## Vercel Deployment

### 1. Add Environment Variables

1. Go to your Vercel project settings
2. Navigate to **Environment Variables**
3. Add:
   - `STRIPE_SECRET_KEY` (your Stripe secret key)
   - `STRIPE_WEBHOOK_SECRET` (from your webhook endpoint)
   - `NEXT_PUBLIC_APP_URL` (your Vercel domain URL)

### 2. Update Webhook URL

1. In Stripe Dashboard → **Webhooks**, find your destination/endpoint
2. Update the URL to:
   `https://your-domain.vercel.app/api/webhooks/stripe`
3. Make sure the webhook secret matches what you set in Vercel

### 3. Test Production Flow

1. Deploy to Vercel
2. Test the payment flow on your production domain
3. Check Stripe Dashboard → **Payments** to see test transactions

## Security Notes

- ✅ Never commit `.env.local` or `.env` files to Git
- ✅ Use test keys (`sk_test_`) for development
- ✅ Use live keys (`sk_live_`) only in production
- ✅ Always verify webhook signatures
- ✅ Keep your secret keys secure

## Troubleshooting

### Webhook Not Receiving Events

1. Check webhook endpoint URL is correct
2. Verify `STRIPE_WEBHOOK_SECRET` matches the signing secret
3. Check Vercel function logs for errors
4. Use Stripe Dashboard → **Webhooks** → **Events** to see delivery status

### Payment Succeeds But Credits Not Added

1. Check webhook is configured correctly
2. Verify webhook secret in environment variables
3. Check database connection
4. Review server logs for errors

### Test Cards Not Working

- Make sure you're using test mode keys (`sk_test_`)
- Use the test card numbers provided above
- Check card expiry date is in the future

## Support

- [Stripe Documentation](https://stripe.com/docs)
- [Stripe Test Cards](https://stripe.com/docs/testing)
- [Stripe Webhooks Guide](https://stripe.com/docs/webhooks)

