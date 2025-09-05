"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const firebase_1 = require("../firebase");
const multer_1 = __importDefault(require("multer"));
const uuid_1 = require("uuid");
const router = (0, express_1.Router)();
const upload = (0, multer_1.default)({ storage: multer_1.default.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } });
// POST /api/uploads/profile - upload profile image for a user
router.post('/profile', upload.single('file'), async (req, res) => {
    try {
        if (!req.file)
            return res.status(400).json({ message: 'No file uploaded' });
        const { userId } = req.body;
        const file = req.file;
        const timestamp = Date.now();
        const random = Math.random().toString(36).slice(2, 10);
        const ext = (file.originalname.split('.').pop() || 'jpg').toLowerCase();
        const path = `uploads/profiles/${userId || 'anonymous'}/${timestamp}_${random}.${ext}`;
        const storage = (0, firebase_1.getStorage)();
        const gcsFile = storage.bucket().file(path);
        const token = (0, uuid_1.v4)();
        await gcsFile.save(file.buffer, {
            contentType: file.mimetype || 'application/octet-stream',
            resumable: false,
            metadata: { cacheControl: 'public, max-age=31536000, immutable', metadata: { firebaseStorageDownloadTokens: token } },
        });
        const publicUrl = `https://firebasestorage.googleapis.com/v0/b/${storage.bucket().name}/o/${encodeURIComponent(path)}?alt=media&token=${token}`;
        return res.status(200).json({ url: publicUrl, path, contentType: file.mimetype });
    }
    catch (error) {
        console.error('POST /api/uploads/profile error:', error);
        return res.status(500).json({ message: error.message });
    }
});
// POST /api/uploads/general - generic uploader for other images
router.post('/general', upload.single('file'), async (req, res) => {
    try {
        if (!req.file)
            return res.status(400).json({ message: 'No file uploaded' });
        const { folder } = req.body;
        const safeFolder = (folder || 'misc').replace(/[^a-zA-Z0-9/_-]+/g, '-');
        const file = req.file;
        const timestamp = Date.now();
        const random = Math.random().toString(36).slice(2, 10);
        const ext = (file.originalname.split('.').pop() || 'jpg').toLowerCase();
        const path = `uploads/${safeFolder}/${timestamp}_${random}.${ext}`;
        const storage = (0, firebase_1.getStorage)();
        const gcsFile = storage.bucket().file(path);
        const token = (0, uuid_1.v4)();
        await gcsFile.save(file.buffer, {
            contentType: file.mimetype || 'application/octet-stream',
            resumable: false,
            metadata: { cacheControl: 'public, max-age=31536000, immutable', metadata: { firebaseStorageDownloadTokens: token } },
        });
        const publicUrl = `https://firebasestorage.googleapis.com/v0/b/${storage.bucket().name}/o/${encodeURIComponent(path)}?alt=media&token=${token}`;
        return res.status(200).json({ url: publicUrl, path, contentType: file.mimetype });
    }
    catch (error) {
        console.error('POST /api/uploads/general error:', error);
        return res.status(500).json({ message: error.message });
    }
});
exports.default = router;
//# sourceMappingURL=uploads.js.map