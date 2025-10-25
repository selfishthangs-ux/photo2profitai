import { useState, useEffect } from 'react';
import type { Listing, ListingFormData } from '../types/listing';
import { 
  createListing, 
  updateListing, 
  uploadImage, 
  subscribeToListing 
} from '../services/listingService';
import { ensureAnonymousUser } from '../config/firebase';

/**
 * Hook for managing a single listing with real-time sync
 */
export function useListing(listingId: string) {
  const [listing, setListing] = useState<Listing | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize anonymous user
  useEffect(() => {
    ensureAnonymousUser()
      .then(setUserId)
      .catch((err) => {
        console.error('Failed to initialize anonymous user:', err);
        setError('Failed to initialize session');
      });
  }, []);

  // Subscribe to real-time updates
  useEffect(() => {
    if (!userId || !listingId) return;

    const unsubscribe = subscribeToListing(userId, listingId, (updatedListing) => {
      setListing(updatedListing);
      setLoading(false);
    });

    return unsubscribe;
  }, [userId, listingId]);

  /**
   * Initialize a new listing
   */
  const initializeListing = async () => {
    try {
      setLoading(true);
      setError(null);
      const uid = await createListing(listingId);
      setUserId(uid);
    } catch (err) {
      console.error('Error initializing listing:', err);
      setError('Failed to initialize listing');
      setLoading(false);
    }
  };

  /**
   * Upload an image for this listing
   */
  const handleImageUpload = async (file: File) => {
    if (!userId) {
      setError('User not initialized');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await uploadImage(userId, listingId, file);
      // Status will be updated via real-time listener
    } catch (err) {
      console.error('Error uploading image:', err);
      setError('Failed to upload image');
      setLoading(false);
    }
  };

  /**
   * Save draft with user edits
   */
  const saveDraft = async (data: ListingFormData) => {
    if (!userId) {
      setError('User not initialized');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await updateListing(userId, listingId, data);
      // Update will be reflected via real-time listener
    } catch (err) {
      console.error('Error saving draft:', err);
      setError('Failed to save draft');
      setLoading(false);
    }
  };

  return {
    listing,
    userId,
    loading,
    error,
    initializeListing,
    handleImageUpload,
    saveDraft
  };
}
