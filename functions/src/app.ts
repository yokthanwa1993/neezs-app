import express, { Request, Response } from 'express';
import cors from 'cors';
import './firebase';
import authRoutes from './routes/auth';
import jobRoutes from './routes/jobs';
import seekerRoutes from './routes/seekers';
import imageRoutes from './routes/images';
import uploadRoutes from './routes/uploads';
import logRoutes from './routes/logs';

const app = express();

// Permissive CORS for GitHub Codespaces debugging
app.use((req, res, next) => {
  console.log(`[CORS] Received request: ${req.method} ${req.path}`);
  console.log(`[CORS] Origin: ${req.headers.origin}`);
  console.log(`[CORS] Referer: ${req.headers.referer}`);
  
  // For debugging: Allow ALL origins temporarily
  const origin = req.headers.origin || req.headers.referer || '*';
  console.log(`[CORS] Setting Access-Control-Allow-Origin to: ${origin}`);
  
  res.setHeader('Access-Control-Allow-Origin', origin);
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    console.log('[CORS] Responding to preflight request with 204');
    return res.sendStatus(204);
  }

  next();
});

// Apply JSON parser only for non-multipart requests so it won't consume multipart bodies
app.use((req, res, next) => {
  const contentType = (req.headers['content-type'] || '').toLowerCase();
  if (contentType.startsWith('multipart/form-data')) {
    return next();
  }
  return express.json()(req, res, next);
});

// Routers
app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/seekers', seekerRoutes);
app.use('/api/uploads', uploadRoutes);
app.use('/api/images', imageRoutes);
app.use('/api/logs', logRoutes);

app.get('/', (req: Request, res: Response) => {
  res.status(200).json({ status: 'ok', message: 'Neeiz API is running!' });
});

export default app;


