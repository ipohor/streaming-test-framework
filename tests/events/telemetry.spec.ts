import { authTest as test } from "../../src/fixtures/authFixtures";
import { PlayerPage } from "../../src/pages/playerPage";
import { expectEventCallWithType } from "../../src/utils/network";

test("telemetry event is sent on like or skip @events @regression", async ({
  page,
  networkRecorder
}) => {
  await page.goto("/home");
  const playerPage = new PlayerPage(page);

  await playerPage.like();

  await expectEventCallWithType(networkRecorder, "LIKE");
});
