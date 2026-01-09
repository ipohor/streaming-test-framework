import { authTest as test, expect } from "../../src/fixtures/authFixtures";
import { env } from "../../src/config/env";
import { PlayerPage } from "../../src/pages/playerPage";
import {
  expectAudioElement,
  expectAudioPlaying,
  expectPlaybackProgress,
  expectPlaybackProgressing,
  measureTTFA
} from "../../src/utils/playback";
import { expectEventCallWithType, expectPlaybackSessionCall } from "../../src/utils/network";

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
