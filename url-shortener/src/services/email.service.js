const env = require("../config/env");
const logger = require("../utils/logger");

const sendEmail = async ({ to, subject, html }) => {
  const response = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      "accept": "application/json",
      "api-key": env.BREVO_API_KEY,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      sender: {
        name: env.SENDER_NAME,
        email: env.SENDER_EMAIL,
      },
      to: [{ email: to }],
      subject,
      htmlContent: html,
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    logger.error({ status: response.status, body: errorBody }, "Brevo API Error");
    throw new Error(`Brevo API Error: ${response.status} - ${errorBody}`);
  }
};

module.exports = {
  sendEmail,
};
