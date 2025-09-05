import url from 'url';

export type DerivedDomains = {
  apexHost: string;
  appOrigin: string; // e.g. https://app.example.com
  webOrigin: string; // e.g. https://web.example.com
  apiOrigin: string; // e.g. https://api.example.com
};

function normalizeBaseDomain(raw?: string | null): string | null {
  if (!raw) return null;
  const unquoted = raw.replace(/^"+|"+$/g, '').replace(/\/$/, '');
  // drop protocol if present
  const noProto = unquoted.replace(/^https?:\/\//i, '');
  // drop www.
  const apex = noProto.replace(/^www\./i, '');
  return apex || null;
}

export function getDerivedDomains(): DerivedDomains | null {
  const apex = normalizeBaseDomain(process.env.BASE_DOMAIN);
  if (!apex) return null;
  const appOrigin = `https://app.${apex}`;
  const webOrigin = `https://web.${apex}`;
  const apiOrigin = `https://api.${apex}`;
  return { apexHost: apex, appOrigin, webOrigin, apiOrigin };
}

export function getAllowedOrigins(): string[] {
  const d = getDerivedDomains();
  const list = new Set<string>();
  if (d) {
    list.add(d.appOrigin);
    list.add(d.webOrigin);
    list.add(d.apiOrigin);
    // Wildcards are not valid in CORS header; keep explicit.
  }
  // Local dev ports used in ecosystem
  list.add('http://localhost:5003'); // Vite app
  list.add('http://localhost:3010'); // Next web
  list.add('http://localhost:8000'); // API

  // Codespaces base (if provided), also add common -3000/-5000/-8000 ports
  const cs = (process.env.VITE_CODESPACES_BASE_DOMAIN || process.env.CODESPACES_BASE_DOMAIN || '').replace(/\/$/, '');
  if (cs) {
    try {
      const u = new url.URL(cs);
      list.add(u.origin);
    } catch {
      // if not absolute, ignore
    }
  }
  return Array.from(list);
}

