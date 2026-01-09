class ApiClient {
  constructor(request) {
    this.request = request;
  }

  async getHealth() {
    return this.request.get("/health");
  }

  async getCatalog() {
    return this.request.get("/catalog");
  }

  async login(username, password) {
    return this.request.post("/auth/login", {
      data: { username, password }
    });
  }

  async createPlaybackSession(payload) {
    return this.request.post("/playback/session", { data: payload });
  }

  async sendEvent(payload) {
    return this.request.post("/events", { data: payload });
  }
}

module.exports = { ApiClient };
