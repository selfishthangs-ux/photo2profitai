# Photo2Profit Cloud Functions Setup

## Environment Variables Setup

Run these commands to configure your Remove.bg API key:

```bash
# Set Remove.bg API key
firebase functions:config:set removebg.api_key="your_remove_bg_api_key_here"

# Deploy functions
firebase deploy --only functions
```

## Remove.bg API Key

1. Go to [remove.bg/api](https://www.remove.bg/api)
2. Sign up for an account
3. Get your API key from the dashboard
4. Run the config command above with your actual API key

## File Structure

```
functions/
├── src/
│   └── index.ts          # Main Cloud Functions
├── package.json          # Dependencies
├── tsconfig.json         # TypeScript config
└── README.md            # This file

Storage Structure (auto-created):
uploads/{userId}/{imageId}    # Original uploaded images
processed/{userId}/{imageId}  # Background-removed images
```

## Functions Included

1. **processUploadedImage** - Auto-triggered when image uploaded
2. **processImage** - Manual processing endpoint  
3. **getImageStatus** - Check processing status

## Testing

```bash
# Install dependencies
cd functions && npm install

# Test locally
npm run serve

# Deploy to production
npm run deploy
```

## Usage in Frontend

```javascript
// Upload image to Storage
const uploadTask = storage.ref(`uploads/${userId}/${imageId}`).put(file);

// Check processing status
const checkStatus = functions.httpsCallable('getImageStatus');
const result = await checkStatus({ userId, imageId });

// Get processed image URL
const processedUrl = await storage.ref(`processed/${userId}/${imageId}.png`).getDownloadURL();
```