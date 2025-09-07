// Utilities to derive GitHub Codespaces origins from a single base domain
// Example base: https://cautious-xxxx.github.dev
// Derived origins: https://cautious-xxxx-5000.app.github.dev, etc.

const CODESPACES_BASE_ENV = (import.meta as any)?.env?.VITE_CODESPACES_BASE_DOMAIN as string | undefined;

export function getCodespacesBaseDomain(): string | null {
  try {
    const raw = CODESPACES_BASE_ENV || '';
    if (!raw) return null;
    const url = new URL(raw);
    return `${url.protocol}//${url.hostname}`; // normalize
  } catch {
    return null;
  }
}

export function codespacesOriginForPort(port: number): string | null {
  const base = getCodespacesBaseDomain();
  if (!base) return null;
  try {
    const baseUrl = new URL(base);
    const host = baseUrl.hostname; // e.g. cautious-xxxx.github.dev
    // Only transform GitHub Codespaces base domains
    if (!host.endsWith('.github.dev')) return `${baseUrl.protocol}//${host}`;
    const prefix = host.replace(/\.github\.dev$/, '');
    return `${baseUrl.protocol}//${prefix}-${port}.app.github.dev`;
  } catch {
    return null;
  }
}

export function buildCallbackUrl(role: 'employer' | 'seeker', preferredPort = 5000): string {
  const origin = codespacesOriginForPort(preferredPort) || window.location.origin;
  return `${origin}/${role}/auth/callback`;
}

export function getCommonCodespacesOrigins(): string[] {
  const out: string[] = [];
  for (const port of [3000, 5000, 8000]) {
    const origin = codespacesOriginForPort(port);
    if (origin) out.push(origin);
  }
  return out;
}

