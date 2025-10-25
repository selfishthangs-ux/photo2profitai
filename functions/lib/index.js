"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a, _b, _c, _d;
Object.defineProperty(exports, "__esModule", { value: true });
exports.getListingStatus = exports.processImage = exports.generateListingData = exports.processUploadedImage = void 0;
const functions = __importStar(require("firebase-functions"));
const admin = __importStar(require("firebase-admin"));
const generative_ai_1 = require("@google/generative-ai");
const axios_1 = __importDefault(require("axios"));
const form_data_1 = __importDefault(require("form-data"));
const sharp_1 = __importDefault(require("sharp"));
// Initialize Firebase Admin
admin.initializeApp();
// Initialize Gemini AI
const GEMINI_API_KEY = (_a = functions.config().gemini) === null || _a === void 0 ? void 0 : _a.api_key;
const ANTHROPIC_API_KEY = (_b = functions.config().anthropic) === null || _b === void 0 ? void 0 : _b.api_key;
const AI_PROVIDER = ((_c = functions.config().ai) === null || _c === void 0 ? void 0 : _c.provider) || 'gemini';
const REMOVEBG_API_KEY = (_d = functions.config().removebg) === null || _d === void 0 ? void 0 : _d.api_key;
const genAI = GEMINI_API_KEY ? new generative_ai_1.GoogleGenerativeAI(GEMINI_API_KEY) : null;
/**
 * TASK 2: Remove.bg processing
 * Triggered when image uploaded to uploads/{userId}/{itemId}
 */
exports.processUploadedImage = functions.storage.object().onFinalize(async (object) => {
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
    }
    catch (error) {
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
exports.generateListingData = functions.firestore
    .document('users/{userId}/listings/{itemId}')
    .onUpdate(async (change, context) => {
    const before = change.before.data();
    const after = change.after.data();
    // Only trigger when status changes to background_removed
    if (before.status === after.status || after.status !== 'background_removed') {
        return null;
    }
    const { userId, itemId, processedUrl } = after;
    if (!processedUrl)
        return null;
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
    }
    catch (error) {
        console.error('AI generation failed:', error);
        await change.after.ref.set({
            status: 'ai_error',
            error: error.message
        }, { merge: true });
        return { success: false, error: error.message };
    }
});
async function generateListingWithAI({ processedUrl }) {
    var _a, _b, _c;
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
        if (!ANTHROPIC_API_KEY)
            throw new Error('Anthropic API key not configured');
        // Call Anthropic Claude 3.5 Sonnet via HTTP
        const anthropicRes = await axios_1.default.post('https://api.anthropic.com/v1/messages', {
            model: 'claude-3-5-sonnet-20240620',
            max_tokens: 1200,
            temperature: 0.3,
            messages: [
                { role: 'user', content: prompt }
            ]
        }, {
            headers: {
                'x-api-key': ANTHROPIC_API_KEY,
                'anthropic-version': '2023-06-01',
                'content-type': 'application/json'
            },
            timeout: 45000
        });
        const text = ((_c = (_b = (_a = anthropicRes.data) === null || _a === void 0 ? void 0 : _a.content) === null || _b === void 0 ? void 0 : _b[0]) === null || _c === void 0 ? void 0 : _c.text) || '';
        const jsonText = extractJson(text);
        return JSON.parse(jsonText);
    }
    // Default: Gemini
    if (!genAI)
        throw new Error('Gemini API key not configured');
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    const jsonText = extractJson(responseText);
    return JSON.parse(jsonText);
}
function extractJson(text) {
    let t = text.trim();
    if (t.startsWith('```json')) {
        t = t.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    }
    else if (t.startsWith('```')) {
        t = t.replace(/```\n?/g, '');
    }
    return t;
}
/**
 * Remove background using Remove.bg API
 */
async function removeBackground(imageBuffer) {
    if (!REMOVEBG_API_KEY) {
        throw new Error('Remove.bg API key not configured');
    }
    try {
        // Optimize image
        const optimizedBuffer = await (0, sharp_1.default)(imageBuffer)
            .resize(2000, 2000, {
            fit: 'inside',
            withoutEnlargement: true
        })
            .jpeg({ quality: 90 })
            .toBuffer();
        // Call Remove.bg API
        const formData = new form_data_1.default();
        formData.append('image_file', optimizedBuffer, {
            filename: 'image.jpg',
            contentType: 'image/jpeg'
        });
        formData.append('size', 'auto');
        formData.append('format', 'png');
        const response = await axios_1.default.post('https://api.remove.bg/v1.0/removebg', formData, {
            headers: Object.assign({ 'X-Api-Key': REMOVEBG_API_KEY }, formData.getHeaders()),
            responseType: 'arraybuffer',
            timeout: 30000
        });
        return Buffer.from(response.data);
    }
    catch (error) {
        if (axios_1.default.isAxiosError(error) && error.response) {
            console.error('Remove.bg API error:', error.response.status, error.response.statusText);
            if (error.response.status === 402) {
                throw new Error('Remove.bg API quota exceeded');
            }
            else if (error.response.status === 400) {
                throw new Error('Invalid image format');
            }
        }
        throw new Error(`Background removal failed: ${error.message}`);
    }
}
/**
 * HTTP callable function to manually trigger processing
 */
exports.processImage = functions.https.onCall(async (data, context) => {
    const { userId, itemId } = data;
    if (!userId || !itemId) {
        throw new functions.https.HttpsError('invalid-argument', 'userId and itemId required');
    }
    try {
        const originalPath = `uploads/${userId}/${itemId}`;
        // Trigger processing
        await (0, exports.processUploadedImage)({
            name: originalPath,
            bucket: admin.storage().bucket().name
        });
        return { success: true };
    }
    catch (error) {
        throw new functions.https.HttpsError('internal', error.message);
    }
});
/**
 * Get listing status
 */
exports.getListingStatus = functions.https.onCall(async (data, context) => {
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
    }
    catch (error) {
        throw new functions.https.HttpsError('internal', error.message);
    }
});
//# sourceMappingURL=index.js.map