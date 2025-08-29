import * as admin from 'firebase-admin';

const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;

if (!serviceAccountKey) {
  throw new Error('The FIREBASE_SERVICE_ACCOUNT_KEY environment variable is not set.');
}

try {
  const serviceAccount = JSON.parse(Buffer.from(serviceAccountKey, 'base64').toString('utf8'));
  
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
  
  console.log('✅ Firebase Admin SDK initialized successfully');
} catch (error) {
  console.error('❌ Error initializing Firebase Admin SDK:', error);
  process.exit(1);
}

export const auth = admin.auth();
export const db = admin.firestore();
export default admin;
