#!/usr/bin/env bash
set -euo pipefail

# Resolve repo root relative to this script
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

CONFIG_FILE="$REPO_ROOT/cloudflared-config.yml"

exec cloudflared tunnel --config "$CONFIG_FILE" run

