const { test, expect } = require("../../src/fixtures/testFixtures");
const { eventPayloadSchema } = require("../../src/utils/schemas");
const { buildCatalogItem } = require("../../src/fixtures/catalogBuilder");

const sampleTrack = buildCatalogItem(1);

test("events accepts valid payload @api @contract @events", async ({ apiClient }) => {
  const payload = {
    type: "PLAYBACK_START",
    ts: Date.now(),
    properties: { trackId: sampleTrack.id, title: sampleTrack.title }
  };

  const parsed = eventPayloadSchema.safeParse(payload);
  expect(parsed.success).toBeTruthy();

  const response = await apiClient.sendEvent(payload);
  expect(response.ok()).toBeTruthy();
});

test("events rejects missing type @api @contract @events", async ({ apiClient }) => {
  const response = await apiClient.sendEvent({ ts: Date.now(), properties: {} });
  expect(response.status()).toBe(400);
});

test("events rejects invalid type @api @contract @events", async ({ apiClient }) => {
  const response = await apiClient.sendEvent({ type: "invalid", ts: Date.now() });
  expect(response.status()).toBe(400);
});
