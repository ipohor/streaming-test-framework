Hello,

I put together a compact, employer-ready Streaming QA Automation Framework that demonstrates how I approach streaming client quality end-to-end. It includes a mock streaming web app and API, plus Playwright tests that cover API contracts, UI flows, playback truth checks (TTFA/currentTime/readyState), and telemetry/event validation.

You can run it locally with `npm install`, `npm run dev`, and `npm run test:smoke`. CI runs a smoke suite on PRs and a full suite on main, with Playwright reports and artifacts (console logs, network summaries, metrics) uploaded for review.

This mock setup intentionally mirrors patterns seen in streaming clients without relying on proprietary systems, and it’s designed to scale to real staging environments, DRM/HLS/DASH playback, long-session soak tests, and analytics pipelines.

Thanks for taking a look.
