const { test: base, expect } = require("./testFixtures");
const { getStorageStatePath } = require("./storageState");

const authTest = base.extend({
  context: async ({ browser }, use, testInfo) => {
    const storageState = getStorageStatePath(testInfo.project.name);
    const context = await browser.newContext({ storageState });
    await use(context);
    await context.close();
  }
});

module.exports = { authTest, expect };
