const { env } = require("../config/env");

const getTestUser = () => {
  return {
    username: env.testUsername,
    password: env.testPassword,
    userId: env.testUsername
  };
};

module.exports = { getTestUser };
