const nodemailer = require("nodemailer");
const env = require("../config/env");
const logger = require("../utils/logger");

const transporter = nodemailer.createTransport({
  host: env.SMTP_HOST,
  port: Number(env.SMTP_PORT),
  secure: false, // STARTTLS on port 587

  auth: {
    user: env.SMTP_EMAIL,
    pass: env.SMTP_PASSWORD,
  },
});

transporter.verify((error) => {
  if (error) {
    logger.error("SMTP Error:", error);
  } else {
    logger.info("✅ Brevo SMTP Ready");
  }
});

module.exports = transporter;
