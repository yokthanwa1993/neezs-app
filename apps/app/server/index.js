import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import admin from 'firebase-admin';
import axios from 'axios';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from root directory
dotenv.config({ path: path.join(__dirname, '..', '.env') });

// Initialize Firebase Admin
let serviceAccount;
try {
  // Try base64 encoded service account first
  if (process.env.FIREBASE_SERVICE_ACCOUNT_BASE64) {
    const decodedServiceAccount = Buffer.from(process.env.FIREBASE_SERVICE_ACCOUNT_BASE64, 'base64').toString('utf-8');
    serviceAccount = JSON.parse(decodedServiceAccount);
    console.log('✅ Firebase Service Account loaded from base64');
    console.log('🔍 Service Account Project ID:', serviceAccount.project_id);
    console.log('🔍 Service Account Client Email:', serviceAccount.client_email);
  }
  // Try JSON string environment variable
  else if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
    serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
    console.log('✅ Firebase Service Account loaded from JSON string');
  } 
  // Fallback to individual environment variables
  else {
    serviceAccount = {
      type: "service_account",
      project_id: "neeiz-01",
      private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
      private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      client_email: process.env.FIREBASE_CLIENT_EMAIL,
      client_id: process.env.FIREBASE_CLIENT_ID,
      auth_uri: "https://accounts.google.com/o/oauth2/auth",
      token_uri: "https://oauth2.googleapis.com/token",
      auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
      client_x509_cert_url: process.env.FIREBASE_CLIENT_CERT_URL
    };
    console.log('✅ Firebase Service Account loaded from individual env vars');
  }
} catch (error) {
  console.error('❌ Failed to load Firebase Service Account:', error.message);
  process.exit(1);
}

// Initialize Firebase with error handling
try {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
  console.log('🔥 Firebase Admin initialized successfully');
} catch (error) {
  console.error('❌ Firebase Admin initialization failed:', error.message);
  console.error('🔍 Error details:', error);
  process.exit(1);
}

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files with correct MIME types
app.use(express.static(path.join(__dirname, 'dist'), {
  setHeaders: (res, path) => {
    if (path.endsWith('.js')) {
      res.setHeader('Content-Type', 'application/javascript');
    }
  }
}));

// LINE Authentication endpoint
app.post('/api/auth/line', async (req, res) => {
  try {
    const { idToken } = req.body;

    if (!idToken) {
      return res.status(400).json({ message: 'ID Token is required' });
    }

    console.log('🔍 Starting LINE authentication process...');

    // Verify LINE ID Token
    const lineResponse = await axios.post('https://api.line.me/oauth2/v2.1/verify', 
      `id_token=${idToken}&client_id=${process.env.LINE_CHANNEL_ID}`,
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    );

    const lineUser = lineResponse.data;
    console.log('✅ LINE token verified successfully:', { sub: lineUser.sub, name: lineUser.name });
    
    if (!lineUser.sub) {
      return res.status(401).json({ message: 'Invalid LINE token' });
    }

    // User profile from ID token claims is sufficient
    const userProfile = {
      displayName: lineUser.name || 'ผู้ใช้ LINE',
      email: lineUser.email || '',
      pictureUrl: lineUser.picture || ''
    };

    console.log('👤 User profile:', userProfile);

    // Create or update user in Firebase
    const uid = `line_${lineUser.sub}`;
    console.log('🔑 Firebase UID:', uid);
    
    try {
      // Try to get existing user
      console.log('🔍 Checking if user exists in Firebase...');
      await admin.auth().getUser(uid);
      console.log('✅ User exists, updating...');
      
      // Update existing user
      await admin.auth().updateUser(uid, {
        displayName: userProfile.displayName,
        photoURL: userProfile.pictureUrl,
      });
      console.log('✅ User updated successfully');
    } catch (error) {
      console.log('ℹ️ User does not exist, creating new user...');
      console.log('Firebase error details:', error.code, error.message);
      
      // User doesn't exist, create new user
      const createUserData = {
        uid: uid,
        displayName: userProfile.displayName,
        photoURL: userProfile.pictureUrl,
        providerData: [{
          uid: lineUser.sub,
          displayName: userProfile.displayName,
          photoURL: userProfile.pictureUrl,
          providerId: 'line'
        }]
      };

      // Only add email if it exists and is valid
      if (userProfile.email && userProfile.email.trim() !== '') {
        createUserData.email = userProfile.email;
        createUserData.providerData[0].email = userProfile.email;
      }

      console.log('📝 Creating user with data:', createUserData);
      
      try {
        await admin.auth().createUser(createUserData);
        console.log('✅ User created successfully');
      } catch (createError) {
        console.error('❌ Failed to create user:', createError.code, createError.message);
        
        // Handle specific Firebase errors
        if (createError.code === 'auth/email-already-exists') {
          return res.status(409).json({ 
            message: 'อีเมลนี้ถูกใช้แล้ว กรุณาใช้อีเมลอื่น หรือเข้าสู่ระบบด้วยวิธีอื่น',
            code: 'EMAIL_ALREADY_EXISTS'
          });
        }
        
        throw createError; // Re-throw if it's not a handled error
      }
    }

    console.log('🎫 Creating Firebase custom token...');
    // Create Firebase Custom Token
    const customToken = await admin.auth().createCustomToken(uid, {
      provider: 'line',
      line_user_id: lineUser.sub
    });

    console.log('✅ Authentication completed successfully');

    // Return custom token and user data
    res.json({
      customToken,
      user: {
        uid: uid,
        displayName: userProfile.displayName,
        email: userProfile.email,
        pictureUrl: userProfile.pictureUrl
      }
    });

  } catch (error) {
    console.error('❌ LINE authentication error:', error);
    
    if (error.response) {
      console.error('LINE API Error Response:', error.response.status, error.response.data);
      return res.status(401).json({ 
        message: 'LINE token verification failed',
        details: error.response.data 
      });
    }
    
    console.error('Internal server error:', error.message);
    console.error('Error stack:', error.stack);
    
    res.status(500).json({ 
      message: 'Internal server error during authentication',
      error: error.message 
    });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    firebase: admin.apps.length > 0 ? 'connected' : 'disconnected'
  });
});

// Serve React app for all other routes (must be last)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🔥 Firebase Admin initialized`);
  console.log(`📁 Serving static files from: ${path.join(__dirname, 'dist')}`);
});