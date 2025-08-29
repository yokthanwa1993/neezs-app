# neeiz-app Changes

## 2025-08-08
- Update `@neeiz/api-client` usage: default API base URL to `https://neeiz-api.lslly.com` if env missing; support `window.__APP_CONFIG__.API_URL` for runtime override.
- Ensure app no longer falls back to `http://localhost:3001` in production bundles.
- GitHub Actions (`deploy-app.yml`):
  - Add `workflow_dispatch` to allow manual runs.
  - Trigger on changes to `packages/**` and `pnpm-workspace.yaml` to rebuild when shared packages change.


