#!/usr/bin/env bash
set -euo pipefail

# Bootstrap PM2 so that `pm2 start all` works from the first run.

SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" &>/dev/null && pwd)"
REPO_ROOT="${SCRIPT_DIR%/bin}"
ECOSYSTEM_PATH="$REPO_ROOT/ecosystem.config.json"

if ! command -v pm2 >/dev/null 2>&1; then
  echo "Error: pm2 is not installed or not in PATH" >&2
  exit 1
fi

echo "➡️  Checking PM2 process list..."
JLIST_STRIPPED=$(pm2 jlist 2>/dev/null | tr -d '\n\r\t ' || echo "[]")
BOOTSTRAPPED=0

if [[ "$JLIST_STRIPPED" == "[]" ]]; then
  echo "📦 PM2 has no processes. Bootstrapping from ecosystem.config.json..."
  if [[ ! -f "$ECOSYSTEM_PATH" ]]; then
    echo "Error: ecosystem.config.json not found at $ECOSYSTEM_PATH" >&2
    exit 1
  fi
  pm2 start "$ECOSYSTEM_PATH"
  pm2 save
  BOOTSTRAPPED=1
else
  echo "✅ PM2 already has processes loaded."
fi

if [[ "$BOOTSTRAPPED" -eq 1 ]]; then
  # We already started from ecosystem; avoid duplicate table output.
  echo "🚀 Apps started from ecosystem. Showing status..."
  pm2 status
else
  echo "🚀 Starting all PM2 apps..."
  pm2 start all
fi

echo "✅ Done. Use 'pm2 logs' to inspect logs."
