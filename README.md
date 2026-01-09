# Streaming QA Automation Framework

A clean, JS-first QA framework for a streaming web client. It pairs a lightweight mock app + API with Playwright tests focused on playback truth checks and telemetry validation.

## Highlights
- JavaScript-only Playwright framework (no TypeScript)
- Deterministic mock data and reset hooks for stable runs
- Playback truth checks (TTFA, currentTime progression, readyState)
- Telemetry validation for play/like/skip events
- CI split: smoke on PRs, full suite on main

## What’s Inside
- Mock streaming web app (Vite + React + JavaScript)
- Mock streaming API (Node + Express + JavaScript)
- Playwright tests with POMs, fixtures, and Zod schemas
- Artifacts: console logs, network summaries, metrics, traces/videos on failure

## Repository Layout
```
apps/
  api/               # Mock streaming API (Express + JS)
  web/               # Mock web app (Vite + React + JS)
src/
  clients/           # API client wrappers
  config/            # env config
  fixtures/          # auth reuse, reset hooks, builders
  pages/             # Playwright POMs
  utils/             # playback, network, schemas, console
 tests/
  api/               # contract tests
  ui/                # UI smoke tests
  playback/          # audio truth checks
  events/            # telemetry tests
 docs/               # framework notes
```

## Run Locally
```
npm install
npm run dev
```

In a second terminal:
```
npm run test:smoke
```

## Test Commands
- `npm run test:smoke` - fast, deterministic smoke suite
- `npm run test` - full suite
- `npm run test:api` - API only
- `npm run test:ui` - UI only
- `npm run test:playback` - playback truth checks
- `npx playwright test -g @playback` - run by tag

## CI Behavior
- PRs: smoke suite in Chromium
- Main: full suite in Chromium + WebKit
- Artifacts: Playwright report + `test-results/**/artifacts`

## Determinism & Anti-Flake
- Mock mode with stable catalog ordering and a fixed “Now Playing” default
- `POST /__test/reset` called before each test (mock only)
- No hard sleeps; waits are tied to UI state, playback readiness, or network calls
- Stable locators via `data-testid`

## Playback Validation
- TTFA measured from click to `currentTime > 0` and `readyState >= 2`
- Progress checks ensure `currentTime` keeps increasing
- Mock-only fallback simulates audio progression if autoplay is blocked

## Observability Artifacts
- Console logs (`console-<test>.log` + `.json`)
- Network summaries (`network-<test>.json` with capped size)
- Metrics (`metrics-<test>.json`: ttfaMs, test duration, console error count, network call count)
- Playwright traces/videos retained on failure

## Scripts
- `npm run dev`
- `npm run test`
- `npm run test:smoke`
- `npm run lint`
- `npm run format`
- `npm run report`

## Environment Variables
See `.env.example` for defaults. The web app uses `VITE_API_BASE_URL` for API origin.
