"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
require("./firebase");
const auth_1 = __importDefault(require("./routes/auth"));
const jobs_1 = __importDefault(require("./routes/jobs"));
const seekers_1 = __importDefault(require("./routes/seekers"));
const images_1 = __importDefault(require("./routes/images"));
const uploads_1 = __importDefault(require("./routes/uploads"));
const logs_1 = __importDefault(require("./routes/logs"));
const app = (0, express_1.default)();
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
    return express_1.default.json()(req, res, next);
});
// Routers
app.use('/api/auth', auth_1.default);
app.use('/api/jobs', jobs_1.default);
app.use('/api/seekers', seekers_1.default);
app.use('/api/uploads', uploads_1.default);
app.use('/api/images', images_1.default);
app.use('/api/logs', logs_1.default);
app.get('/', (req, res) => {
    res.status(200).json({ status: 'ok', message: 'Neeiz API is running!' });
});
exports.default = app;
//# sourceMappingURL=app.js.map