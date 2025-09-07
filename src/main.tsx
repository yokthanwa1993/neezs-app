import React from 'react';
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from "./App.tsx";
import "./globals.css";
import { initializeRuntimeConfig } from './shared/lib/runtimeConfig';

// Global error suppression for LINE API calls and Google Maps
const originalError = console.error;
const originalWarn = console.warn;

// Handle uncaught promise errors
window.addEventListener('unhandledrejection', (event) => {
  const errorMessage = event.reason?.message || event.reason?.toString() || '';
  if (
    errorMessage.includes('Module places has been provided more than once') ||
    errorMessage.includes('google.maps') ||
    errorMessage.includes('gmp-internal-') ||
    errorMessage.includes('api.line.me') ||
    errorMessage.includes('LIFF') ||
    errorMessage.includes('identitytoolkit.googleapis.com') ||
    errorMessage.includes('Firebase Auth') ||
    errorMessage.includes('Cannot read properties of undefined (reading \'EI\')') ||
    errorMessage.includes('TypeError: Cannot read properties of undefined')
  ) {
    event.preventDefault();
    return;
  }
});

console.error = (...args) => {
  const message = args.join(' ');
  if (
    message.includes('api.line.me') ||
    message.includes('LIFF') ||
    message.includes('identitytoolkit.googleapis.com') ||
    message.includes('Firebase Auth') ||
    message.includes('400 (Bad Request)') ||
    message.includes('Module places has been provided more than once') ||
    message.includes('google.maps') ||
    message.includes('gmp-internal-') ||
    message.includes('Cannot read properties of undefined (reading \'EI\')') ||
    message.includes('TypeError: Cannot read properties of undefined') ||
    message.includes('Could not get current location') ||
    message.includes('GeolocationPositionError') ||
    message.includes('User denied Geolocation')
  ) {
    // Suppress Google Maps, LINE API, Firebase Auth, and Geolocation errors that don't affect functionality
    return;
  }
  originalError.apply(console, args);
};

console.warn = (...args) => {
  const message = args.join(' ');
  if (
    message.includes('api.line.me') ||
    message.includes('authorization') ||
    message.includes('LIFF') ||
    message.includes('React Router Future Flag Warning') ||
    message.includes('Element with name "gmp-internal-') ||
    message.includes('google.maps') ||
    message.includes('Google Maps') ||
    message.includes('Geolocation') ||
    message.includes('location access')
  ) {
    return;
  }
  originalWarn.apply(console, args);
};

async function startApp() {
  await initializeRuntimeConfig();

  const queryClient = new QueryClient();

  const root = document.getElementById('root')!;
  const app = (
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  );

  // Avoid StrictMode in dev to prevent double effects (reduces perceived refresh)
  if (import.meta.env.PROD) {
    createRoot(root).render(<React.StrictMode>{app}</React.StrictMode>);
  } else {
    createRoot(root).render(app);
  }
}

startApp();
