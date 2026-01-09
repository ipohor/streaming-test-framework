const defaultAllowlist = ["Failed to load resource"];

class ConsoleTracker {
  constructor(page, allowlist = defaultAllowlist) {
    this.page = page;
    this.allowlist = allowlist;
    this.entries = [];
    this.errors = [];

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

  isAllowed(message) {
    return this.allowlist.some((allowed) => message.includes(allowed));
  }

  getEntries() {
    return [...this.entries];
  }

  getErrors() {
    return [...this.errors];
  }
}

module.exports = { ConsoleTracker };
