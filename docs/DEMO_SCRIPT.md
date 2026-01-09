# Demo Script (2-3 Minutes)

## 1) Start Services
"I start the streaming API and web app locally."
```
npm run dev
```

## 2) Run Smoke Tests
"In a second terminal I run the smoke suite."
```
npm run test:smoke
```

## 3) Open the Report
"Playwright generates a report with traces and artifacts on failure."
```
npx playwright show-report
```

## 4) Walk Through Playback Truth Check
"Here is the playback test. It validates TTFA, checks that audio currentTime progresses, and confirms the playback session call and telemetry payload."
- Highlight: `tests/playback/audio.playing.spec.ts`
- Point out TTFA vs `TTFA_MS_MAX` and readyState checks

## 5) Show Artifacts
"When failures happen, we capture console logs, network summaries, metrics, traces, and video."
- Show `test-results/**/artifacts/console-*.log`
- Show `test-results/**/artifacts/network-*.json`
- Show `test-results/**/artifacts/metrics-*.json`

## 6) Close With Scale-Up Strategy
"To scale this to production streaming systems I would add staging environments, DRM/HLS/DASH validation, long-session soak tests, and telemetry pipeline checks. The framework already has the right test layers and observability patterns to expand."
