import { Router, Request, Response } from 'express';
import { getDb, getStorage } from '../firebase';
import multer from 'multer';
import { randomUUID } from 'crypto';

const router = Router();
const upload = multer({ 
  storage: multer.memoryStorage(), 
  limits: { 
    fileSize: 25 * 1024 * 1024,
    fieldSize: 25 * 1024 * 1024
  },
  fileFilter: (req, file, cb) => {
    // Accept images only
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

// GET /api/jobs
router.get('/', async (req: Request, res: Response) => {
  try {
    let db;
    try {
      db = getDb();
    } catch (e: any) {
      // Graceful dev fallback when Firebase Admin isn't configured
      if (process.env.NODE_ENV !== 'production') {
        console.warn('GET /api/jobs: Firebase not initialized; returning empty list in development.');
        return res.status(200).json({ items: [] });
      }
      throw e;
    }
    const limit = Number(req.query.limit || 100);
    const snapshot = await db
      .collection('jobs')
      .where('status', '==', 'active')
      .orderBy('createdAt', 'desc')
      .limit(limit)
      .get();

    const items = snapshot.docs.map((doc: FirebaseFirestore.QueryDocumentSnapshot) => ({ id: doc.id, ...doc.data() }));
    res.set('Cache-Control', 'no-store');
    res.status(200).json({ items });
  } catch (error: any) {
    console.error('GET /api/jobs error:', error);
    res.status(500).json({ message: error.message });
  }
});

// GET /api/jobs/:id
router.get('/:id', async (req: Request, res: Response) => {
  try {
    let db;
    try {
      db = getDb();
    } catch (e: any) {
      if (process.env.NODE_ENV !== 'production') {
        console.warn('GET /api/jobs/:id: Firebase not initialized; returning 404 in development.');
        return res.status(404).json({ message: 'Job not found' });
      }
      throw e;
    }
    const id = req.params.id;
    const doc = await db.collection('jobs').doc(id).get();
    if (!doc.exists) {
      return res.status(404).json({ message: 'Job not found' });
    }
    res.set('Cache-Control', 'no-store');
    return res.status(200).json({ id: doc.id, ...doc.data() });
  } catch (error: any) {
    console.error('GET /api/jobs/:id error:', error);
    res.status(500).json({ message: error.message });
  }
});

// POST /api/jobs/upload - upload image to Firebase Storage and return public URL
router.post('/upload', (req: Request, res: Response) => {
  // Set CORS headers
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  const uploadHandler = upload.single('file');
  
  uploadHandler(req, res, async (err: any) => {
    try {
      if (err) {
        console.error('Multer error:', err);
        return res.status(400).json({ message: 'File upload error: ' + err.message });
      }
      
      if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
      }
      
      const file = req.file as Express.Multer.File;
      console.log('File received:', { 
        originalname: file.originalname, 
        mimetype: file.mimetype, 
        size: file.size 
      });

      const timestamp = Date.now();
      const random = Math.random().toString(36).slice(2, 10);
      const ext = file.originalname.split('.').pop() || 'jpg';
      const path = `uploads/jobs/${timestamp}_${random}.${ext}`;

      const storage = getStorage();
      const gcsFile = storage.bucket().file(path);
      const token = randomUUID();
      
      await gcsFile.save(file.buffer, {
        contentType: file.mimetype || 'application/octet-stream',
        resumable: false,
        metadata: {
          cacheControl: 'no-store',
          metadata: { firebaseStorageDownloadTokens: token },
        },
      } as any);

      const publicUrl = `https://firebasestorage.googleapis.com/v0/b/${storage.bucket().name}/o/${encodeURIComponent(path)}?alt=media&token=${token}`;
      console.log('File uploaded successfully:', { path, publicUrl });
      
      return res.status(200).json({ url: publicUrl, path, contentType: file.mimetype });
    } catch (error: any) {
      console.error('POST /api/jobs/upload error:', error);
      res.status(500).json({ message: error.message });
    }
  });
});

// POST /api/jobs/upload-json - upload image via base64 JSON payload
router.post('/upload-json', async (req: Request, res: Response) => {
  try {
    const { fileBase64, fileName, contentType } = (req.body || {}) as {
      fileBase64?: string;
      fileName?: string;
      contentType?: string;
    };
    if (!fileBase64) return res.status(400).json({ message: 'fileBase64 is required' });

    const base64Data = fileBase64.includes('base64,')
      ? fileBase64.split('base64,')[1]
      : fileBase64;

    const buffer = Buffer.from(base64Data, 'base64');
    const timestamp = Date.now();
    const random = Math.random().toString(36).slice(2, 10);
    const extFromName = (fileName?.split('.').pop() || '').toLowerCase();
    const extFromType = (contentType || '').split('/').pop() || '';
    const ext = (extFromName || extFromType || 'jpg').replace(/[^a-z0-9]+/gi, '');
    const path = `uploads/jobs/${timestamp}_${random}.${ext}`;

    const storage = getStorage();
    const gcsFile = storage.bucket().file(path);
    const token = randomUUID();
    await gcsFile.save(buffer, {
      contentType: contentType || 'application/octet-stream',
      resumable: false,
      metadata: {
        cacheControl: 'no-store',
        metadata: { firebaseStorageDownloadTokens: token },
      },
    } as any);

    const publicUrl = `https://firebasestorage.googleapis.com/v0/b/${storage.bucket().name}/o/${encodeURIComponent(path)}?alt=media&token=${token}`;
    return res.status(200).json({ url: publicUrl, path, contentType: contentType || 'application/octet-stream' });
  } catch (error: any) {
    console.error('POST /api/jobs/upload-json error:', error);
    res.status(500).json({ message: error.message });
  }
});

// POST /api/jobs
router.post('/', async (req: Request, res: Response) => {
  try {
    const db = getDb();
    const { title, description, category, location, salary, jobType, status, employerId, images } = req.body;

    console.log('Received /api/jobs POST with body:', req.body);

    if (!title || !description) {
      return res.status(400).json({ message: 'Missing required fields: title, description' });
    }

    const payload = {
      title,
      description,
      category: category || '',
      location: location || '',
      salary: Number(salary || 0),
      jobType: jobType || 'full-time',
      status: status || 'active',
      employerId: employerId || 'unknown',
      images: Array.isArray(images) ? images.filter(Boolean) : [],
      createdAt: new Date(),
    } as const;

    const ref = await db.collection('jobs').add(payload);
    const snap = await ref.get();
    res.set('Cache-Control', 'no-store');
    res.status(201).json({ id: ref.id, ...snap.data() });
  } catch (error: any) {
    console.error('POST /api/jobs error:', error);
    res.status(500).json({ message: error.message });
  }
});

export default router;

