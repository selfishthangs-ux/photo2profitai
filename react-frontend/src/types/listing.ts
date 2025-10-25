/**
 * Status of a listing as it progresses through the pipeline
 */
export type ListingStatus = 
  | 'uploading'           // Image is being uploaded to Firebase Storage
  | 'processing_bg'       // Background removal in progress
  | 'bg_removed'          // Background removed, waiting for AI
  | 'generating_ai'       // AI content generation in progress
  | 'ai_complete'         // AI content ready
  | 'ready'               // Ready to post
  | 'error';              // An error occurred

/**
 * AI-generated content for a listing
 */
export interface AIContent {
  category?: string;
  condition?: string;
  color?: string;
  title?: string;
  description?: string;
  pricing?: {
    thrift: number;
    boutique: number;
    new: number;
  };
}

/**
 * Listing document structure in Firestore
 * Stored at: users/{userId}/listings/{listingId}
 */
export interface Listing {
  // IDs
  id: string;
  userId: string;
  
  // Image paths
  originalPath?: string;      // Firebase Storage path to original image
  processedPath?: string;     // Firebase Storage path to processed image
  originalUrl?: string;       // Download URL for original
  processedUrl?: string;      // Download URL for processed
  
  // Status
  status: ListingStatus;
  
  // AI-generated content (populated by Cloud Function)
  ai?: AIContent;
  
  // User-editable fields (can override AI)
  title?: string;
  description?: string;
  price?: number;
  category?: string;
  
  // Metadata
  createdAt: Date;
  updatedAt?: Date;
  aiGeneratedAt?: Date;
  
  // Error handling
  error?: string;
  aiError?: string;
}

/**
 * Form data for creating/updating a listing
 */
export interface ListingFormData {
  title?: string;
  description?: string;
  price?: number;
  category?: string;
}
