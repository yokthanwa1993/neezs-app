"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
// Load .env file from the root directory. 
// The path is relative to the compiled 'lib' folder.
dotenv_1.default.config({ path: path_1.default.resolve(__dirname, '../../.env') });
const app_1 = __importDefault(require("./app"));
const port = Number(process.env.PORT) || 5001;
console.log('🚀 Starting Express server for local development...');
app_1.default.listen(port, '0.0.0.0', () => {
    console.log(`✅ Backend server running on port ${port}`);
    console.log(`🌐 API endpoints available at: http://localhost:${port}/api/`);
    console.log(' Available routes:');
    console.log(`   POST /api/auth/line - LINE authentication`);
    console.log(`   GET  /api/jobs - Job listings`);
    console.log(`   GET  /api/seekers - Seeker profiles`);
});
//# sourceMappingURL=server.js.map