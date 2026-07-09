const nodemailer = require("nodemailer");
const env = require("../config/env");

// console.log(env.SMTP_EMAIL);
// console.log(env.SMTP_PASSWORD);
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: env.SMTP_EMAIL,
    pass: env.SMTP_PASSWORD,
  },
});

transporter.verify((error, success) => {
  if (error) {
    console.log(error);
  } else {
    console.log("SMTP Server Ready");
  }
});

module.exports = transporter;
