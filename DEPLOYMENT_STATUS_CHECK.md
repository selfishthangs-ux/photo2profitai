# Firebase Deployment Status Check

Use this guide to verify your Firebase deployment setup is complete and properly configured.

## ✅ Pre-Deployment Checklist

### 1. Firebase Project Setup
- [ ] Firebase project created at https://console.firebase.google.com
- [ ] Project ID matches: `photo2profit-ai` (or your chosen ID)
- [ ] Blaze (pay-as-you-go) plan enabled (required for Cloud Functions)

### 2. Firebase Services Enabled
- [ ] **Hosting**: Enabled (Hosting tab shows setup complete)
- [ ] **Firestore Database**: Created in production mode
- [ ] **Cloud Storage**: Enabled (Storage tab accessible)
- [ ] **Authentication**: Google sign-in enabled (optional but recommended)
- [ ] **Cloud Functions**: Ready (if using backend functions)

### 3. Service Account Generated
- [ ] Service account JSON downloaded from Firebase Console
- [ ] JSON file contains: `type`, `project_id`, `private_key`, `client_email`
- [ ] Service account email format: `firebase-adminsdk-xxxxx@YOUR_PROJECT_ID.iam.gserviceaccount.com`

### 4. ⚠️ IAM Roles Granted (CRITICAL)
- [ ] **Firebase Admin role granted** (`roles/firebase.admin`)
  - OR granular roles: Firebase Hosting Admin, Datastore Index Admin, Firebase Rules Admin
- [ ] Verified in: https://console.cloud.google.com/iam-admin/iam?project=YOUR_PROJECT_ID
- [ ] Service account appears in IAM list with proper roles

**📖 Need help with IAM? See [FIREBASE_IAM_SETUP.md](FIREBASE_IAM_SETUP.md)**

### 5. GitHub Secrets Configured
- [ ] Navigate to: https://github.com/selfishthangs-ux/photo2profitai/settings/secrets/actions
- [ ] `FIREBASE_SERVICE_ACCOUNT` secret added (entire JSON content)
- [ ] `FIREBASE_PROJECT_ID` secret added (e.g., `photo2profit-ai`)
- [ ] Other API keys added (Remove.bg, AI provider, etc.)

### 6. Repository Files Present
- [ ] `firebase.json` exists in root
- [ ] `.firebaserc` exists with correct project ID
- [ ] `public/index.html` exists
- [ ] `.github/workflows/firebase-deploy.yml` exists

## 🚀 Deployment Verification

### Step 1: Trigger Deployment

**Option A: Manual Trigger**
1. Go to: https://github.com/selfishthangs-ux/photo2profitai/actions
2. Click "Deploy to Firebase Hosting"
3. Click "Run workflow" → Select `main` → "Run workflow"

**Option B: Push to Main**
```bash
git commit --allow-empty -m "Verify Firebase deployment"
git push origin main
```

### Step 2: Monitor GitHub Actions

Watch for these steps to complete successfully:

- [ ] ✅ Checkout code
- [ ] ✅ Setup Node.js
- [ ] ✅ Verify public directory exists
- [ ] ✅ **Validate Firebase service account secret**
  - Should show: `✅ Service account JSON looks valid`
  - Should show: Notice with `client_email` and `project_id`
- [ ] ✅ Resolve PROJECT_ID
- [ ] ✅ **Deploy to Firebase Hosting**
  - Should show: "Deploy complete!"
  - Should show deployment URL

### Step 3: Check for Common Errors

#### ❌ "FIREBASE_SERVICE_ACCOUNT secret is missing or empty"
**Solution**: Add or update the secret in GitHub settings

#### ❌ "Permission denied" or "403 Forbidden"
**Solution**: Grant IAM roles to service account (see [FIREBASE_IAM_SETUP.md](FIREBASE_IAM_SETUP.md))

#### ❌ "Service account does not have permission to access project"
**Solution**: 
1. Verify service account `project_id` matches your Firebase project
2. Check IAM roles are granted on the correct project
3. Wait 1-2 minutes for IAM changes to propagate

#### ❌ "Site Not Found" after successful deployment
**Solution**:
1. Wait 2-3 minutes for DNS propagation
2. Verify `public/index.html` exists in repository
3. Check Firebase Hosting console for active deployment

## ✨ Post-Deployment Verification

### 1. Verify Website is Live
- [ ] Open: https://YOUR_PROJECT_ID.web.app
- [ ] Or: https://YOUR_PROJECT_ID.firebaseapp.com
- [ ] Site loads without "Site Not Found" error
- [ ] Content matches your latest code

### 2. Verify Firebase Console

#### Hosting
- [ ] Go to: https://console.firebase.google.com/project/YOUR_PROJECT_ID/hosting
- [ ] Shows recent deployment with timestamp
- [ ] "View" button opens your live site

#### Firestore Rules
- [ ] Go to: https://console.firebase.google.com/project/YOUR_PROJECT_ID/firestore/rules
- [ ] Rules tab shows your custom security rules
- [ ] Last updated timestamp is recent

#### Storage Rules  
- [ ] Go to: https://console.firebase.google.com/project/YOUR_PROJECT_ID/storage/rules
- [ ] Rules tab shows your custom security rules
- [ ] Last updated timestamp is recent

### 3. Test Application Functionality

- [ ] Sign in with Google works (if Auth enabled)
- [ ] Upload a photo works
- [ ] Background removal processes
- [ ] AI generates listing content
- [ ] Data saves to Firestore
- [ ] Images appear in Storage

## 🔍 Debugging Deployment Issues

### Check GitHub Actions Logs
1. Go to: https://github.com/selfishthangs-ux/photo2profitai/actions
2. Click the failed workflow run
3. Expand failed steps to see error messages

### Check Firebase Deployment Logs
1. Go to Firebase Console → Hosting
2. Click on a deployment
3. View deployment details and any errors

### Common Solutions

#### Issue: IAM Permission Errors
- **Check**: IAM roles granted? See [FIREBASE_IAM_SETUP.md](FIREBASE_IAM_SETUP.md)
- **Wait**: 1-2 minutes for IAM changes to propagate
- **Verify**: Service account email matches in both GitHub secret and GCP IAM

#### Issue: Secret Format Errors
- **Check**: JSON is valid (use `jq` or JSON validator)
- **Check**: No extra quotes or spaces in GitHub secret value
- **Fix**: Copy entire JSON content exactly as downloaded

#### Issue: Project ID Mismatch
- **Check**: `.firebaserc` project ID
- **Check**: Service account JSON `project_id` field  
- **Check**: GitHub secret `FIREBASE_PROJECT_ID`
- **Fix**: Ensure all three match exactly

## 📊 Deployment Health Scorecard

Rate your deployment setup:

| Category | Status | Notes |
|----------|--------|-------|
| Firebase project created | ⬜ | |
| Services enabled | ⬜ | Hosting, Firestore, Storage |
| Service account generated | ⬜ | JSON downloaded |
| **IAM roles granted** | ⬜ | **CRITICAL** - Firebase Admin or granular roles |
| GitHub secrets configured | ⬜ | FIREBASE_SERVICE_ACCOUNT + PROJECT_ID |
| Workflow file present | ⬜ | .github/workflows/firebase-deploy.yml |
| Public files exist | ⬜ | public/index.html |
| Deployment successful | ⬜ | GitHub Actions green ✅ |
| Site accessible | ⬜ | https://YOUR_PROJECT_ID.web.app |
| Rules deployed | ⬜ | Firestore + Storage |

**Target: 10/10 ✅**

## 🎯 Next Steps After Successful Deployment

1. **Set up custom domain** (optional)
   - Firebase Hosting → Domain → Add custom domain
   - Follow DNS setup instructions

2. **Configure environment variables**
   - Add remaining API keys (Remove.bg, AI provider)
   - Update frontend config with Firebase web config

3. **Monitor usage**
   - Firebase Console → Usage tab
   - Set up billing alerts
   - Monitor free tier limits

4. **Set up monitoring**
   - Firebase Performance Monitoring
   - Google Analytics
   - Error tracking (Sentry, etc.)

5. **Iterate and improve**
   - Test all features
   - Gather user feedback
   - Deploy updates regularly

## 📚 Additional Resources

- [CHECKLIST.md](CHECKLIST.md) - Complete deployment guide
- [FIREBASE_IAM_SETUP.md](FIREBASE_IAM_SETUP.md) - IAM roles and permissions
- [FIREBASE_DEPLOYMENT_FIXES.md](FIREBASE_DEPLOYMENT_FIXES.md) - Troubleshooting guide
- [Firebase Documentation](https://firebase.google.com/docs)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)

## 🆘 Still Having Issues?

1. **Review error messages** in GitHub Actions logs
2. **Check IAM roles** - Most common issue!
3. **Verify secrets** are set correctly
4. **Wait** 1-2 minutes for changes to propagate
5. **Test locally** with Firebase CLI if needed:
   ```bash
   npm install -g firebase-tools
   firebase login
   firebase deploy
   ```

---

**Last Updated**: After IAM setup documentation added
**Status**: ✅ Ready for deployment verification
