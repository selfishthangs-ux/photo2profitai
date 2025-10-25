# 🚀 Quick Deploy Commands

## First Time Setup
```bash
# 1. Install Firebase CLI globally
npm install -g firebase-tools

# 2. Login to Firebase
firebase login

# 3. Link to your project
firebase use photo2profit-ai

# 4. Set API keys
firebase functions:config:set removebg.api_key="YOUR_REMOVEBG_KEY"
firebase functions:config:set gemini.api_key="YOUR_GEMINI_KEY"
```

## Deploy Commands
```bash
# Build and deploy everything
cd /workspaces/photo2profitai/functions
npm run build
cd ..
firebase deploy

# Deploy specific services
firebase deploy --only functions      # Just Cloud Functions
firebase deploy --only hosting        # Just frontend
firebase deploy --only firestore:rules # Just Firestore rules
firebase deploy --only storage:rules   # Just Storage rules
```

## Development Commands
```bash
# Test functions locally
cd functions
npm run serve

# Test hosting locally
firebase serve --only hosting

# View live logs
firebase functions:log --follow

# View config
firebase functions:config:get
```

## Common Tasks
```bash
# Update a function
cd functions/src
# Edit index.ts
cd ..
npm run build
firebase deploy --only functions

# Update frontend
# Edit public/index.html
firebase deploy --only hosting

# View your app
firebase open hosting:site
```

## Your Live URLs
- **Frontend**: https://photo2profit-ai.web.app
- **Functions**: https://us-central1-photo2profit-ai.cloudfunctions.net
- **Firebase Console**: https://console.firebase.google.com/project/photo2profit-ai

---

**Pro Tip**: Save your API keys in a password manager! You'll need them if you redeploy.