# Testing & Debugging

## Testing via curl

```bash
curl -X POST http://localhost:5678/webhook/agent-chat-webhook/chat \
  -H "Content-Type: application/json" \
  -d '{"chatInput": "Hello", "sessionId": "test-123"}'
```

## n8n UI

Access at `http://localhost:5678` to view executions and debug.

## Rebuild

```bash
cd server/n8n/custom-nodes && npm run build
npm run build
```

## Common Issues

- **Agent not calling tools** — check tools connected in workflow
- **Tool execution fails** — check tool name matches
- **Infinite loop** — check maxIterations parameter

## Browser compatibility checks

Older Safari / iOS users sometimes get a white screen, and the error trackers don't fire because the app itself fails to bootstrap. To catch such regressions we use two layers:

### 1. Bundle syntax check (`es-check`)

Verifies that the production client bundle does not contain syntax newer than the supported baseline.

```bash
npm run build
npm run check:bundle   # runs: npx es-check es2019 '.next/static/**/*.js'
```

The browser baseline is declared in `package.json` under `browserslist`:

```json
"browserslist": {
  "production": ["Safari >= 13", "iOS >= 13", "Chrome >= 80", "Firefox >= 78", "Edge >= 80"],
  "development": ["last 2 chrome version", "last 2 firefox version", "last 2 safari version"]
}
```

Notes:
- Next.js (SWC) reads `browserslist` from `package.json`. `tsconfig.target` does **not** affect the runtime bundle.
- `browserslist` is a hint, not a guarantee — some dependencies ship modern ESM that bypasses transpilation.
- Refresh the browsers DB when the build prints `caniuse-lite is outdated`:
  ```bash
  npx update-browserslist-db@latest
  ```

### 2. Runtime errors check (Playwright + WebKit)

Catches runtime errors (`pageerror`, `console.error`) that `es-check` cannot detect — missing APIs, hydration failures, broken dependencies, etc.

Setup files:
- `playwright.config.ts` — two projects: `webkit` (Desktop Safari) and `mobile-webkit` (iPhone 13). `baseURL` comes from the `PLAYWRIGHT_BASE_URL` env variable, defaults to `http://localhost:3000`. The server is **not** auto-started — run it yourself.
- `tests/e2e/console-errors.spec.ts` — opens pages from the `PAGES` array, listens to `pageerror` and `console.error`, fails the test if anything is reported.

Scripts:

```bash
npm run e2e            # both projects (desktop + mobile webkit)
npm run e2e:webkit     # only Desktop Safari
npm run e2e:report     # open HTML report after a run
```

Usage:

```bash
# terminal 1
npm run dev   # or npm run build && npm run start

# terminal 2
npm run e2e:webkit
# or against a remote URL:
PLAYWRIGHT_BASE_URL=https://example.com npm run e2e:webkit
```

Failure artifacts (screenshots, traces) land in `playwright-report/` and `test-results/`.

Caveats:
- Playwright bundles a recent WebKit build, so it does **not** fully reproduce older Safari (13–15) bugs. For real old iPhones use BrowserStack / SauceLabs.
- Dev builds (especially with Turbopack) can produce errors that do not appear in production. When in doubt, run the e2e suite against a production build.
