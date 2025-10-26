# photo2profitai

Photo2Profit is a next-generation AI resale tool that transforms any photo into a ready-to-sell product listing. Built for creators, thrifters, and e-commerce entrepreneurs, it uses advanced AI to identify products, clean images, suggest optimized prices, and generate listings that sell themselves.

## 🗺️ What's Next?

**New to the project?** Check out [WHATS_NEXT.md](WHATS_NEXT.md) for:
- 📊 Current project status
- 🎯 Immediate priorities (AI features, user flow)
- 📋 Short and long-term roadmap
- 🚀 How to contribute and where to start

## 🔥 Firebase Deployment

### Quick Status
✅ Firebase configuration files added  
✅ VSCode workspace settings configured  
✅ Automated deployment workflow ready  

**For detailed deployment instructions, see:**
- [FIREBASE_DEPLOYMENT_FIXES.md](FIREBASE_DEPLOYMENT_FIXES.md) - Complete fix documentation
- [CHECKLIST.md](CHECKLIST.md) - Step-by-step deployment checklist

### Deploy Now
1. Add Firebase secrets to GitHub (see CHECKLIST.md)
2. Push to main branch or manually trigger deployment
3. Your site will be live at: https://photo2profit-ai.web.app

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
