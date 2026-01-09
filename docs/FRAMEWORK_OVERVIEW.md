# Streaming QA Automation Framework - Technical Overview

## Purpose
This repository is a streaming QA framework built around a mock web client and API. It shows how a streaming engineering org can validate reliability, playback truth, and telemetry integrity with tests that stay repeatable in CI.

## Test Layers (Pyramid)
- **API/Contract:** Zod schemas validate backend payloads and reject invalid requests early.
- **UI Smoke:** Critical user journeys (login, play, like/skip) verify core UX.
- **Playback Truth Checks:** Direct `HTMLAudioElement` validation ensures audio really starts and progresses.
- **Events/Telemetry:** Network assertions confirm analytics payloads are emitted with correct type and properties.

This balance keeps fast feedback at the base (API) while preserving confidence on the end-to-end experience (playback + telemetry).

## Contracts & Schema Validation
Zod schemas define the contract for:
- `/catalog` items
- `/playback/session` responses
- `/events` payloads

Contract tests parse real responses and fail on drift. This mirrors how streaming orgs keep clients and services aligned during rapid iteration.

## Fixtures & State Design
- **Auth reuse:** Pre-generated storage state per browser to avoid repeated UI logins.
- **Reset hooks:** `POST /__test/reset` is invoked in mock mode before each test for isolation.
- **Builders:** Catalog data builders prevent hard-coded IDs across tests.

This keeps tests fast, independent, and repeatable.

## CI Quality Gates
- **PR:** Smoke suite in Chromium only for <3 minute feedback.
- **Main:** Full suite in Chromium + WebKit.
- **Artifacts:** Playwright report, traces/videos on failure, plus console/network/metrics JSON.

Expected runtime budgets prioritize developer feedback while still validating cross-browser behavior before merge.

## How To Adopt This Pattern For Real Services
- Replace API URLs with staging/preview endpoints via `.env` and secrets.
- Add environment-based user pools and token management.
- Integrate observability artifacts into your CI/CD artifact store.
- Expand playback checks for DRM, adaptive bitrate (HLS/DASH), and long-session stability.
- Route telemetry validations into your analytics pipeline to catch schema drift or sampling regressions.
