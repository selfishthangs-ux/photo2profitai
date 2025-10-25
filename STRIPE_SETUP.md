# Stripe Integration Guide - $1 Trial System

This guide will walk you through setting up the Stripe integration for Photo2Profit's $1 trial system.

## Overview

The $1 trial system includes four pricing tiers:
- **$1 Trial**: 5 credits - Perfect for testing the platform
- **Casual Seller** ($9.99): 50 credits - For occasional sellers
- **Pro Reseller** ($19.99): 200 credits - For serious resellers
- **Boss Mode** ($29.99): 1,000 credits - For power users and teams

## Prerequisites

1. A Stripe account (create one at https://stripe.com)
2. Node.js backend running (see backend/README.md)
3. Environment variables configured

## Step 1: Create a Stripe Account

1. Go to https://stripe.com and sign up
2. Complete the account verification process
3. Switch to **Test Mode** during development (toggle in the top right)

## Step 2: Get Your API Keys

1. In the Stripe Dashboard, click **Developers** → **API keys**
2. Copy your **Secret key** (starts with `sk_test_` for test mode)
3. Add it to your backend `.env` file:

```bash
STRIPE_SECRET_KEY=sk_test_your_secret_key_here
```

## Step 3: Configure Webhook

Webhooks allow Stripe to notify your backend when payments succeed or fail.

### Development (Using Stripe CLI)

1. Install Stripe CLI: https://stripe.com/docs/stripe-cli
2. Login to Stripe CLI:
   ```bash
   stripe login
   ```
3. Forward webhooks to your local server:
   ```bash
   stripe listen --forward-to localhost:3000/api/stripe/webhook
   ```
4. Copy the webhook signing secret (starts with `whsec_`)
5. Add it to your `.env`:
   ```bash
   STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
   ```

### Production

1. In Stripe Dashboard, go to **Developers** → **Webhooks**
2. Click **Add endpoint**
3. Set endpoint URL to: `https://your-domain.com/api/stripe/webhook`
4. Select events to listen for:
   - `checkout.session.completed`
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
5. Copy the **Signing secret** and add to your production environment variables

## Step 4: Set Base URL

Add your application's base URL to `.env`:

```bash
# Development
BASE_URL=http://localhost:3000

# Production
BASE_URL=https://your-domain.com
```

This is used for redirect URLs after payment.

## Step 5: Start the Backend

```bash
cd backend
npm install
npm run dev
```

The server will automatically create Stripe products and prices on first run.

## Step 6: Test the Integration

### Testing with Stripe Test Cards

Use these test card numbers in test mode:

**Successful Payment:**
- Card: `4242 4242 4242 4242`
- Expiry: Any future date (e.g., `12/34`)
- CVC: Any 3 digits (e.g., `123`)
- ZIP: Any 5 digits (e.g., `12345`)

**Payment Declined:**
- Card: `4000 0000 0000 0002`

### Test Flow

1. Open `http://localhost:3000/pricing.html` (or your hosted URL)
2. Click "Start $1 Trial"
3. Enter test card details
4. Complete payment
5. You should be redirected to `success.html`
6. Check your terminal for webhook logs

## API Endpoints

### GET /api/pricing
Returns all available pricing plans.

**Response:**
```json
{
  "plans": {
    "trial": {
      "name": "$1 Trial",
      "price": 100,
      "credits": 5,
      "features": [...]
    },
    ...
  },
  "currency": "USD"
}
```

### POST /api/create-checkout-session
Creates a Stripe checkout session for a specific plan.

**Request:**
```json
{
  "planKey": "trial",
  "userId": "user_123"
}
```

**Response:**
```json
{
  "sessionId": "cs_test_...",
  "url": "https://checkout.stripe.com/..."
}
```

### POST /api/stripe/webhook
Receives Stripe webhook events (called by Stripe, not your frontend).

## Integrating with Firebase

To track user credits and purchases in Firestore:

1. Add Firebase Admin SDK to your backend
2. Update the webhook handler in `backend/src/index.js`:

```javascript
case 'checkout.session.completed':
  const session = event.data.object;
  const { userId, credits, planKey } = session.metadata;
  
  // Update Firestore
  const userRef = admin.firestore().doc(`users/${userId}`);
  await userRef.set({
    credits: admin.firestore.FieldValue.increment(parseInt(credits)),
    lastPurchase: {
      plan: planKey,
      date: admin.firestore.FieldValue.serverTimestamp(),
      amount: session.amount_total / 100
    }
  }, { merge: true });
  
  console.log(`Added ${credits} credits to user ${userId}`);
  break;
```

## Going Live (Production)

1. **Switch to Live Mode** in Stripe Dashboard
2. Get your **live API keys** (starts with `sk_live_`)
3. Update production environment variables:
   ```bash
   STRIPE_SECRET_KEY=sk_live_your_live_key_here
   STRIPE_WEBHOOK_SECRET=whsec_your_live_webhook_secret
   BASE_URL=https://your-production-domain.com
   ```
4. Create a production webhook endpoint
5. Update `public/pricing.html` with your production backend URL

## Customizing Pricing

To modify pricing plans, edit `backend/src/stripe-config.js`:

```javascript
const PRICING_PLANS = {
  trial: {
    name: '$1 Trial',
    price: 100, // Price in cents ($1.00)
    credits: 5,
    features: [...]
  },
  // Add or modify plans...
};
```

After changing prices, delete old Stripe products/prices from the dashboard or the code will create new ones automatically.

## Security Best Practices

1. **Never commit API keys** - Always use environment variables
2. **Verify webhook signatures** - The code already does this
3. **Use HTTPS in production** - Required by Stripe
4. **Validate user input** - Check `userId` and `planKey` before processing
5. **Handle errors gracefully** - Don't expose internal errors to users

## Troubleshooting

### "Stripe secret key not configured"
- Check your `.env` file has `STRIPE_SECRET_KEY`
- Restart your server after adding environment variables

### Webhook not receiving events
- Make sure Stripe CLI is running: `stripe listen --forward-to localhost:3000/api/stripe/webhook`
- In production, verify your webhook endpoint URL is correct
- Check webhook signing secret matches your environment variable

### Payment succeeds but credits not added
- Check webhook logs in your terminal
- Verify webhook handler code is executing
- Check Firestore rules allow writes from your backend

### "Invalid price ID" error
- Let the backend create products automatically on first run
- Or manually create products in Stripe Dashboard and update `STRIPE_FOUNDING_PRICE_ID`

## Support

- Stripe Documentation: https://stripe.com/docs
- Stripe Testing: https://stripe.com/docs/testing
- Firebase + Stripe: https://firebase.google.com/docs/stripe

## Next Steps

1. ✅ Complete Stripe setup
2. 🎨 Customize pricing page design
3. 💾 Integrate with Firestore for credit tracking
4. 📊 Add analytics to track conversions
5. 🚀 Deploy to production
