// VIRTUAL STYLIST AI - $1 TRIAL SYSTEM
// Credit-based trial → Auto-upgrade funnel

export const PRICING_CONFIG = {
  // $1 Trial - 5 Boss Listings
  trial: {
    name: "Boss Trial",
    price: 1.00,
    credits: 5,
    features: [
      "5 Full Boss-Mode Listings",
      "Background Removal ✅",
      "AI Title + Description + SEO ✅", 
      "Pricing AI ✅",
      "Cross-posting ✅",
      "Inventory Sync ✅",
      "Watermark ✅"
    ],
    duration: "7 days or 5 listings",
    stripe_price_id: "price_trial_boss_1dollar"
  },

  // Auto-upgrade options after trial
  plans: {
    casual: {
      name: "Casual Seller",
      price: 9.99,
      monthly: true,
      features: [
        "Unlimited AI Listings",
        "Background Removal",
        "AI Titles & Descriptions", 
        "Pricing AI",
        "Basic Analytics"
      ],
      limitations: ["No Cross-posting", "No Batch Upload"],
      stripe_price_id: "price_casual_9_99"
    },
    
    pro: {
      name: "Pro Seller", 
      price: 19.99,
      monthly: true,
      features: [
        "Everything in Casual",
        "Custom Branding",
        "Batch Upload (50 items)",
        "Priority Support",
        "Advanced Analytics"
      ],
      limitations: ["No Cross-posting Automation"],
      stripe_price_id: "price_pro_19_99"
    },
    
    boss: {
      name: "Boss Mode 💎",
      price: 29.99,
      monthly: true,
      popular: true, // Default selection
      features: [
        "Everything in Pro",
        "Cross-posting Automation",
        "Unlimited Batch Upload", 
        "White-label Options",
        "Priority Queue",
        "Dedicated Success Manager"
      ],
      stripe_price_id: "price_boss_29_99"
    }
  }
};

export const CONVERSION_COPY = {
  trialComplete: {
    headline: "🔥 You've used your 5 Boss listings!",
    subheading: "Which best matches how you sell?",
    cta: "Continue with Boss Mode 💎"
  },
  
  creditWarning: {
    1: "📊 You have 1 Boss listing left",
    0: "🔔 Upgrade now to keep selling everywhere automatically" 
  },
  
  upgradeReasons: [
    "You're already making money with our automation",
    "Don't lose momentum - your listings are converting",
    "Boss Mode users report 3x higher sales velocity"
  ]
};

export const TRIAL_LOGIC = {
  // Conversion triggers
  convertAfter: {
    credits: 5, // listings used
    days: 7,    // or time limit
    whicheverFirst: true
  },
  
  // Default upgrade path
  defaultPlan: "boss", // Psychology: they experienced it, they want it
  
  // Usage tracking
  trackEvents: [
    "listing_created",
    "background_removed", 
    "cross_post_attempted",
    "pricing_ai_used",
    "trial_conversion_shown",
    "plan_selected"
  ]
};