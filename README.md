# Streaming QA Automation Framework

A shareable, **non-proprietary** streaming QA framework that validates **API + UI + playback truth + telemetry** using a **mock React app + mock Express API**. Built to demonstrate how I’d structure automation for a real streaming product while staying safe to share publicly.

---

## What This Validates (and why it matters)
Streaming failures often hide behind “healthy-looking UI.” This framework checks multiple layers:

- **API contracts**: predictable, schema-validated responses
- **UI journeys**: core flows and regressions with stable locators
- **Playback truth checks**: confirms audio actually starts and progresses (not just “Play button toggled”)
- **Telemetry/events**: verifies analytics signals are emitted for engagement + observability

---

## Tech Stack
- **Web**: Vite + React + JavaScript
- **API**: Node + Express + JavaScript
- **Tests**: Playwright + POMs + fixtures + **Zod schemas**
- **Debug**: traces/videos on failure, network + console + metrics artifacts
- **CI**: smoke vs full suite separation

---

## Repo Structure
```text
apps/
  api/               # Mock streaming API (Express + JS)
  web/               # Mock web app (Vite + React + JS)

src/
  clients/           # API clients (thin wrappers)
  config/            # env config + defaults
  fixtures/          # auth reuse, reset hooks, test builders
  pages/             # Playwright Page Objects (POMs)
  utils/             # playback probes, network helpers, schemas, console capture

tests/
  api/               # contract tests
  ui/                # UI smoke tests
  playback/          # audio truth checks
  events/            # telemetry tests

docs/                # explanation pack + diagram
