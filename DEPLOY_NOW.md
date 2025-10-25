# Photo2Profit Deployment Commands
# Get your app live in 10 minutes!

## Step 1: Prepare for Deployment

# Commit all changes
git add .
git commit -m "feat: complete Photo2Profit app ready for deployment"
git push origin main

## Step 2: Deploy Frontend to Vercel (FREE)

# Go to: https://vercel.com
# 1. Sign up with GitHub
# 2. "New Project" → Import your photo2profitai repo
# 3. Use these settings:
#    - Framework: Other
#    - Root Directory: ./
#    - Build Command: cp frontend.html index.html
#    - Output Directory: ./

## Step 3: Deploy Backend to Railway ($5/month)

# Go to: https://railway.app  
# 1. Sign up with GitHub
# 2. "Deploy from GitHub" → Select photo2profitai
# 3. Choose "backend" folder as root
# 4. Add environment variables in Railway dashboard:

ALERT_DISCORD_WEBHOOK_URL=https://discord.com/api/webhooks/your-webhook
FIREBASE_PRIVATE_KEY=your-firebase-key-here
STRIPE_FOUNDING_PRICE_ID=your-stripe-price-id
REMOVEBG_API_KEY=your-remove-bg-api-key
NODE_ENV=production
PORT=3000

## Step 4: Connect Frontend to Backend

# After Railway deployment, get your backend URL
# Update vercel.json with your Railway URL
# Redeploy to Vercel

## Step 5: Add Custom Domain (Optional - $12/year)

# Buy domain from Namecheap
# Point to Vercel in domain settings
# Professional branding instantly!

## Total Setup Time: 10-15 minutes
## Total Monthly Cost: $5-17
## Revenue Potential: $1,500-15,000+