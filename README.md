# Streaming QA Automation Framework

## Overview
This repo is a portfolio-grade streaming QA framework that simulates a real-world music client while keeping everything generic. It demonstrates how to validate a streaming experience across API, UI, playback truth checks, and telemetry without relying on proprietary systems.

## Why This Architecture
Streaming quality is multi-layered. A UI can look healthy while playback never starts or telemetry never fires. This framework validates:
- **API contracts** for reliability and predictable data
- **UI flows** for core user journeys
- **Playback truth checks** for actual audio activity
- **Telemetry/events** to ensure analytics and engagement signals are emitted

## What’s Included
- Mock streaming web app (Vite + React + TypeScript)
- Mock streaming API (Node + Express + TypeScript)
- Playwright test framework with POMs, fixtures, and Zod schemas
- Observability artifacts (console, network, metrics, traces/videos on failure)
- CI pipeline with smoke vs full suite separation

## Repository Layout
```
apps/
  api/               # Mock streaming API (Express + TS)
  web/               # Mock web app (Vite + React + TS)
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
 docs/               # explanation pack + diagram
```

## How To Run Locally
```
npm install
npm run dev
```

In a second terminal:
```
npm run test:smoke
```

## How To Run Tests
- Smoke (fast, deterministic): `npm run test:smoke`
- Full suite: `npm run test`
- API only: `npm run test:api`
- UI only: `npm run test:ui`
- Playback only: `npm run test:playback`
- Tags: `npx playwright test -g @playback`

## CI Behavior
- **PRs:** smoke suite in Chromium only (fast feedback)
- **Main:** full suite in Chromium + WebKit
- **Artifacts:** Playwright report, traces/videos (on failure), plus `test-results/**/artifacts`

## Determinism & Anti-Flake Approach
- Mock mode with stable catalog ordering and deterministic “Now Playing”
- Mock-only reset endpoint (`POST /__test/reset`) called before each test
- No hard sleeps; waits are tied to UI state, playback readiness, or network calls
- Stable locators via `data-testid`

## Playback Validation Strategy
- TTFA measured from click to `currentTime > 0` with `readyState >= 2`
- Progress validation ensures `currentTime` keeps increasing
- Mock-only fallback simulates audio progression if autoplay is blocked

## Observability Artifacts
- Console logs (`console-<test>.log` + `.json`)
- Network summaries (`network-<test>.json` with capped size)
- Metrics (`metrics-<test>.json`: ttfaMs, test duration, console error count, network call count)
- Playwright traces/videos retained on failure

## What I Would Extend For A Real Streaming System
- Staging environment matrix with secrets and auth rotation
- DRM-protected playback (Widevine/FairPlay) and HLS/DASH validation
- Long-session soak tests for buffering and memory leaks
- A/B test coverage and experiment telemetry validation
- CTV/remote UX flows with focus navigation and playback probes
- Analytics pipeline checks (batching, sampling, schema drift)

## Tradeoffs
- A mock app keeps the repo portable and safe to share, but simplifies real network, DRM, and CDN variability.
- Audio fallback logic improves determinism in CI, but should be disabled in production test tiers.

## Scripts
- `npm run dev`
- `npm run test`
- `npm run test:smoke`
- `npm run lint`
- `npm run format`
- `npm run report`

## Environment Variables
See `.env.example` for defaults. The web app uses `VITE_API_BASE_URL` for API origin.
