import { Page } from "@playwright/test";

export class LoginPage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto("/login");
  }

  async login(username: string, password: string) {
    await this.page.getByTestId("username").fill(username);
    await this.page.getByTestId("password").fill(password);
    await this.page.getByTestId("sign-in").click();
  }
}
