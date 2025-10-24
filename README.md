# photo2profitai

Photo2Profit is a next-generation AI resale tool that transforms any photo into a ready-to-sell product listing. Built for creators, thrifters, and e-commerce entrepreneurs, it uses advanced AI to identify products, clean images, suggest optimized prices, and generate listings that sell themselves.

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
