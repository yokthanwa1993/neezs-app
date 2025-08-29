import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import axios from 'axios';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import admin from 'firebase-admin';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Firebase Admin
let serviceAccount;
try {
  if (process.env.FIREBASE_SERVICE_ACCOUNT_BASE64) {
    const decodedServiceAccount = Buffer.from(process.env.FIREBASE_SERVICE_ACCOUNT_BASE64, 'base64').toString('utf-8');
    serviceAccount = JSON.parse(decodedServiceAccount);
    console.log('✅ Firebase Service Account loaded from base64');
  } else if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
    serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
    console.log('✅ Firebase Service Account loaded from JSON string');
  } else {
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

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
  console.log('🔥 Firebase Admin initialized');
} catch (error) {
  console.error('❌ Failed to load Firebase Service Account:', error.message);
  process.exit(1);
}

const app = express();
const PORT = process.env.PORT || 80;

// Middleware
app.use(cors());
app.use(express.json());

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// API Routes
app.post('/api/auth/line', async (req, res) => {
  try {
    const { idToken } = req.body;
    
    if (!idToken) {
      return res.status(400).json({ message: 'ID Token is required' });
    }

    console.log('🔍 Starting LINE authentication process...');

    // Verify LINE ID Token
    const response = await axios.post('https://api.line.me/oauth2/v2.1/verify', 
      `id_token=${idToken}&client_id=${process.env.LINE_CHANNEL_ID}`,
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    );

    const lineUser = response.data;
    console.log('✅ LINE token verified successfully:', { sub: lineUser.sub, name: lineUser.name });
    
    if (!lineUser.sub) {
      return res.status(401).json({ message: 'Invalid LINE token' });
    }

    // User profile from ID token claims
    const userProfile = {
      displayName: lineUser.name || 'ผู้ใช้ LINE',
      email: lineUser.email || '',
      pictureUrl: lineUser.picture || ''
    };

    console.log('👤 User profile:', userProfile);

    let uid = `line_${lineUser.sub}`;
    let isNewUser = false;
    let existingUser = null;

    // Check if user exists with this LINE ID
    try {
      existingUser = await admin.auth().getUser(uid);
      console.log('✅ Found existing user with LINE ID');
    } catch (error) {
      console.log('ℹ️ No existing user with this LINE ID');
      
      // If user has email, check if email already exists
      if (userProfile.email && userProfile.email.trim() !== '') {
        try {
          const userByEmail = await admin.auth().getUserByEmail(userProfile.email);
          console.log('✅ Found existing user with same email, linking accounts');
          uid = userByEmail.uid;
          existingUser = userByEmail;
        } catch (emailError) {
          console.log('ℹ️ No existing user with this email, creating new user');
          isNewUser = true;
        }
      } else {
        console.log('ℹ️ No email provided, creating new user');
        isNewUser = true;
      }
    }

    if (existingUser) {
      // Update existing user with new LINE provider data
      console.log('🔄 Updating existing user with LINE data...');
      
      const updatedProviderData = existingUser.providerData.filter(
        provider => provider.providerId !== 'line'
      );
      
      updatedProviderData.push({
        uid: lineUser.sub,
        displayName: userProfile.displayName,
        photoURL: userProfile.pictureUrl,
        providerId: 'line',
        email: userProfile.email || existingUser.email
      });

      await admin.auth().updateUser(uid, {
        displayName: userProfile.displayName || existingUser.displayName,
        photoURL: userProfile.pictureUrl || existingUser.photoURL,
        providerData: updatedProviderData
      });
      
      console.log('✅ User updated successfully with LINE provider');
    } else {
      // Create new user
      console.log('📝 Creating new user...');
      
      const createUserData = {
        uid: uid,
        displayName: userProfile.displayName,
        photoURL: userProfile.pictureUrl,
        providerData: [{
          uid: lineUser.sub,
          displayName: userProfile.displayName,
          photoURL: userProfile.pictureUrl,
          providerId: 'line',
          email: userProfile.email
        }]
      };

      // Only add email if it exists and is valid
      if (userProfile.email && userProfile.email.trim() !== '') {
        createUserData.email = userProfile.email;
      }

      console.log('📝 Creating user with data:', createUserData);
      
      try {
        await admin.auth().createUser(createUserData);
        console.log('✅ User created successfully');
      } catch (createError) {
        console.error('❌ Failed to create user:', createError.code, createError.message);
        
        if (createError.code === 'auth/email-already-exists') {
          return res.status(409).json({ 
            message: 'อีเมลนี้ถูกใช้แล้ว กรุณาใช้อีเมลอื่น หรือเข้าสู่ระบบด้วยวิธีอื่น',
            code: 'EMAIL_ALREADY_EXISTS'
          });
        }
        
        throw createError;
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
        pictureUrl: userProfile.pictureUrl,
        isNewUser: isNewUser
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
    
    res.status(500).json({ 
      message: 'Internal server error during authentication',
      error: error.message 
    });
  }
});

// Google Authentication endpoint
app.post('/api/auth/google', async (req, res) => {
  try {
    const { idToken } = req.body;
    
    if (!idToken) {
      return res.status(400).json({ message: 'ID Token is required' });
    }

    console.log('🔍 Starting Google authentication process...');

    // Verify Google ID Token
    const response = await axios.get(`https://oauth2.googleapis.com/tokeninfo?id_token=${idToken}`);
    const googleUser = response.data;
    
    console.log('✅ Google token verified successfully:', { sub: googleUser.sub, email: googleUser.email });
    
    if (!googleUser.sub) {
      return res.status(401).json({ message: 'Invalid Google token' });
    }

    // User profile from ID token claims
    const userProfile = {
      displayName: googleUser.name || 'ผู้ใช้ Google',
      email: googleUser.email || '',
      pictureUrl: googleUser.picture || ''
    };

    console.log('👤 User profile:', userProfile);

    let uid = `google_${googleUser.sub}`;
    let isNewUser = false;
    let existingUser = null;

    // Check if user exists with this Google ID
    try {
      existingUser = await admin.auth().getUser(uid);
      console.log('✅ Found existing user with Google ID');
    } catch (error) {
      console.log('ℹ️ No existing user with this Google ID');
      
      // If user has email, check if email already exists
      if (userProfile.email && userProfile.email.trim() !== '') {
        try {
          const userByEmail = await admin.auth().getUserByEmail(userProfile.email);
          console.log('✅ Found existing user with same email, linking accounts');
          uid = userByEmail.uid;
          existingUser = userByEmail;
        } catch (emailError) {
          console.log('ℹ️ No existing user with this email, creating new user');
          isNewUser = true;
        }
      } else {
        console.log('ℹ️ No email provided, creating new user');
        isNewUser = true;
      }
    }

    if (existingUser) {
      // Update existing user with new Google provider data
      console.log('🔄 Updating existing user with Google data...');
      
      const updatedProviderData = existingUser.providerData.filter(
        provider => provider.providerId !== 'google.com'
      );
      
      updatedProviderData.push({
        uid: googleUser.sub,
        displayName: userProfile.displayName,
        photoURL: userProfile.pictureUrl,
        providerId: 'google.com',
        email: userProfile.email || existingUser.email
      });

      await admin.auth().updateUser(uid, {
        displayName: userProfile.displayName || existingUser.displayName,
        photoURL: userProfile.pictureUrl || existingUser.photoURL,
        providerData: updatedProviderData
      });
      
      console.log('✅ User updated successfully with Google provider');
    } else {
      // Create new user
      console.log('📝 Creating new user...');
      
      const createUserData = {
        uid: uid,
        displayName: userProfile.displayName,
        photoURL: userProfile.pictureUrl,
        email: userProfile.email,
        providerData: [{
          uid: googleUser.sub,
          displayName: userProfile.displayName,
          photoURL: userProfile.pictureUrl,
          providerId: 'google.com',
          email: userProfile.email
        }]
      };

      console.log('📝 Creating user with data:', createUserData);
      
      try {
        await admin.auth().createUser(createUserData);
        console.log('✅ User created successfully');
      } catch (createError) {
        console.error('❌ Failed to create user:', createError.code, createError.message);
        
        if (createError.code === 'auth/email-already-exists') {
          return res.status(409).json({ 
            message: 'อีเมลนี้ถูกใช้แล้ว กรุณาใช้อีเมลอื่น หรือเข้าสู่ระบบด้วยวิธีอื่น',
            code: 'EMAIL_ALREADY_EXISTS'
          });
        }
        
        throw createError;
      }
    }

    console.log('🎫 Creating Firebase custom token...');
    // Create Firebase Custom Token
    const customToken = await admin.auth().createCustomToken(uid, {
      provider: 'google.com',
      google_user_id: googleUser.sub
    });

    console.log('✅ Authentication completed successfully');

    // Return custom token and user data
    res.json({
      customToken,
      user: {
        uid: uid,
        displayName: userProfile.displayName,
        email: userProfile.email,
        pictureUrl: userProfile.pictureUrl,
        isNewUser: isNewUser
      }
    });

  } catch (error) {
    console.error('❌ Google authentication error:', error);
    
    if (error.response) {
      console.error('Google API Error Response:', error.response.status, error.response.data);
      return res.status(401).json({ 
        message: 'Google token verification failed',
        details: error.response.data 
      });
    }
    
    console.error('Internal server error:', error.message);
    
    res.status(500).json({ 
      message: 'Internal server error during authentication',
      error: error.message 
    });
  }
});

// Middleware to verify JWT
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};

// Protected routes
app.get('/api/user/profile', authenticateToken, (req, res) => {
  res.json({
    user: req.user
  });
});

// Get user profile with linked providers
app.get('/api/user/profile/detailed', authenticateToken, async (req, res) => {
  try {
    const user = await admin.auth().getUser(req.user.uid);
    
    res.json({
      user: {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        emailVerified: user.emailVerified,
        disabled: user.disabled,
        metadata: user.metadata,
        providerData: user.providerData,
        customClaims: user.customClaims
      }
    });
  } catch (error) {
    console.error('❌ Error getting user profile:', error);
    res.status(500).json({ 
      message: 'Error getting user profile',
      error: error.message 
    });
  }
});

// Link additional provider to existing account
app.post('/api/user/link-provider', authenticateToken, async (req, res) => {
  try {
    const { provider, idToken } = req.body;
    
    if (!provider || !idToken) {
      return res.status(400).json({ message: 'Provider and ID token are required' });
    }

    const currentUser = await admin.auth().getUser(req.user.uid);
    
    // Check if provider is already linked
    const existingProvider = currentUser.providerData.find(p => p.providerId === provider);
    if (existingProvider) {
      return res.status(400).json({ 
        message: 'Provider is already linked to this account',
        code: 'PROVIDER_ALREADY_LINKED'
      });
    }

    // Verify token based on provider
    let verifiedUser;
    if (provider === 'line') {
      const response = await axios.post('https://api.line.me/oauth2/v2.1/verify', 
        `id_token=${idToken}&client_id=${process.env.LINE_CHANNEL_ID}`,
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }
      );
      verifiedUser = response.data;
    } else if (provider === 'google.com') {
      const response = await axios.get(`https://oauth2.googleapis.com/tokeninfo?id_token=${idToken}`);
      verifiedUser = response.data;
    } else {
      return res.status(400).json({ message: 'Unsupported provider' });
    }

    // Add new provider to user
    const updatedProviderData = [...currentUser.providerData, {
      uid: verifiedUser.sub,
      displayName: verifiedUser.name || verifiedUser.displayName,
      photoURL: verifiedUser.picture || verifiedUser.photoURL,
      providerId: provider,
      email: verifiedUser.email || currentUser.email
    }];

    await admin.auth().updateUser(req.user.uid, {
      providerData: updatedProviderData
    });

    res.json({
      message: 'Provider linked successfully',
      user: {
        uid: req.user.uid,
        providerData: updatedProviderData
      }
    });

  } catch (error) {
    console.error('❌ Error linking provider:', error);
    
    if (error.response) {
      return res.status(401).json({ 
        message: 'Token verification failed',
        details: error.response.data 
      });
    }
    
    res.status(500).json({ 
      message: 'Error linking provider',
      error: error.message 
    });
  }
});

// Unlink provider from existing account
app.post('/api/user/unlink-provider', authenticateToken, async (req, res) => {
  try {
    const { providerId } = req.body;
    
    if (!providerId) {
      return res.status(400).json({ message: 'Provider ID is required' });
    }

    const currentUser = await admin.auth().getUser(req.user.uid);
    
    // Check if provider is linked
    const existingProvider = currentUser.providerData.find(p => p.providerId === providerId);
    if (!existingProvider) {
      return res.status(400).json({ 
        message: 'Provider is not linked to this account',
        code: 'PROVIDER_NOT_LINKED'
      });
    }

    // Check if user has at least 2 providers (can't unlink if only 1 provider)
    if (currentUser.providerData.length <= 1) {
      return res.status(400).json({ 
        message: 'Cannot unlink the only provider. Please link another provider first.',
        code: 'CANNOT_UNLINK_ONLY_PROVIDER'
      });
    }

    // Remove provider from user
    const updatedProviderData = currentUser.providerData.filter(p => p.providerId !== providerId);

    await admin.auth().updateUser(req.user.uid, {
      providerData: updatedProviderData
    });

    res.json({
      message: 'Provider unlinked successfully',
      user: {
        uid: req.user.uid,
        providerData: updatedProviderData
      }
    });

  } catch (error) {
    console.error('❌ Error unlinking provider:', error);
    
    res.status(500).json({ 
      message: 'Error unlinking provider',
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

// Serve static files from dist directory
app.use(express.static(path.join(__dirname, 'dist')));

// Middleware to handle SPA routing
app.use((req, res, next) => {
  if (req.method === 'GET' && !req.path.startsWith('/api/') && !req.path.includes('.')) {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
  } else {
    next();
  }
});

// Handle React Router (SPA)
app.get('*', (req, res) => {
  // Skip API routes
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({ error: 'API endpoint not found' });
  }
  
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🔥 Firebase Admin initialized`);
  console.log(`Frontend: http://localhost:${PORT}`);
  console.log(`API: http://localhost:${PORT}/api`);
});