const nodemailer = require("nodemailer");

// console.log(process.env.SMTP_EMAIL);
// console.log(process.env.SMTP_PASSWORD);
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SMTP_EMAIL,
    pass: process.env.SMTP_PASSWORD,
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
