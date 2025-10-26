#!/bin/bash

# Photo2Profit - Quick Firebase Connection Test
# Run this after you've created your Firebase project

set -e

echo "🔥 Photo2Profit - Firebase Quick Setup"
echo "========================================"
echo ""

# Check if firebase-tools is installed
if ! command -v firebase &> /dev/null; then
    echo "Installing Firebase CLI..."
    npm install -g firebase-tools
fi

echo "Firebase CLI version: $(firebase --version)"
echo ""

# Test if already logged in
echo "Checking Firebase authentication..."
if firebase projects:list &> /dev/null; then
    echo "✅ Already logged in to Firebase!"
    echo ""
    echo "Your Firebase projects:"
    firebase projects:list
else
    echo "📝 Need to login to Firebase..."
    echo "Opening browser for authentication..."
    firebase login
fi

echo ""
echo "What's your Firebase project ID?"
echo "(Should look like: photo2profit-ai or my-app-12345)"
read -p "Enter project ID: " PROJECT_ID

if [ -z "$PROJECT_ID" ]; then
    echo "❌ Project ID cannot be empty"
    exit 1
fi

# Create .firebaserc
echo "Creating .firebaserc with project: $PROJECT_ID"
cat > .firebaserc << EOF
{
  "projects": {
    "default": "$PROJECT_ID"
  }
}
EOF

echo "✅ .firebaserc created"
echo ""

# Test connection
echo "Testing connection to Firebase..."
if firebase use "$PROJECT_ID" &> /dev/null; then
    echo "✅ Successfully connected to $PROJECT_ID"
else
    echo "⚠️  Couldn't connect to $PROJECT_ID"
    echo "Make sure:"
    echo "  1. The project exists in Firebase Console"
    echo "  2. You have permission to access it"
    echo "  3. The project ID is spelled correctly"
    exit 1
fi

echo ""
echo "📦 Building Cloud Functions..."
cd functions
npm install --silent
npm run build
cd ..

echo "✅ Functions built successfully"
echo ""

echo "🎯 What you can do now:"
echo ""
echo "1. Deploy everything:"
echo "   firebase deploy"
echo ""
echo "2. Deploy just hosting (fastest):"
echo "   firebase deploy --only hosting"
echo ""
echo "3. Test locally:"
echo "   firebase emulators:start"
echo ""
echo "4. View your live app (after deploy):"
echo "   https://$PROJECT_ID.web.app"
echo ""

read -p "Deploy now? (y/n): " DEPLOY_NOW

if [ "$DEPLOY_NOW" = "y" ]; then
    echo ""
    echo "🚀 Deploying to Firebase..."
    echo "This will take ~2 minutes..."
    
    # Deploy in stages for better visibility
    echo ""
    echo "Step 1/4: Deploying Firestore rules..."
    firebase deploy --only firestore:rules
    
    echo ""
    echo "Step 2/4: Deploying Storage rules..."
    firebase deploy --only storage:rules
    
    echo ""
    echo "Step 3/4: Deploying Functions..."
    firebase deploy --only functions
    
    echo ""
    echo "Step 4/4: Deploying Hosting..."
    firebase deploy --only hosting
    
    echo ""
    echo "🎉 Deployment complete!"
    echo ""
    echo "Your app is live at:"
    echo "https://$PROJECT_ID.web.app"
    echo ""
    echo "⚠️  IMPORTANT: Your Functions need API keys to work!"
    echo "Set them now:"
    echo ""
    echo "firebase functions:config:set removebg.api_key=\"YOUR_REMOVE_BG_KEY\""
    echo "firebase functions:config:set gemini.api_key=\"YOUR_GEMINI_KEY\""
    echo "# OR for Claude:"
    echo "firebase functions:config:set anthropic.api_key=\"YOUR_ANTHROPIC_KEY\""
    echo "firebase functions:config:set ai.provider=\"anthropic\""
    echo ""
    echo "Then redeploy functions:"
    echo "firebase deploy --only functions"
else
    echo ""
    echo "No problem! Deploy when you're ready with:"
    echo "firebase deploy"
fi

echo ""
echo "✅ Setup complete!"
