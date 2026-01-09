Hello,

I built a small streaming QA framework that shows how I approach client quality end-to-end. It includes a streaming web app and API, plus Playwright tests for API contracts, UI flows, playback truth checks (TTFA/currentTime/readyState), and telemetry/event validation.

You can run it with `npm install`, `npm run dev`, and `npm run test:smoke`. CI runs smoke tests on PRs and the full suite on main, and it uploads the Playwright report plus console/network/metrics artifacts for review.

The project stays generic on purpose, but the patterns map to real streaming systems: staging environments, DRM/HLS/DASH playback checks, long-session soak tests, and analytics pipeline validation.

Thanks for taking a look.
