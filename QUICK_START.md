# 🚀 Firebase Deployment Quick Start

**For Photo2Profit AI - Get deployed in 15 minutes!**

## Step 1: Create Firebase Project (2 min)
1. Go to https://console.firebase.google.com → "Add project"
2. Name: `photo2profit-ai` → Continue → Create
3. Click "Upgrade to Blaze plan" (pay-as-you-go, free tier available)

## Step 2: Generate Service Account (1 min)
1. Firebase Console → ⚙️ Settings → "Service accounts" tab
2. Click "Generate new private key" → Download JSON
3. **Save this file securely!** (Never commit to git)

## Step 3: ⚠️ Grant IAM Roles (2 min) **CRITICAL STEP**

### Option A: Using Firebase Console (Easiest)
1. Same page → Click "Manage service account permissions in Google Cloud Console"
2. Find your service account (ends with `@photo2profit-ai.iam.gserviceaccount.com`)
3. Click ✏️ (edit) → "+ ADD ANOTHER ROLE"
4. Search and add: **"Firebase Admin"**
5. Click "Save"

### Option B: Using gcloud CLI
```bash
PROJECT_ID="photo2profit-ai"
SERVICE_ACCOUNT="firebase-adminsdk-xxxxx@${PROJECT_ID}.iam.gserviceaccount.com"

gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member="serviceAccount:${SERVICE_ACCOUNT}" \
  --role="roles/firebase.admin"
```

### ✅ Verify IAM Roles Granted
Go to: https://console.cloud.google.com/iam-admin/iam?project=photo2profit-ai
- Find your service account
- Verify "Firebase Admin" appears in Role column
- ⚠️ **If not visible, deployment will fail!**

**📖 Detailed IAM guide: [FIREBASE_IAM_SETUP.md](FIREBASE_IAM_SETUP.md)**

## Step 4: Add GitHub Secrets (3 min)
1. Go to: https://github.com/selfishthangs-ux/photo2profitai/settings/secrets/actions
2. Click "New repository secret"

### Add these secrets:

**Secret 1: FIREBASE_SERVICE_ACCOUNT**
- Name: `FIREBASE_SERVICE_ACCOUNT`
- Value: Paste **entire JSON file content** from Step 2
- Click "Add secret"

**Secret 2: FIREBASE_PROJECT_ID**
- Name: `FIREBASE_PROJECT_ID`
- Value: `photo2profit-ai` (or your actual project ID)
- Click "Add secret"

## Step 5: Deploy! (5 min)

### Option A: Manual Trigger
1. Go to: https://github.com/selfishthangs-ux/photo2profitai/actions
2. Click "Deploy to Firebase Hosting"
3. Click "Run workflow" → main → "Run workflow"

### Option B: Push to Main
```bash
git commit --allow-empty -m "Deploy to Firebase"
git push origin main
```

### Watch deployment progress (takes ~3 min):
- ✅ Checkout code
- ✅ Setup Node.js
- ✅ Verify public directory exists
- ✅ Validate Firebase service account secret
- ✅ Deploy to Firebase Hosting

## Step 6: Verify It's Live! (2 min)
1. Open: https://photo2profit-ai.web.app
2. Should see your app (no "Site Not Found")
3. Test features: Upload photo, background removal, AI generation

## ❌ Troubleshooting

### "Permission denied" or "403 Forbidden"
- ⚠️ **Most common issue!** IAM roles not granted
- Go back to Step 3 and grant "Firebase Admin" role
- Wait 1-2 minutes, then re-run deployment

### "FIREBASE_SERVICE_ACCOUNT secret is missing"
- Check GitHub secrets are added correctly (Step 4)
- Verify JSON is valid (no syntax errors)

### "Project ID mismatch" warning
- Verify `.firebaserc` matches your project ID
- Update if needed: Change `"default": "photo2profit-ai"` to your ID

### "Site Not Found" after successful deployment
- Wait 2-3 minutes for DNS propagation
- Clear browser cache and try again
- Verify `public/index.html` exists in repo

## 🎉 Success Checklist
- [ ] Firebase project created
- [ ] Service account JSON downloaded
- [ ] ⚠️ **IAM roles granted** (Firebase Admin)
- [ ] GitHub secrets added (FIREBASE_SERVICE_ACCOUNT + PROJECT_ID)
- [ ] GitHub Actions deployment successful (all green ✅)
- [ ] Site loads at https://photo2profit-ai.web.app
- [ ] Features work (upload, background removal, AI)

## 📚 Next Steps
1. Add more API keys (Remove.bg, AI provider) - see [CHECKLIST.md](CHECKLIST.md)
2. Enable Firebase Authentication
3. Set up Stripe for payments - see [STRIPE_SETUP.md](STRIPE_SETUP.md)
4. Configure custom domain
5. Monitor usage in Firebase Console

## 📖 Full Documentation
- **[CHECKLIST.md](CHECKLIST.md)** - Complete step-by-step guide
- **[FIREBASE_IAM_SETUP.md](FIREBASE_IAM_SETUP.md)** - Detailed IAM configuration
- **[DEPLOYMENT_STATUS_CHECK.md](DEPLOYMENT_STATUS_CHECK.md)** - Verify your setup
- **[FIREBASE_DEPLOYMENT_FIXES.md](FIREBASE_DEPLOYMENT_FIXES.md)** - Troubleshooting

## 🆘 Still Stuck?
1. Check GitHub Actions logs for specific error messages
2. Review [FIREBASE_IAM_SETUP.md](FIREBASE_IAM_SETUP.md) for IAM setup
3. Verify all secrets are set correctly
4. Wait 1-2 minutes for IAM changes to propagate
5. Most issues are IAM-related - double-check Step 3!

---

**Deployment Time: ~15 minutes**  
**Difficulty: Easy** (with this guide)  
**Most Critical Step: Step 3 - IAM Roles** ⚠️

**Let's get you deployed! 🚀**
