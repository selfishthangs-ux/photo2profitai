# 🔥 Firebase Deployment - Quick Fix Guide

## The VSCode Error (Can be Ignored!)

**Error Message**: `Unable to read file 'vscode-userdata:/User/settings.json'`

**What it means**: Your VSCode editor has a configuration issue.

**Impact on deployment**: ⚠️ **NONE** - This is a local IDE issue and does NOT affect Firebase deployment!

**Quick Fix**:
1. The `.vscode/` directory is now in `.gitignore`
2. Close VSCode
3. Delete any `.vscode` folder in your project
4. Reopen VSCode
5. Error should be gone

---

## Firebase Deployment Checklist

### Before You Start
- [ ] Firebase project created at [console.firebase.google.com](https://console.firebase.google.com)
- [ ] Services enabled: Authentication, Firestore, Storage, Hosting
- [ ] Service account key downloaded (JSON file)

### GitHub Secrets Required
Go to: `https://github.com/selfishthangs-ux/photo2profitai/settings/secrets/actions`

**Minimum Required**:
- [ ] `FIREBASE_SERVICE_ACCOUNT` - Full JSON from service account file
- [ ] `FIREBASE_PROJECT_ID` - Your Firebase project ID (e.g., `photo2profit-ai`)

**Recommended** (for automatic config injection):
- [ ] `FIREBASE_WEB_API_KEY`
- [ ] `FIREBASE_AUTH_DOMAIN`
- [ ] `FIREBASE_STORAGE_BUCKET`
- [ ] `FIREBASE_MESSAGING_SENDER_ID`
- [ ] `FIREBASE_APP_ID`

### Deploy
```bash
# Option 1: Push to main
git push origin main

# Option 2: Manual trigger
# Go to GitHub → Actions → "Deploy to Firebase Hosting" → Run workflow
```

### Verify
- [ ] GitHub Actions shows green ✅
- [ ] Visit `https://YOUR-PROJECT-ID.web.app`
- [ ] Test sign-in
- [ ] Upload test photo

---

## Common Issues & Quick Fixes

### Issue: "Site Not Found"
**Fix**: Wait 2-3 minutes after deployment, clear browser cache, try again.

### Issue: "Permission denied"
**Fix**: Check service account has "Firebase Admin" role in Google Cloud Console.

### Issue: "Invalid service account"
**Fix**: Re-copy entire JSON file content to GitHub secret. Include `{` and `}`.

### Issue: Firebase config shows "YOUR_API_KEY"
**Fix**: Add all Firebase web config secrets to GitHub. See checklist above.

---

## Full Documentation

For complete setup instructions and advanced troubleshooting:
- 📚 [FIREBASE_SETUP.md](FIREBASE_SETUP.md) - Complete guide
- ✅ [CHECKLIST.md](CHECKLIST.md) - Step-by-step deployment
- 🔧 [setup-firebase.sh](setup-firebase.sh) - Automated setup script

---

## Need Help?

1. Check GitHub Actions logs for specific errors
2. Review [FIREBASE_SETUP.md](FIREBASE_SETUP.md) troubleshooting section
3. Verify all secrets are set in GitHub repository settings
4. Check Firebase Console for service status

**Remember**: The VSCode error is NOT related to Firebase deployment! 🚀
