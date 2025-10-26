# photo2profitai

Photo2Profit is a next-generation AI resale tool that transforms any photo into a ready-to-sell product listing. Built for creators, thrifters, and e-commerce entrepreneurs, it uses advanced AI to identify products, clean images, suggest optimized prices, and generate listings that sell themselves.

## 🌐 Live Demo

- **Website**: [https://photo2profitai.web.app](https://photo2profitai.web.app) (Firebase Hosting)
- **API**: [https://photo2profit-backend-production.up.railway.app](https://photo2profit-backend-production.up.railway.app) (Railway)

## Frontend Setup (Firebase Hosting)

The landing page is hosted on Firebase Hosting and provides information about Photo2Profit features, pricing, and status.

### Quick Deploy

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login to Firebase
firebase login

# Deploy to Firebase Hosting
firebase deploy --only hosting
```

See [FIREBASE_SETUP.md](FIREBASE_SETUP.md) for detailed Firebase Hosting setup instructions, troubleshooting, and custom domain configuration.

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
- 🔥 [Firebase Hosting Setup](FIREBASE_SETUP.md) - Deploy the landing page
- 📋 [Contributing Guidelines](CONTRIBUTING.md) - How to contribute to the project
- 🤖 [Copilot Coding Agent Guide](.github/COPILOT_CODING_AGENT.md) - Instructions for automated contributors
- 🔒 [Security Policy](.github/CODEOWNERS) - Code ownership and security guidelines

## Copilot coding agent

This repository includes a Copilot coding agent guidance file with instructions for automated contributors: `.github/COPILOT_CODING_AGENT.md`.

If you use or accept automated contributions, please read that file for agent permissions, branch/PR conventions, and next steps for maintainers.
