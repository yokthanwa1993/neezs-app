import { Router, Request, Response } from 'express';
import { getAuth, getDb, getStorage } from '../firebase';
import admin from '../firebase';
import { DecodedIdToken } from 'firebase-admin/auth';
import axios from 'axios';
import * as functions from 'firebase-functions';
import { randomUUID } from 'crypto';
import { buildCallbackUrl } from '../utils/codespaces';
import crypto from 'crypto';

const router = Router();

// Helpers: base64url encoding and PKCE utilities
const base64url = (input: Buffer) =>
  input
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/g, '');

const generateVerifier = (bytes = 32) => base64url(crypto.randomBytes(bytes));
const sha256 = (data: string) => crypto.createHash('sha256').update(data).digest();

const parseCookies = (cookieHeader?: string) => {
  const out: Record<string, string> = {};
  if (!cookieHeader) return out;
  cookieHeader.split(';').forEach((part) => {
    const idx = part.indexOf('=');
    if (idx > -1) {
      const key = part.slice(0, idx).trim();
      const val = decodeURIComponent(part.slice(idx + 1).trim());
      out[key] = val;
    }
  });
  return out;
};

// POST /api/auth/authorize
// Returns LINE authorize URL with PKCE (S256) and sets HttpOnly cookies for state + code_verifier
router.post('/authorize', async (req: Request, res: Response) => {
  try {
    const { role, redirectPath = '/', redirectUri } = req.body as {
      role: 'seeker' | 'employer';
      redirectPath?: string;
      redirectUri?: string;
    };

    if (!role) {
      return res.status(400).json({ message: 'Missing role' });
    }

    const lineChannelId = process.env.VITE_LINE_CHANNEL_ID || process.env.LINE_CHANNEL_ID;
    if (!lineChannelId) {
      return res.status(500).json({ message: 'LINE channel ID not configured' });
    }

    // Determine redirect URI. Prefer explicit value from client; otherwise env per role; fallback to origin
    const origin = (req.headers.origin as string) || (req.headers.referer as string) || '';
    // Priority: explicit body.redirectUri -> env per role -> base-domain derived -> origin-derived
    const derivedFromBase = buildCallbackUrl(role, 5000) || undefined;
    const fallbackRedirect = origin ? `${origin.replace(/\/$/, '')}/${role}/auth/callback` : undefined;
    const redirect = redirectUri ||
      (role === 'seeker' ? process.env.VITE_LINE_REDIRECT_URI_SEEKER : process.env.VITE_LINE_REDIRECT_URI_EMPLOYER) ||
      derivedFromBase ||
      fallbackRedirect;

    if (!redirect) {
      return res.status(400).json({ message: 'redirectUri not provided and could not be inferred' });
    }

    // Generate state embedding minimal info safely
    const statePayload = {
      r: role,
      p: redirectPath,
      t: Date.now(),
      jti: randomUUID(),
    };
    const state = base64url(Buffer.from(JSON.stringify(statePayload)));

    // PKCE
    const codeVerifier = generateVerifier(64);
    const codeChallenge = base64url(sha256(codeVerifier));

    // Build authorize URL
    const params = new URLSearchParams({
      response_type: 'code',
      client_id: lineChannelId,
      redirect_uri: redirect,
      scope: 'profile openid email',
      state,
      nonce: randomUUID(),
      code_challenge: codeChallenge,
      code_challenge_method: 'S256',
    });
    const authorizeUrl = `https://access.line.me/oauth2/v2.1/authorize?${params.toString()}`;

    // Set HttpOnly cookies for validation
    const cookieOpts = {
      httpOnly: true,
      sameSite: 'lax' as const,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 5 * 60 * 1000, // 5 minutes
    };
    // res.cookie is available without cookie-parser for setting
    (res as any).cookie?.('oauth_state', state, cookieOpts) || res.setHeader('Set-Cookie', [`oauth_state=${encodeURIComponent(state)}; Path=/; Max-Age=300; ${process.env.NODE_ENV==='production'?'Secure; ':''}HttpOnly; SameSite=Lax`]);
    (res as any).cookie?.('pkce_verifier', codeVerifier, cookieOpts) || res.append('Set-Cookie', `pkce_verifier=${encodeURIComponent(codeVerifier)}; Path=/; Max-Age=300; ${process.env.NODE_ENV==='production'?'Secure; ':''}HttpOnly; SameSite=Lax`);

    return res.status(200).json({ authorizeUrl });
  } catch (error: any) {
    console.error('Authorize error:', error);
    return res.status(500).json({ message: error.message || 'Authorize failed' });
  }
});

router.post('/line', async (req: Request, res: Response) => {
  try {
    const { idToken, accessToken, role } = req.body as { idToken?: string; accessToken?: string; role?: 'seeker' | 'employer' };
    console.log('📨 Received LIFF auth request:', { role, hasIdToken: !!idToken, hasAccessToken: !!accessToken });
    if (!role || !idToken) {
      return res.status(400).json({ error: 'Missing role or idToken' });
    }

    const lineChannelId = process.env.VITE_LINE_CHANNEL_ID || process.env.LINE_CHANNEL_ID;
    if (!lineChannelId) {
      return res.status(500).json({ error: 'LINE channel ID not configured' });
    }

    // Verify idToken with LINE
    const verifyResp = await axios.post(
      'https://api.line.me/oauth2/v2.1/verify',
      new URLSearchParams({ id_token: idToken, client_id: lineChannelId }),
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
    );

    const verified = verifyResp.data as any;
    const lineUserId: string = verified.sub;
    if (!lineUserId) {
      return res.status(401).json({ error: 'Invalid LINE idToken' });
    }

    // Optionally fetch profile when accessToken is provided; otherwise create minimal user
    let displayName: string | undefined;
    let pictureUrl: string | undefined;
    let email: string | null = null;
    try {
      if (accessToken) {
        const profileResp = await axios.get('https://api.line.me/v2/profile', {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        const p = profileResp.data as any;
        displayName = p.displayName;
        pictureUrl = p.pictureUrl;
      }
      if (verified.email) {
        email = verified.email;
      }
    } catch (e) {
      console.warn('⚠️ Could not fetch LINE profile with accessToken, proceeding with minimal info');
    }

    const auth = getAuth();
    const db = getDb();
    let userRecord;

    try {
      userRecord = await auth.getUser(lineUserId);
    } catch (error: any) {
      if (error.code === 'auth/user-not-found') {
        const userToCreate: any = {
          uid: lineUserId,
          displayName: displayName,
          photoURL: pictureUrl,
        };
        if (email) {
          userToCreate.email = email;
          userToCreate.emailVerified = true;
        }
        userRecord = await auth.createUser(userToCreate);
      } else {
        throw error;
      }
    }

    // Persist profile per role collection
    if (role === 'seeker') {
      const seekerDoc = db.collection('SeekerUsers').doc(userRecord.uid);
      await seekerDoc.set({
        lineUserId: lineUserId,
        displayName: displayName || null,
        pictureUrl: pictureUrl || null,
        email: email || null,
        role: role,
        lastLogin: new Date(),
      }, { merge: true });
    } else {
      const userDocRef = db.collection('users').doc(userRecord.uid);
      await userDocRef.set({
        lineUserId: lineUserId,
        displayName: displayName || null,
        pictureUrl: pictureUrl || null,
        email: email || null,
        role: role,
        lastLogin: new Date(),
      }, { merge: true });
    }

    const customToken = await auth.createCustomToken(userRecord.uid);
    console.log('🎟️ Custom token created successfully');

    res.json({ 
      token: customToken, 
      user: {
        uid: userRecord.uid,
        displayName: displayName || null,
        pictureUrl: pictureUrl || null,
        email: email || null,
        role: role
      }
    });
  } catch (error: any) {
    console.error('❌ LINE Auth Error:', error.message);
    
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
      console.error('Response headers:', error.response.headers);
      
      // Return more specific error information
      return res.status(error.response.status).json({
        error: 'LINE API Error',
        details: error.response.data,
        status: error.response.status
      });
    }
    
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
});

router.post('/sessionLogin', async (req: Request, res: Response) => {
  try {
    const { idToken } = req.body;
    const auth = getAuth();
    const expiresIn = 60 * 60 * 24 * 5 * 1000; // 5 days
    const sessionCookie = await auth.createSessionCookie(idToken, { expiresIn });
    const options = { maxAge: expiresIn, httpOnly: true, secure: process.env.NODE_ENV === 'production' };
    res.cookie('session', sessionCookie, options);
    res.status(200).json({ status: 'success' });
  } catch (error) {
    console.error('Session Login Error:', error);
    res.status(401).send('UNAUTHORIZED REQUEST!');
  }
});

router.post('/sessionLogout', (req: Request, res: Response) => {
  res.clearCookie('session');
  res.status(200).json({ status: 'success' });
});

// POST /api/auth/line/logout-notify
router.post('/line/logout-notify', async (req: Request, res: Response) => {
  try {
    const { lineUserId, message = 'คุณได้ออกจากระบบ NEEZS แล้ว ดีๆ แบบนี้ดี' } = req.body as { lineUserId?: string; message?: string };
    console.log('📨 Logout-notify request:', { hasUserId: !!lineUserId, message });
    if (!lineUserId) {
      return res.status(400).json({ message: 'lineUserId is required' });
    }

    const channelAccessToken = process.env.LINE_CHANNEL_ACCESS_TOKEN || (functions.config?.() as any)?.line?.channel_access_token;
    if (!channelAccessToken) {
      console.log('⚠️ LINE_CHANNEL_ACCESS_TOKEN not configured - skipping push notification');
      return res.status(200).json({ ok: true, message: 'Logout recorded (push notification disabled)' });
    }

    const resp = await fetch('https://api.line.me/v2/bot/message/push', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${channelAccessToken}`,
      },
      body: JSON.stringify({
        to: lineUserId,
        messages: [
          { type: 'text', text: message }
        ],
      }),
    });

    if (!resp.ok) {
      const txt = await resp.text();
      console.error('LINE push error:', resp.status, txt);
      return res.status(502).json({ message: 'Failed to push message to LINE' });
    }
    // Log success status for diagnostics
    let info: any = undefined;
    try { info = await resp.text(); } catch {}
    console.log('✅ LINE push success:', resp.status, info || '(no body)');
    return res.status(200).json({ ok: true });
  } catch (error: any) {
    console.error('Logout notify error:', error);
    return res.status(500).json({ message: error.message });
  }
});

// POST /api/auth/line-login
router.post('/line-login', async (req: Request, res: Response) => {
  try {
    const { lineToken } = req.body;

    if (!lineToken) {
      return res.status(400).json({ message: 'Missing LINE token' });
    }

    // TODO: Verify LINE token with LINE API
    // TODO: Get LINE profile
    // TODO: Create or update Firebase user
    // TODO: Return Firebase custom token

    res.status(200).json({
      message: 'LINE login successful',
      // customToken: firebaseToken
    });
  } catch (error: any) {
    console.error('LINE login error:', error);
    res.status(500).json({ message: error.message });
  }
});

// GET /api/auth/line-profile
router.get('/line-profile', async (req: Request, res: Response) => {
  try {
    const { lineToken } = req.query as { lineToken?: string };

    if (!lineToken) {
      return res.status(400).json({ message: 'Missing LINE token' });
    }

    // TODO: Get LINE profile from LINE API
    // TODO: Return LINE profile data

    res.status(200).json({
      message: 'LINE profile retrieved',
      // profile: lineProfile
    });
  } catch (error: any) {
    console.error('LINE profile error:', error);
    res.status(500).json({ message: error.message });
  }
});

// POST /api/auth/seeker-line-callback
router.post('/seeker-line-callback', async (req: Request, res: Response) => {
  try {
    const { code, redirectUri, role = 'seeker', state } = req.body as { code?: string; redirectUri?: string; role?: 'seeker'; state?: string };
    console.log('📨 Seeker LINE OAuth callback:', { hasCode: !!code, redirectUri, role, hasState: !!state });

    if (!code) {
      return res.status(400).json({ message: 'Missing authorization code' });
    }

    // Validate state from cookie
    const cookies = parseCookies(req.headers.cookie as string | undefined);
    if (!state || !cookies.oauth_state || cookies.oauth_state !== state) {
      return res.status(400).json({ message: 'Invalid state' });
    }

    const lineChannelId = process.env.VITE_LINE_CHANNEL_ID || process.env.LINE_CHANNEL_ID;
    const lineChannelSecret = process.env.LINE_CHANNEL_SECRET;
    
    if (!lineChannelId || !lineChannelSecret) {
      console.error('Missing LINE channel configuration');
      return res.status(500).json({ message: 'Server configuration error' });
    }

    // แลก code กับ access token จาก LINE
    const tokenRequestData: any = {
      grant_type: 'authorization_code',
      code,
      redirect_uri: redirectUri,
      client_id: lineChannelId,
      client_secret: lineChannelSecret,
    };

    // PKCE: include code_verifier if present
    const codeVerifier = cookies.pkce_verifier;
    if (codeVerifier) {
      tokenRequestData.code_verifier = codeVerifier;
    }

    console.log('🔄 Requesting LINE access token with:', {
      grant_type: tokenRequestData.grant_type,
      hasCode: !!code,
      redirect_uri: tokenRequestData.redirect_uri,
      client_id: tokenRequestData.client_id,
      hasSecret: !!lineChannelSecret
    });

    const tokenResponse = await axios.post('https://api.line.me/oauth2/v2.1/token', 
      new URLSearchParams(tokenRequestData),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );

    if (!tokenResponse.data.access_token) {
      throw new Error('Failed to get access token from LINE');
    }

    // ใช้ access token เพื่อดึง profile
    const profileResponse = await axios.get('https://api.line.me/v2/profile', {
      headers: {
        Authorization: `Bearer ${tokenResponse.data.access_token}`,
      },
    });

    const lineProfile = profileResponse.data;
    console.log('👤 Got LINE profile for seeker:', lineProfile.displayName);

    // สร้าง Firebase user
    const auth = getAuth();
    const db = getDb();
    
    let userRecord;
    try {
      userRecord = await auth.getUser(lineProfile.userId);
    } catch (error: any) {
      if (error.code === 'auth/user-not-found') {
        userRecord = await auth.createUser({
          uid: lineProfile.userId,
          displayName: lineProfile.displayName,
          photoURL: lineProfile.pictureUrl,
        });
        console.log('✅ Created new Firebase user for seeker');
      } else {
        throw error;
      }
    }

    // บันทึก/อัพเดท user data ใน Firestore
    await db.collection('SeekerUsers').doc(lineProfile.userId).set({
      uid: lineProfile.userId,
      displayName: lineProfile.displayName,
      pictureUrl: lineProfile.pictureUrl,
      statusMessage: lineProfile.statusMessage || null,
      role: 'seeker',
      provider: 'line',
      lastLoginAt: admin.firestore.FieldValue.serverTimestamp(),
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    }, { merge: true });

    // สร้าง Firebase custom token
    const firebaseToken = await auth.createCustomToken(lineProfile.userId, {
      role: 'seeker',
      provider: 'line',
    });

    // Clear validation cookies
    res.append('Set-Cookie', 'oauth_state=; Path=/; Max-Age=0; SameSite=Lax; HttpOnly');
    res.append('Set-Cookie', 'pkce_verifier=; Path=/; Max-Age=0; SameSite=Lax; HttpOnly');

    console.log('✅ Seeker LINE authentication successful');
    res.json({
      firebaseToken,
      profile: lineProfile,
      user: {
        uid: lineProfile.userId,
        displayName: lineProfile.displayName,
        photoURL: lineProfile.pictureUrl,
        role: 'seeker',
      },
    });

  } catch (error: any) {
    console.error('❌ Seeker LINE callback error:', error);
    
    if (error.response) {
      console.error('LINE API error response:', error.response.data);
      return res.status(400).json({ 
        message: 'LINE authentication failed',
        details: error.response.data 
      });
    }
    
    res.status(500).json({ message: error.message || 'Authentication failed' });
  }
});

// POST /api/auth/line-webhook
router.post('/line-webhook', async (req: Request, res: Response) => {
  try {
    const { events } = req.body;

    if (!events || !Array.isArray(events) || events.length === 0) {
      return res.status(200).json({ message: 'No events to process' });
    }

    const channelAccessToken = process.env.LINE_CHANNEL_ACCESS_TOKEN || (functions.config?.() as any)?.line?.channel_access_token;
    if (!channelAccessToken) {
      console.error('Missing LINE_CHANNEL_ACCESS_TOKEN');
      return res.status(500).json({ message: 'Server misconfigured' });
    }

    for (const event of events) {
      if (event.type === 'message' && event.message.type === 'text') {
        try {
          await fetch('https://api.line.me/v2/bot/message/reply', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${channelAccessToken}`,
            },
            body: JSON.stringify({
              replyToken: event.replyToken,
              messages: [{ type: 'text', text: 'Webhook received' }],
            }),
          });
        } catch (replyError) {
          console.error('Failed to send LINE reply:', replyError);
        }
      }
    }

    res.status(200).json({ message: 'Webhook processed' });
  } catch (error: any) {
    console.error('LINE webhook error:', error);
    res.status(500).json({ message: error.message });
  }
});

// POST /api/auth/seeker-liff-token
router.post('/seeker-liff-token', async (req: Request, res: Response) => {
  try {
    const { accessToken, role = 'seeker' } = req.body;
    console.log('📨 Seeker LIFF token exchange:', { hasAccessToken: !!accessToken, role });

    if (!accessToken) {
      return res.status(400).json({ message: 'Missing LIFF access token' });
    }

    // Get LINE profile using LIFF access token
    const profileResponse = await axios.get('https://api.line.me/v2/profile', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const lineProfile = profileResponse.data;
    console.log('👤 Got LINE profile for seeker:', lineProfile.displayName);

    // Create/update Firebase user
    const auth = getAuth();
    const db = getDb();
    
    let userRecord;
    try {
      userRecord = await auth.getUser(lineProfile.userId);
    } catch (error: any) {
      if (error.code === 'auth/user-not-found') {
        userRecord = await auth.createUser({
          uid: lineProfile.userId,
          displayName: lineProfile.displayName,
          photoURL: lineProfile.pictureUrl,
        });
        console.log('✅ Created new Firebase user for seeker');
      } else {
        throw error;
      }
    }

    // Save/update user data in SeekerUsers collection
    await db.collection('SeekerUsers').doc(lineProfile.userId).set({
      uid: lineProfile.userId,
      displayName: lineProfile.displayName,
      pictureUrl: lineProfile.pictureUrl,
      statusMessage: lineProfile.statusMessage || null,
      role: 'seeker',
      provider: 'line',
      lastLoginAt: admin.firestore.FieldValue.serverTimestamp(),
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    }, { merge: true });

    // Create Firebase custom token
    const firebaseToken = await auth.createCustomToken(lineProfile.userId, {
      role: 'seeker',
      provider: 'line',
    });

    console.log('✅ Seeker LIFF authentication successful');
    res.json({
      firebaseToken,
      profile: lineProfile,
      user: {
        uid: lineProfile.userId,
        displayName: lineProfile.displayName,
        photoURL: lineProfile.pictureUrl,
        role: 'seeker',
      },
    });

  } catch (error: any) {
    console.error('❌ Seeker LIFF token error:', error);
    
    if (error.response) {
      console.error('LINE API error response:', error.response.data);
      return res.status(400).json({ 
        message: 'LINE authentication failed',
        details: error.response.data 
      });
    }
    
    res.status(500).json({ message: error.message || 'Authentication failed' });
  }
});

// POST /api/auth/employer-liff-token
router.post('/employer-liff-token', async (req: Request, res: Response) => {
  try {
    const { accessToken, role = 'employer' } = req.body;
    console.log('📨 Employer LIFF token exchange:', { hasAccessToken: !!accessToken, role });

    if (!accessToken) {
      return res.status(400).json({ message: 'Missing LIFF access token' });
    }

    // Get LINE profile using LIFF access token
    const profileResponse = await axios.get('https://api.line.me/v2/profile', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const lineProfile = profileResponse.data;
    console.log('👤 Got LINE profile for employer:', lineProfile.displayName);

    // Create/update Firebase user
    const auth = getAuth();
    const db = getDb();
    
    let userRecord;
    try {
      userRecord = await auth.getUser(lineProfile.userId);
    } catch (error: any) {
      if (error.code === 'auth/user-not-found') {
        userRecord = await auth.createUser({
          uid: lineProfile.userId,
          displayName: lineProfile.displayName,
          photoURL: lineProfile.pictureUrl,
        });
        console.log('✅ Created new Firebase user for employer');
      } else {
        throw error;
      }
    }

    // Save/update user data in EmployerUsers collection
    await db.collection('EmployerUsers').doc(lineProfile.userId).set({
      uid: lineProfile.userId,
      displayName: lineProfile.displayName,
      pictureUrl: lineProfile.pictureUrl,
      statusMessage: lineProfile.statusMessage || null,
      role: 'employer',
      provider: 'line',
      lastLoginAt: admin.firestore.FieldValue.serverTimestamp(),
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    }, { merge: true });

    // Create Firebase custom token
    const firebaseToken = await auth.createCustomToken(lineProfile.userId, {
      role: 'employer',
      provider: 'line',
    });

    console.log('✅ Employer LIFF authentication successful');
    res.json({
      firebaseToken,
      profile: lineProfile,
      user: {
        uid: lineProfile.userId,
        displayName: lineProfile.displayName,
        photoURL: lineProfile.pictureUrl,
        role: 'employer',
      },
    });

  } catch (error: any) {
    console.error('❌ Employer LIFF token error:', error);
    
    if (error.response) {
      console.error('LINE API error response:', error.response.data);
      return res.status(400).json({ 
        message: 'LINE authentication failed',
        details: error.response.data 
      });
    }
    
    res.status(500).json({ message: error.message || 'Authentication failed' });
  }
});

// POST /api/auth/employer-line-callback
router.post('/employer-line-callback', async (req: Request, res: Response) => {
  try {
    const { code, redirectUri, role = 'employer', state } = req.body as { code?: string; redirectUri?: string; role?: 'employer'; state?: string };
    console.log('📨 Employer LINE OAuth callback:', { hasCode: !!code, redirectUri, role, hasState: !!state });

    if (!code) {
      return res.status(400).json({ message: 'Missing authorization code' });
    }

    // Validate state from cookie
    const cookies = parseCookies(req.headers.cookie as string | undefined);
    if (!state || !cookies.oauth_state || cookies.oauth_state !== state) {
      return res.status(400).json({ message: 'Invalid state' });
    }

    const lineChannelId = process.env.VITE_LINE_CHANNEL_ID || process.env.LINE_CHANNEL_ID;
    const lineChannelSecret = process.env.LINE_CHANNEL_SECRET;
    
    if (!lineChannelId || !lineChannelSecret) {
      console.error('Missing LINE channel configuration');
      return res.status(500).json({ message: 'Server configuration error' });
    }

    // Exchange code for access token from LINE
    const tokenRequestData: any = {
      grant_type: 'authorization_code',
      code,
      redirect_uri: redirectUri,
      client_id: lineChannelId,
      client_secret: lineChannelSecret,
    };

    // PKCE: include code_verifier if present
    const codeVerifier = cookies.pkce_verifier;
    if (codeVerifier) {
      tokenRequestData.code_verifier = codeVerifier;
    }

    console.log('🔄 Requesting LINE access token for employer with:', {
      grant_type: tokenRequestData.grant_type,
      hasCode: !!code,
      redirect_uri: tokenRequestData.redirect_uri,
      client_id: tokenRequestData.client_id,
      hasSecret: !!lineChannelSecret
    });

    const tokenResponse = await axios.post('https://api.line.me/oauth2/v2.1/token', 
      new URLSearchParams(tokenRequestData),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );

    if (!tokenResponse.data.access_token) {
      throw new Error('Failed to get access token from LINE');
    }

    // Use access token to get profile
    const profileResponse = await axios.get('https://api.line.me/v2/profile', {
      headers: {
        Authorization: `Bearer ${tokenResponse.data.access_token}`,
      },
    });

    const lineProfile = profileResponse.data;
    console.log('👤 Got LINE profile for employer:', lineProfile.displayName);

    // Create Firebase user
    const auth = getAuth();
    const db = getDb();
    
    let userRecord;
    try {
      userRecord = await auth.getUser(lineProfile.userId);
    } catch (error: any) {
      if (error.code === 'auth/user-not-found') {
        userRecord = await auth.createUser({
          uid: lineProfile.userId,
          displayName: lineProfile.displayName,
          photoURL: lineProfile.pictureUrl,
        });
        console.log('✅ Created new Firebase user for employer');
      } else {
        throw error;
      }
    }

    // Save/update user data in EmployerUsers Firestore collection
    await db.collection('EmployerUsers').doc(lineProfile.userId).set({
      uid: lineProfile.userId,
      displayName: lineProfile.displayName,
      pictureUrl: lineProfile.pictureUrl,
      statusMessage: lineProfile.statusMessage || null,
      role: 'employer',
      provider: 'line',
      lastLoginAt: admin.firestore.FieldValue.serverTimestamp(),
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    }, { merge: true });

    // Create Firebase custom token
    const firebaseToken = await auth.createCustomToken(lineProfile.userId, {
      role: 'employer',
      provider: 'line',
    });

    // Clear validation cookies
    res.append('Set-Cookie', 'oauth_state=; Path=/; Max-Age=0; SameSite=Lax; HttpOnly');
    res.append('Set-Cookie', 'pkce_verifier=; Path=/; Max-Age=0; SameSite=Lax; HttpOnly');

    console.log('✅ Employer LINE authentication successful');
    res.json({
      firebaseToken,
      profile: lineProfile,
      user: {
        uid: lineProfile.userId,
        displayName: lineProfile.displayName,
        photoURL: lineProfile.pictureUrl,
        role: 'employer',
      },
    });

  } catch (error: any) {
    console.error('❌ Employer LINE callback error:', error);
    
    if (error.response) {
      console.error('LINE API error response:', error.response.data);
      return res.status(400).json({ 
        message: 'LINE authentication failed',
        details: error.response.data 
      });
    }
    
    res.status(500).json({ message: error.message || 'Authentication failed' });
  }
});

export default router;
