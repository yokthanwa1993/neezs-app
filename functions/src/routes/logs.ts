import express from 'express';
import fs from 'fs';
import path from 'path';

const router = express.Router();

// Ensure logs directory exists (resolve relative to compiled lib folder)
// __dirname at runtime is expected to be functions/lib/routes
// So ../../logs reliably points to functions/logs regardless of cwd
const logsDir = path.resolve(__dirname, '..', '..', 'logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// POST /api/logs/write - Write log entry to file
router.post('/write', (req, res) => {
  const { logFile, entry } = req.body || {};

  if (!logFile || !entry) {
    return res.status(400).json({ error: 'logFile and entry are required' });
  }

  // Prevent path traversal; only allow file name within logs directory
  const safeFile = path.basename(String(logFile));
  const logPath = path.join(logsDir, safeFile);

  // Write asynchronously without blocking the event loop
  // Respond immediately to avoid proxy timeouts from high-frequency logging
  setImmediate(() => {
    fs.promises
      .appendFile(logPath, String(entry))
      .catch((error) => {
        console.error('Error writing log:', error);
      });
  });

  return res.status(202).json({ success: true, message: 'Log accepted' });
});

// GET /api/logs/:filename - Read log file
router.get('/:filename', async (req, res) => {
  try {
    const { filename } = req.params;
    const logPath = path.join(logsDir, filename);
    
    if (!fs.existsSync(logPath)) {
      return res.json({ content: '' }); // Return empty content instead of 404
    }
    
    const content = fs.readFileSync(logPath, 'utf8');
    res.json({ content });
  } catch (error) {
    console.error('Error reading log:', error);
    res.status(500).json({ error: 'Failed to read log' });
  }
});

// POST /api/logs/clear/:filename - Clear log file
router.post('/clear/:filename', async (req, res) => {
  try {
    const { filename } = req.params;
    const logPath = path.join(logsDir, filename);
    
    // Clear the file by writing empty string
    fs.writeFileSync(logPath, '');
    
    res.json({ success: true, message: 'Log file cleared successfully' });
  } catch (error) {
    console.error('Error clearing log:', error);
    res.status(500).json({ error: 'Failed to clear log' });
  }
});

export default router;
