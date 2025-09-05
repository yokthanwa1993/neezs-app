"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const router = express_1.default.Router();
// Ensure logs directory exists
const logsDir = path_1.default.join(process.cwd(), 'logs');
if (!fs_1.default.existsSync(logsDir)) {
    fs_1.default.mkdirSync(logsDir, { recursive: true });
}
// POST /api/logs/write - Write log entry to file
router.post('/write', async (req, res) => {
    try {
        const { logFile, entry } = req.body;
        if (!logFile || !entry) {
            return res.status(400).json({ error: 'logFile and entry are required' });
        }
        const logPath = path_1.default.join(logsDir, logFile);
        // Append log entry to file
        fs_1.default.appendFileSync(logPath, entry);
        res.json({ success: true, message: 'Log written successfully' });
    }
    catch (error) {
        console.error('Error writing log:', error);
        res.status(500).json({ error: 'Failed to write log' });
    }
});
// GET /api/logs/:filename - Read log file
router.get('/:filename', async (req, res) => {
    try {
        const { filename } = req.params;
        const logPath = path_1.default.join(logsDir, filename);
        if (!fs_1.default.existsSync(logPath)) {
            return res.json({ content: '' }); // Return empty content instead of 404
        }
        const content = fs_1.default.readFileSync(logPath, 'utf8');
        res.json({ content });
    }
    catch (error) {
        console.error('Error reading log:', error);
        res.status(500).json({ error: 'Failed to read log' });
    }
});
// POST /api/logs/clear/:filename - Clear log file
router.post('/clear/:filename', async (req, res) => {
    try {
        const { filename } = req.params;
        const logPath = path_1.default.join(logsDir, filename);
        // Clear the file by writing empty string
        fs_1.default.writeFileSync(logPath, '');
        res.json({ success: true, message: 'Log file cleared successfully' });
    }
    catch (error) {
        console.error('Error clearing log:', error);
        res.status(500).json({ error: 'Failed to clear log' });
    }
});
exports.default = router;
//# sourceMappingURL=logs.js.map