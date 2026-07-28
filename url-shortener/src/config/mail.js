const env = require("../config/env");
const logger = require("../utils/logger");

// SMTP transporter is no longer used — email is now sent via Brevo's HTTP API
// (see src/services/email.service.js) to avoid ETIMEDOUT on cloud platforms
// that block outbound SMTP ports.

logger.info("📧 Email service: Brevo HTTP API (api.brevo.com)");
logger.info(`📤 Sender: ${env.SENDER_NAME} <${env.SENDER_EMAIL}>`);
