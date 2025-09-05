import { Router, Request, Response } from 'express';
import { getAuth, getDb } from '../firebase';

const router = Router();

// POST /api/applications
// Creates a job application document
router.post('/', async (req: Request, res: Response) => {
  try {
    const authHeader = (req.headers.authorization || '').toString();
    const bearer = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : undefined;
    const idToken = bearer || (req.body?.idToken as string | undefined);
    if (!idToken) return res.status(401).json({ message: 'Missing ID token' });

    const { jobId, bid, phoneNumber, idCardImageUrl, selectedCategories } = (req.body || {}) as {
      jobId?: string;
      bid?: number;
      phoneNumber?: string;
      idCardImageUrl?: string;
      selectedCategories?: string[];
    };

    if (!jobId) return res.status(400).json({ message: 'jobId is required' });
    if (!phoneNumber) return res.status(400).json({ message: 'phoneNumber is required' });

    const auth = getAuth();
    const db = getDb();
    const decoded = await auth.verifyIdToken(idToken);
    const uid = decoded.uid;

    const payload = {
      jobId,
      applicantUid: uid,
      bid: typeof bid === 'number' ? bid : null,
      phoneNumber,
      idCardImageUrl: idCardImageUrl || null,
      selectedCategories: Array.isArray(selectedCategories) ? selectedCategories : [],
      status: 'submitted',
      createdAt: new Date(),
      source: 'web',
    };

    const ref = await db.collection('applications').add(payload);
    const snap = await ref.get();
    return res.status(201).json({ id: ref.id, ...snap.data() });
  } catch (error: any) {
    console.error('POST /api/applications error:', error);
    return res.status(500).json({ message: error.message || 'Internal Server Error' });
  }
});

export default router;

