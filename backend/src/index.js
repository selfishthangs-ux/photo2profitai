require('dotenv').config();

const express = require('express');
const cors = require('cors');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const {
  PRICING_PLANS,
  createCheckoutSession,
  handleSuccessfulPayment,
  checkCredits,
  deductCredit
} = require('./stripe-integration');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Founding count endpoint
app.get('/api/founding-count', async (req, res) => {
  try {
    // Verify required environment variables are set
    const envCheck = {
      alertWebhook: !!process.env.ALERT_DISCORD_WEBHOOK_URL,
      firebaseKey: !!process.env.FIREBASE_PRIVATE_KEY,
      stripePrice: !!process.env.STRIPE_FOUNDING_PRICE_ID,
    };

    // Mock founding count data
    // In production, this would query Firebase or Stripe
    const foundingCount = {
      total: 0,
      limit: 100,
      remaining: 100,
      percentFilled: 0,
      timestamp: new Date().toISOString(),
      environment: {
        configured: envCheck,
        allConfigured: Object.values(envCheck).every(v => v)
      }
    };

    res.json(foundingCount);
  } catch (error) {
    console.error('Error in /api/founding-count:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
});

// Get pricing plans
app.get('/api/pricing', (req, res) => {
  const plans = Object.entries(PRICING_PLANS).map(([key, plan]) => ({
    id: key,
    name: plan.name,
    price: plan.price / 100, // Convert cents to dollars
    credits: plan.credits,
    description: plan.description
  }));
  
  res.json({ plans });
});

// Create Stripe checkout session
app.post('/api/checkout', async (req, res) => {
  try {
    const { plan, userId } = req.body;

    if (!plan || !userId) {
      return res.status(400).json({ error: 'Missing plan or userId' });
    }

    const baseUrl = process.env.BASE_URL || 'http://localhost:3000';
    
    const session = await createCheckoutSession({
      plan,
      userId,
      successUrl: `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancelUrl: `${baseUrl}/canceled`
    });

    res.json(session);
  } catch (error) {
    console.error('Checkout error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Stripe webhook handler
app.post('/api/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object;
      const { userId, plan, credits } = session.metadata;
      
      await handleSuccessfulPayment({
        userId,
        plan,
        subscriptionId: session.subscription
      });
      
      console.log(`✅ Checkout completed for ${userId}, plan: ${plan}`);
      break;

    case 'customer.subscription.updated':
    case 'customer.subscription.deleted':
      console.log(`Subscription ${event.type}:`, event.data.object.id);
      break;

    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  res.json({ received: true });
});

// Check user credits
app.get('/api/credits/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    // In real app, check Firestore
    // For now, return mock data
    res.json({
      hasCredits: true,
      remaining: 5,
      plan: 'trial'
    });
  } catch (error) {
    console.error('Credits check error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Something went wrong',
    message: err.message
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log('\nEnvironment variables status:');
  console.log(`  ALERT_DISCORD_WEBHOOK_URL: ${process.env.ALERT_DISCORD_WEBHOOK_URL ? '✓ Set' : '✗ Not set'}`);
  console.log(`  FIREBASE_PRIVATE_KEY: ${process.env.FIREBASE_PRIVATE_KEY ? '✓ Set' : '✗ Not set'}`);
  console.log(`  STRIPE_FOUNDING_PRICE_ID: ${process.env.STRIPE_FOUNDING_PRICE_ID ? '✓ Set' : '✗ Not set'}`);
});

module.exports = app;
