import { test, expect } from "../../src/fixtures/testFixtures";
import { LoginPage } from "../../src/pages/loginPage";
import { PlayerPage } from "../../src/pages/playerPage";
import { expectAudioElement } from "../../src/utils/playback";
import { getTestUser } from "../../src/fixtures/users";

test("can sign in and start playback @smoke @ui", async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  const user = getTestUser();
  await loginPage.login(user.username, user.password);

  await expect(page).toHaveURL(/\/home/);

  const playerPage = new PlayerPage(page);
  await expectAudioElement(page);
  await playerPage.play();

  await expect(playerPage.playbackReady()).toHaveText(/ready/i);
  await expect(playerPage.nowPlaying()).not.toHaveText(/Select a track/i);
});
