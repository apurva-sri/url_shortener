const OTP_TTL_SECONDS = 300;

const OTP_MAX_ATTEMPTS = 5;

const OTP_RESEND_COOLDOWN = 60;

const BCRYPT_SALT_ROUNDS = 10;

const RESERVED_ALIASES = [
  "login",
  "register",
  "logout",
  "dashboard",
  "admin",
  "api",
  "docs",
  "pricing",
  "about",
  "contact",
];

const QR_CODE_OPTIONS = {
  errorCorrectionLevel: "H",
  margin: 2,
  width: 300,
};

const QR_CACHE_TTL = 60 * 60 * 24;

module.exports = {
  OTP_TTL_SECONDS,
  OTP_MAX_ATTEMPTS,
  OTP_RESEND_COOLDOWN,
  RESERVED_ALIASES,
  BCRYPT_SALT_ROUNDS,
  QR_CODE_OPTIONS,
  QR_CACHE_TTL,
};
