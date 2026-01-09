const dotenv = require("dotenv");

dotenv.config();

const webBaseUrl = process.env.WEB_BASE_URL || "http://localhost:5173";

module.exports = {
  testDir: "./tests",
  timeout: 45_000,
  globalTimeout: 10 * 60_000,
  expect: {
    timeout: 10_000
  },
  retries: process.env.CI ? 2 : 0,
  reporter: [["html", { open: "never" }]],
  use: {
    baseURL: webBaseUrl,
    trace: "on-first-retry",
    video: "retain-on-failure",
    actionTimeout: 10_000
  },
  globalSetup: "./src/fixtures/global-setup.js",
  projects: [
    {
      name: "chromium",
      use: { browserName: "chromium" }
    },
    {
      name: "webkit",
      use: { browserName: "webkit" }
    }
  ]
};
