# photo2profitai

Photo2Profit is a next-generation AI resale tool that transforms any photo into a ready-to-sell product listing. Built for creators, thrifters, and e-commerce entrepreneurs, it uses advanced AI to identify products, clean images, suggest optimized prices, and generate listings that sell themselves.

## 🗺️ What's Next?

**New to the project?** Check out [WHATS_NEXT.md](WHATS_NEXT.md) for:
- 📊 Current project status
- 🎯 Immediate priorities (AI features, user flow)
- 📋 Short and long-term roadmap
- 🚀 How to contribute and where to start

## 🔥 Firebase Deployment

### 🎯 Just Granted IAM Access? Start Here!
👉 **[DEPLOYMENT_SUMMARY.md](DEPLOYMENT_SUMMARY.md)** - What to do after granting access

### Quick Status
✅ Firebase configuration files added  
✅ VSCode workspace settings configured  
✅ Automated deployment workflow ready  
✅ **IAM setup documentation complete**

### 📚 Documentation Guides

**Getting Started (Pick One):**
- 🚀 **[QUICK_START.md](QUICK_START.md)** - 15-minute deployment guide (START HERE)
- 📋 **[CHECKLIST.md](CHECKLIST.md)** - Complete step-by-step checklist
- 📊 **[DEPLOYMENT_STATUS_CHECK.md](DEPLOYMENT_STATUS_CHECK.md)** - Verify your setup

**Important References:**
- ⚠️ **[FIREBASE_IAM_SETUP.md](FIREBASE_IAM_SETUP.md)** - **IAM roles configuration** (CRITICAL)
- 🔧 **[FIREBASE_DEPLOYMENT_FIXES.md](FIREBASE_DEPLOYMENT_FIXES.md)** - Troubleshooting guide
- 📝 **[DEPLOYMENT_SUMMARY.md](DEPLOYMENT_SUMMARY.md)** - What was fixed and next steps

### Deploy Now (5 Steps)
1. Create Firebase project and generate service account JSON
2. **⚠️ Grant IAM roles to service account** → See [FIREBASE_IAM_SETUP.md](FIREBASE_IAM_SETUP.md)
3. Add Firebase secrets to GitHub → See [QUICK_START.md](QUICK_START.md)
4. Trigger deployment (push to main or run workflow)
5. Your site will be live at: https://photo2profit-ai.web.app

### Common Issues
- **Permission denied**: IAM roles not granted → [FIREBASE_IAM_SETUP.md](FIREBASE_IAM_SETUP.md)
- **Secret missing**: GitHub secrets not set → [QUICK_START.md](QUICK_START.md)
- **Site not found**: Wait 2-3 minutes for DNS → [FIREBASE_DEPLOYMENT_FIXES.md](FIREBASE_DEPLOYMENT_FIXES.md)

## Backend Setup

The backend service provides API endpoints for the Photo2Profit application.

### Quick Start

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your actual values
npm run dev
```

### Testing the API

```bash
# Local
curl -sS http://localhost:3000/api/founding-count | jq .

# Production (Railway)
curl -sS https://photo2profit-backend-production.up.railway.app/api/founding-count | jq .
```

### Important: Environment Variable Configuration

⚠️ **Common mistake to avoid:**

- ✅ **Correct:** `ALERT_DISCORD_WEBHOOK_URL`
- ❌ **Wrong:** `LERT_DISCORD_WEBHOOK_URL` (missing the 'A')

See [backend/README.md](backend/README.md) for detailed setup instructions and troubleshooting.

## Contributing

We welcome contributions from the community! Please read our [Contributing Guide](CONTRIBUTING.md) to get started.

### Quick Links
- 📋 [Contributing Guidelines](CONTRIBUTING.md) - How to contribute to the project
- 🤖 [Copilot Coding Agent Guide](.github/COPILOT_CODING_AGENT.md) - Instructions for automated contributors
- 🔒 [Security Policy](.github/CODEOWNERS) - Code ownership and security guidelines

## Copilot coding agent

This repository includes a Copilot coding agent guidance file with instructions for automated contributors: `.github/COPILOT_CODING_AGENT.md`.

If you use or accept automated contributions, please read that file for agent permissions, branch/PR conventions, and next steps for maintainers.
