import * as admin from 'firebase-admin';

let app: admin.app.App;

try {
  if (!admin.apps.length) {
    const saBase64 = process.env.FIREBASE_SERVICE_ACCOUNT_BASE64;
    const projectId = process.env.FIREBASE_PROJECT_ID;
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    const privateKeyFromEnv = process.env.FIREBASE_PRIVATE_KEY;

    if (saBase64) {
      try {
        const jsonText = Buffer.from(saBase64, 'base64').toString('utf8');
        const json = JSON.parse(jsonText) as any;
        app = admin.initializeApp({
          credential: admin.credential.cert(json),
          storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
        });
        console.log('✅ Firebase Admin SDK initialized successfully from FIREBASE_SERVICE_ACCOUNT_BASE64.');
      } catch (e) {
        console.warn('⚠️ FIREBASE_SERVICE_ACCOUNT_BASE64 present but invalid; falling back to individual env vars. Error:', e);
      }
    }

    if (!admin.apps.length && (!projectId || !clientEmail || !privateKeyFromEnv)) {
      console.warn('Firebase service account environment variables are not set. Firebase Admin SDK will not be initialized.');
    } else if (!admin.apps.length) {
      // Support base64 or raw PEM with escaped newlines or accidental quotes
      const raw = (privateKeyFromEnv || '').trim();
      const guessIsBase64 = /^[A-Za-z0-9+/=\n\r]+$/.test(raw) && !raw.includes('BEGIN');
      const decoded = guessIsBase64 ? Buffer.from(raw, 'base64').toString('utf8') : raw;
      const unquoted = decoded.replace(/^"+|"+$/g, '');
      const privateKey = unquoted.replace(/\\n/g, '\n');
      app = admin.initializeApp({
        credential: admin.credential.cert({ projectId, clientEmail, privateKey }),
        storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
      });
      console.log('✅ Firebase Admin SDK initialized successfully.');
    }
  } else {
    app = admin.app();
    console.log('✅ Firebase Admin SDK already initialized.');
  }
} catch (error) {
  console.error('❌ Failed to initialize Firebase Admin SDK:', error);
}

const getDb = () => {
  if (!app) throw new Error('Firebase app not initialized');
  return admin.firestore();
};

const getAuth = () => {
  if (!app) throw new Error('Firebase app not initialized');
  return admin.auth();
};

const getStorage = () => {
  if (!app) throw new Error('Firebase app not initialized');
  return admin.storage();
};


export { getDb, getAuth, getStorage };
export default admin;
