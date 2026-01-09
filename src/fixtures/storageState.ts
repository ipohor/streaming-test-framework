import path from "path";

export const AUTH_DIR = path.join(process.cwd(), ".playwright", ".auth");

export const getStorageStatePath = (projectName: string) => {
  return path.join(AUTH_DIR, `${projectName}.json`);
};
