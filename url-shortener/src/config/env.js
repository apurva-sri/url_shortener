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

  CLOUDINARY_CLOUD_NAME: str(),
  CLOUDINARY_API_KEY: str(),
  CLOUDINARY_API_SECRET: str(),
  CLOUDINARY_QR_FOLDER: str({ default: "linkPilot/qr_code" }),
  CLOUDINARY_AVATAR_FOLDER: str({ default: "linkPilot/Profile_photo" }),
});

module.exports = env;
