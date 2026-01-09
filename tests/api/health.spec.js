const { test, expect } = require("../../src/fixtures/testFixtures");
const { healthSchema } = require("../../src/utils/schemas");

test("health endpoint returns ok @api @contract", async ({ apiClient }) => {
  const response = await apiClient.getHealth();
  expect(response.ok()).toBeTruthy();

  const body = await response.json();
  const parsed = healthSchema.safeParse(body);
  expect(parsed.success).toBeTruthy();
  expect(parsed.data?.service).toBe("mock-streaming-api");
});
