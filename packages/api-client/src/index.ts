import axios, { AxiosInstance } from 'axios';

function resolveBaseUrl(): string {
  // 1) Runtime global config (optional)
  try {
    if (typeof window !== 'undefined' && (window as any).__APP_CONFIG__?.API_URL) {
      return (window as any).__APP_CONFIG__.API_URL as string;
    }
  } catch {
    // ignore
  }

  // 1.5) Force same-origin on Firebase Hosting to avoid external CORS
  try {
    if (typeof window !== 'undefined') {
      const host = window.location.hostname || '';
      if (host.endsWith('web.app') || host.endsWith('firebaseapp.com')) {
        return '';
      }
    }
  } catch {
    // ignore
  }

  // 2) Vite (import.meta.env) at build-time
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const viteEnv = (typeof import.meta !== 'undefined' ? (import.meta as any).env : undefined) as
      | { VITE_API_URL?: string; NEXT_PUBLIC_API_URL?: string }
      | undefined;
    if (viteEnv?.VITE_API_URL) return viteEnv.VITE_API_URL;
    if (viteEnv?.NEXT_PUBLIC_API_URL) return viteEnv.NEXT_PUBLIC_API_URL;
  } catch {
    // ignore
  }

  // 2.5) LocalStorage runtime override (helps when dev tool doesn't load app-config.js)
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      const lsUrl = window.localStorage.getItem('APP_API_URL');
      if (lsUrl) return lsUrl;
    }
  } catch {
    // ignore
  }

  // 3) Next.js/Node (process.env) at build/SSR time
  if (typeof process !== 'undefined' && process.env) {
    if (process.env.NEXT_PUBLIC_API_URL) return process.env.NEXT_PUBLIC_API_URL;
    if (process.env.VITE_API_URL) return process.env.VITE_API_URL;
  }

  // 4) Runtime fallback: if running on localhost, point to production Hosting so dev UIs see real data
  try {
    if (typeof window !== 'undefined') {
      const host = (window.location && window.location.hostname) || '';
      const isLocal = host === 'localhost' || host === '127.0.0.1';
      if (isLocal) return 'https://neeiz-01.web.app';
    } else if (typeof process !== 'undefined') {
        // For server-side rendering in local development
        return 'https://neeiz-01.web.app';
    }
  } catch {
    // ignore
  }
  // 5) Default to same-origin for Firebase Hosting (relative)
  return '';
}

export function createApiClient(baseURL: string): AxiosInstance {
  const instance = axios.create({
    baseURL,
    withCredentials: true,
  });
  return instance;
}

export const apiClient = createApiClient(resolveBaseUrl());


