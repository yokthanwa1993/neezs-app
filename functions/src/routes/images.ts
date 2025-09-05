import { Router, Request, Response } from 'express';
import { getStorage } from '../firebase';
import axios from 'axios';

const router = Router();

// GET /api/images?path=<full_storage_path>
// This acts as a CORS proxy for Firebase Storage images.
router.get('/', async (req: Request, res: Response) => {
  try {
    const path = req.query.path as string;
    const allowedPrefixes = ['uploads/', 'jobs/'];
    if (!path || !allowedPrefixes.some((p) => path.startsWith(p))) {
      return res.status(400).json({ message: 'A valid storage path starting with one of: "uploads/", "jobs/" is required.' });
    }

    const storage = getStorage();
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
    const imageResponse = await axios.get(signedUrl, { responseType: 'stream' });
    
    res.setHeader('Content-Type', imageResponse.headers['content-type'] || 'image/jpeg');
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    
    imageResponse.data.pipe(res);

  } catch (error: any) {
    console.error('GET /api/images proxy error:', error);
    res.status(500).json({ message: error.message });
  }
});

export default router;
