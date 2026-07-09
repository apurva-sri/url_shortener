const transporter = require("../config/mail");
const env = require("../config/env");

const sendEmail = async ({ to, subject, html }) => {
  await transporter.sendMail({
    from: `"URL Shortener" <${env.SMTP_EMAIL}>`,
    to,
    subject,
    html,
  });
};

module.exports = {
  sendEmail,
};
