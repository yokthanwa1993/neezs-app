"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const firebase_1 = require("../firebase");
const axios_1 = __importDefault(require("axios"));
const router = (0, express_1.Router)();
// GET /api/images?path=<full_storage_path>
// This acts as a CORS proxy for Firebase Storage images.
router.get('/', async (req, res) => {
    try {
        const path = req.query.path;
        if (!path || !path.startsWith('uploads/')) {
            return res.status(400).json({ message: 'A valid storage path starting with "uploads/" is required.' });
        }
        const storage = (0, firebase_1.getStorage)();
        const file = storage.bucket().file(path);
        const [exists] = await file.exists();
        if (!exists) {
            return res.status(404).json({ message: 'Image not found.' });
        }
        // Get a signed URL to access the private object
        const [signedUrl] = await file.getSignedUrl({
            action: 'read',
            expires: '03-09-2491' // A long, long time in the future
        });
        // Pipe the image from the signed URL to the response
        const imageResponse = await axios_1.default.get(signedUrl, { responseType: 'stream' });
        res.setHeader('Content-Type', imageResponse.headers['content-type'] || 'image/jpeg');
        res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
        imageResponse.data.pipe(res);
    }
    catch (error) {
        console.error('GET /api/images proxy error:', error);
        res.status(500).json({ message: error.message });
    }
});
exports.default = router;
//# sourceMappingURL=images.js.map