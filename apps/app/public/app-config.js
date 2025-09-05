// App configuration
window.APP_CONFIG = {
  // Environment configuration
  NODE_ENV: 'development',
  
  // API configuration
  API_BASE_URL: 'https://api.wwoom.com',
  
  // Google Maps API Key
  GOOGLE_MAPS_API_KEY: 'AIzaSyA2Pbk2W5oT1c2Lx68-hVfLvBZ1bawHT1w',
  
  // Firebase configuration (ใช้ค่าตายตัวชั่วคราว)
  FIREBASE_CONFIG: {
    apiKey: 'your-api-key',
    authDomain: 'neeiz-01.firebaseapp.com',
    projectId: 'neeiz-01',
    storageBucket: 'neeiz-01.appspot.com',
    messagingSenderId: 'your-sender-id',
    appId: 'your-app-id'
  },
  
  // LINE configuration
  LINE_LIFF_ID: 'your-liff-id',
  
  // App version
  VERSION: '1.0.0'
};

// Provide config for @neeiz/api-client (runtime override)
window.__APP_CONFIG__ = Object.assign({}, window.__APP_CONFIG__ || {}, {
  API_URL: 'https://api.wwoom.com'
});
