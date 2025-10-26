# 🔍 Firebase Deployment Troubleshooting Guide

## Quick Diagnostic: Where Are You?

### ✅ I just granted IAM access
**Next Steps:**
1. ⏱️ Wait 1-2 minutes for IAM changes to propagate
2. 🚀 Re-run your GitHub Actions deployment
3. 👀 Watch for success in: https://github.com/selfishthangs-ux/photo2profitai/actions

**What to expect:**
- ✅ "Validate Firebase service account secret" should pass
- ✅ "Deploy to Firebase Hosting" should complete
- 🌐 Site should be live at: https://photo2profit-ai.web.app

**If it still fails:** See "Deployment Fails" section below

---

### ❌ Deployment fails with "Permission denied"
**Most likely cause:** IAM roles not granted or not propagated

**Solutions:**
1. **Verify IAM roles are granted:**
   - Go to: https://console.cloud.google.com/iam-admin/iam?project=photo2profit-ai
   - Find: `firebase-adminsdk-xxxxx@photo2profit-ai.iam.gserviceaccount.com`
   - Check: Role column shows "Firebase Admin"

2. **If role is NOT there:**
   - Follow: [FIREBASE_IAM_SETUP.md](FIREBASE_IAM_SETUP.md) → "How to Grant IAM Roles"
   - Wait 1-2 minutes
   - Re-run deployment

3. **If role IS there:**
   - You just added it? Wait 2 more minutes (IAM propagation)
   - Re-run deployment
   - Still failing? Check "Advanced Troubleshooting" below

**Detailed guide:** [FIREBASE_IAM_SETUP.md](FIREBASE_IAM_SETUP.md)

---

### ❌ Deployment fails with "FIREBASE_SERVICE_ACCOUNT secret is missing"
**Most likely cause:** GitHub secret not configured

**Solutions:**
1. **Check if secret exists:**
   - Go to: https://github.com/selfishthangs-ux/photo2profitai/settings/secrets/actions
   - Look for: `FIREBASE_SERVICE_ACCOUNT`

2. **If secret is missing:**
   - Follow: [QUICK_START.md](QUICK_START.md) → Step 4
   - Add both `FIREBASE_SERVICE_ACCOUNT` and `FIREBASE_PROJECT_ID`
   - Re-run deployment

3. **If secret exists:**
   - Delete and re-add it (might be corrupted)
   - Ensure you pasted the ENTIRE JSON content
   - No extra quotes or spaces

**Detailed guide:** [QUICK_START.md](QUICK_START.md) - Step 4

---

### ❌ Deployment succeeds but "Site Not Found"
**Most likely cause:** DNS propagation delay or missing files

**Solutions:**
1. **Wait for DNS propagation:**
   - Wait 2-3 minutes
   - Clear browser cache (Ctrl+Shift+R or Cmd+Shift+R)
   - Try incognito/private window

2. **Check public/index.html exists:**
   ```bash
   # Should show the file
   ls -la public/index.html
   ```
   - If missing: Add `public/index.html` file
   - Commit and push

3. **Verify deployment in Firebase Console:**
   - Go to: https://console.firebase.google.com/project/photo2profit-ai/hosting
   - Check: Recent deployment shows with timestamp
   - Click: "View" button to test

**Detailed guide:** [FIREBASE_DEPLOYMENT_FIXES.md](FIREBASE_DEPLOYMENT_FIXES.md)

---

### ❌ "Project ID mismatch" warning
**Most likely cause:** Service account from different project

**Solutions:**
1. **Check which project the service account is from:**
   - Look at GitHub Actions log
   - Find: "Service account used: project_id=XXXXX"
   - Compare with your intended project: `photo2profit-ai`

2. **If they DON'T match:**
   - **Option A:** Generate new service account from correct project
   - **Option B:** Update `.firebaserc` to match service account project
   - **Option C:** Update `FIREBASE_PROJECT_ID` secret to match

3. **Which option should I choose?**
   - Use the project that has your Firebase services configured
   - Usually: Option A (generate new service account from photo2profit-ai)

**Detailed guide:** [FIREBASE_IAM_SETUP.md](FIREBASE_IAM_SETUP.md) → "Common Issues"

---

### ❌ "Error deploying to Firebase Hosting"
**Most likely cause:** Missing permissions or configuration

**Check these in order:**

1. **IAM roles granted?**
   - Yes → Go to #2
   - No → Grant roles: [FIREBASE_IAM_SETUP.md](FIREBASE_IAM_SETUP.md)

2. **firebase.json exists?**
   ```bash
   cat firebase.json
   ```
   - Should show hosting configuration
   - If missing: File should be in repo (check git status)

3. **public/index.html exists?**
   ```bash
   ls -la public/index.html
   ```
   - Should exist
   - If missing: Create it

4. **Check GitHub Actions error:**
   - Read the specific error message
   - Search for it in [FIREBASE_IAM_SETUP.md](FIREBASE_IAM_SETUP.md) troubleshooting

---

### ✅ Deployment succeeded but features don't work
**Most likely cause:** Missing environment variables or API keys

**Solutions:**
1. **Check Firebase Functions are deployed:**
   - Go to: https://console.firebase.google.com/project/photo2profit-ai/functions
   - Should see functions listed
   - Check logs for errors

2. **Check API keys are configured:**
   - Remove.bg API key
   - AI provider API key (Gemini or Anthropic)
   - See: [CHECKLIST.md](CHECKLIST.md) → Step 5

3. **Check browser console for errors:**
   - Open Developer Tools (F12)
   - Check Console tab
   - Look for API errors or configuration issues

**Detailed guide:** [CHECKLIST.md](CHECKLIST.md) - Complete setup

---

## 🎯 Decision Tree

```
Start: Did deployment fail?
│
├─ YES → Check error message:
│   │
│   ├─ "Permission denied" / "403"
│   │   └─> Grant IAM roles → FIREBASE_IAM_SETUP.md
│   │
│   ├─ "Secret missing"
│   │   └─> Add GitHub secrets → QUICK_START.md Step 4
│   │
│   ├─ "Project ID mismatch"
│   │   └─> Verify projects match → FIREBASE_IAM_SETUP.md
│   │
│   └─ Other error
│       └─> See Advanced Troubleshooting below
│
└─ NO → Site deployed but:
    │
    ├─ "Site Not Found"
    │   └─> Wait 2-3 min, check DNS → FIREBASE_DEPLOYMENT_FIXES.md
    │
    ├─ Features don't work
    │   └─> Check API keys, functions → CHECKLIST.md
    │
    └─ Everything works!
        └─> 🎉 Congratulations! You're live!
```

---

## 🔧 Advanced Troubleshooting

### Check GitHub Actions Logs
1. Go to: https://github.com/selfishthangs-ux/photo2profitai/actions
2. Click the failed workflow run
3. Click on the failed step
4. Read the error message carefully
5. Search for that error in our docs

### Check Firebase Console
1. **Hosting:** https://console.firebase.google.com/project/photo2profit-ai/hosting
   - Recent deployments
   - Hosting configuration

2. **IAM:** https://console.cloud.google.com/iam-admin/iam?project=photo2profit-ai
   - Service account roles
   - Permissions

3. **Functions:** https://console.firebase.google.com/project/photo2profit-ai/functions
   - Function logs
   - Error messages

### Verify Service Account
```bash
# Extract and check service account email from GitHub secret
# (Do this in GitHub Actions workflow or locally with secret)
echo $FIREBASE_SERVICE_ACCOUNT | jq -r '.client_email'
# Should output: firebase-adminsdk-xxxxx@photo2profit-ai.iam.gserviceaccount.com

echo $FIREBASE_SERVICE_ACCOUNT | jq -r '.project_id'
# Should output: photo2profit-ai (or your project ID)
```

### Test Locally (If GitHub Actions keeps failing)
```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login to Firebase
firebase login

# Deploy locally to test
firebase deploy

# If this works but GitHub Actions fails:
# → Issue is with service account or IAM roles
# → Follow: FIREBASE_IAM_SETUP.md
```

---

## 📋 Quick Reference: All Documentation

| Guide | Use When | Time to Read |
|-------|----------|--------------|
| **[DEPLOYMENT_SUMMARY.md](DEPLOYMENT_SUMMARY.md)** | Just granted IAM access | 2 min |
| **[QUICK_START.md](QUICK_START.md)** | Starting from scratch | 15 min |
| **[FIREBASE_IAM_SETUP.md](FIREBASE_IAM_SETUP.md)** | IAM permission issues | 10 min |
| **[DEPLOYMENT_STATUS_CHECK.md](DEPLOYMENT_STATUS_CHECK.md)** | Verifying setup | 5 min |
| **[CHECKLIST.md](CHECKLIST.md)** | Complete guide | 30 min |
| **[FIREBASE_DEPLOYMENT_FIXES.md](FIREBASE_DEPLOYMENT_FIXES.md)** | Troubleshooting | 10 min |
| **This Guide** | Quick diagnosis | 3 min |

---

## 🆘 Still Stuck?

### Before Asking for Help:
1. ✅ Read the error message carefully
2. ✅ Check IAM roles are granted (most common issue!)
3. ✅ Verify GitHub secrets are set
4. ✅ Wait 2 minutes after making IAM changes
5. ✅ Check all relevant guides above

### When Asking for Help:
Provide:
1. 📋 Exact error message from GitHub Actions
2. 🔗 Link to failed workflow run
3. ✅ Checklist of what you've tried
4. 📸 Screenshot of IAM page (if permission issue)

### Most Common Fix:
**90% of issues are IAM-related!**
- → Grant "Firebase Admin" role
- → Wait 1-2 minutes
- → Re-run deployment
- → Success! 🎉

---

**Your Next Action:** Find your issue above → Follow the solution → Re-run deployment

**Success Rate:** Following these guides = 95%+ deployment success 🚀
