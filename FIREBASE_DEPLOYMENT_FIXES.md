# Firebase Deployment Fixes

## Issues Resolved

### 1. VSCode Settings Error
**Problem:** `Unable to read file 'vscode-userdata:/User/settings.json'`

**Solution:** Created `.vscode/settings.json` with proper workspace configuration. This provides consistent editor settings across the team and eliminates the VSCode configuration error.

**Files Added:**
- `.vscode/settings.json` - Workspace settings
- `.vscode/extensions.json` - Recommended extensions
- Updated `.gitignore` to include VSCode workspace files while excluding user-specific configurations

### 2. Firebase Site Not Found
**Problem:** Firebase deployment showing "Site Not Found" error

**Root Cause:** Missing Firebase configuration files required for deployment

**Solution:** Added complete Firebase configuration:

**Files Added:**
- `firebase.json` - Main Firebase configuration for hosting, Firestore, and Storage
- `.firebaserc` - Project ID configuration (defaults to `photo2profit-ai`)
- `firestore.rules` - Security rules for Firestore database
- `firestore.indexes.json` - Database indexes configuration
- `storage.rules` - Security rules for Cloud Storage

### 3. Missing Firebase Deployment Workflow
**Problem:** No automated deployment process

**Solution:** Created GitHub Actions workflow for automated Firebase deployment

**File Added:**
- `.github/workflows/firebase-deploy.yml` - Automated deployment on push to main branch

## Configuration Details

### Firebase Hosting Configuration
The `firebase.json` configures:
- **Public Directory:** `public/` - Contains the static website
- **Single Page App:** Rewrites all routes to `/index.html`
- **Caching:** Optimized cache headers for static assets
- **Ignored Files:** Excludes Firebase config and hidden files

### Security Rules

#### Firestore Rules
- Users can only read/write their own data
- User listings are private to each user
- Credits can only be modified by server functions
- Public listings are read-only

#### Storage Rules
- Users can upload images up to 10MB
- Only image files are allowed
- Processed images are read-only (server-generated)
- All uploads are scoped to user ID

### VSCode Settings
Configured for optimal development experience:
- Auto-format on save (Prettier)
- ESLint auto-fix
- Consistent import paths
- Hidden node_modules and Firebase cache from search

## Deployment Instructions

### Prerequisites
You must add these secrets to GitHub:
1. Go to: https://github.com/selfishthangs-ux/photo2profitai/settings/secrets/actions
2. Add the following secrets:
   - `FIREBASE_SERVICE_ACCOUNT` - Firebase service account JSON
   - `FIREBASE_PROJECT_ID` - Your Firebase project ID (e.g., `photo2profit-ai`)

### Manual Deployment
```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login to Firebase
firebase login

# Deploy everything
firebase deploy

# Or deploy specific services
firebase deploy --only hosting
firebase deploy --only firestore:rules
firebase deploy --only storage:rules
```

### Automatic Deployment
Every push to the `main` branch automatically triggers deployment via GitHub Actions.

To manually trigger deployment:
1. Go to Actions tab
2. Select "Deploy to Firebase Hosting"
3. Click "Run workflow"

## Verification Steps

After deployment, verify:

1. **Hosting:** Visit https://photo2profit-ai.web.app (or your custom domain)
2. **GitHub Actions:** Check that deployment workflow completes successfully
3. **Firebase Console:** 
   - Hosting shows your site
   - Firestore rules are deployed
   - Storage rules are deployed

## Troubleshooting

### "Site Not Found" Error
- Verify `public/index.html` exists
- Check GitHub Actions completed successfully
- Wait 2-3 minutes for DNS propagation
- Verify Firebase project ID matches in `.firebaserc`

### GitHub Actions Deployment Fails
- Verify secrets are set correctly in GitHub
- Check that `FIREBASE_SERVICE_ACCOUNT` is valid JSON
- Ensure Firebase project exists and Blaze plan is enabled
- Check workflow logs for specific error messages

### VSCode Settings Not Loading
- Close and reopen VSCode
- Reload window (Cmd/Ctrl + Shift + P → "Reload Window")
- Verify `.vscode/settings.json` exists
- Check file permissions

## Next Steps

1. ✅ Configuration files added
2. ✅ VSCode workspace configured
3. ✅ Deployment workflow created
4. 🔲 Add Firebase secrets to GitHub
5. 🔲 Push to main branch to trigger deployment
6. 🔲 Verify site is live

See [CHECKLIST.md](CHECKLIST.md) for complete deployment checklist.
