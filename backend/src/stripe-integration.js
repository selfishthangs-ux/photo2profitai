// Stripe integration for Virtual Stylist AI
require('dotenv').config();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// Virtual Stylist AI Pricing Plans
const PRICING_PLANS = {
  starter: {
    name: 'Starter',
    price: 4900, // $49.00 in cents
    interval: 'month',
    features: [
      'Up to 500 outfit suggestions',
      'Basic AI Styling Widget',
      'Email Support'
    ]
  },
  pro: {
    name: 'Pro', 
    price: 14900, // $149.00 in cents
    interval: 'month',
    features: [
      'Unlimited AI Styling',
      'White-label branding',
      'Integration for Shopify & Webflow',
      'Priority Support'
    ]
  },
  enterprise: {
    name: 'Enterprise',
    price: 49900, // $499.00 in cents (starting price)
    interval: 'month',
    features: [
      'Full API access',
      'Dedicated support',
      'Styling data analytics dashboard',
      'Custom integrations'
    ]
  }
};

// Create checkout session
async function createCheckoutSession(req, res) {
  try {
    const { plan, successUrl, cancelUrl } = req.body;
    
    if (!PRICING_PLANS[plan]) {
      return res.status(400).json({ error: 'Invalid plan selected' });
    }
    
    const planDetails = PRICING_PLANS[plan];
    
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `Virtual Stylist AI - ${planDetails.name}`,
              description: planDetails.features.join(', '),
              images: ['https://your-domain.com/assets/images/brand-logo.jpg']
            },
            unit_amount: planDetails.price,
            recurring: {
              interval: planDetails.interval,
            },
          },
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: successUrl || `${req.headers.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancelUrl || `${req.headers.origin}/virtual-stylist`,
      metadata: {
        plan: plan,
        product: 'virtual-stylist-ai'
      }
    });

    res.json({ 
      checkoutUrl: session.url,
      sessionId: session.id 
    });
    
  } catch (error) {
    console.error('Stripe checkout error:', error);
    res.status(500).json({ 
      error: 'Failed to create checkout session',
      details: error.message 
    });
  }
}

// Webhook to handle successful payments
async function handleWebhook(req, res) {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object;
      console.log('Payment successful:', session);
      
      // TODO: Provision user access, send welcome email, etc.
      // For now, we'll log the successful payment
      await handleSuccessfulPayment(session);
      break;
      
    case 'invoice.payment_succeeded':
      console.log('Subscription payment succeeded:', event.data.object);
      break;
      
    case 'customer.subscription.deleted':
      console.log('Subscription cancelled:', event.data.object);
      break;
      
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.json({ received: true });
}

async function handleSuccessfulPayment(session) {
  // In production, you'd:
  // 1. Create user account in database
  // 2. Send welcome email with login details
  // 3. Provision API access based on plan
  // 4. Send Discord/Slack notification
  
  console.log('🎉 New subscriber:', {
    plan: session.metadata.plan,
    amount: session.amount_total / 100,
    customer: session.customer_details.email
  });
  
  // Send notification to your Discord webhook
  if (process.env.ALERT_DISCORD_WEBHOOK_URL) {
    try {
      const webhookData = {
        embeds: [{
          title: "💰 New Virtual Stylist AI Subscriber!",
          color: 0xc78a8a,
          fields: [
            {
              name: "Plan",
              value: session.metadata.plan,
              inline: true
            },
            {
              name: "Amount",
              value: `$${session.amount_total / 100}`,
              inline: true  
            },
            {
              name: "Customer",
              value: session.customer_details.email,
              inline: false
            }
          ],
          timestamp: new Date().toISOString()
        }]
      };
      
      await fetch(process.env.ALERT_DISCORD_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(webhookData)
      });
    } catch (error) {
      console.error('Discord notification failed:', error);
    }
  }
}

module.exports = {
  createCheckoutSession,
  handleWebhook,
  PRICING_PLANS
};