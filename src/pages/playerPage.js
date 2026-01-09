class PlayerPage {
  constructor(page) {
    this.page = page;
  }

  async play() {
    await this.page.getByTestId("play").click();
  }

  async pause() {
    await this.page.getByTestId("pause").click();
  }

  async like() {
    await this.page.getByTestId("like").click();
  }

  async skip() {
    await this.page.getByTestId("skip").click();
  }

  nowPlaying() {
    return this.page.getByTestId("now-playing");
  }

  playbackReady() {
    return this.page.getByTestId("playback-ready");
  }

  audio() {
    return this.page.getByTestId("audio");
  }
}

module.exports = { PlayerPage };
