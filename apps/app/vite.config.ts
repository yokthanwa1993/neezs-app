import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

export default defineConfig(({ mode }) => ({
  mode: mode || 'development',
  envDir: '../../',
  server: {
    host: "0.0.0.0",
    port: 5173,
    // Allow access via Cloudflare Tunnel custom domains
    allowedHosts: [
      'app.wwoom.com',
      // Add more hosts here if needed
    ],
    hmr: {
      host: 'app.wwoom.com',
      protocol: 'wss',
      clientPort: 443,
      path: '/',
    },
    proxy: {
      "/api": {
        target: process.env.NODE_ENV === 'production' 
          ? "https://urban-carnival-gppqwpx9x4jcwp49-8000.app.github.dev"
          : "http://localhost:8000",
        changeOrigin: true,
        secure: false,
        configure: (proxy, options) => {
          proxy.on('error', (err, req, res) => {
            console.log('Proxy error:', err);
          });
          proxy.on('proxyReq', (proxyReq, req, res) => {
            console.log(`Proxying ${req.method} ${req.url} to ${options.target}`);
          });
        }
      },
    },
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    outDir: "dist",
    assetsDir: "assets",
    sourcemap: false,
    rollupOptions: {
      output: {
        entryFileNames: `assets/index.js`,
        chunkFileNames: `assets/chunk.js`,
        assetFileNames: `assets/[name].[ext]`,
        manualChunks: undefined,
      },
    },
  },
}));
