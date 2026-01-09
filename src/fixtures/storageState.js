const path = require("path");

const AUTH_DIR = path.join(process.cwd(), ".playwright", ".auth");

const getStorageStatePath = (projectName) => {
  return path.join(AUTH_DIR, `${projectName}.json`);
};

module.exports = { AUTH_DIR, getStorageStatePath };
