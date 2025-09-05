import dotenv from 'dotenv';
import path from 'path';

// Load .env file from the root directory. 
// The path is relative to the compiled 'lib' folder.
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

import app from './app';

const port = Number(process.env.PORT) || 5001;

console.log('🚀 Starting Express server for local development...');

app.listen(port, '0.0.0.0', () => {
  console.log(`✅ Backend server running on port ${port}`);
  console.log(`🌐 API endpoints available at: http://localhost:${port}/api/`);
  console.log(' Available routes:');
  console.log(`   POST /api/auth/line - LINE authentication`);
  console.log(`   GET  /api/jobs - Job listings`);
  console.log(`   GET  /api/seekers - Seeker profiles`);
});