import { initializeApp } from 'firebase/app';
import { getAuth, setPersistence, browserLocalPersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyBvRiVMDAeqAKiylft59YPwc90oFz-WCXo",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "neeiz-01.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "neeiz-01",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "neeiz-01.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "967647307195",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:967647307195:web:75dee1f61f4822a4da509e",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-T1QDJYTSK9"
};

// Initialize Firebase app for employers with a unique name
const employerApp = initializeApp(firebaseConfig, 'employer-app');

// Initialize Auth for employers
export const employerAuth = getAuth(employerApp);

// Initialize Firestore for employers  
export const employerDb = getFirestore(employerApp);

// Initialize Storage for employers
export const employerStorage = getStorage(employerApp);

// Enable auth persistence for employers
const initializeEmployerAuth = async () => {
  try {
    await setPersistence(employerAuth, browserLocalPersistence);
    console.log('✅ Employer Firebase Auth persistence enabled');
  } catch (error) {
    console.warn('⚠️ Employer Firebase Auth persistence setup failed:', error);
  }
};

// Initialize persistence
initializeEmployerAuth();

console.log('✅ Employer Firebase initialized successfully');
console.log('🔥 Employer Project ID:', firebaseConfig.projectId);
