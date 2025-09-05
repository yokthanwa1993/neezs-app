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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStorage = exports.getAuth = exports.getDb = void 0;
const admin = __importStar(require("firebase-admin"));
let app;
try {
    if (!admin.apps.length) {
        const saBase64 = process.env.FIREBASE_SERVICE_ACCOUNT_BASE64;
        const projectId = process.env.FIREBASE_PROJECT_ID;
        const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
        const privateKeyFromEnv = process.env.FIREBASE_PRIVATE_KEY;
        if (saBase64) {
            try {
                const jsonText = Buffer.from(saBase64, 'base64').toString('utf8');
                const json = JSON.parse(jsonText);
                app = admin.initializeApp({
                    credential: admin.credential.cert(json),
                    storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
                });
                console.log('✅ Firebase Admin SDK initialized successfully from FIREBASE_SERVICE_ACCOUNT_BASE64.');
            }
            catch (e) {
                console.warn('⚠️ FIREBASE_SERVICE_ACCOUNT_BASE64 present but invalid; falling back to individual env vars. Error:', e);
            }
        }
        if (!admin.apps.length && (!projectId || !clientEmail || !privateKeyFromEnv)) {
            console.warn('Firebase service account environment variables are not set. Firebase Admin SDK will not be initialized.');
        }
        else if (!admin.apps.length) {
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
    }
    else {
        app = admin.app();
        console.log('✅ Firebase Admin SDK already initialized.');
    }
}
catch (error) {
    console.error('❌ Failed to initialize Firebase Admin SDK:', error);
}
const getDb = () => {
    if (!app)
        throw new Error('Firebase app not initialized');
    return admin.firestore();
};
exports.getDb = getDb;
const getAuth = () => {
    if (!app)
        throw new Error('Firebase app not initialized');
    return admin.auth();
};
exports.getAuth = getAuth;
const getStorage = () => {
    if (!app)
        throw new Error('Firebase app not initialized');
    return admin.storage();
};
exports.getStorage = getStorage;
exports.default = admin;
//# sourceMappingURL=firebase.js.map