const { authTest: test, expect } = require("../../src/fixtures/authFixtures");
const { env } = require("../../src/config/env");
const { PlayerPage } = require("../../src/pages/playerPage");
const {
  expectAudioElement,
  expectAudioPlaying,
  expectPlaybackProgress,
  expectPlaybackProgressing,
  measureTTFA
} = require("../../src/utils/playback");
const { expectEventCallWithType, expectPlaybackSessionCall } = require("../../src/utils/network");

test("audio plays and progresses with acceptable TTFA @playback @perf", async ({
  page,
  networkRecorder,
  metrics
}) => {
  await page.goto("/home");
  const playerPage = new PlayerPage(page);
  await expectAudioElement(page);

  const ttfa = await measureTTFA(page, () => playerPage.play());
  expect(ttfa).toBeLessThanOrEqual(env.ttfaMsMax);
  metrics.setTTFA(ttfa);

  await expect(playerPage.playbackReady()).toHaveText(/ready/i);
  await expectAudioPlaying(page);
  await expectPlaybackProgress(page, env.playbackProgressSeconds, 15_000);
  await expectPlaybackProgressing(page, env.playbackProgressSeconds, 20_000);
  await expectPlaybackSessionCall(networkRecorder);
  await expectEventCallWithType(networkRecorder, "PLAYBACK_START");
});
