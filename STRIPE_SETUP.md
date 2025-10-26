# Stripe Setup Guide - $1 Trial System

## Overview
Photo2Profit uses Stripe for subscription billing with a $1 trial that auto-upgrades to monthly tiers.

## Pricing Structure
- **Trial**: $1.00 (5 listings)
- **Casual**: $9.99/month (50 listings)
- **Pro**: $19.99/month (200 listings)
- **Boss Mode**: $29.99/month (1000 listings)

## Step 1: Create Stripe Account
1. Go to https://stripe.com
2. Sign up for a free account
3. Complete account verification

## Step 2: Create Products in Stripe Dashboard

### Trial Plan
1. Stripe Dashboard → Products → Add product
2. Name: "Photo2Profit Trial"
3. Description: "5 listings to try Photo2Profit"
4. Pricing: $1.00 one-time or recurring (your choice)
5. Click "Save product"
6. Copy the Price ID (starts with `price_`)

### Casual Plan
1. Add product → "Photo2Profit Casual"
2. Description: "50 listings per month"
3. Pricing model: Recurring
4. Price: $9.99
5. Billing period: Monthly
6. Copy the Price ID

### Pro Plan
1. Add product → "Photo2Profit Pro"
2. Description: "200 listings per month"
3. Pricing: $19.99/month recurring
4. Copy the Price ID

### Boss Mode Plan
1. Add product → "Photo2Profit Boss Mode"
2. Description: "Unlimited power reseller"
3. Pricing: $29.99/month recurring
4. Copy the Price ID

## Step 3: Get API Keys

### Secret Key
1. Stripe Dashboard → Developers → API keys
2. Copy "Secret key" (starts with `sk_test_` for test mode)
3. **Important**: Use test mode initially, switch to live when ready

### Webhook Secret
1. Stripe Dashboard → Developers → Webhooks
2. Click "Add endpoint"
3. Endpoint URL: `https://your-backend.com/api/webhook`
4. Select events to listen for:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
5. Copy the "Signing secret" (starts with `whsec_`)

## Step 4: Configure Backend

Update `backend/.env`:
```bash
STRIPE_SECRET_KEY=sk_test_your_actual_key
STRIPE_WEBHOOK_SECRET=whsec_your_actual_secret

STRIPE_TRIAL_PRICE_ID=price_from_step_2
STRIPE_CASUAL_PRICE_ID=price_from_step_2
STRIPE_PRO_PRICE_ID=price_from_step_2
STRIPE_BOSS_PRICE_ID=price_from_step_2

BASE_URL=https://photo2profit-ai.web.app
```

## Step 5: Test the Flow

### Local Testing
```bash
# Install Stripe CLI
brew install stripe/stripe-cli/stripe

# Login
stripe login

# Forward webhooks to local backend
stripe listen --forward-to localhost:3000/api/webhook

# Test a payment
stripe trigger checkout.session.completed
```

### Frontend Testing
1. Visit your app
2. Upload 6 photos (exceeds 5 free trial)
3. Upgrade modal should appear
4. Click a plan → redirects to Stripe Checkout
5. Use test card: `4242 4242 4242 4242`
6. Any future expiry, any CVC
7. Complete payment
8. Should redirect back with success

## Step 6: Update Frontend Backend URL

Edit `public/index.html`, find the `selectPlan` function:
```javascript
const response = await fetch('YOUR_BACKEND_URL/api/checkout', {
```

Replace `YOUR_BACKEND_URL` with your actual backend:
- Local: `http://localhost:3000`
- Production: `https://your-api-domain.com`

## Step 7: Deploy Backend

### Option A: Railway
```bash
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# Deploy
cd backend
railway up
```

### Option B: Render
1. Go to https://render.com
2. New → Web Service
3. Connect your GitHub repo
4. Build command: `cd backend && npm install`
5. Start command: `npm start`
6. Add environment variables from `.env`

### Option C: Heroku
```bash
heroku create photo2profit-api
cd backend
git push heroku main
heroku config:set STRIPE_SECRET_KEY=your_key
```

## Step 8: Switch to Live Mode

When ready for real customers:

1. Stripe Dashboard → Toggle to "Live mode" (top right)
2. Create new products (same as Step 2)
3. Get new live API keys (starts with `sk_live_`)
4. Update backend `.env` with live keys
5. Update webhook endpoint to production URL
6. Redeploy backend

## Security Checklist

✅ Never commit `.env` file
✅ Use webhook secret to verify Stripe events
✅ Validate user IDs before creating subscriptions
✅ Test subscription cancellation flow
✅ Test subscription renewal
✅ Monitor Stripe logs for errors

## Monitoring

### Stripe Dashboard
- View all payments: Dashboard → Payments
- Check subscriptions: Dashboard → Subscriptions
- Monitor webhooks: Developers → Webhooks → View logs

### Backend Logs
```bash
# View logs (Railway)
railway logs

# View logs (Render)
# Check Render dashboard → Logs tab

# View logs (Heroku)
heroku logs --tail
```

## Common Issues

### "No such price"
- Verify Price IDs in `.env` match Stripe Dashboard
- Check if using test mode keys with live prices (or vice versa)

### Webhook not working
- Verify webhook URL is publicly accessible
- Check webhook secret is correct
- Look at Stripe Dashboard → Webhooks → View logs

### Payment succeeds but credits not added
- Check backend logs for errors
- Verify `checkout.session.completed` event is handled
- Test webhook with Stripe CLI: `stripe trigger checkout.session.completed`

## Next Steps

After Stripe is working:
1. Add Firestore integration to persist subscription data
2. Implement credit refill on subscription renewal
3. Add cancellation flow in frontend
4. Set up customer portal for managing subscriptions
5. Add analytics to track conversion rates

---

**Ready to make money!** 💰 Once Stripe is configured, your app can accept real payments.