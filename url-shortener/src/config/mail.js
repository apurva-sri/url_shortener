const nodemailer = require("nodemailer");
const env = require("../config/env");
const logger = require("../utils/logger");

const transporter = nodemailer.createTransport({
  host: env.SMTP_HOST,
  port: Number(env.SMTP_PORT),
  secure: false, // STARTTLS on port 587
  requireTLS: true,
  auth: {
    user: env.SMTP_EMAIL,
    pass: env.SMTP_PASSWORD,
  },
});

transporter.verify((error) => {
  if (error) {
    logger.error({ err: error }, "SMTP Error");
  } else {
    logger.info("✅ Brevo SMTP Ready");
  }
});

module.exports = transporter;
