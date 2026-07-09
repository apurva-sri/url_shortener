const { cleanEnv, str, port } = require("envalid");

const env = cleanEnv(process.env, {
  PORT: port({
    default: 5000,
  }),

  DATABASE_URL: str(),

  JWT_SECRET: str(),

  JWT_EXPIRES_IN: str(),

  BASE_URL: str(),

  REDIS_URL: str(),

  SMTP_HOST: str(),

  SMTP_PORT: port(),

  SMTP_EMAIL: str(),

  SMTP_PASSWORD: str(),
});

module.exports = env;
