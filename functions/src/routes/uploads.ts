import { Router, Request, Response } from 'express';
import { getDb, getStorage } from '../firebase';
import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';

const router = Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } });

// POST /api/uploads/profile - upload profile image for a user
router.post('/profile', upload.single('file'), async (req: Request, res: Response) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
    const { userId } = req.body as { userId?: string };
    const file = req.file as Express.Multer.File;

    const timestamp = Date.now();
    const random = Math.random().toString(36).slice(2, 10);
    const ext = (file.originalname.split('.').pop() || 'jpg').toLowerCase();
    const path = `uploads/profiles/${userId || 'anonymous'}/${timestamp}_${random}.${ext}`;

    const storage = getStorage();
    const gcsFile = storage.bucket().file(path);
    const token = uuidv4();
    await gcsFile.save(file.buffer, {
      contentType: file.mimetype || 'application/octet-stream',
      resumable: false,
      metadata: { cacheControl: 'public, max-age=31536000, immutable', metadata: { firebaseStorageDownloadTokens: token } },
    } as any);

    const publicUrl = `https://firebasestorage.googleapis.com/v0/b/${storage.bucket().name}/o/${encodeURIComponent(path)}?alt=media&token=${token}`;
    return res.status(200).json({ url: publicUrl, path, contentType: file.mimetype });
  } catch (error: any) {
    console.error('POST /api/uploads/profile error:', error);
    return res.status(500).json({ message: error.message });
  }
});

// POST /api/uploads/general - generic uploader for other images
router.post('/general', upload.single('file'), async (req: Request, res: Response) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
    const { folder } = req.body as { folder?: string };
    const safeFolder = (folder || 'misc').replace(/[^a-zA-Z0-9/_-]+/g, '-');
    const file = req.file as Express.Multer.File;

    const timestamp = Date.now();
    const random = Math.random().toString(36).slice(2, 10);
    const ext = (file.originalname.split('.').pop() || 'jpg').toLowerCase();
    const path = `uploads/${safeFolder}/${timestamp}_${random}.${ext}`;

    const storage = getStorage();
    const gcsFile = storage.bucket().file(path);
    const token = uuidv4();
    await gcsFile.save(file.buffer, {
      contentType: file.mimetype || 'application/octet-stream',
      resumable: false,
      metadata: { cacheControl: 'public, max-age=31536000, immutable', metadata: { firebaseStorageDownloadTokens: token } },
    } as any);

    const publicUrl = `https://firebasestorage.googleapis.com/v0/b/${storage.bucket().name}/o/${encodeURIComponent(path)}?alt=media&token=${token}`;
    return res.status(200).json({ url: publicUrl, path, contentType: file.mimetype });
  } catch (error: any) {
    console.error('POST /api/uploads/general error:', error);
    return res.status(500).json({ message: error.message });
  }
});

export default router;


