const { test, expect } = require("../../src/fixtures/testFixtures");
const { playbackSessionSchema } = require("../../src/utils/schemas");

const deviceId = "test-device";

test("playback session schema matches contract @api @contract", async ({ apiClient }) => {
  const response = await apiClient.createPlaybackSession({ deviceId });
  expect(response.ok()).toBeTruthy();

  const body = await response.json();
  const parsed = playbackSessionSchema.safeParse(body);
  expect(parsed.success).toBeTruthy();
});

test("playback session rejects missing deviceId @api @contract", async ({ apiClient }) => {
  const response = await apiClient.createPlaybackSession({});
  expect(response.status()).toBe(400);
});
