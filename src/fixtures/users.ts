import { env } from "../config/env";

export const getTestUser = () => {
  return {
    username: env.testUsername,
    password: env.testPassword,
    userId: env.testUsername
  };
};
