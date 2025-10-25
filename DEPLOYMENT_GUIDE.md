# Photo2Profit AI - Setup & Deployment Guide

## 🎯 What You've Built

A complete AI-powered resale tool that:
- ✂️ Removes backgrounds with Remove.bg
- ✨ Generates titles, descriptions, and pricing with Gemini AI
- 💾 Saves listings to Firestore with real-time sync
- 🔐 Supports Google sign-in and anonymous users

## 📋 Prerequisites

1. **Firebase Project**: Create at https://console.firebase.google.com
2. **Remove.bg API Key**: Get at https://www.remove.bg/api
3. **Google Gemini API Key**: Get at https://aistudio.google.com/app/apikey

## 🚀 Step 1: Firebase Setup

### 1.1 Create Firebase Project
```bash
# Open Firebase Console
https://console.firebase.google.com

# Create new project named "photo2profit-ai"
# Enable Google Analytics (optional)
```

### 1.2 Enable Services
```
✅ Authentication → Sign-in method → Enable "Google"
✅ Firestore Database → Create database (production mode)
✅ Storage → Get started
✅ Functions → Upgrade to Blaze plan (pay-as-you-go)
```

### 1.3 Get Firebase Config
```bash
# Go to Project Settings → General → Your apps
# Add Web App → Copy config object

# Your config will look like:
{
  apiKey: "AIza...",
  authDomain: "photo2profit-ai.firebaseapp.com",
  projectId: "photo2profit-ai",
  storageBucket: "photo2profit-ai.appspot.com",
  messagingSenderId: "123...",
  appId: "1:123..."
}
```

## 🔧 Step 2: Configure API Keys

### 2.1 Set Firebase Functions Config
```bash
cd /workspaces/photo2profitai/functions

# Set Remove.bg API key
firebase functions:config:set removebg.api_key="YOUR_REMOVEBG_KEY"

# Set Gemini API key
firebase functions:config:set gemini.api_key="YOUR_GEMINI_KEY"

# View config (verify)
firebase functions:config:get
```

### 2.2 Update Frontend Config
```bash
# Edit public/index.html
# Replace lines 465-471 with your Firebase config:

const firebaseConfig = {
  apiKey: "YOUR_ACTUAL_API_KEY",
  authDomain: "photo2profit-ai.firebaseapp.com",
  projectId: "photo2profit-ai",
  storageBucket: "photo2profit-ai.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_ID",
  appId: "YOUR_APP_ID"
};
```

## 📤 Step 3: Deploy to Firebase

### 3.1 Install Firebase CLI
```bash
npm install -g firebase-tools

# Login to Firebase
firebase login
```

### 3.2 Initialize Project
```bash
cd /workspaces/photo2profitai

# Link to your Firebase project
firebase use photo2profit-ai
```

### 3.3 Build Functions
```bash
cd functions
npm run build
cd ..
```

### 3.4 Deploy Everything
```bash
# Deploy Firestore rules
firebase deploy --only firestore:rules

# Deploy Storage rules
firebase deploy --only storage:rules

# Deploy Cloud Functions
firebase deploy --only functions

# Deploy Frontend
firebase deploy --only hosting

# Or deploy all at once
firebase deploy
```

## 🧪 Step 4: Test the App

### 4.1 Open Your App
```bash
# Your app will be live at:
https://photo2profit-ai.web.app

# Or open Firebase Console → Hosting → View live URL
```

### 4.2 Test Upload Flow
1. Click "Continue Without Account" or "Sign in with Google"
2. Upload a product photo
3. Watch status indicators:
   - 📤 Uploading...
   - ✂️ Removing background...
   - ✨ AI writing listing...
   - 🎉 Listing ready!
4. Form auto-fills with AI data
5. Click "Save Draft" to store in Firestore

### 4.3 Check Firebase Console
```
✅ Storage: uploads/{userId}/{itemId} (original)
✅ Storage: processed/{userId}/{itemId}.png (no background)
✅ Firestore: users/{userId}/listings/{itemId} (listing data)
```

## 💰 Step 5: Add Stripe Payments

### 5.1 Update Pricing Plans
```bash
# Edit backend/src/stripe-integration.js
# Change from $49/$149/$499 to $1 trial system:

const PRICING_PLANS = {
  trial: {
    name: "Trial",
    price: 100, // $1.00
    credits: 5
  },
  casual: {
    name: "Casual",
    price: 999, // $9.99
    credits: 50
  },
  pro: {
    name: "Pro",
    price: 1999, // $19.99
    credits: 200
  },
  boss: {
    name: "Boss Mode",
    price: 2999, // $29.99
    credits: 1000
  }
};
```

### 5.2 Deploy Backend
```bash
cd backend
npm install
node src/index.js &

# Or deploy to cloud service (Heroku, Railway, Render)
```

## 📊 Step 6: Monitor & Scale

### 6.1 Check Firebase Console
```
Functions → Dashboard → View execution logs
Functions → Usage → Monitor invocations
Firestore → Usage → Check reads/writes
Storage → Usage → Check bandwidth
```

### 6.2 Set Budgets
```
Firebase Console → Usage and billing → Set budget alerts
Recommended: Start with $25/month cap
```

### 6.3 Optimize Costs
```javascript
// Firestore optimization:
- Limit query results: .limit(10)
- Use pagination for listings
- Cache AI results (avoid regenerating)

// Storage optimization:
- Compress images before upload
- Delete old uploads after 30 days
- Use Cloud Functions to auto-cleanup
```

## 🎨 Step 7: Customize Branding

### 7.1 Add Your Logo
```bash
# Replace header in public/index.html:
<header>
  <img src="/assets/logo.png" alt="Your Logo">
  <h1>Your Brand Name</h1>
</header>
```

### 7.2 Change Colors
```css
/* Update rose-gold gradient in public/index.html */
background: linear-gradient(135deg, #YOUR_COLOR_1, #YOUR_COLOR_2);
```

## 🔥 What's Next?

### Immediate Revenue Tasks:
1. ✅ Deploy to Firebase (you're ready!)
2. 🎯 Update Stripe to $1 trial pricing
3. 📱 Share your live URL on social media
4. 💰 Start collecting payments

### Future Enhancements:
- Multi-platform export (eBay, Poshmark, Depop)
- Bulk upload (process 10+ photos at once)
- Mobile app (React Native)
- Advanced AI (brand recognition, defect detection)
- Analytics dashboard (track listings, sales)

## 🆘 Troubleshooting

### Functions Not Triggering
```bash
# Check Firebase logs
firebase functions:log

# Verify API keys are set
firebase functions:config:get

# Redeploy functions
firebase deploy --only functions --force
```

### Storage Upload Fails
```bash
# Check storage.rules
# Verify CORS is enabled:
gsutil cors set cors.json gs://YOUR_BUCKET
```

### AI Not Generating Content
```bash
# Test Gemini API key:
curl https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=YOUR_KEY

# Check Firestore listener in browser console
# Verify document path: users/{uid}/listings/{itemId}
```

## 📞 Support

- Firebase Docs: https://firebase.google.com/docs
- Remove.bg Docs: https://www.remove.bg/api/documentation
- Gemini Docs: https://ai.google.dev/docs

---

## 🎉 Congratulations!

You now have a **complete AI resale tool** that:
- Processes photos automatically
- Generates listings with AI
- Stores data in Firestore
- Ready for monetization with Stripe

**Your app is live at**: https://photo2profit-ai.web.app

Now go make money! 💰✨