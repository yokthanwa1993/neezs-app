#!/usr/bin/env bash
set -euo pipefail

# Simple start script for daily work
# - Ensures Node 20 via nvm
# - Installs deps with pnpm (using npx fallback to avoid corepack quirks)
# - Starts all processes with pm2 (API, Web, Frontend, Cloudflare tunnel)

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
cd "$REPO_ROOT"

echo "[start-work] Repo: $REPO_ROOT"

# Load nvm and use Node 20
if [ -s "$NVM_DIR/nvm.sh" ]; then
  . "$NVM_DIR/nvm.sh"
fi
nvm install 20 >/dev/null 2>&1 || true
nvm use 20 >/dev/null 2>&1 || true
echo "[start-work] Node: $(node -v)"

# If BASE_DOMAIN is set in .env, derive per-service URLs and write envs
if [ -f .env ]; then
  BASE_DOMAIN_LINE=$(grep -E '^BASE_DOMAIN=' .env || true)
  if [ -n "${BASE_DOMAIN_LINE}" ]; then
    BASE_DOMAIN=${BASE_DOMAIN_LINE#BASE_DOMAIN=}
    BASE_DOMAIN=${BASE_DOMAIN%/}
    # Strip optional quotes
    DQ='"'
    BASE_DOMAIN=${BASE_DOMAIN%$DQ}
    BASE_DOMAIN=${BASE_DOMAIN#$DQ}
    echo "[start-work] BASE_DOMAIN detected: ${BASE_DOMAIN}"
    # Normalize to host (drop protocol)
    HOST=${BASE_DOMAIN#http://}
    HOST=${HOST#https://}
    # Use apex without www for subdomains
    APEX=${HOST#www.}
    APP_HOST="https://app.${APEX}"
    WEB_HOST="https://web.${APEX}"
    API_HOST="https://api.${APEX}"

    # Helper to upsert key=value in .env
    upsert_env() {
      local key="$1" val="$2"
      if grep -qE "^${key}=" .env; then
        sed -i '' -E "s|^${key}=.*|${key}=${val}|" .env
      else
        printf "\n%s=%s\n" "$key" "$val" >> .env
      fi
    }

    echo "[start-work] Setting API URLs based on BASE_DOMAIN ..."
    upsert_env VITE_API_URL "$API_HOST"
    upsert_env NEXT_PUBLIC_API_URL "$API_HOST"

    # Optional app domain hint for UI
    upsert_env VITE_APP_DOMAIN "$APP_HOST"

    # Also write framework-specific local envs (non-secret)
    mkdir -p apps/web apps/app
    printf "NEXT_PUBLIC_API_URL=%s\n" "$API_HOST" > apps/web/.env.local
    printf "VITE_API_URL=%s\nVITE_APP_DOMAIN=%s\n" "$API_HOST" "$APP_HOST" > apps/app/.env.local

    echo "[start-work] Derived domains:"
    echo "  API: $API_HOST"
    echo "  APP: $APP_HOST"
    echo "  WEB: $WEB_HOST"
  fi
fi

# Install deps (prefer known-good pnpm via npx)
echo "[start-work] Installing dependencies (pnpm) ..."
npx -y pnpm@10.15.1 install --prefer-offline

# Ensure log folders exist
mkdir -p logs functions/logs apps/app/logs apps/web/logs

# Start everything via pm2 (idempotent)
echo "[start-work] Starting services with pm2 ..."
pm2 start ecosystem.config.json || true
pm2 restart all || true

echo "[start-work] pm2 status:"
pm2 status

echo "[start-work] Endpoints:"
echo "  - App (Vite):   https://app.wwoom.com"
echo "  - Web (Next):   https://web.wwoom.com"
echo "  - API:          https://api.wwoom.com/api"
