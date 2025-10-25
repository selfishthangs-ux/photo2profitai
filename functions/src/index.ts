import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { GoogleGenerativeAI } from '@google/generative-ai';
import axios from 'axios';
import FormData from 'form-data';
import sharp from 'sharp';

// Initialize Firebase Admin
admin.initializeApp();

// Initialize Gemini AI
const GEMINI_API_KEY = functions.config().gemini?.api_key;
const ANTHROPIC_API_KEY = functions.config().anthropic?.api_key;
const AI_PROVIDER: 'gemini' | 'anthropic' = (functions.config().ai?.provider as any) || 'gemini';
const REMOVEBG_API_KEY = functions.config().removebg?.api_key;

const genAI = GEMINI_API_KEY ? new GoogleGenerativeAI(GEMINI_API_KEY) : null;

/**
 * TASK 2: Remove.bg processing
 * Triggered when image uploaded to uploads/{userId}/{itemId}
 */
export const processUploadedImage = functions.storage.object().onFinalize(async (object) => {
  const filePath = object.name;
  
  if (!filePath || !filePath.startsWith('uploads/')) {
    return null;
  }

  const pathParts = filePath.split('/');
  if (pathParts.length !== 3) {
    return null;
  }

  const [, userId, fileName] = pathParts;
  const itemId = fileName.split('.')[0];

  console.log(`Processing image for user ${userId}, item ${itemId}`);

  try {
    // Download image
    const bucket = admin.storage().bucket(object.bucket);
    const file = bucket.file(filePath);
    const [imageBuffer] = await file.download();

    // Remove background
    const processedBuffer = await removeBackground(imageBuffer);

    // Save processed image
    const processedPath = `processed/${userId}/${itemId}.png`;
    const processedFile = bucket.file(processedPath);
    
    await processedFile.save(processedBuffer, {
      metadata: {
        contentType: 'image/png',
        metadata: {
          originalPath: filePath,
          userId,
          itemId
        }
      }
    });

    // Get public URL
    await processedFile.makePublic();
    const processedUrl = `https://storage.googleapis.com/${object.bucket}/${processedPath}`;

    // Update Firestore listing
    const listingRef = admin.firestore().doc(`users/${userId}/listings/${itemId}`);
    await listingRef.set({
      userId,
      itemId,
      originalPath: filePath,
      processedPath,
      processedUrl,
      status: 'background_removed',
      processedAt: admin.firestore.FieldValue.serverTimestamp()
    }, { merge: true });

    console.log(`✅ Background removed for ${itemId}`);
    return { success: true };

  } catch (error: any) {
    console.error('Background removal failed:', error);
    
    // Update with error
    const listingRef = admin.firestore().doc(`users/${userId}/listings/${itemId}`);
    await listingRef.set({
      status: 'error',
      error: error.message
    }, { merge: true });

    return { success: false, error: error.message };
  }
});

/**
 * TASK 3: Gemini AI Content Generation
 * Triggered when listing status becomes 'background_removed'
 */
export const generateListingData = functions.firestore
  .document('users/{userId}/listings/{itemId}')
  .onUpdate(async (change, context) => {
    const before = change.before.data();
    const after = change.after.data();
    
    // Only trigger when status changes to background_removed
    if (before.status === after.status || after.status !== 'background_removed') {
      return null;
    }

    const { userId, itemId, processedUrl } = after;

    if (!processedUrl) return null;

    console.log(`Generating AI content for ${itemId}`);

    try {
      const aiData = await generateListingWithAI({ processedUrl });

      // Update Firestore with AI-generated content
      await change.after.ref.set({
        ai: aiData,
        status: 'ai_complete',
        aiGeneratedAt: admin.firestore.FieldValue.serverTimestamp()
      }, { merge: true });

      console.log(`✅ AI content generated for ${itemId}:`, aiData);
      return { success: true, data: aiData };

    } catch (error: any) {
      console.error('AI generation failed:', error);
      
      await change.after.ref.set({
        status: 'ai_error',
        error: error.message
      }, { merge: true });

      return { success: false, error: error.message };
    }
  });

type ListingAIResult = {
  category: string;
  condition: string;
  color?: string;
  brand?: string;
  title: string;
  description: string;
  pricing: { thrift: number; boutique: number; new: number };
};

async function generateListingWithAI({ processedUrl }: { processedUrl: string }): Promise<ListingAIResult> {
  const prompt = `You are an expert product listing copywriter for resale markets like eBay, Poshmark, Depop, and Facebook Marketplace.

Analyze this product image and return ONLY valid JSON with this exact structure:
{
  "category": "string (clothing/shoes/bags/accessories/etc)",
  "condition": "string (new with tags/like new/good/fair)",
  "color": "string (primary color)",
  "brand": "string (if identifiable, or 'Unknown')",
  "title": "string (7-12 words, compelling, SEO-optimized)",
  "description": "string (2-3 paragraphs, stylish but honest, highlight condition and features)",
  "pricing": {
    "thrift": number (lowest price for quick sale),
    "boutique": number (mid-range fair market value),
    "new": number (premium/retail replacement value)
  }
}

Image URL: ${processedUrl}

Return ONLY the JSON object, no other text.`;

  if (AI_PROVIDER === 'anthropic') {
    if (!ANTHROPIC_API_KEY) throw new Error('Anthropic API key not configured');

    // Call Anthropic Claude 3.5 Sonnet via HTTP
    const anthropicRes = await axios.post(
      'https://api.anthropic.com/v1/messages',
      {
        model: 'claude-3-5-sonnet-20240620',
        max_tokens: 1200,
        temperature: 0.3,
        messages: [
          { role: 'user', content: prompt }
        ]
      },
      {
        headers: {
          'x-api-key': ANTHROPIC_API_KEY,
          'anthropic-version': '2023-06-01',
          'content-type': 'application/json'
        },
        timeout: 45000
      }
    );

    const text = anthropicRes.data?.content?.[0]?.text || '';
    const jsonText = extractJson(text);
    return JSON.parse(jsonText);
  }

  // Default: Gemini
  if (!genAI) throw new Error('Gemini API key not configured');
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
  const result = await model.generateContent(prompt);
  const responseText = result.response.text();
  const jsonText = extractJson(responseText);
  return JSON.parse(jsonText);
}

function extractJson(text: string): string {
  let t = text.trim();
  if (t.startsWith('```json')) {
    t = t.replace(/```json\n?/g, '').replace(/```\n?/g, '');
  } else if (t.startsWith('```')) {
    t = t.replace(/```\n?/g, '');
  }
  return t;
}

/**
 * Remove background using Remove.bg API
 */
async function removeBackground(imageBuffer: Buffer): Promise<Buffer> {
  if (!REMOVEBG_API_KEY) {
    throw new Error('Remove.bg API key not configured');
  }

  try {
    // Optimize image
    const optimizedBuffer = await sharp(imageBuffer)
      .resize(2000, 2000, { 
        fit: 'inside',
        withoutEnlargement: true 
      })
      .jpeg({ quality: 90 })
      .toBuffer();

    // Call Remove.bg API
    const formData = new FormData();
    formData.append('image_file', optimizedBuffer, {
      filename: 'image.jpg',
      contentType: 'image/jpeg'
    });
    formData.append('size', 'auto');
    formData.append('format', 'png');

    const response = await axios.post('https://api.remove.bg/v1.0/removebg', formData, {
      headers: {
        'X-Api-Key': REMOVEBG_API_KEY,
        ...formData.getHeaders()
      },
      responseType: 'arraybuffer',
      timeout: 30000
    });

    return Buffer.from(response.data);

  } catch (error: any) {
    if (axios.isAxiosError(error) && error.response) {
      console.error('Remove.bg API error:', error.response.status, error.response.statusText);
      if (error.response.status === 402) {
        throw new Error('Remove.bg API quota exceeded');
      } else if (error.response.status === 400) {
        throw new Error('Invalid image format');
      }
    }
    throw new Error(`Background removal failed: ${error.message}`);
  }
}

/**
 * HTTP callable function to manually trigger processing
 */
export const processImage = functions.https.onCall(async (data, context) => {
  const { userId, itemId } = data;
  
  if (!userId || !itemId) {
    throw new functions.https.HttpsError('invalid-argument', 'userId and itemId required');
  }

  try {
    const originalPath = `uploads/${userId}/${itemId}`;
    
    // Trigger processing
    await processUploadedImage({
      name: originalPath,
      bucket: admin.storage().bucket().name
    } as any);

    return { success: true };
  } catch (error: any) {
    throw new functions.https.HttpsError('internal', error.message);
  }
});

/**
 * Get listing status
 */
export const getListingStatus = functions.https.onCall(async (data, context) => {
  const { userId, itemId } = data;
  
  if (!userId || !itemId) {
    throw new functions.https.HttpsError('invalid-argument', 'userId and itemId required');
  }

  try {
    const doc = await admin.firestore()
      .doc(`users/${userId}/listings/${itemId}`)
      .get();

    if (!doc.exists) {
      return { status: 'not_found' };
    }

    return doc.data();
  } catch (error: any) {
    throw new functions.https.HttpsError('internal', error.message);
  }
});