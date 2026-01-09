import { BrowserContext } from "@playwright/test";

import { test as base } from "./testFixtures";
import { getStorageStatePath } from "./storageState";

export const authTest = base.extend<{ context: BrowserContext }>({
  context: async ({ browser }, use, testInfo) => {
    const storageState = getStorageStatePath(testInfo.project.name);
    const context = await browser.newContext({ storageState });
    await use(context);
    await context.close();
  }
});

export { expect } from "./testFixtures";
