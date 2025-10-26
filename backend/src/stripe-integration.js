// Stripe Integration - $1 Trial System
// Photo2Profit AI - Credit-based pricing with auto-upgrade

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// Pricing Plans: $1 trial → $9.99/$19.99/$29.99 monthly
const PRICING_PLANS = {
  trial: {
    name: 'Trial',
    price: 100, // $1.00 in cents
    credits: 5,
    priceId: process.env.STRIPE_TRIAL_PRICE_ID || 'price_trial', // Replace with real Stripe Price ID
    description: '5 listings to try Photo2Profit'
  },
  casual: {
    name: 'Casual Seller',
    price: 999, // $9.99
    credits: 50,
    priceId: process.env.STRIPE_CASUAL_PRICE_ID || 'price_casual',
    description: '50 listings per month'
  },
  pro: {
    name: 'Pro Reseller',
    price: 1999, // $19.99
    credits: 200,
    priceId: process.env.STRIPE_PRO_PRICE_ID || 'price_pro',
    description: '200 listings per month'
  },
  boss: {
    name: 'Boss Mode',
    price: 2999, // $29.99
    credits: 1000,
    priceId: process.env.STRIPE_BOSS_PRICE_ID || 'price_boss',
    description: 'Unlimited listings'
  }
};

/**
 * Create Stripe checkout session
 */
async function createCheckoutSession({ plan, userId, successUrl, cancelUrl }) {
  if (!PRICING_PLANS[plan]) {
    throw new Error(`Invalid plan: ${plan}`);
  }

  const planDetails = PRICING_PLANS[plan];

  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    payment_method_types: ['card'],
    line_items: [
      {
        price: planDetails.priceId,
        quantity: 1,
      },
    ],
    success_url: successUrl,
    cancel_url: cancelUrl,
    client_reference_id: userId,
    metadata: {
      userId,
      plan,
      credits: planDetails.credits
    },
    subscription_data: {
      metadata: {
        userId,
        plan,
        credits: planDetails.credits
      }
    }
  });

  return {
    sessionId: session.id,
    url: session.url
  };
}

/**
 * Handle successful payment webhook
 */
async function handleSuccessfulPayment({ userId, plan, subscriptionId }) {
  const planDetails = PRICING_PLANS[plan];

  console.log(`✅ Payment successful for user ${userId}, plan: ${plan}`);

  // In a real app, update Firestore with:
  // - subscription status
  // - credit balance
  // - subscription ID for future reference
  
  return {
    success: true,
    userId,
    plan: planDetails.name,
    credits: planDetails.credits,
    subscriptionId
  };
}

/**
 * Check if user has credits remaining
 */
async function checkCredits(userId, db) {
  // Query Firestore for user's subscription
  const userDoc = await db.collection('users').doc(userId).get();
  
  if (!userDoc.exists) {
    return { hasCredits: false, remaining: 0, plan: null };
  }

  const userData = userDoc.data();
  const credits = userData.credits || 0;
  const plan = userData.plan || null;

  return {
    hasCredits: credits > 0,
    remaining: credits,
    plan
  };
}

/**
 * Deduct a credit after successful listing generation
 */
async function deductCredit(userId, db) {
  const userRef = db.collection('users').doc(userId);
  
  await db.runTransaction(async (transaction) => {
    const userDoc = await transaction.get(userRef);
    
    if (!userDoc.exists) {
      throw new Error('User not found');
    }

    const currentCredits = userDoc.data().credits || 0;
    
    if (currentCredits <= 0) {
      throw new Error('No credits remaining');
    }

    transaction.update(userRef, {
      credits: currentCredits - 1,
      lastUsed: new Date()
    });
  });

  return { success: true };
}

/**
 * Handle subscription renewal (webhook)
 */
async function handleSubscriptionRenewal({ subscriptionId, userId, db }) {
  const subscription = await stripe.subscriptions.retrieve(subscriptionId);
  const plan = subscription.metadata.plan;
  const planDetails = PRICING_PLANS[plan];

  // Refill credits on renewal
  await db.collection('users').doc(userId).update({
    credits: planDetails.credits,
    lastRenewal: new Date(),
    subscriptionStatus: 'active'
  });

  console.log(`🔄 Subscription renewed for ${userId}, plan: ${plan}, credits refilled to ${planDetails.credits}`);
  
  return { success: true };
}

/**
 * Handle subscription cancellation
 */
async function handleSubscriptionCanceled({ subscriptionId, userId, db }) {
  await db.collection('users').doc(userId).update({
    subscriptionStatus: 'canceled',
    canceledAt: new Date()
  });

  console.log(`❌ Subscription canceled for ${userId}`);
  
  return { success: true };
}

module.exports = {
  PRICING_PLANS,
  createCheckoutSession,
  handleSuccessfulPayment,
  checkCredits,
  deductCredit,
  handleSubscriptionRenewal,
  handleSubscriptionCanceled
};
