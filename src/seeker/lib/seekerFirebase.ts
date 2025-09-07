import { initializeApp } from 'firebase/app';
import { getAuth, setPersistence, browserLocalPersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyBvRiVMDAeqAKiylft59YPwc90oFz-WCXo",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "neeiz-01.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "neeiz-01",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "neeiz-01.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "967647307195",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:967647307195:web:75dee1f61f4822a4da509e",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-T1QDJYTSK9"
};

// Initialize Firebase app for seekers with a unique name
const seekerApp = initializeApp(firebaseConfig, 'seeker-app');

// Initialize Auth for seekers
export const seekerAuth = getAuth(seekerApp);

// Initialize Firestore for seekers  
export const seekerDb = getFirestore(seekerApp);

// Enable auth persistence for seekers
const initializeSeekerAuth = async () => {
  try {
    await setPersistence(seekerAuth, browserLocalPersistence);
    console.log('✅ Seeker Firebase Auth persistence enabled');
  } catch (error) {
    console.warn('⚠️ Seeker Firebase Auth persistence setup failed:', error);
  }
};

// Initialize persistence
initializeSeekerAuth();

console.log('✅ Seeker Firebase initialized successfully');
console.log('🔥 Seeker Project ID:', firebaseConfig.projectId);
