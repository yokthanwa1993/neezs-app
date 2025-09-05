#!/usr/bin/env bash
set -euo pipefail

# Simple stop script for end of day
# - Stops all pm2 processes (keeps definitions)

echo "[end-work] Stopping all pm2 apps ..."
pm2 stop all || true
echo "[end-work] Saving current pm2 process list ..."
pm2 save || true
echo "[end-work] Done. Use 'pm2 status' to verify."

