import { APIRequestContext } from "@playwright/test";

export class ApiClient {
  constructor(private request: APIRequestContext) {}

  async getHealth() {
    const response = await this.request.get("/health");
    return response;
  }

  async getCatalog() {
    const response = await this.request.get("/catalog");
    return response;
  }

  async login(username: string, password: string) {
    const response = await this.request.post("/auth/login", {
      data: { username, password }
    });
    return response;
  }

  async createPlaybackSession(payload: { deviceId?: string; trackId?: string; userId?: string }) {
    const response = await this.request.post("/playback/session", { data: payload });
    return response;
  }

  async sendEvent(payload: { type?: string; ts?: number; properties?: Record<string, unknown> }) {
    const response = await this.request.post("/events", { data: payload });
    return response;
  }
}
