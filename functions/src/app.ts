import express, { Request, Response } from 'express';
import cors from 'cors';
import './firebase';
import { getAllowedOrigins } from './utils/domains';
import authRoutes from './routes/auth';
import jobRoutes from './routes/jobs';
import seekerRoutes from './routes/seekers';
import imageRoutes from './routes/images';
import uploadRoutes from './routes/uploads';
import logRoutes from './routes/logs';
import userRoutes from './routes/users';
import applicationRoutes from './routes/applications';

const app = express();

// Centralized CORS using BASE_DOMAIN-derived origins
app.use((req, res, next) => {
  const allowList = getAllowedOrigins();
  const origin = (req.headers.origin as string | undefined) || undefined;
  const referer = (req.headers.referer as string | undefined) || undefined;
  const candidate = origin || (referer ? referer.replace(/\/$/, '') : undefined);

  if (candidate && allowList.some((o) => candidate.startsWith(o))) {
    res.setHeader('Access-Control-Allow-Origin', origin || candidate);
    res.setHeader('Vary', 'Origin');
  }
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  if (req.method === 'OPTIONS') return res.sendStatus(204);
  next();
});

// Apply JSON parser only for non-multipart requests so it won't consume multipart bodies
app.use((req, res, next) => {
  const contentType = (req.headers['content-type'] || '').toLowerCase();
  if (contentType.startsWith('multipart/form-data')) {
    return next();
  }
  // Increase JSON body limit to handle data URLs (e.g., image base64 uploads)
  return express.json({ limit: '20mb' })(req, res, next);
});

// Routers
app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/seekers', seekerRoutes);
app.use('/api/uploads', uploadRoutes);
app.use('/api/images', imageRoutes);
app.use('/api/logs', logRoutes);
app.use('/api/users', userRoutes);
app.use('/api/applications', applicationRoutes);

app.get('/', (req: Request, res: Response) => {
  res.status(200).json({ status: 'ok', message: 'Neeiz API is running!' });
});

export default app;
