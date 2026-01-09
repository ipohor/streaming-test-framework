import fs from "fs/promises";
import path from "path";
import { env } from "../config/env";
import { AUTH_DIR, getStorageStatePath } from "./storageState";

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
        await fs.writeFile(storagePath, JSON.stringify(storageState, null, 2), "utf-8");
      }
    })
  );
};

export default globalSetup;
