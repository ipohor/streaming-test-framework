class LoginPage {
  constructor(page) {
    this.page = page;
  }

  async goto() {
    await this.page.goto("/login");
  }

  async login(username, password) {
    await this.page.getByTestId("username").fill(username);
    await this.page.getByTestId("password").fill(password);
    await this.page.getByTestId("sign-in").click();
  }
}

module.exports = { LoginPage };
