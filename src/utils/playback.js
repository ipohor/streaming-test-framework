const { expect } = require("@playwright/test");

const getAudio = () => {
  const audio = document.querySelector("audio");
  if (!audio) return null;
  return {
    paused: audio.paused,
    currentTime: audio.currentTime,
    readyState: audio.readyState,
    mockPlayback: audio.dataset.mockPlayback === "true",
    playbackReady: audio.dataset.playbackReady === "true"
  };
};

const expectAudioElement = async (page) => {
  await expect(page.getByTestId("audio")).toHaveCount(1);
};

const expectAudioPlaying = async (page, timeoutMs = 10_000) => {
  await page.waitForFunction(() => {
    const audio = document.querySelector("audio");
    if (!audio) return false;
    if (audio.dataset.mockPlayback === "true") return true;
    return !audio.paused;
  }, null, { timeout: timeoutMs });
};

const measureTTFA = async (page, action, timeoutMs = 15_000) => {
  const start = Date.now();
  await action();
  await page.waitForFunction(() => {
    const audio = document.querySelector("audio");
    if (!audio) return false;
    if (audio.dataset.mockPlayback === "true") return audio.currentTime > 0;
    return audio.currentTime > 0 && audio.readyState >= 2;
  }, null, { timeout: timeoutMs });
  return Date.now() - start;
};

const expectPlaybackProgress = async (page, seconds, timeoutMs = 15_000) => {
  const snapshot = await page.evaluate(getAudio);
  if (!snapshot) {
    throw new Error("Audio element not found");
  }

  const targetTime = snapshot.currentTime + seconds;
  await page.waitForFunction(
    (target) => {
      const audio = document.querySelector("audio");
      return !!audio && audio.currentTime >= target;
    },
    targetTime,
    { timeout: timeoutMs }
  );
};

const expectPlaybackProgressing = async (page, seconds, timeoutMs = 20_000) => {
  const snapshot = await page.evaluate(getAudio);
  if (!snapshot) {
    throw new Error("Audio element not found");
  }

  const startTime = snapshot.currentTime;
  await page.waitForFunction(
    ({ start, seconds }) => {
      const audio = document.querySelector("audio");
      return !!audio && audio.currentTime - start >= seconds;
    },
    { start: startTime, seconds },
    { timeout: timeoutMs }
  );
};

module.exports = {
  expectAudioElement,
  expectAudioPlaying,
  measureTTFA,
  expectPlaybackProgress,
  expectPlaybackProgressing
};
