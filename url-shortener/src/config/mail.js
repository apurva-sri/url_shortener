const nodemailer = require("nodemailer");
const env = require("../config/env");
const logger = require("../utils/logger");
// logger.info(env.SMTP_EMAIL);
// logger.info(env.SMTP_PASSWORD);
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: env.SMTP_EMAIL,
    pass: env.SMTP_PASSWORD,
  },
});

transporter.verify((error, success) => {
  if (error) {
    logger.info(error);
  } else {
    logger.info("SMTP Server Ready");
  }
});

module.exports = transporter;
