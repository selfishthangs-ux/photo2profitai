require('dotenv').config();

const express = require('express');
const cors = require('cors');

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
