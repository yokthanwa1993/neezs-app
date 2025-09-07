// Runtime config helpers for pulling keys from multiple sources

export const runtimeConfig = {
  googleMapsApiKey: '',
};

export async function initializeRuntimeConfig() {
  const googleMapsApiKey = await loadGoogleMapsApiKey();
  if (googleMapsApiKey) {
    runtimeConfig.googleMapsApiKey = googleMapsApiKey;
  } else {
    console.warn('Google Maps API Key could not be loaded.');
  }
}

export async function loadGoogleMapsApiKey(): Promise<string | null> {
  // 1) window.__APP_CONFIG__ (served via /app-config.js)
  try {
    if (typeof window !== 'undefined') {
      const fromWindow = (window as any)?.__APP_CONFIG__?.GOOGLE_MAPS_API_KEY as string | undefined;
      if (fromWindow && typeof fromWindow === 'string' && fromWindow.trim()) {
        return fromWindow.trim();
      }
    }
  } catch {
    // ignore
  }

  // 2) import.meta.env at build-time
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const viteEnv = (typeof import.meta !== 'undefined' ? (import.meta as any).env : undefined) as
      | { VITE_GOOGLE_MAPS_API_KEY?: string }
      | undefined;
    if (viteEnv?.VITE_GOOGLE_MAPS_API_KEY) {
      const key = (viteEnv.VITE_GOOGLE_MAPS_API_KEY as string).trim();
      if (key) return key;
    }
  } catch {
    // ignore
  }

  // 3) LocalStorage cache
  try {
    if (typeof window !== 'undefined') {
      const cached = localStorage.getItem('google_maps_api_key');
      if (cached && cached.trim()) return cached.trim();
    }
  } catch {
    // ignore
  }

  // 4) Fetch from a public markdown file served by Firebase Hosting
  // Place your key (single line) in app/public/config/google-maps.md
  try {
    const res = await fetch('/config/google-maps.md', { cache: 'no-store' });
    if (res.ok) {
      const text = (await res.text()).trim();
      // Assume first non-empty line is the key
      const line = text.split(/\r?\n/).find((l) => l.trim().length > 0) || '';
      const key = line.replace(/[`#*\s]/g, '').trim();
      if (key) {
        try { localStorage.setItem('google_maps_api_key', key); } catch {}
        return key;
      }
    }
  } catch {
    // ignore
  }

  return null;
}


