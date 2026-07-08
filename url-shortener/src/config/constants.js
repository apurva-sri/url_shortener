const OTP_TTL_SECONDS = 300;

const OTP_MAX_ATTEMPTS = 5;

const OTP_RESEND_COOLDOWN = 60;

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

module.exports = {
  OTP_TTL_SECONDS,
  OTP_MAX_ATTEMPTS,
  OTP_RESEND_COOLDOWN,
  RESERVED_ALIASES,
};
