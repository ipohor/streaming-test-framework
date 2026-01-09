import { Page } from "@playwright/test";

type ConsoleEntry = {
  type: string;
  text: string;
};

const defaultAllowlist = ["Failed to load resource"]; // allowlist benign dev errors

export class ConsoleTracker {
  private entries: ConsoleEntry[] = [];
  private errors: ConsoleEntry[] = [];

  constructor(private page: Page, private allowlist: string[] = defaultAllowlist) {
    this.page.on("console", (message) => {
      const entry = { type: message.type(), text: message.text() };
      this.entries.push(entry);
      if (message.type() === "error" && !this.isAllowed(entry.text)) {
        this.errors.push(entry);
      }
    });

    this.page.on("pageerror", (error) => {
      const entry = { type: "pageerror", text: error.message };
      this.entries.push(entry);
      if (!this.isAllowed(entry.text)) {
        this.errors.push(entry);
      }
    });
  }

  private isAllowed(message: string) {
    return this.allowlist.some((allowed) => message.includes(allowed));
  }

  getEntries() {
    return [...this.entries];
  }

  getErrors() {
    return [...this.errors];
  }
}
