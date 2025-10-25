import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, onAuthStateChanged, type User } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Firebase configuration
// These should be set as environment variables in production
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "demo-api-key",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "demo.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "demo-project",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "demo.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "123456789",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:123456789:web:abc123"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Anonymous user management
let currentUser: User | null = null;

/**
 * Ensures an anonymous user is signed in
 * Returns the anonymous user ID
 */
export async function ensureAnonymousUser(): Promise<string> {
  if (currentUser) {
    return currentUser.uid;
  }

  // Check if already signed in
  const user = auth.currentUser;
  if (user) {
    currentUser = user;
    return user.uid;
  }

  // Sign in anonymously
  const credential = await signInAnonymously(auth);
  currentUser = credential.user;
  return credential.user.uid;
}

/**
 * Get current anonymous user ID (without triggering sign-in)
 */
export function getCurrentUserId(): string | null {
  return auth.currentUser?.uid || null;
}

/**
 * Listen to auth state changes
 */
export function onAuthChange(callback: (userId: string | null) => void) {
  return onAuthStateChanged(auth, (user) => {
    currentUser = user;
    callback(user?.uid || null);
  });
}

export default app;
