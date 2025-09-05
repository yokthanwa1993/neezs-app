import { Router, Request, Response } from 'express';
import { getAuth, getDb } from '../firebase';

const router = Router();

// POST /api/users/phone-verified
// Body: { phoneNumber: string } ; Auth: Bearer <Firebase ID token> or body.idToken
router.post('/phone-verified', async (req: Request, res: Response) => {
  try {
    const authHeader = (req.headers.authorization || '').toString();
    const bearer = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : undefined;
    const idToken = bearer || (req.body?.idToken as string | undefined);
    const phoneNumber = (req.body?.phoneNumber as string | undefined) || '';
    if (!idToken) return res.status(401).json({ message: 'Missing ID token' });
    const auth = getAuth();
    const db = getDb();
    const decoded = await auth.verifyIdToken(idToken);
    const uid = decoded.uid;
    const payload = {
      phoneNumber,
      phoneVerified: true,
      phoneVerifiedAt: new Date(),
    };
    // Write to primary users collection
    await db.collection('users').doc(uid).set(payload, { merge: true });
    // Also mirror to SeekerUsers collection for seeker-specific views
    await db.collection('SeekerUsers').doc(uid).set(payload, { merge: true });
    return res.status(200).json({ ok: true });
  } catch (error: any) {
    console.error('POST /api/users/phone-verified error:', error);
    return res.status(500).json({ message: error.message || 'Internal Server Error' });
  }
});

export default router;
