# 🔥 Firebase Setup Guide

This guide will help you set up Firebase for the Photo2Profit AI application and resolve deployment issues.

## Quick Start (For the Impatient)

```bash
# 1. Run the automated setup script
./setup-firebase.sh

# 2. Add secrets to GitHub (output from script)

# 3. Deploy
git push origin main
```

## Understanding the Error

### "Unable to read file 'vscode-userdata:/User/settings.json'"

**This is a VSCode IDE configuration error, not a Firebase deployment error.**

**Cause**: Your VSCode workspace settings are trying to access a non-existent settings file.

**Solution**: This error is now prevented by adding `.vscode/` to `.gitignore`. If you still see it:

1. Close VSCode
2. Delete the `.vscode` folder in your project (if it exists)
3. Restart VSCode
4. The error should be gone

**Important**: This error does NOT affect Firebase deployment! It's purely a local IDE issue.

---

## Firebase Deployment Setup

### Prerequisites

Before deploying to Firebase, you need:

1. ✅ A Firebase project created
2. ✅ Firebase services enabled (Auth, Firestore, Storage, Hosting)
3. ✅ Firebase service account key (JSON file)
4. ✅ GitHub secrets configured
5. ✅ Firebase configuration files (already included in repo)

### Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Click "Add project" or "Create a project"
3. Enter project name: `photo2profit-ai` (or your preferred name)
4. Enable Google Analytics (optional but recommended)
5. Click "Create project"

### Step 2: Enable Firebase Services

#### Enable Authentication
1. In Firebase Console → Build → Authentication
2. Click "Get started"
3. Enable "Google" sign-in method
4. Add your authorized domains (e.g., `photo2profit-ai.web.app`)
5. Save

#### Enable Firestore Database
1. In Firebase Console → Build → Firestore Database
2. Click "Create database"
3. Choose "Start in production mode"
4. Select a location (choose closest to your users)
5. Click "Enable"

#### Enable Cloud Storage
1. In Firebase Console → Build → Storage
2. Click "Get started"
3. Use default security rules (we'll update them later)
4. Select same location as Firestore
5. Click "Done"

#### Enable Firebase Hosting
1. In Firebase Console → Build → Hosting
2. Click "Get started"
3. Follow the wizard (no need to install CLI locally)
4. Note your hosting URL: `https://YOUR-PROJECT-ID.web.app`

### Step 3: Get Firebase Service Account

This is required for GitHub Actions to deploy automatically.

1. Firebase Console → Project Settings (⚙️ icon)
2. Go to "Service accounts" tab
3. Click "Generate new private key"
4. Save the JSON file securely (NEVER commit this to Git!)
5. You'll add this to GitHub secrets in the next step

### Step 4: Get Firebase Web Configuration

1. Firebase Console → Project Settings → General
2. Scroll to "Your apps" section
3. Click the Web icon (`</>`)
4. Register app with nickname: "Photo2Profit Web"
5. Copy the `firebaseConfig` object values:
   - `apiKey`
   - `authDomain`
   - `projectId`
   - `storageBucket`
   - `messagingSenderId`
   - `appId`

### Step 5: Add GitHub Secrets

Go to your GitHub repository:
```
https://github.com/selfishthangs-ux/photo2profitai/settings/secrets/actions
```

Add these secrets (click "New repository secret" for each):

#### Required Secrets

| Secret Name | Value | Where to Find |
|-------------|-------|---------------|
| `FIREBASE_SERVICE_ACCOUNT` | Full JSON content from Step 3 | Service account JSON file |
| `FIREBASE_PROJECT_ID` | Your project ID | Firebase Console → Project Settings |

#### Optional (but recommended) Secrets

These allow the GitHub Action to inject the Firebase config dynamically:

| Secret Name | Example Value | Where to Find |
|-------------|---------------|---------------|
| `FIREBASE_WEB_API_KEY` | `AIzaSyC...` | Firebase web config from Step 4 |
| `FIREBASE_AUTH_DOMAIN` | `photo2profit-ai.firebaseapp.com` | Firebase web config |
| `FIREBASE_STORAGE_BUCKET` | `photo2profit-ai.appspot.com` | Firebase web config |
| `FIREBASE_MESSAGING_SENDER_ID` | `1234567890` | Firebase web config |
| `FIREBASE_APP_ID` | `1:123:web:abc...` | Firebase web config |
| `BACKEND_URL` | `https://your-backend.railway.app` | Your backend URL (optional) |

### Step 6: Update Firebase Project ID (if different)

If you used a different project ID than `photo2profit-ai`:

1. Edit `.firebaserc`:
```json
{
  "projects": {
    "default": "your-actual-project-id"
  }
}
```

2. Commit the change:
```bash
git add .firebaserc
git commit -m "Update Firebase project ID"
git push origin main
```

### Step 7: Deploy

Once all secrets are configured, deploy by pushing to main:

```bash
git push origin main
```

Or manually trigger the deployment:
1. Go to GitHub → Actions
2. Select "Deploy to Firebase Hosting"
3. Click "Run workflow" → "Run workflow"

### Step 8: Verify Deployment

1. Check GitHub Actions for successful deployment
2. Visit your app at: `https://YOUR-PROJECT-ID.web.app`
3. Test authentication (Google sign-in)
4. Upload a test photo
5. Verify it appears in Firebase Storage

---

## Troubleshooting

### Issue: "Permission denied" during deployment

**Cause**: Firebase service account doesn't have proper permissions.

**Solution**:
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Select your Firebase project
3. Go to IAM & Admin → IAM
4. Find your service account
5. Add roles: "Firebase Admin", "Cloud Functions Developer"

### Issue: "Project not found"

**Cause**: Project ID mismatch between `.firebaserc` and GitHub secrets.

**Solution**:
1. Check `.firebaserc` → `projects.default`
2. Check GitHub secret `FIREBASE_PROJECT_ID`
3. Make sure they match exactly
4. Update Firebase Console → Project Settings to verify actual project ID

### Issue: GitHub Action fails with "Invalid service account"

**Cause**: Malformed JSON in `FIREBASE_SERVICE_ACCOUNT` secret.

**Solution**:
1. Re-download service account JSON from Firebase Console
2. Copy the ENTIRE content (including opening `{` and closing `}`)
3. Delete old secret in GitHub
4. Create new secret with fresh JSON content
5. Make sure there are no extra spaces or newlines

### Issue: App shows "Site Not Found"

**Cause**: Firebase Hosting not properly configured.

**Solution**:
1. Verify `firebase.json` exists with proper hosting config
2. Check `public/index.html` exists
3. Run deployment again
4. Wait 2-3 minutes for DNS propagation
5. Clear browser cache and try again

### Issue: Firebase config shows "YOUR_API_KEY"

**Cause**: GitHub secrets not set or injection failed.

**Solution**:
1. Verify all Firebase web config secrets are set in GitHub
2. Re-run the GitHub Action
3. Check Action logs for "Firebase config injected successfully"
4. If still failing, manually update `public/index.html` with your values

### Issue: Images not uploading

**Cause**: Storage rules too restrictive or not deployed.

**Solution**:
1. Check `storage.rules` exists in repository
2. Deploy rules manually:
   ```bash
   firebase deploy --only storage:rules
   ```
3. Verify rules in Firebase Console → Storage → Rules
4. Check browser console for specific error messages

### Issue: Authentication not working

**Cause**: Authorized domains not configured.

**Solution**:
1. Firebase Console → Authentication → Settings
2. Go to "Authorized domains"
3. Add your domains:
   - `YOUR-PROJECT-ID.web.app`
   - `YOUR-PROJECT-ID.firebaseapp.com`
   - `localhost` (for local testing)
4. Save changes

---

## Local Development with Firebase

### Install Firebase CLI

```bash
npm install -g firebase-tools
```

### Login to Firebase

```bash
firebase login
```

### Serve Locally

```bash
firebase serve
# App runs at http://localhost:5000
```

### Deploy from Local Machine

```bash
firebase deploy
```

### Use Firebase Emulators (Recommended for Development)

```bash
# Start all emulators
firebase emulators:start

# Your app now uses local Firebase services
# No charges, no production data affected
```

---

## File Explanations

### Configuration Files

| File | Purpose |
|------|---------|
| `firebase.json` | Main Firebase configuration, defines hosting rules |
| `.firebaserc` | Project aliases and active project |
| `firestore.rules` | Security rules for Firestore database |
| `firestore.indexes.json` | Database indexes for query optimization |
| `storage.rules` | Security rules for Cloud Storage |

### Why These Files Exist

- **firebase.json**: Tells Firebase CLI what to deploy and how
- **.firebaserc**: Links your code to your Firebase project
- **firestore.rules**: Prevents unauthorized access to user data
- **storage.rules**: Prevents unauthorized file uploads/downloads

### Security Note

✅ These files are SAFE to commit to Git:
- `firebase.json`
- `.firebaserc`
- `firestore.rules`
- `storage.rules`

❌ NEVER commit these to Git:
- Service account JSON files
- `.env` files with secrets
- Any file with API keys or tokens

---

## Next Steps After Deployment

1. ✅ Monitor Firebase Console → Analytics for usage
2. ✅ Set up budget alerts in Google Cloud Console
3. ✅ Configure custom domain (optional)
4. ✅ Set up Firebase Functions for backend processing
5. ✅ Implement monitoring and error tracking
6. ✅ Set up Stripe for payments (see `STRIPE_SETUP.md`)

---

## Additional Resources

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firebase Hosting Guide](https://firebase.google.com/docs/hosting)
- [Firebase CLI Reference](https://firebase.google.com/docs/cli)
- [GitHub Actions for Firebase](https://github.com/FirebaseExtended/action-hosting-deploy)
- [Photo2Profit Deployment Checklist](CHECKLIST.md)

---

## Getting Help

If you're still having issues:

1. Check [CHECKLIST.md](CHECKLIST.md) for step-by-step deployment
2. Review GitHub Actions logs for specific errors
3. Check Firebase Console → Functions → Logs for backend errors
4. Look at browser console for frontend errors
5. Create an issue on GitHub with:
   - Error message
   - What you were trying to do
   - Screenshots of errors
   - GitHub Action logs (remove any sensitive data)

---

**Remember**: The VSCode settings error is unrelated to Firebase deployment. Focus on the Firebase setup steps above! 🚀
