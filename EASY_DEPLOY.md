# Photo2Profit - Quick Start (No Firebase CLI Needed!)

## 🎯 Fastest Way to Deploy (GitHub Actions)

Your app is set up to auto-deploy when you push to GitHub. Follow these 3 steps:

### Step 1: Create Firebase Project (2 minutes)
1. Go to https://console.firebase.google.com
2. Click "Add project" → name it `photo2profit-ai`
3. Enable these services:
   - **Authentication** → Sign-in method → Enable Google
   - **Firestore Database** → Create database (production mode)
   - **Storage** → Get started
   - **Hosting** → Get started

### Step 2: Get Service Account Key (1 minute)
```bash
# In Firebase Console:
1. Project Settings (⚙️) → Service accounts
2. Click "Generate new private key"
3. Save the JSON file (keep it secret!)
```

### Step 3: Add Secrets to GitHub (1 minute)
```bash
# In your GitHub repo:
1. Go to Settings → Secrets and variables → Actions
2. Click "New repository secret"
3. Name: FIREBASE_SERVICE_ACCOUNT
4. Value: Paste the entire JSON from Step 2
5. Click "Add secret"
```

### Step 4: Push to Deploy 🚀
```bash
git add .
git commit -m "Deploy Photo2Profit"
git push origin main
```

**That's it!** GitHub Actions will build and deploy your app automatically.

Check deploy status: https://github.com/selfishthangs-ux/photo2profitai/actions

---

## 🔑 Add API Keys (After First Deploy)

Once deployed, add your API keys in Firebase Console:

```bash
# Go to Firebase Console → Functions → Configuration
# Or use CLI locally if you have it set up:

firebase functions:config:set removebg.api_key="YOUR_REMOVE_BG_KEY"
firebase functions:config:set gemini.api_key="YOUR_GEMINI_KEY"

# Optional: Enable Claude instead of Gemini
firebase functions:config:set ai.provider="anthropic"
firebase functions:config:set anthropic.api_key="YOUR_ANTHROPIC_KEY"

# Then redeploy functions:
firebase deploy --only functions
```

**Or set via Console:**
1. Firebase Console → Functions → Configuration
2. Add environment config:
   - `removebg.api_key` = your Remove.bg key
   - `gemini.api_key` = your Gemini key
   - `ai.provider` = "anthropic" (optional)
   - `anthropic.api_key` = your Anthropic key (optional)

---

## 🌐 Update Frontend Firebase Config

After project is created, update `public/index.html`:

1. Firebase Console → Project Settings → General → Your apps
2. Click the Web app (</>) icon
3. Copy the config object
4. Replace lines 465-471 in `public/index.html`:

```javascript
const firebaseConfig = {
  apiKey: "YOUR_ACTUAL_API_KEY",
  authDomain: "photo2profit-ai.firebaseapp.com",
  projectId: "photo2profit-ai",
  storageBucket: "photo2profit-ai.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_ID",
  appId: "YOUR_APP_ID"
};
```

5. Commit and push to deploy the update.

---

## ✅ Your App is Live!

After the GitHub Action completes:
- **Live URL**: https://photo2profit-ai.web.app
- **Firebase Console**: https://console.firebase.google.com/project/photo2profit-ai

Test the flow:
1. Visit your live URL
2. Sign in or continue as guest
3. Upload a product photo
4. Watch AI generate your listing
5. Save and export!

---

## 🆘 Troubleshooting

**GitHub Action fails?**
- Check you added the `FIREBASE_SERVICE_ACCOUNT` secret
- Verify Firebase project ID matches in `.github/workflows/firebase-deploy.yml`

**Functions not triggering?**
- Add API keys in Firebase Console (see section above)
- Check Functions logs in Firebase Console

**Frontend errors?**
- Update Firebase config in `public/index.html` (see section above)
- Check browser console for errors

---

## 🎨 What's Next?

Now that deployment is automated, focus on revenue:
1. Update Stripe to $1 trial system
2. Share your live URL on social media
3. Track conversions in Firebase Analytics
4. Add more AI features (bulk upload, multi-platform export)

**No Firebase CLI needed!** Just push to GitHub and your app deploys automatically. 🚀