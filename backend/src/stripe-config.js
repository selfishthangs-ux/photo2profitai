require('dotenv').config();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// Pricing structure with $1 trial
const PRICING_PLANS = {
  trial: {
    name: '$1 Trial',
    description: 'Test Photo2Profit with 5 credits',
    price: 100, // $1.00 in cents
    credits: 5,
    features: [
      '5 AI-powered listings',
      'Background removal',
      'AI-generated content',
      'Basic support'
    ]
  },
  casual: {
    name: 'Casual Seller',
    description: 'Perfect for occasional sellers',
    price: 999, // $9.99 in cents
    credits: 50,
    features: [
      '50 AI-powered listings',
      'Background removal',
      'AI-generated content',
      'Priority support',
      'Export to multiple platforms'
    ]
  },
  pro: {
    name: 'Pro Reseller',
    description: 'For serious resellers',
    price: 1999, // $19.99 in cents
    credits: 200,
    features: [
      '200 AI-powered listings',
      'Background removal',
      'AI-generated content',
      'Priority support',
      'Export to multiple platforms',
      'Bulk processing',
      'Advanced analytics'
    ]
  },
  boss: {
    name: 'Boss Mode',
    description: 'For power users and teams',
    price: 2999, // $29.99 in cents
    credits: 1000,
    features: [
      '1000 AI-powered listings',
      'Background removal',
      'AI-generated content',
      'Premium support',
      'Export to multiple platforms',
      'Bulk processing',
      'Advanced analytics',
      'API access',
      'Team collaboration'
    ]
  }
};

// Create or retrieve Stripe products and prices
async function ensureStripeProducts() {
  try {
    const products = {};
    
    for (const [key, plan] of Object.entries(PRICING_PLANS)) {
      // Search for existing product
      const existingProducts = await stripe.products.search({
        query: `name:"${plan.name}"`,
      });

      let product;
      if (existingProducts.data.length > 0) {
        product = existingProducts.data[0];
      } else {
        // Create new product
        product = await stripe.products.create({
          name: plan.name,
          description: plan.description,
          metadata: {
            credits: plan.credits,
            plan_key: key
          }
        });
      }

      // Get or create price for this product
      const prices = await stripe.prices.list({
        product: product.id,
        active: true,
        limit: 1
      });

      let price;
      if (prices.data.length > 0 && prices.data[0].unit_amount === plan.price) {
        price = prices.data[0];
      } else {
        // Create new price
        price = await stripe.prices.create({
          product: product.id,
          unit_amount: plan.price,
          currency: 'usd',
          metadata: {
            plan_key: key,
            credits: plan.credits
          }
        });
      }

      products[key] = {
        product_id: product.id,
        price_id: price.id,
        ...plan
      };
    }

    return products;
  } catch (error) {
    console.error('Error ensuring Stripe products:', error);
    throw error;
  }
}

// Create a checkout session
async function createCheckoutSession({ priceId, userId, planKey, successUrl, cancelUrl }) {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: successUrl,
      cancel_url: cancelUrl,
      client_reference_id: userId,
      metadata: {
        userId,
        planKey,
        credits: PRICING_PLANS[planKey].credits
      }
    });

    return session;
  } catch (error) {
    console.error('Error creating checkout session:', error);
    throw error;
  }
}

// Create a customer portal session
async function createPortalSession({ customerId, returnUrl }) {
  try {
    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: returnUrl,
    });

    return session;
  } catch (error) {
    console.error('Error creating portal session:', error);
    throw error;
  }
}

// Verify webhook signature
function verifyWebhookSignature(payload, signature) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  
  if (!webhookSecret) {
    throw new Error('Stripe webhook secret not configured');
  }

  try {
    return stripe.webhooks.constructEvent(payload, signature, webhookSecret);
  } catch (error) {
    console.error('Webhook signature verification failed:', error);
    throw error;
  }
}

module.exports = {
  stripe,
  PRICING_PLANS,
  ensureStripeProducts,
  createCheckoutSession,
  createPortalSession,
  verifyWebhookSignature
};
