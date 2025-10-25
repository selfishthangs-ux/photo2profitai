import { 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc, 
  onSnapshot,
  serverTimestamp 
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage, ensureAnonymousUser } from '../config/firebase';
import type { Listing, ListingFormData, ListingStatus } from '../types/listing';

/**
 * Create a new listing in Firestore
 */
export async function createListing(listingId: string): Promise<string> {
  const userId = await ensureAnonymousUser();
  
  const listingRef = doc(db, 'users', userId, 'listings', listingId);
  
  const listingData: Partial<Listing> = {
    id: listingId,
    userId,
    status: 'uploading',
    createdAt: new Date()
  };
  
  await setDoc(listingRef, {
    ...listingData,
    createdAt: serverTimestamp()
  });
  
  return userId;
}

/**
 * Update listing status
 */
export async function updateListingStatus(
  userId: string,
  listingId: string,
  status: ListingStatus
): Promise<void> {
  const listingRef = doc(db, 'users', userId, 'listings', listingId);
  
  await updateDoc(listingRef, {
    status,
    updatedAt: serverTimestamp()
  });
}

/**
 * Update listing with user edits
 */
export async function updateListing(
  userId: string,
  listingId: string,
  data: ListingFormData
): Promise<void> {
  const listingRef = doc(db, 'users', userId, 'listings', listingId);
  
  await updateDoc(listingRef, {
    ...data,
    updatedAt: serverTimestamp()
  });
}

/**
 * Upload image to Firebase Storage
 */
export async function uploadImage(
  userId: string,
  listingId: string,
  file: File
): Promise<string> {
  const fileExtension = file.name.split('.').pop() || 'jpg';
  const filename = `${listingId}.${fileExtension}`;
  const storageRef = ref(storage, `uploads/${userId}/${filename}`);
  
  await uploadBytes(storageRef, file);
  const downloadUrl = await getDownloadURL(storageRef);
  
  // Update listing with original image info
  const listingRef = doc(db, 'users', userId, 'listings', listingId);
  await updateDoc(listingRef, {
    originalPath: `uploads/${userId}/${filename}`,
    originalUrl: downloadUrl,
    status: 'processing_bg',
    updatedAt: serverTimestamp()
  });
  
  return downloadUrl;
}

/**
 * Get a specific listing
 */
export async function getListing(
  userId: string,
  listingId: string
): Promise<Listing | null> {
  const listingRef = doc(db, 'users', userId, 'listings', listingId);
  const docSnap = await getDoc(listingRef);
  
  if (!docSnap.exists()) {
    return null;
  }
  
  const data = docSnap.data();
  return {
    ...data,
    id: docSnap.id,
    createdAt: data.createdAt?.toDate() || new Date(),
    updatedAt: data.updatedAt?.toDate(),
    aiGeneratedAt: data.aiGeneratedAt?.toDate()
  } as Listing;
}

/**
 * Subscribe to real-time listing updates
 */
export function subscribeToListing(
  userId: string,
  listingId: string,
  callback: (listing: Listing | null) => void
): () => void {
  const listingRef = doc(db, 'users', userId, 'listings', listingId);
  
  return onSnapshot(listingRef, (docSnap) => {
    if (!docSnap.exists()) {
      callback(null);
      return;
    }
    
    const data = docSnap.data();
    const listing: Listing = {
      ...data,
      id: docSnap.id,
      createdAt: data.createdAt?.toDate() || new Date(),
      updatedAt: data.updatedAt?.toDate(),
      aiGeneratedAt: data.aiGeneratedAt?.toDate()
    } as Listing;
    
    callback(listing);
  }, (error) => {
    console.error('Error subscribing to listing:', error);
    callback(null);
  });
}
