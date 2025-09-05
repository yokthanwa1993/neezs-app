export function getCodespacesBaseDomain(): string | null {
  const raw = process.env.VITE_CODESPACES_BASE_DOMAIN || process.env.CODESPACES_BASE_DOMAIN;
  if (!raw) return null;
  try {
    const url = new URL(raw);
    return `${url.protocol}//${url.hostname}`;
  } catch {
    return null;
  }
}

export function codespacesOriginForPort(port: number): string | null {
  const base = getCodespacesBaseDomain();
  if (!base) return null;
  try {
    const url = new URL(base);
    const host = url.hostname; // e.g. cautious-xxx.github.dev
    if (!host.endsWith('.github.dev')) return `${url.protocol}//${host}`;
    const prefix = host.replace(/\.github\.dev$/, '');
    return `${url.protocol}//${prefix}-${port}.app.github.dev`;
  } catch {
    return null;
  }
}

export function buildCallbackUrl(role: 'seeker' | 'employer', preferredPort = 5000): string | null {
  const origin = codespacesOriginForPort(preferredPort);
  if (!origin) return null;
  return `${origin}/${role}/auth/callback`;
}

