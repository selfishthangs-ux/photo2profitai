# 🚀 Photo2Profit Deployment Checklist

## 🔧 Recent Fixes Applied

### Firebase Configuration Files
- ✅ Added `firebase.json` - Firebase hosting configuration
- ✅ Added `.firebaserc` - Firebase project configuration
- ✅ Added `firestore.rules` - Firestore security rules
- ✅ Added `firestore.indexes.json` - Firestore indexes
- ✅ Added `storage.rules` - Cloud Storage security rules

### VSCode Configuration
- ✅ Added `.vscode/settings.json` - Workspace settings (fixes VSCode error)
- ✅ Added `.vscode/extensions.json` - Recommended extensions
- ✅ Updated `.gitignore` - Properly handles VSCode files

### GitHub Actions
- ✅ Added `firebase-deploy.yml` - Automated Firebase deployment workflow

---

## ✅ Step 1: Firebase Project Setup

### Create Firebase Project
- [ ] Go to https://console.firebase.google.com
- [ ] Click "Add project"
- [ ] Name: `photo2profit-ai`
- [ ] Enable Google Analytics (optional)
- [ ] Click "Create project"

### Enable Firebase Services
- [ ] Authentication → Sign-in method → Enable "Google"
- [ ] Firestore Database → Create database → Production mode → Next → Enable
- [ ] Storage → Get started → Production mode → Done
- [ ] Functions → Upgrade to Blaze plan (pay-as-you-go, required for Cloud Functions)

---

## ✅ Step 2: Get Firebase Service Account

- [ ] Firebase Console → Project Settings (⚙️ icon)
- [ ] Service accounts tab
- [ ] Click "Generate new private key"
- [ ] Download JSON file (keep it safe!)
- [ ] Note: This file contains sensitive credentials

---

## ✅ Step 3: Get Firebase Web Config

- [ ] Firebase Console → Project Settings → General
- [ ] Scroll to "Your apps" section
- [ ] Click Web icon (</>)
- [ ] Register app name: "Photo2Profit Web"
- [ ] Copy these values:
  ```
  apiKey: _______________________
  authDomain: _______________________
  projectId: _______________________
  storageBucket: _______________________
  messagingSenderId: _______________________
  appId: _______________________
  ```

---

## ✅ Step 4: Get API Keys

### Remove.bg (Background Removal)
- [ ] Go to https://www.remove.bg/api
- [ ] Sign up for free account
- [ ] Dashboard → Get API Key
- [ ] Copy your API key
- [ ] Note: Free tier = 50 images/month

### Gemini AI (Option 1)
- [ ] Go to https://aistudio.google.com/app/apikey
- [ ] Sign in with Google
- [ ] Click "Create API Key"
- [ ] Copy your API key

### Anthropic Claude (Option 2 - Recommended)
- [ ] Go to https://console.anthropic.com
- [ ] Sign up for account
- [ ] API Keys → Create Key
- [ ] Copy your API key
- [ ] Note: Claude 3.5 Sonnet is more advanced

---

## ✅ Step 5: Add Secrets to GitHub

### Go to GitHub Secrets
- [ ] Open: https://github.com/selfishthangs-ux/photo2profitai/settings/secrets/actions
- [ ] Click "New repository secret" for each below

### Required Secrets

#### Firebase Service Account
- [ ] Name: `FIREBASE_SERVICE_ACCOUNT`
- [ ] Value: Paste entire JSON file content from Step 2
- [ ] Click "Add secret"

#### Firebase Project ID
- [ ] Name: `FIREBASE_PROJECT_ID`
- [ ] Value: `photo2profit-ai` (or your actual project ID)
- [ ] Click "Add secret"

#### Remove.bg API Key
- [ ] Name: `REMOVE_BG_API_KEY`
- [ ] Value: Your Remove.bg API key from Step 4
- [ ] Click "Add secret"

#### AI Provider Choice
Pick one (or add both):

**Option A: Use Claude (Recommended)**
- [ ] Name: `ANTHROPIC_API_KEY`
- [ ] Value: Your Anthropic API key from Step 4
- [ ] Click "Add secret"
- [ ] Name: `AI_PROVIDER`
- [ ] Value: `anthropic`
- [ ] Click "Add secret"

**Option B: Use Gemini**
- [ ] Name: `GEMINI_API_KEY`
- [ ] Value: Your Gemini API key from Step 4
- [ ] Click "Add secret"
- [ ] Name: `AI_PROVIDER`
- [ ] Value: `gemini`
- [ ] Click "Add secret"

### Optional Secrets (Makes deployment smoother)

#### Firebase Web Config
- [ ] Name: `FIREBASE_WEB_API_KEY`
- [ ] Value: apiKey from Step 3
- [ ] Name: `FIREBASE_AUTH_DOMAIN`
- [ ] Value: authDomain from Step 3
- [ ] Name: `FIREBASE_STORAGE_BUCKET`
- [ ] Value: storageBucket from Step 3
- [ ] Name: `FIREBASE_MESSAGING_SENDER_ID`
- [ ] Value: messagingSenderId from Step 3
- [ ] Name: `FIREBASE_APP_ID`
- [ ] Value: appId from Step 3

---

## ✅ Step 6: Deploy to Firebase

### Trigger Deployment
Choose one method:

**Method A: Re-run GitHub Action**
- [ ] Go to: https://github.com/selfishthangs-ux/photo2profitai/actions
- [ ] Click the latest workflow run
- [ ] Click "Re-run all jobs"

**Method B: Push empty commit**
```bash
git commit --allow-empty -m "Deploy with secrets configured"
git push origin main
```

### Wait for Deployment
- [ ] Watch the GitHub Actions progress (takes ~3 minutes)
- [ ] All steps should show green checkmarks ✅
- [ ] Look for "Deploy Hosting" step to complete

---

## ✅ Step 7: Verify Your Live App

### Test the App
- [ ] Open: https://photo2profit-ai.web.app (or your custom domain)
- [ ] You should see the Photo2Profit landing page (no more "Site Not Found")
- [ ] Click "Continue Without Account" or "Sign in with Google"
- [ ] Upload a product photo
- [ ] Watch the status indicators:
  - 📤 Uploading...
  - ✂️ Removing background...
  - ✨ AI writing listing...
  - 🎉 Listing ready!
- [ ] Verify form auto-fills with AI data (title, description, pricing)
- [ ] Click "Save Draft" - should save successfully
- [ ] Upload 5 more photos to test upgrade modal

### Check Firebase Console
- [ ] Firestore → users/{userId}/listings - see your listing documents
- [ ] Storage → uploads/{userId} - see uploaded images
- [ ] Storage → processed/{userId} - see processed images (background removed)
- [ ] Functions → Logs - see function execution logs

---

## ✅ Step 8: Setup Stripe (Optional - For Revenue)

### If you want to accept payments:
- [ ] Follow guide: `STRIPE_SETUP.md`
- [ ] Create Stripe account
- [ ] Create 4 products ($1, $9.99, $19.99, $29.99)
- [ ] Deploy backend (Railway/Render/Heroku)
- [ ] Update frontend with backend URL
- [ ] Test payment flow with test card

---

## 🎉 You're Live!

### What You Built:
✅ AI-powered photo-to-listing generator
✅ Background removal with Remove.bg
✅ Smart pricing with AI (Gemini or Claude)
✅ Real-time status updates
✅ 5 free trial listings
✅ Upgrade modal for paid tiers
✅ Firebase hosting + functions
✅ Google sign-in + anonymous mode

### Your Live URLs:
- **App**: https://photo2profit-ai.web.app
- **Firebase Console**: https://console.firebase.google.com/project/photo2profit-ai
- **GitHub Actions**: https://github.com/selfishthangs-ux/photo2profitai/actions

### Next Steps:
1. Share your app URL on social media
2. Get feedback from users
3. Set up Stripe to start making money
4. Add analytics to track conversions
5. Build more features (bulk upload, multi-platform export)

---

## 🆘 Troubleshooting

### "Site Not Found" after deploy
- Check GitHub Actions completed successfully
- Verify `public/index.html` exists in repo
- Wait 2-3 minutes for DNS propagation

### Functions not working
- Check Firebase Console → Functions → Logs for errors
- Verify API keys are set in GitHub secrets
- Check Functions → Configuration shows your keys

### AI not generating content
- Check Functions logs for errors
- Verify AI_PROVIDER matches the key you provided
- Test API keys directly (curl commands in STRIPE_SETUP.md)

### Upgrade modal not showing
- Upload 6 photos (more than 5 free)
- Check browser console for JavaScript errors
- Verify credit tracking is working

---

**Need help?** Check:
- `EASY_DEPLOY.md` - Simplified deployment guide
- `DEPLOYMENT_GUIDE.md` - Detailed technical docs
- `STRIPE_SETUP.md` - Payment setup guide
- Firebase docs: https://firebase.google.com/docs

**You've got this! 🚀**