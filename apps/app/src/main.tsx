import React from 'react';
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from "./App.tsx";
import "./globals.css";
import { initializeRuntimeConfig } from './lib/runtimeConfig';

// Global error suppression for LINE API calls
const originalError = console.error;
const originalWarn = console.warn;

console.error = (...args) => {
  const message = args.join(' ');
  if (
    message.includes('api.line.me') ||
    message.includes('Bad Request') ||
    message.includes('400') ||
    message.includes('oauth2/v2.1/token')
  ) {
    // Suppress LINE API errors that don't affect functionality
    return;
  }
  originalError.apply(console, args);
};

console.warn = (...args) => {
  const message = args.join(' ');
  if (
    message.includes('api.line.me') ||
    message.includes('authorization') ||
    message.includes('LIFF')
  ) {
    return;
  }
  originalWarn.apply(console, args);
};

async function startApp() {
  await initializeRuntimeConfig();

  const queryClient = new QueryClient();

  createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </React.StrictMode>,
  );
}

startApp();
