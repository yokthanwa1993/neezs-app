import * as functions from 'firebase-functions/v2/https';
import * as logger from 'firebase-functions/logger';
import { defineSecret } from 'firebase-functions/params';
import app from './app';

// Declare secrets so Firebase mounts them at runtime
// Use a non-reserved name (FIREBASE_* prefix is reserved by Google)
const SERVICE_ACCOUNT_BASE64 = defineSecret('SERVICE_ACCOUNT_BASE64');

export const api = functions.onRequest({
  cors: false,
  region: 'asia-southeast1',
  concurrency: 80,
  secrets: [SERVICE_ACCOUNT_BASE64],
}, (req, res) => {
  logger.info('Handling request', { path: req.path, method: req.method });
  return app(req, res);
});


