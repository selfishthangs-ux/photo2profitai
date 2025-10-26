#!/bin/bash

# Script to help you get Firebase Web Config
# Run this and paste the output into GitHub Secrets

echo "🔥 Firebase Web Config Helper"
echo "=============================="
echo ""
echo "Go to Firebase Console and copy your web app config:"
echo "https://console.firebase.google.com/project/photo2profitai-24443056/settings/general"
echo ""
echo "Scroll to 'Your apps' → Click the Web app (</>) if you haven't added one yet"
echo ""
echo "You'll see something like:"
echo ""
echo "const firebaseConfig = {"
echo '  apiKey: "AIza...",'
echo '  authDomain: "photo2profitai-24443056.firebaseapp.com",'
echo '  projectId: "photo2profitai-24443056",'
echo '  storageBucket: "photo2profitai-24443056.appspot.com",'
echo '  messagingSenderId: "123...",'
echo '  appId: "1:123..."'
echo "};"
echo ""
echo "Now, paste each value below:"
echo ""

read -p "apiKey: " API_KEY
read -p "authDomain (press Enter for default): " AUTH_DOMAIN
read -p "storageBucket (press Enter for default): " STORAGE_BUCKET
read -p "messagingSenderId: " MESSAGING_ID
read -p "appId: " APP_ID

# Set defaults
if [ -z "$AUTH_DOMAIN" ]; then
    AUTH_DOMAIN="photo2profitai-24443056.firebaseapp.com"
fi

if [ -z "$STORAGE_BUCKET" ]; then
    STORAGE_BUCKET="photo2profitai-24443056.firebasestorage.app"
fi

echo ""
echo "✅ Got it! Here's what to add to GitHub Secrets:"
echo "https://github.com/selfishthangs-ux/photo2profitai/settings/secrets/actions"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "FIREBASE_WEB_API_KEY"
echo "$API_KEY"
echo ""
echo "FIREBASE_AUTH_DOMAIN"
echo "$AUTH_DOMAIN"
echo ""
echo "FIREBASE_STORAGE_BUCKET"  
echo "$STORAGE_BUCKET"
echo ""
echo "FIREBASE_MESSAGING_SENDER_ID"
echo "$MESSAGING_ID"
echo ""
echo "FIREBASE_APP_ID"
echo "$APP_ID"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Also add the PROJECT_ID (already known):"
echo ""
echo "FIREBASE_PROJECT_ID"
echo "photo2profitai-24443056"
echo ""
echo "Save these somewhere safe, then add them to GitHub one by one!"
