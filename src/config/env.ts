import dotenv from "dotenv";

dotenv.config();

const toNumber = (value: string | undefined, fallback: number) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

export const env = {
  mode: process.env.MODE || "mock",
  webBaseUrl: process.env.WEB_BASE_URL || "http://localhost:5173",
  apiBaseUrl: process.env.API_BASE_URL || "http://localhost:3001",
  testUsername: process.env.TEST_USERNAME || "test_user",
  testPassword: process.env.TEST_PASSWORD || "test_pass",
  ttfaMsMax: toNumber(process.env.TTFA_MS_MAX, 2500),
  playbackProgressSeconds: toNumber(process.env.PLAYBACK_PROGRESS_SECONDS, 2),
  slowStartMs: toNumber(process.env.SLOW_START_MS, 1200)
};
