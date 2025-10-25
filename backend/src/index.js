require('dotenv').config();

const express = require('express');
const cors = require('cors');
const path = require('path');
const { createCheckoutSession, handleWebhook } = require('./stripe-integration');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Serve static assets (your branding images)
app.use('/assets', express.static(path.join(__dirname, '../../assets')));

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

// Simple frontend preview route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../../frontend.html'));
});

// Serve the Virtual Stylist AI landing page
app.get('/virtual-stylist', (req, res) => {
  res.sendFile(path.join(__dirname, '../../virtual-stylist.html'));
});

// Stripe checkout endpoint
app.post('/api/checkout', createCheckoutSession);

// Stripe webhook endpoint (for production)
app.post('/api/webhook', express.raw({type: 'application/json'}), handleWebhook);

// Success page
app.get('/success', (req, res) => {
  res.send(`
    <html>
      <head><title>Welcome to Virtual Stylist AI!</title></head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto; background: linear-gradient(135deg, #fff5f5, #fce7e7); padding: 2rem; text-align: center;">
        <h1 style="color: #c78a8a;">🎉 Welcome to Virtual Stylist AI!</h1>
        <p style="font-size: 1.2rem; color: #9e5e60;">Your subscription is now active!</p>
        <p>Check your email for setup instructions and API access details.</p>
        <a href="/virtual-stylist" style="display: inline-block; margin-top: 2rem; background: linear-gradient(90deg, #c78a8a, #eac5c5); color: white; padding: 14px 28px; border-radius: 14px; text-decoration: none; font-weight: 600;">Return to Dashboard</a>
      </body>
    </html>
  `);
});

// API endpoint for description generation
app.post('/api/generate-description', (req, res) => {
  const { title, image } = req.body;
  
  // Demo AI-generated description
  const descriptions = [
    `Beautiful ${title} in excellent condition. This carefully curated piece combines style and functionality, perfect for anyone looking to add a touch of elegance to their collection.`,
    `High-quality ${title} that showcases attention to detail and craftsmanship. Well-maintained and ready for its next owner who appreciates fine items.`,
    `Stunning ${title} with unique character and charm. This piece has been lovingly cared for and offers great value for discerning buyers.`,
    `Exceptional ${title} featuring premium materials and timeless design. A rare find that would make a perfect addition to any collection.`
  ];
  
  const randomDescription = descriptions[Math.floor(Math.random() * descriptions.length)];
  
  res.json({
    description: randomDescription,
    confidence: 0.85,
    keywords: title.toLowerCase().split(' ').filter(word => word.length > 2)
  });
});

// API endpoint for price suggestions
app.post('/api/suggest-prices', (req, res) => {
  const { title, category } = req.body;
  
  // Demo pricing based on category
  const basePrices = {
    'clothing': { min: 15, max: 80 },
    'electronics': { min: 25, max: 200 },
    'home': { min: 10, max: 150 },
    'books': { min: 5, max: 30 },
    'toys': { min: 8, max: 60 },
    'sports': { min: 20, max: 120 },
    'beauty': { min: 12, max: 50 },
    'automotive': { min: 30, max: 300 },
    'default': { min: 10, max: 75 }
  };
  
  const priceRange = basePrices[category] || basePrices.default;
  const basePrice = Math.floor(Math.random() * (priceRange.max - priceRange.min)) + priceRange.min;
  
  res.json({
    thriftPrice: (basePrice * 0.6).toFixed(2),
    marketPrice: basePrice.toFixed(2),
    retailPrice: (basePrice * 1.8).toFixed(2),
    confidence: 0.78,
    factors: ['Category analysis', 'Market trends', 'Condition assessment']
  });
});

// API endpoint for background removal
app.post('/api/remove-background', async (req, res) => {
  try {
    const { imageData } = req.body;
    
    if (!imageData) {
      return res.status(400).json({ error: 'No image data provided' });
    }
    
    // Check if remove.bg API key is available
    const removeBgApiKey = process.env.REMOVEBG_API_KEY;
    
    if (!removeBgApiKey) {
      return res.json({
        success: false,
        message: 'Background removal ready for integration',
        status: 'needs_api_key',
        instructions: {
          step1: 'Get API key from https://www.remove.bg/api',
          step2: 'Add REMOVEBG_API_KEY to your .env file',
          step3: 'Restart server to enable background removal'
        },
        demo: true
      });
    }
    
    // Convert base64 to buffer for remove.bg API
    const base64Data = imageData.replace(/^data:image\/[a-z]+;base64,/, '');
    const imageBuffer = Buffer.from(base64Data, 'base64');
    
    // Call remove.bg API
    const FormData = require('form-data');
    const axios = require('axios');
    
    const formData = new FormData();
    formData.append('image_file', imageBuffer, 'image.jpg');
    formData.append('size', 'auto');
    
    const response = await axios.post('https://api.remove.bg/v1.0/removebg', formData, {
      headers: {
        'X-Api-Key': removeBgApiKey,
        ...formData.getHeaders()
      },
      responseType: 'arraybuffer'
    });
    
    // Convert processed image back to base64
    const processedImageBase64 = Buffer.from(response.data).toString('base64');
    const processedImageDataUrl = `data:image/png;base64,${processedImageBase64}`;
    
    res.json({
      success: true,
      pngDataUrl: processedImageDataUrl,
      message: 'Background removed successfully!',
      credits_remaining: response.headers['x-credits-remaining'] || 'unknown'
    });
    
  } catch (error) {
    console.error('Background removal error:', error.message);
    
    // Handle different types of errors
    if (error.response?.status === 402) {
      return res.status(402).json({
        success: false,
        error: 'Insufficient credits',
        message: 'Remove.bg API credits exhausted. Please upgrade your plan.',
        support: 'https://www.remove.bg/pricing'
      });
    }
    
    if (error.response?.status === 400) {
      return res.status(400).json({
        success: false,
        error: 'Invalid image',
        message: 'The image format or size is not supported.',
        supported_formats: ['JPG', 'PNG', 'WebP']
      });
    }
    
    res.status(500).json({
      success: false,
      error: 'Background removal failed',
      message: error.message,
      fallback: 'Try using a different image or check your API key'
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
