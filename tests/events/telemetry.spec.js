const { authTest: test } = require("../../src/fixtures/authFixtures");
const { PlayerPage } = require("../../src/pages/playerPage");
const { expectEventCallWithType } = require("../../src/utils/network");

test("telemetry event is sent on like or skip @events @regression", async ({
  page,
  networkRecorder
}) => {
  await page.goto("/home");
  const playerPage = new PlayerPage(page);

  await playerPage.like();

  await expectEventCallWithType(networkRecorder, "LIKE");
});
