// This file is served statically and loaded before the app boots.
// It sets the base URL for API requests.
window.__APP_CONFIG__ = window.__APP_CONFIG__ || {};

// Detect environment and set appropriate API URL
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
  // Local development: use localhost backend
  window.__APP_CONFIG__.API_URL = 'http://localhost:5001';
} else if (window.location.hostname.includes('app.github.dev')) {
  // GitHub Codespaces: use GitHub Codespaces backend URL
  const backendUrl = window.location.origin.replace('-5000.', '-5001.');
  window.__APP_CONFIG__.API_URL = backendUrl;
} else {
  // Production: use relative path for same-origin requests
  window.__APP_CONFIG__.API_URL = '/';
}
// Simple cache-busting token for LIFF/webview. Update on each deploy.
window.__APP_CONFIG__.BUILD_ID = 'b' + Math.floor(Date.now() / 1000);

// Optional: Set GOOGLE_MAPS_API_KEY at runtime without rebuild.
// Example: window.__APP_CONFIG__.GOOGLE_MAPS_API_KEY = 'AIza...';
window.__APP_CONFIG__.GOOGLE_MAPS_API_KEY = 'AIzaSyA2Pbk2W5oT1c2Lx68-hVfLvBZ1bawHT1w';