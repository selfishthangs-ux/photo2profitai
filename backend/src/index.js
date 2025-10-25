require('dotenv').config();

const express = require('express');
const cors = require('cors');
const {
  PRICING_PLANS,
  ensureStripeProducts,
  createCheckoutSession,
  createPortalSession,
  verifyWebhookSignature
} = require('./stripe-config');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());

// Stripe webhook needs raw body
app.post('/api/stripe/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const signature = req.headers['stripe-signature'];

  try {
    const event = verifyWebhookSignature(req.body, signature);

    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object;
        console.log('Payment succeeded:', session);
        
        // Here you would update user credits in Firestore
        // For now, just log it
        console.log('User:', session.metadata.userId);
        console.log('Credits to add:', session.metadata.credits);
        console.log('Plan:', session.metadata.planKey);
        break;

      case 'payment_intent.succeeded':
        console.log('Payment intent succeeded');
        break;

      case 'payment_intent.payment_failed':
        console.log('Payment intent failed');
        break;

      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    res.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(400).send(`Webhook Error: ${error.message}`);
  }
});

// JSON middleware for other routes
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Get pricing plans
app.get('/api/pricing', (req, res) => {
  try {
    res.json({
      plans: PRICING_PLANS,
      currency: 'USD'
    });
  } catch (error) {
    console.error('Error in /api/pricing:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
});

// Create checkout session
app.post('/api/create-checkout-session', async (req, res) => {
  try {
    const { planKey, userId } = req.body;

    if (!planKey || !userId) {
      return res.status(400).json({
        error: 'Missing required fields',
        message: 'planKey and userId are required'
      });
    }

    if (!PRICING_PLANS[planKey]) {
      return res.status(400).json({
        error: 'Invalid plan',
        message: 'The specified plan does not exist'
      });
    }

    // Ensure Stripe products exist
    const products = await ensureStripeProducts();
    const selectedPlan = products[planKey];

    // Create checkout session
    const baseUrl = process.env.BASE_URL || 'http://localhost:3000';
    const session = await createCheckoutSession({
      priceId: selectedPlan.price_id,
      userId,
      planKey,
      successUrl: `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancelUrl: `${baseUrl}/cancel`
    });

    res.json({
      sessionId: session.id,
      url: session.url
    });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    res.status(500).json({
      error: 'Failed to create checkout session',
      message: error.message
    });
  }
});

// Create customer portal session
app.post('/api/create-portal-session', async (req, res) => {
  try {
    const { customerId } = req.body;

    if (!customerId) {
      return res.status(400).json({
        error: 'Missing required field',
        message: 'customerId is required'
      });
    }

    const baseUrl = process.env.BASE_URL || 'http://localhost:3000';
    const session = await createPortalSession({
      customerId,
      returnUrl: baseUrl
    });

    res.json({
      url: session.url
    });
  } catch (error) {
    console.error('Error creating portal session:', error);
    res.status(500).json({
      error: 'Failed to create portal session',
      message: error.message
    });
  }
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
  console.log(`  STRIPE_SECRET_KEY: ${process.env.STRIPE_SECRET_KEY ? '✓ Set' : '✗ Not set'}`);
  console.log(`  STRIPE_WEBHOOK_SECRET: ${process.env.STRIPE_WEBHOOK_SECRET ? '✓ Set' : '✗ Not set'}`);
});

module.exports = app;
