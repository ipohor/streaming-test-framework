import { test, expect } from "../../src/fixtures/testFixtures";
import { catalogSchema } from "../../src/utils/schemas";

test("catalog schema matches contract @api @contract", async ({ apiClient }) => {
  const response = await apiClient.getCatalog();
  expect(response.ok()).toBeTruthy();

  const body = await response.json();
  const parsed = catalogSchema.safeParse(body);
  expect(parsed.success).toBeTruthy();
});
