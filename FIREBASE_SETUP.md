# Firebase Hosting Setup Guide

This guide will help you deploy the Photo2Profit landing page to Firebase Hosting.

## Prerequisites

1. A Firebase account (free tier is sufficient)
2. Firebase CLI installed: `npm install -g firebase-tools`
3. Node.js 18 or higher

## Initial Setup

### 1. Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" or select an existing project
3. Name your project (e.g., "photo2profitai")
4. Follow the setup wizard

### 2. Initialize Firebase in Your Project

```bash
# Login to Firebase
firebase login

# Initialize Firebase Hosting (if not already done)
firebase init hosting
```

When prompted:
- Select "Use an existing project" and choose your Firebase project
- Set public directory to: `public`
- Configure as single-page app: `No`
- Set up automatic builds with GitHub: `No` (we'll use GitHub Actions)
- Don't overwrite existing files

### 3. Test Locally

```bash
# Serve locally
firebase serve

# Open http://localhost:5000 in your browser
```

### 4. Deploy Manually

```bash
# Deploy to Firebase Hosting
firebase deploy --only hosting
```

Your site will be live at: `https://YOUR-PROJECT-ID.web.app`

## Automated Deployment with GitHub Actions

The repository includes a GitHub Actions workflow that automatically deploys to Firebase Hosting when you push to the `main` branch.

### Setup GitHub Actions Deployment

1. **Get Firebase Token**
   ```bash
   firebase login:ci
   ```
   This will output a token. Copy it.

2. **Add Token to GitHub Secrets**
   - Go to your GitHub repository
   - Navigate to: Settings > Secrets and variables > Actions
   - Click "New repository secret"
   - Name: `FIREBASE_TOKEN`
   - Value: Paste the token from step 1
   - Click "Add secret"

3. **Trigger Deployment**
   - Push to the `main` branch
   - Or manually trigger: Actions > Deploy to Firebase Hosting > Run workflow

## Custom Domain Setup

To use a custom domain:

1. Go to Firebase Console > Hosting
2. Click "Add custom domain"
3. Follow the verification steps
4. Update DNS records as instructed
5. Wait for SSL certificate provisioning (can take up to 24 hours)

## Troubleshooting

### "Site Not Found" Error

This error typically means:
1. **No deployment yet**: Run `firebase deploy --only hosting`
2. **Empty public directory**: Ensure `/public/index.html` exists
3. **Wrong project**: Check `.firebaserc` has the correct project ID
4. **DNS not configured**: If using custom domain, verify DNS settings

### Check Deployment Status

```bash
# List your hosting sites
firebase hosting:sites:list

# Check deployment history
firebase hosting:channel:list
```

### View Logs

```bash
# View deploy logs
firebase hosting:channel:open live
```

## Files and Configuration

### `firebase.json`
Main configuration file for Firebase Hosting:
- `public`: Directory to deploy (set to `public`)
- `ignore`: Files to exclude from deployment
- `rewrites`: URL rewrite rules (for SPA routing)
- `headers`: Custom HTTP headers

### `.firebaserc`
Contains project aliases and settings:
- `projects.default`: Your Firebase project ID

### `public/` Directory
Contains all static files to be deployed:
- `index.html`: Main landing page
- `styles.css`: Styling
- `app.js`: JavaScript functionality

## Backend Integration

The frontend connects to the backend API hosted on Railway:
- Production API: `https://photo2profit-backend-production.up.railway.app`
- Health Check: `GET /health`
- Founding Count: `GET /api/founding-count`

The backend URL is hardcoded in `public/app.js`. To change it, edit the fetch URLs in that file.

## Security Notes

- Never commit `FIREBASE_TOKEN` to the repository
- Use GitHub Secrets for sensitive data
- Firebase Hosting uses HTTPS by default
- Enable Firebase App Check for additional security

## Useful Commands

```bash
# Login to Firebase
firebase login

# List projects
firebase projects:list

# Check current project
firebase use

# Switch project
firebase use project-name

# Deploy hosting only
firebase deploy --only hosting

# Deploy with specific message
firebase deploy --only hosting -m "Deploy message"

# Open hosting dashboard
firebase open hosting

# View logs
firebase hosting:channel:list
```

## Resources

- [Firebase Hosting Documentation](https://firebase.google.com/docs/hosting)
- [Firebase CLI Reference](https://firebase.google.com/docs/cli)
- [GitHub Actions for Firebase](https://github.com/marketplace/actions/github-action-for-firebase)

## Support

If you encounter issues:
1. Check the [Firebase Status Dashboard](https://status.firebase.google.com/)
2. Review deployment logs in Firebase Console
3. Check GitHub Actions logs for CI/CD issues
4. Ensure all required secrets are set in GitHub
