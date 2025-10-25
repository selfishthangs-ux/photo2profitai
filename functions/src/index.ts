import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import axios from 'axios';
import FormData from 'form-data';
import sharp from 'sharp';

// Initialize Firebase Admin
admin.initializeApp();

// Environment variables (set in Firebase Functions config)
const REMOVE_BG_API_KEY = functions.config().removebg?.api_key;
const GEMINI_API_KEY = functions.config().gemini?.api_key;

/**
 * Cloud Function triggered when an image is uploaded to /uploads/{userId}/{imageId}
 * Processes the image through Remove.bg API and saves to /processed/{userId}/{imageId}
 */
export const processUploadedImage = functions.storage.object().onFinalize(async (object) => {
  const { name, bucket } = object;
  
  // Only process images in the uploads folder
  if (!name || !name.startsWith('uploads/')) {
    console.log('Not an upload, skipping:', name);
    return null;
  }

  // Extract userId and imageId from path: uploads/{userId}/{imageId}
  const pathParts = name.split('/');
  if (pathParts.length !== 3) {
    console.log('Invalid upload path structure:', name);
    return null;
  }

  const [, userId, fileName] = pathParts;
  const imageId = fileName.split('.')[0]; // Remove file extension
  
  console.log(`Processing image for user ${userId}, image ${imageId}`);

  try {
    // Download the uploaded image
    const bucket_obj = admin.storage().bucket(bucket);
    const file = bucket_obj.file(name);
    
    const [imageBuffer] = await file.download();
    
    // Process with Remove.bg API
    const processedBuffer = await removeBackground(imageBuffer);
    
    // Save processed image to /processed/{userId}/{imageId}.png
    const processedPath = `processed/${userId}/${imageId}.png`;
    const processedFile = bucket_obj.file(processedPath);
    
    await processedFile.save(processedBuffer, {
      metadata: {
        contentType: 'image/png',
        metadata: {
          originalPath: name,
          processedAt: new Date().toISOString(),
          userId: userId,
          imageId: imageId
        }
      }
    });

    // Create listing document in Firestore with processed image
    const listingData = {
      id: imageId,
      userId,
      imageId,
      originalPath: name,
      processedPath,
      processedUrl: await bucket_obj.file(processedPath).getSignedUrl({
        action: 'read',
        expires: Date.now() + 24 * 60 * 60 * 1000 // 24 hours
      }).then(urls => urls[0]),
      status: 'bg_removed',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      metadata: {
        originalSize: imageBuffer.length,
        processedSize: processedBuffer.length,
        format: 'png'
      }
    };

    // Use anonymous user ID for A + NO architecture
    const anonUserId = userId || 'anonymous';
    await admin.firestore()
      .collection('users')
      .doc(anonUserId)
      .collection('listings')
      .doc(imageId)
      .set(listingData);

    console.log(`Successfully processed image ${imageId} for user ${anonUserId}`);
    
    // Trigger AI content generation
    await generateAIContent(anonUserId, imageId, listingData.processedUrl);
    
    return { success: true, processedPath };

  } catch (error) {
    console.error('Error processing image:', error);
    
    // Update Firestore with error status using new structure
    const anonUserId = userId || 'anonymous';
    await admin.firestore()
      .collection('users')
      .doc(anonUserId)
      .collection('listings')
      .doc(imageId)
      .set({
        userId: anonUserId,
        id: imageId,
        originalPath: name,
        status: 'error',
        error: error.message,
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      }, { merge: true });

    throw new functions.https.HttpsError('internal', 'Failed to process image');
  }
});

/**
 * Remove background using Remove.bg API
 */
async function removeBackground(imageBuffer: Buffer): Promise<Buffer> {
  if (!REMOVE_BG_API_KEY) {
    throw new Error('Remove.bg API key not configured');
  }

  try {
    // Optimize image before sending to Remove.bg (reduce API costs)
    const optimizedBuffer = await sharp(imageBuffer)
      .resize(2000, 2000, { 
        fit: 'inside',
        withoutEnlargement: true 
      })
      .jpeg({ quality: 90 })
      .toBuffer();

    // Prepare form data for Remove.bg API
    const formData = new FormData();
    formData.append('image_file', optimizedBuffer, {
      filename: 'image.jpg',
      contentType: 'image/jpeg'
    });
    formData.append('size', 'auto');
    formData.append('format', 'png');

    // Call Remove.bg API
    const response = await axios.post('https://api.remove.bg/v1.0/removebg', formData, {
      headers: {
        'X-Api-Key': REMOVE_BG_API_KEY,
        ...formData.getHeaders()
      },
      responseType: 'arraybuffer',
      timeout: 30000 // 30 second timeout
    });

    return Buffer.from(response.data);

  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Remove.bg API error:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data?.toString()
      });
      
      if (error.response?.status === 402) {
        throw new Error('Remove.bg API quota exceeded');
      } else if (error.response?.status === 400) {
        throw new Error('Invalid image format for Remove.bg');
      }
    }
    
    throw new Error(`Background removal failed: ${error.message}`);
  }
}

/**
 * Generate AI content for listing using Gemini
 */
async function generateAIContent(userId: string, imageId: string, imageUrl: string) {
  if (!GEMINI_API_KEY) {
    console.error('Gemini API key not configured');
    return;
  }

  try {
    const prompt = `
You are an expert product listing copywriter for resale markets like eBay/Poshmark/Facebook.

Analyze this item image: ${imageUrl}

Return JSON ONLY with the following:
{
  "category": string,
  "condition": string,
  "color": string,
  "title": string (7-12 words, compelling SEO),
  "description": string (2 paragraphs, stylish, honest),
  "pricing": {
    "thrift": number,
    "boutique": number,
    "new": number
  }
}
`;

    // Call Gemini API directly
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        contents: [{
          parts: [{
            text: prompt
          }]
        }]
      },
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    const aiText = response.data.candidates[0].content.parts[0].text;
    
    // Parse JSON from AI response
    const cleanJson = aiText.replace(/```json\n?|\n?```/g, '').trim();
    const aiData = JSON.parse(cleanJson);

    // Update Firestore with AI-generated content
    await admin.firestore()
      .collection('users')
      .doc(userId)
      .collection('listings')
      .doc(imageId)
      .update({
        ai: aiData,
        status: 'ai_complete',
        aiGeneratedAt: admin.firestore.FieldValue.serverTimestamp()
      });

    console.log(`✅ AI content generated for ${imageId}:`, aiData);

  } catch (error) {
    console.error('Error generating AI content:', error);
    
    // Update with error status
    await admin.firestore()
      .collection('users')
      .doc(userId)
      .collection('listings')
      .doc(imageId)
      .update({
        status: 'ai_error',
        aiError: error.message,
        aiErrorAt: admin.firestore.FieldValue.serverTimestamp()
      });
  }
}

/**
 * HTTP endpoint to manually trigger image processing
 * Usage: POST /processImage with { userId, imageId }
 */
export const processImage = functions.https.onCall(async (data, context) => {
  // Verify user is authenticated
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }

  const { userId, imageId } = data;
  
  if (!userId || !imageId) {
    throw new functions.https.HttpsError('invalid-argument', 'userId and imageId are required');
  }

  // Verify user can only process their own images
  if (context.auth.uid !== userId) {
    throw new functions.https.HttpsError('permission-denied', 'Can only process your own images');
  }

  try {
    const originalPath = `uploads/${userId}/${imageId}`;
    
    // Trigger the same processing logic
    const result = await processUploadedImage({
      name: originalPath,
      bucket: admin.storage().bucket().name
    } as any);

    return result;

  } catch (error) {
    console.error('Manual processing error:', error);
    throw new functions.https.HttpsError('internal', 'Failed to process image');
  }
});

/**
 * Get processing status for an image
 */
export const getImageStatus = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }

  const { userId, imageId } = data;
  
  if (!userId || !imageId) {
    throw new functions.https.HttpsError('invalid-argument', 'userId and imageId are required');
  }

  if (context.auth.uid !== userId) {
    throw new functions.https.HttpsError('permission-denied', 'Can only check your own images');
  }

  try {
    const doc = await admin.firestore()
      .collection('images')
      .doc(`${userId}_${imageId}`)
      .get();

    if (!doc.exists) {
      return { status: 'not_found' };
    }

    return doc.data();

  } catch (error) {
    console.error('Error getting image status:', error);
    throw new functions.https.HttpsError('internal', 'Failed to get image status');
  }
});