# Background Removal API Setup Guide

## Quick Setup for remove.bg Integration

### 1. Get API Key
1. Go to [remove.bg API](https://www.remove.bg/api)
2. Sign up for a free account (50 free API calls/month)
3. Get your API key from the dashboard

### 2. Add to Environment
1. Open `/workspaces/photo2profitai/backend/.env`
2. Add your API key:
   ```
   REMOVEBG_API_KEY=your-actual-api-key-here
   ```

### 3. Restart Server
```bash
cd backend
npm run dev
```

## How It Works

### Without API Key (Demo Mode)
- Shows setup instructions
- Simulates background removal
- Perfect for testing the UI

### With API Key (Production Mode)
- Real background removal using remove.bg
- High-quality PNG output with transparency
- Credit usage tracking

## API Pricing (remove.bg)
- **Free:** 50 API calls/month
- **Subscription:** $9/month for 500 calls
- **Pay-as-you-go:** $0.20 per image

## Alternative Services

If you prefer different providers, the API is designed to be easily swapped:

### Adobe Creative SDK
- Higher quality processing
- More expensive
- Requires Adobe partnership

### Custom AI Models
- Use Hugging Face models
- Deploy your own background removal
- More control, requires setup

### clipdrop API
- Another commercial option
- Similar to remove.bg
- Different pricing structure

## Testing

### Test with Demo Mode (No API Key)
1. Upload an image
2. Click "Remove Background"
3. See setup instructions

### Test with Real API
1. Add API key to `.env`
2. Restart server
3. Upload image and remove background
4. Download processed PNG with transparency

## Error Handling

The API handles:
- ✅ Missing API key (demo mode)
- ✅ Invalid images (format/size errors)
- ✅ Insufficient credits (billing errors)
- ✅ Network timeouts
- ✅ API rate limits

## Next Steps

Once background removal is working:
1. **Add image enhancement** (upscaling, color correction)
2. **Add object detection** (identify product categories)
3. **Add style transfer** (apply different backgrounds)
4. **Add batch processing** (multiple images at once)

---

**Your Photo2Profit app now has professional background removal capabilities!** 🎉