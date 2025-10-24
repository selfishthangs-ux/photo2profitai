# Backend

The backend service for Photo2Profit AI.

## Quick Start

### Local Development

1. Install dependencies:
```bash
cd backend
npm install
```

2. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your actual values
```

3. Start the development server:
```bash
npm run dev
```

4. Test the endpoint:
```bash
curl -sS http://localhost:3000/api/founding-count | jq .
```

### Production (Railway)

1. Open Railway dashboard:
```bash
$BROWSER https://railway.app/dashboard
```

2. After deployment, check the endpoint:
```bash
curl -sS https://photo2profit-backend-production.up.railway.app/api/founding-count | jq .
```

## Environment Variables

⚠️ **Important**: Make sure to use the correct variable names!

### Required Variables

- `ALERT_DISCORD_WEBHOOK_URL` - Discord webhook URL for alerts
  - ❌ **NOT** `LERT_DISCORD_WEBHOOK_URL` (common typo to avoid)
  
- `FIREBASE_PRIVATE_KEY` - Firebase service account private key
  - Must have `\n` newlines escaped properly in Railway environment
  - Example: `"-----BEGIN PRIVATE KEY-----\nYour key\n-----END PRIVATE KEY-----\n"`
  
- `STRIPE_FOUNDING_PRICE_ID` - Stripe price ID for founding member tier
  - Format: `price_xxxxxxxxxxxx`

- `FIREBASE_PROJECT_ID` - Your Firebase project ID

- `FIREBASE_CLIENT_EMAIL` - Firebase service account email

- `STRIPE_SECRET_KEY` - Stripe secret key

### Optional Variables

- `PORT` - Server port (default: 3000)
- `NODE_ENV` - Environment (development/production)

## Troubleshooting

### Common Issues

1. **LERT_DISCORD_WEBHOOK_URL typo**
   - ✅ Correct: `ALERT_DISCORD_WEBHOOK_URL`
   - ❌ Wrong: `LERT_DISCORD_WEBHOOK_URL`

2. **Firebase private key issues**
   - Ensure `\n` newlines are escaped in Railway environment
   - The key should be wrapped in quotes
   - Format: `"-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"`

3. **Stripe price ID**
   - Confirm you're using the correct price ID from your Stripe dashboard
   - Should start with `price_`

### Checking Logs

**Railway:**
- Go to Deployments → Logs in the Railway dashboard

**Local:**
- Check the terminal output where `npm run dev` is running

## API Endpoints

### GET /api/founding-count

Returns the current founding member count and configuration status.

**Response:**
```json
{
  "total": 0,
  "limit": 100,
  "remaining": 100,
  "percentFilled": 0,
  "timestamp": "2025-10-24T02:16:23.118Z",
  "environment": {
    "configured": {
      "alertWebhook": true,
      "firebaseKey": true,
      "stripePrice": true
    },
    "allConfigured": true
  }
}
```

### GET /health

Health check endpoint.

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2025-10-24T02:16:23.118Z"
}
```
