# Firebase Service Account IAM Setup Guide

## Overview

This guide explains how to grant the necessary IAM (Identity and Access Management) roles to your Firebase service account for automated deployment via GitHub Actions.

## Why IAM Roles Are Needed

The Firebase service account needs specific permissions to deploy your application components:
- **Firebase Hosting**: Deploy the web application
- **Firestore Database**: Deploy security rules and indexes
- **Cloud Storage**: Deploy storage security rules
- **Cloud Functions**: Deploy serverless functions (if used)

## Required IAM Roles

Your Firebase service account needs the following roles granted on your Firebase/GCP project:

### Core Deployment Roles

1. **Firebase Admin** (`roles/firebase.admin`)
   - Full access to Firebase services
   - **Recommended**: This single role covers all Firebase deployment needs
   - **Scope**: All Firebase services (Hosting, Firestore, Storage, Functions)

### Alternative: Granular Roles (Optional)

If you prefer more granular permissions instead of Firebase Admin:

1. **Firebase Hosting Admin** (`roles/firebasehosting.admin`)
   - Deploy to Firebase Hosting
   - Manage hosting sites and releases

2. **Cloud Datastore Index Admin** (`roles/datastore.indexAdmin`)
   - Deploy Firestore indexes
   - Manage database index configurations

3. **Firebase Rules Admin** (`roles/firebaserules.admin`)
   - Deploy Firestore and Storage security rules
   - Update security rule configurations

4. **Cloud Functions Developer** (`roles/cloudfunctions.developer`) *(if using Functions)*
   - Deploy and manage Cloud Functions
   - Update function code and configurations

5. **Service Account User** (`roles/iam.serviceAccountUser`)
   - Allow the service account to act as itself
   - Required for certain deployment operations

## How to Grant IAM Roles

### Method 1: Firebase Console (Easiest)

1. **Open Firebase Console**
   - Go to: https://console.firebase.google.com
   - Select your project: `photo2profit-ai` (or your actual project name)

2. **Navigate to Project Settings**
   - Click the ⚙️ (gear icon) next to "Project Overview"
   - Select "Project settings"

3. **Go to Service Accounts Tab**
   - Click the "Service accounts" tab
   - You'll see your service account email (e.g., `firebase-adminsdk-xxxxx@photo2profit-ai.iam.gserviceaccount.com`)

4. **Open Google Cloud Console**
   - Click "Manage service account permissions in Google Cloud Console"
   - Or go directly to: https://console.cloud.google.com/iam-admin/iam?project=YOUR_PROJECT_ID

5. **Grant Roles**
   - Find your service account in the list (email ends with `@photo2profit-ai.iam.gserviceaccount.com`)
   - Click the ✏️ (pencil icon) to edit
   - Click "+ ADD ANOTHER ROLE"
   - Search for and add **"Firebase Admin"**
   - Click "Save"

### Method 2: gcloud CLI (Advanced)

```bash
# Set your project ID
PROJECT_ID="photo2profit-ai"

# Set your service account email (get this from Firebase Console → Service Accounts)
SERVICE_ACCOUNT="firebase-adminsdk-xxxxx@${PROJECT_ID}.iam.gserviceaccount.com"

# Option A: Grant Firebase Admin role (Recommended)
gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member="serviceAccount:${SERVICE_ACCOUNT}" \
  --role="roles/firebase.admin"

# Option B: Grant granular roles (if you prefer minimal permissions)
gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member="serviceAccount:${SERVICE_ACCOUNT}" \
  --role="roles/firebasehosting.admin"

gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member="serviceAccount:${SERVICE_ACCOUNT}" \
  --role="roles/datastore.indexAdmin"

gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member="serviceAccount:${SERVICE_ACCOUNT}" \
  --role="roles/firebaserules.admin"

gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member="serviceAccount:${SERVICE_ACCOUNT}" \
  --role="roles/iam.serviceAccountUser"

# If using Cloud Functions:
gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member="serviceAccount:${SERVICE_ACCOUNT}" \
  --role="roles/cloudfunctions.developer"
```

## Verifying IAM Roles

### Via Google Cloud Console

1. Go to: https://console.cloud.google.com/iam-admin/iam?project=YOUR_PROJECT_ID
2. Find your service account (ends with `@photo2profit-ai.iam.gserviceaccount.com`)
3. Verify the "Role" column shows "Firebase Admin" (or the granular roles)

### Via gcloud CLI

```bash
# List all IAM bindings for your service account
PROJECT_ID="photo2profit-ai"
SERVICE_ACCOUNT="firebase-adminsdk-xxxxx@${PROJECT_ID}.iam.gserviceaccount.com"

gcloud projects get-iam-policy $PROJECT_ID \
  --flatten="bindings[].members" \
  --format="table(bindings.role)" \
  --filter="bindings.members:serviceAccount:${SERVICE_ACCOUNT}"
```

Expected output should include:
```
ROLE
roles/firebase.admin
```

Or if using granular roles:
```
ROLE
roles/firebasehosting.admin
roles/datastore.indexAdmin
roles/firebaserules.admin
roles/iam.serviceAccountUser
```

## Testing Deployment After Granting Access

Once you've granted the IAM roles:

### 1. Verify GitHub Secrets Are Set

Ensure these secrets are configured in GitHub:
- `FIREBASE_SERVICE_ACCOUNT` - The service account JSON file content
- `FIREBASE_PROJECT_ID` - Your Firebase project ID (e.g., `photo2profit-ai`)

Check at: https://github.com/selfishthangs-ux/photo2profitai/settings/secrets/actions

### 2. Trigger a Deployment

**Option A: Manual Trigger**
1. Go to: https://github.com/selfishthangs-ux/photo2profitai/actions
2. Click "Deploy to Firebase Hosting"
3. Click "Run workflow"
4. Select branch: `main`
5. Click "Run workflow"

**Option B: Push to Main**
```bash
git commit --allow-empty -m "Test deployment with IAM roles configured"
git push origin main
```

### 3. Monitor the Deployment

1. Watch the GitHub Actions workflow run
2. Check the "Validate Firebase service account secret" step - should show:
   ```
   ✅ Service account JSON looks valid
   Notice: Service account used: client_email=firebase-adminsdk-xxxxx@photo2profit-ai.iam.gserviceaccount.com, project_id=photo2profit-ai
   ```
3. Check the "Deploy to Firebase Hosting" step - should complete successfully
4. Look for the deployment URL in the logs

### 4. Verify Live Deployment

- Open your app: https://photo2profit-ai.web.app (or your custom domain)
- Verify the site loads correctly
- Check Firebase Console for updated deployments:
  - Hosting: https://console.firebase.google.com/project/photo2profit-ai/hosting
  - Firestore Rules: https://console.firebase.google.com/project/photo2profit-ai/firestore/rules
  - Storage Rules: https://console.firebase.google.com/project/photo2profit-ai/storage/rules

## Common Issues and Solutions

### Issue: "Permission denied" during deployment

**Cause**: Service account lacks required IAM roles

**Solution**:
1. Verify IAM roles are granted (see "Verifying IAM Roles" section)
2. Wait 1-2 minutes for IAM changes to propagate
3. Re-run the deployment

### Issue: "Service account does not have permission to access project"

**Cause**: Service account might be from a different project

**Solution**:
1. Check the service account email matches your project
2. Verify the service account JSON `project_id` field matches your Firebase project
3. Ensure IAM roles are granted on the correct project

### Issue: Deployment succeeds but rules don't update

**Cause**: Missing `firebaserules.admin` role

**Solution**:
1. Grant `roles/firebaserules.admin` to the service account
2. Or grant the broader `roles/firebase.admin` role

### Issue: "Error: HTTP Error: 403, The caller does not have permission"

**Cause**: Specific permission missing for a service

**Solution**:
1. Check the error message for which service failed
2. Grant the appropriate role:
   - Hosting: `roles/firebasehosting.admin`
   - Firestore: `roles/datastore.indexAdmin` + `roles/firebaserules.admin`
   - Storage: `roles/firebaserules.admin`
   - Functions: `roles/cloudfunctions.developer`
3. Or grant `roles/firebase.admin` for complete access

## Security Best Practices

### 1. Use Dedicated Service Accounts

- Create a dedicated service account for CI/CD deployments
- Don't reuse service accounts across multiple projects
- Use descriptive names (e.g., `github-actions-deploy@project.iam.gserviceaccount.com`)

### 2. Principle of Least Privilege

- If you don't use certain Firebase services, don't grant related roles
- Example: If not using Cloud Functions, don't grant `cloudfunctions.developer`
- Start with `firebase.admin`, then narrow down if needed

### 3. Rotate Service Account Keys

- Regularly rotate (regenerate) service account keys
- Update GitHub secrets when rotating keys
- Delete old keys after successful rotation

### 4. Audit IAM Permissions

- Periodically review IAM permissions in Google Cloud Console
- Remove unused service accounts
- Monitor audit logs for unauthorized access attempts

## Additional Resources

- [Firebase Service Accounts Documentation](https://firebase.google.com/docs/admin/setup#initialize-sdk)
- [Google Cloud IAM Roles](https://cloud.google.com/iam/docs/understanding-roles)
- [Firebase Admin SDK Setup](https://firebase.google.com/docs/admin/setup)
- [GitHub Actions Firebase Deploy Action](https://github.com/FirebaseExtended/action-hosting-deploy)

## Quick Reference

### Recommended IAM Role (Simplest)
```
roles/firebase.admin
```

### Service Account Email Format
```
firebase-adminsdk-xxxxx@YOUR_PROJECT_ID.iam.gserviceaccount.com
```

### Where to Grant Roles
1. Firebase Console → Project Settings → Service Accounts → "Manage permissions in GCP Console"
2. Or: https://console.cloud.google.com/iam-admin/iam?project=YOUR_PROJECT_ID

### After Granting Access
1. Wait 1-2 minutes for propagation
2. Re-run GitHub Actions deployment
3. Verify at: https://YOUR_PROJECT_ID.web.app

---

**Need Help?**
- See [CHECKLIST.md](CHECKLIST.md) for complete deployment checklist
- See [FIREBASE_DEPLOYMENT_FIXES.md](FIREBASE_DEPLOYMENT_FIXES.md) for troubleshooting
- Check GitHub Actions logs for specific error messages
