const fs = require("fs/promises");
const path = require("path");

const { env } = require("../config/env");
const { AUTH_DIR, getStorageStatePath } = require("./storageState");

const globalSetup = async () => {
  await fs.mkdir(AUTH_DIR, { recursive: true });

  const storageState = {
    cookies: [],
    origins: [
      {
        origin: env.webBaseUrl,
        localStorage: [
          { name: "mockToken", value: "mock-token" },
          { name: "mockUserId", value: env.testUsername }
        ]
      }
    ]
  };

  const projectNames = ["chromium", "webkit"];

  await Promise.all(
    projectNames.map(async (projectName) => {
      const storagePath = getStorageStatePath(projectName);
      try {
        await fs.access(storagePath);
        return;
      } catch {
        await fs.mkdir(path.dirname(storagePath), { recursive: true });
        await fs.writeFile(storagePath, JSON.stringify(storageState, null, 2), "utf-8");
      }
    })
  );
};

module.exports = globalSetup;
