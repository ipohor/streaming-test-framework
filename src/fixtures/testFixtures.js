const { test: base, expect, request } = require("@playwright/test");
const fs = require("fs/promises");
const path = require("path");

const { env } = require("../config/env");
const { ApiClient } = require("../clients/apiClient");
const { ConsoleTracker } = require("../utils/console");
const { createNetworkRecorder } = require("../utils/network");
const { MetricsCollector } = require("../utils/metrics");

const sanitize = (value) => value.replace(/[^a-z0-9-_]+/gi, "_").slice(0, 100);

const writeArtifact = async (filePath, data) => {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), "utf-8");
};

const writeTextArtifact = async (filePath, data) => {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, data, "utf-8");
};

const waitForApiReady = async (attempts = 5, delayMs = 500) => {
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    const apiContext = await request.newContext({ baseURL: env.apiBaseUrl });
    try {
      const response = await apiContext.get("/health");
      if (response.ok()) {
        await apiContext.dispose();
        return;
      }
    } catch {
      // keep retrying until attempts exhausted
    } finally {
      await apiContext.dispose();
    }
    await new Promise((resolve) => setTimeout(resolve, delayMs));
  }

  throw new Error(
    `API not reachable at ${env.apiBaseUrl}. Start services with 'npm run dev' in another terminal.`
  );
};

const test = base.extend({
  apiToken: [
    async ({}, use) => {
      const apiContext = await request.newContext({ baseURL: env.apiBaseUrl });
      const client = new ApiClient(apiContext);
      const response = await client.login(env.testUsername, env.testPassword);
      const body = await response.json();
      await apiContext.dispose();
      await use(body.token);
    },
    { scope: "worker" }
  ],

  apiClient: async ({ apiToken }, use) => {
    const apiContext = await request.newContext({
      baseURL: env.apiBaseUrl,
      extraHTTPHeaders: { Authorization: `Bearer ${apiToken}` }
    });
    const client = new ApiClient(apiContext);
    await use(client);
    await apiContext.dispose();
  },

  networkRecorder: async ({ page }, use) => {
    const recorder = createNetworkRecorder(page, { maxRecords: 200, maxBodySize: 1000 });
    await use(recorder);
  },

  consoleTracker: async ({ page }, use) => {
    const tracker = new ConsoleTracker(page);
    await use(tracker);
  },

  metrics: async ({}, use) => {
    await use(new MetricsCollector());
  }
});

test.beforeEach(async () => {
  if (env.mode !== "mock") return;
  await waitForApiReady();
  const apiContext = await request.newContext({ baseURL: env.apiBaseUrl });
  await apiContext.post("/__test/reset");
  await apiContext.dispose();
});

test.afterEach(async ({ networkRecorder, consoleTracker, metrics }, testInfo) => {
  const isFailure = testInfo.status !== testInfo.expectedStatus;
  const consoleEntries = consoleTracker.getEntries();
  const consoleErrors = consoleTracker.getErrors();
  const safeTitle = sanitize(testInfo.title);

  metrics.setConsoleErrors(consoleErrors.length);
  metrics.setNetworkCalls(networkRecorder.records.length);

  const metricsSnapshot = metrics.finalize(testInfo.duration);
  const metricsPath = testInfo.outputPath(`artifacts/metrics-${safeTitle}.json`);
  await writeArtifact(metricsPath, metricsSnapshot);

  const consolePath = testInfo.outputPath(`artifacts/console-${safeTitle}.log`);
  const consoleJsonPath = testInfo.outputPath(`artifacts/console-${safeTitle}.json`);
  await writeTextArtifact(
    consolePath,
    consoleEntries.map((entry) => `[${entry.type}] ${entry.text}`).join("\n")
  );
  await writeArtifact(consoleJsonPath, consoleEntries);

  const networkPath = testInfo.outputPath(`artifacts/network-${safeTitle}.json`);
  await writeArtifact(networkPath, {
    summary: networkRecorder.summary(),
    records: networkRecorder.records
  });

  if (isFailure || consoleErrors.length > 0) {
    await testInfo.attach("console-log", { path: consolePath, contentType: "text/plain" });
    await testInfo.attach("console-json", { path: consoleJsonPath, contentType: "application/json" });
    await testInfo.attach("network-summary", { path: networkPath, contentType: "application/json" });
  }

  await testInfo.attach("metrics", { path: metricsPath, contentType: "application/json" });

  expect(consoleErrors, "Console errors detected").toEqual([]);
});

module.exports = { test, expect };
