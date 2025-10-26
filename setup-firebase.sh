#!/bin/bash

# Photo2Profit - Firebase Setup Script
# This script helps you gather all the credentials needed for deployment

set -e

echo "🔥 Photo2Profit Firebase Setup"
echo "================================"
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}Step 1: Create Firebase Project${NC}"
echo "1. Go to: https://console.firebase.google.com"
echo "2. Click 'Add project'"
echo "3. Name it: photo2profit-ai"
echo "4. Enable Google Analytics (optional)"
echo ""
read -p "Press Enter when project is created..."

echo ""
echo -e "${BLUE}Step 2: Enable Firebase Services${NC}"
echo "In Firebase Console, enable these:"
echo "  ✓ Authentication → Sign-in method → Google"
echo "  ✓ Firestore Database → Create database (production mode)"
echo "  ✓ Storage → Get started"
echo "  ✓ Functions → Upgrade to Blaze plan (pay-as-you-go)"
echo ""
read -p "Press Enter when services are enabled..."

echo ""
echo -e "${BLUE}Step 3: Get Service Account Key${NC}"
echo "1. Firebase Console → Project Settings (⚙️)"
echo "2. Service accounts tab"
echo "3. Click 'Generate new private key'"
echo "4. Save the JSON file"
echo ""
read -p "Enter the path to your service account JSON file: " SERVICE_ACCOUNT_PATH

if [ -f "$SERVICE_ACCOUNT_PATH" ]; then
    echo -e "${GREEN}✓ Found service account file${NC}"
    SERVICE_ACCOUNT_JSON=$(cat "$SERVICE_ACCOUNT_PATH")
else
    echo -e "${YELLOW}⚠ File not found. You'll need to add it manually to GitHub secrets.${NC}"
    SERVICE_ACCOUNT_JSON=""
fi

echo ""
echo -e "${BLUE}Step 4: Get Firebase Web Config${NC}"
echo "1. Firebase Console → Project Settings → General"
echo "2. Scroll to 'Your apps' section"
echo "3. Click Web app (</>) icon"
echo "4. Register app (name it 'Photo2Profit Web')"
echo ""
read -p "Enter your Firebase API Key: " API_KEY
read -p "Enter your Project ID (e.g., photo2profit-ai): " PROJECT_ID
read -p "Enter your Messaging Sender ID: " MESSAGING_ID
read -p "Enter your App ID: " APP_ID

echo ""
echo -e "${BLUE}Step 5: Get API Keys${NC}"
echo ""
echo "Remove.bg API Key:"
echo "  Get it at: https://www.remove.bg/api"
read -p "Enter Remove.bg API key (or press Enter to skip): " REMOVEBG_KEY

echo ""
echo "AI Provider - Choose one or both:"
echo "  Gemini: https://aistudio.google.com/app/apikey"
echo "  Anthropic Claude: https://console.anthropic.com/"
read -p "Enter Gemini API key (or press Enter to skip): " GEMINI_KEY
read -p "Enter Anthropic API key (or press Enter to skip): " ANTHROPIC_KEY
read -p "AI Provider (gemini or anthropic): " AI_PROVIDER

echo ""
echo -e "${GREEN}================================${NC}"
echo -e "${GREEN}Setup Complete! Here's what to do next:${NC}"
echo -e "${GREEN}================================${NC}"
echo ""

echo "📋 GitHub Secrets to Add:"
echo "Go to: https://github.com/selfishthangs-ux/photo2profitai/settings/secrets/actions"
echo ""

echo "Required:"
if [ -n "$SERVICE_ACCOUNT_JSON" ]; then
    echo -e "  ${GREEN}✓ FIREBASE_SERVICE_ACCOUNT${NC} (copy from file above)"
else
    echo "  ⚠ FIREBASE_SERVICE_ACCOUNT (paste JSON content)"
fi
echo "  FIREBASE_PROJECT_ID = $PROJECT_ID"
echo ""

echo "Firebase Web Config:"
echo "  FIREBASE_WEB_API_KEY = $API_KEY"
echo "  FIREBASE_AUTH_DOMAIN = ${PROJECT_ID}.firebaseapp.com"
echo "  FIREBASE_STORAGE_BUCKET = ${PROJECT_ID}.appspot.com"
echo "  FIREBASE_MESSAGING_SENDER_ID = $MESSAGING_ID"
echo "  FIREBASE_APP_ID = $APP_ID"
echo ""

if [ -n "$REMOVEBG_KEY" ]; then
    echo "API Keys:"
    echo "  REMOVE_BG_API_KEY = $REMOVEBG_KEY"
fi

if [ -n "$GEMINI_KEY" ]; then
    echo "  GEMINI_API_KEY = $GEMINI_KEY"
fi

if [ -n "$ANTHROPIC_KEY" ]; then
    echo "  ANTHROPIC_API_KEY = $ANTHROPIC_KEY"
fi

if [ -n "$AI_PROVIDER" ]; then
    echo "  AI_PROVIDER = $AI_PROVIDER"
fi

echo ""
echo "📝 Save these secrets to a file? (secrets-backup.txt)"
read -p "Save? (y/n): " SAVE_SECRETS

if [ "$SAVE_SECRETS" = "y" ]; then
    cat > secrets-backup.txt << EOF
# Photo2Profit Firebase Secrets
# DO NOT COMMIT THIS FILE - Add to .gitignore

FIREBASE_PROJECT_ID=$PROJECT_ID
FIREBASE_WEB_API_KEY=$API_KEY
FIREBASE_AUTH_DOMAIN=${PROJECT_ID}.firebaseapp.com
FIREBASE_STORAGE_BUCKET=${PROJECT_ID}.appspot.com
FIREBASE_MESSAGING_SENDER_ID=$MESSAGING_ID
FIREBASE_APP_ID=$APP_ID
REMOVE_BG_API_KEY=$REMOVEBG_KEY
GEMINI_API_KEY=$GEMINI_KEY
ANTHROPIC_API_KEY=$ANTHROPIC_KEY
AI_PROVIDER=$AI_PROVIDER

# Service Account JSON:
# (Copy from: $SERVICE_ACCOUNT_PATH)
EOF
    echo -e "${GREEN}✓ Saved to secrets-backup.txt${NC}"
    echo "secrets-backup.txt" >> .gitignore
fi

echo ""
echo "🚀 Next Steps:"
echo "1. Add all secrets to GitHub (link above)"
echo "2. Make any small change and push to main"
echo "3. GitHub Actions will deploy automatically"
echo "4. Your app will be live at: https://${PROJECT_ID}.web.app"
echo ""
echo "Done! 🎉"
