"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const firebase_1 = require("../firebase");
const firebase_2 = __importDefault(require("../firebase"));
const axios_1 = __importDefault(require("axios"));
const functions = __importStar(require("firebase-functions"));
const router = (0, express_1.Router)();
router.post('/line', async (req, res) => {
    try {
        const { idToken, role, profile } = req.body;
        console.log('📨 Received auth request:', { role, hasIdToken: !!idToken, hasProfile: !!profile });
        if (!role || !profile) {
            return res.status(400).json({ error: 'Missing role or profile' });
        }
        console.log('👤 Using LINE profile from LIFF:', profile);
        // ใช้ profile ที่ได้จาก LIFF โดยตรงแทนการ verify กับ LINE API
        // เพราะ LIFF SDK จัดการ verification ให้แล้ว
        const lineProfile = {
            sub: profile.userId,
            name: profile.displayName,
            picture: profile.pictureUrl || null,
            email: null // LIFF profile ไม่มี email
        };
        console.log('✅ Using LINE profile directly from LIFF SDK');
        const { sub: lineUserId, name, picture, email } = lineProfile;
        const auth = (0, firebase_1.getAuth)();
        const db = (0, firebase_1.getDb)();
        let userRecord;
        try {
            userRecord = await auth.getUser(lineUserId);
        }
        catch (error) {
            if (error.code === 'auth/user-not-found') {
                const userToCreate = {
                    uid: lineUserId,
                    displayName: name,
                    photoURL: picture,
                };
                if (email) {
                    userToCreate.email = email;
                    userToCreate.emailVerified = true;
                }
                userRecord = await auth.createUser(userToCreate);
            }
            else {
                throw error;
            }
        }
        const userDocRef = db.collection('users').doc(userRecord.uid);
        await userDocRef.set({
            lineUserId: lineUserId,
            displayName: name,
            pictureUrl: picture,
            email: email || null,
            role: role,
            lastLogin: new Date(),
        }, { merge: true });
        const customToken = await auth.createCustomToken(userRecord.uid);
        console.log('🎟️ Custom token created successfully');
        res.json({
            token: customToken,
            user: {
                uid: userRecord.uid,
                displayName: name,
                pictureUrl: picture,
                email: email || null,
                role: role
            }
        });
    }
    catch (error) {
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
router.post('/sessionLogin', async (req, res) => {
    try {
        const { idToken } = req.body;
        const auth = (0, firebase_1.getAuth)();
        const expiresIn = 60 * 60 * 24 * 5 * 1000; // 5 days
        const sessionCookie = await auth.createSessionCookie(idToken, { expiresIn });
        const options = { maxAge: expiresIn, httpOnly: true, secure: process.env.NODE_ENV === 'production' };
        res.cookie('session', sessionCookie, options);
        res.status(200).json({ status: 'success' });
    }
    catch (error) {
        console.error('Session Login Error:', error);
        res.status(401).send('UNAUTHORIZED REQUEST!');
    }
});
router.post('/sessionLogout', (req, res) => {
    res.clearCookie('session');
    res.status(200).json({ status: 'success' });
});
// POST /api/auth/line/logout-notify
router.post('/line/logout-notify', async (req, res) => {
    try {
        const { lineUserId, message = 'Logout' } = req.body;
        if (!lineUserId) {
            return res.status(400).json({ message: 'lineUserId is required' });
        }
        const channelAccessToken = process.env.LINE_CHANNEL_ACCESS_TOKEN || functions.config?.()?.line?.channel_access_token;
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
        return res.status(200).json({ ok: true });
    }
    catch (error) {
        console.error('Logout notify error:', error);
        return res.status(500).json({ message: error.message });
    }
});
// POST /api/auth/line-login
router.post('/line-login', async (req, res) => {
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
    }
    catch (error) {
        console.error('LINE login error:', error);
        res.status(500).json({ message: error.message });
    }
});
// GET /api/auth/line-profile
router.get('/line-profile', async (req, res) => {
    try {
        const { lineToken } = req.query;
        if (!lineToken) {
            return res.status(400).json({ message: 'Missing LINE token' });
        }
        // TODO: Get LINE profile from LINE API
        // TODO: Return LINE profile data
        res.status(200).json({
            message: 'LINE profile retrieved',
            // profile: lineProfile
        });
    }
    catch (error) {
        console.error('LINE profile error:', error);
        res.status(500).json({ message: error.message });
    }
});
// POST /api/auth/seeker-line-callback
router.post('/seeker-line-callback', async (req, res) => {
    try {
        const { code, redirectUri, role = 'seeker' } = req.body;
        console.log('📨 Seeker LINE OAuth callback:', { hasCode: !!code, redirectUri, role });
        if (!code) {
            return res.status(400).json({ message: 'Missing authorization code' });
        }
        const lineChannelId = process.env.VITE_LINE_CHANNEL_ID || process.env.LINE_CHANNEL_ID;
        const lineChannelSecret = process.env.LINE_CHANNEL_SECRET;
        if (!lineChannelId || !lineChannelSecret) {
            console.error('Missing LINE channel configuration');
            return res.status(500).json({ message: 'Server configuration error' });
        }
        // แลก code กับ access token จาก LINE
        const tokenRequestData = {
            grant_type: 'authorization_code',
            code,
            redirect_uri: redirectUri,
            client_id: lineChannelId,
            client_secret: lineChannelSecret,
        };
        console.log('🔄 Requesting LINE access token with:', {
            grant_type: tokenRequestData.grant_type,
            hasCode: !!code,
            redirect_uri: tokenRequestData.redirect_uri,
            client_id: tokenRequestData.client_id,
            hasSecret: !!lineChannelSecret
        });
        const tokenResponse = await axios_1.default.post('https://api.line.me/oauth2/v2.1/token', new URLSearchParams(tokenRequestData), {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        });
        if (!tokenResponse.data.access_token) {
            throw new Error('Failed to get access token from LINE');
        }
        // ใช้ access token เพื่อดึง profile
        const profileResponse = await axios_1.default.get('https://api.line.me/v2/profile', {
            headers: {
                Authorization: `Bearer ${tokenResponse.data.access_token}`,
            },
        });
        const lineProfile = profileResponse.data;
        console.log('👤 Got LINE profile for seeker:', lineProfile.displayName);
        // สร้าง Firebase user
        const auth = (0, firebase_1.getAuth)();
        const db = (0, firebase_1.getDb)();
        let userRecord;
        try {
            userRecord = await auth.getUser(lineProfile.userId);
        }
        catch (error) {
            if (error.code === 'auth/user-not-found') {
                userRecord = await auth.createUser({
                    uid: lineProfile.userId,
                    displayName: lineProfile.displayName,
                    photoURL: lineProfile.pictureUrl,
                });
                console.log('✅ Created new Firebase user for seeker');
            }
            else {
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
            lastLoginAt: firebase_2.default.firestore.FieldValue.serverTimestamp(),
            createdAt: firebase_2.default.firestore.FieldValue.serverTimestamp(),
        }, { merge: true });
        // สร้าง Firebase custom token
        const firebaseToken = await auth.createCustomToken(lineProfile.userId, {
            role: 'seeker',
            provider: 'line',
        });
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
    }
    catch (error) {
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
router.post('/line-webhook', async (req, res) => {
    try {
        const { events } = req.body;
        if (!events || !Array.isArray(events) || events.length === 0) {
            return res.status(200).json({ message: 'No events to process' });
        }
        const channelAccessToken = process.env.LINE_CHANNEL_ACCESS_TOKEN || functions.config?.()?.line?.channel_access_token;
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
                }
                catch (replyError) {
                    console.error('Failed to send LINE reply:', replyError);
                }
            }
        }
        res.status(200).json({ message: 'Webhook processed' });
    }
    catch (error) {
        console.error('LINE webhook error:', error);
        res.status(500).json({ message: error.message });
    }
});
// POST /api/auth/seeker-liff-token
router.post('/seeker-liff-token', async (req, res) => {
    try {
        const { accessToken, role = 'seeker' } = req.body;
        console.log('📨 Seeker LIFF token exchange:', { hasAccessToken: !!accessToken, role });
        if (!accessToken) {
            return res.status(400).json({ message: 'Missing LIFF access token' });
        }
        // Get LINE profile using LIFF access token
        const profileResponse = await axios_1.default.get('https://api.line.me/v2/profile', {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        const lineProfile = profileResponse.data;
        console.log('👤 Got LINE profile for seeker:', lineProfile.displayName);
        // Create/update Firebase user
        const auth = (0, firebase_1.getAuth)();
        const db = (0, firebase_1.getDb)();
        let userRecord;
        try {
            userRecord = await auth.getUser(lineProfile.userId);
        }
        catch (error) {
            if (error.code === 'auth/user-not-found') {
                userRecord = await auth.createUser({
                    uid: lineProfile.userId,
                    displayName: lineProfile.displayName,
                    photoURL: lineProfile.pictureUrl,
                });
                console.log('✅ Created new Firebase user for seeker');
            }
            else {
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
            lastLoginAt: firebase_2.default.firestore.FieldValue.serverTimestamp(),
            createdAt: firebase_2.default.firestore.FieldValue.serverTimestamp(),
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
    }
    catch (error) {
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
router.post('/employer-liff-token', async (req, res) => {
    try {
        const { accessToken, role = 'employer' } = req.body;
        console.log('📨 Employer LIFF token exchange:', { hasAccessToken: !!accessToken, role });
        if (!accessToken) {
            return res.status(400).json({ message: 'Missing LIFF access token' });
        }
        // Get LINE profile using LIFF access token
        const profileResponse = await axios_1.default.get('https://api.line.me/v2/profile', {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        const lineProfile = profileResponse.data;
        console.log('👤 Got LINE profile for employer:', lineProfile.displayName);
        // Create/update Firebase user
        const auth = (0, firebase_1.getAuth)();
        const db = (0, firebase_1.getDb)();
        let userRecord;
        try {
            userRecord = await auth.getUser(lineProfile.userId);
        }
        catch (error) {
            if (error.code === 'auth/user-not-found') {
                userRecord = await auth.createUser({
                    uid: lineProfile.userId,
                    displayName: lineProfile.displayName,
                    photoURL: lineProfile.pictureUrl,
                });
                console.log('✅ Created new Firebase user for employer');
            }
            else {
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
            lastLoginAt: firebase_2.default.firestore.FieldValue.serverTimestamp(),
            createdAt: firebase_2.default.firestore.FieldValue.serverTimestamp(),
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
    }
    catch (error) {
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
router.post('/employer-line-callback', async (req, res) => {
    try {
        const { code, redirectUri, role = 'employer' } = req.body;
        console.log('📨 Employer LINE OAuth callback:', { hasCode: !!code, redirectUri, role });
        if (!code) {
            return res.status(400).json({ message: 'Missing authorization code' });
        }
        const lineChannelId = process.env.VITE_LINE_CHANNEL_ID || process.env.LINE_CHANNEL_ID;
        const lineChannelSecret = process.env.LINE_CHANNEL_SECRET;
        if (!lineChannelId || !lineChannelSecret) {
            console.error('Missing LINE channel configuration');
            return res.status(500).json({ message: 'Server configuration error' });
        }
        // Exchange code for access token from LINE
        const tokenRequestData = {
            grant_type: 'authorization_code',
            code,
            redirect_uri: redirectUri,
            client_id: lineChannelId,
            client_secret: lineChannelSecret,
        };
        console.log('🔄 Requesting LINE access token for employer with:', {
            grant_type: tokenRequestData.grant_type,
            hasCode: !!code,
            redirect_uri: tokenRequestData.redirect_uri,
            client_id: tokenRequestData.client_id,
            hasSecret: !!lineChannelSecret
        });
        const tokenResponse = await axios_1.default.post('https://api.line.me/oauth2/v2.1/token', new URLSearchParams(tokenRequestData), {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        });
        if (!tokenResponse.data.access_token) {
            throw new Error('Failed to get access token from LINE');
        }
        // Use access token to get profile
        const profileResponse = await axios_1.default.get('https://api.line.me/v2/profile', {
            headers: {
                Authorization: `Bearer ${tokenResponse.data.access_token}`,
            },
        });
        const lineProfile = profileResponse.data;
        console.log('👤 Got LINE profile for employer:', lineProfile.displayName);
        // Create Firebase user
        const auth = (0, firebase_1.getAuth)();
        const db = (0, firebase_1.getDb)();
        let userRecord;
        try {
            userRecord = await auth.getUser(lineProfile.userId);
        }
        catch (error) {
            if (error.code === 'auth/user-not-found') {
                userRecord = await auth.createUser({
                    uid: lineProfile.userId,
                    displayName: lineProfile.displayName,
                    photoURL: lineProfile.pictureUrl,
                });
                console.log('✅ Created new Firebase user for employer');
            }
            else {
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
            lastLoginAt: firebase_2.default.firestore.FieldValue.serverTimestamp(),
            createdAt: firebase_2.default.firestore.FieldValue.serverTimestamp(),
        }, { merge: true });
        // Create Firebase custom token
        const firebaseToken = await auth.createCustomToken(lineProfile.userId, {
            role: 'employer',
            provider: 'line',
        });
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
    }
    catch (error) {
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
exports.default = router;
//# sourceMappingURL=auth.js.map