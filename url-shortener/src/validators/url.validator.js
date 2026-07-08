const Joi = require("joi");

const createUrlSchema = Joi.object({
  originalUrl: Joi.string()
    .uri({
      scheme: ["http", "https"],
    })
    .required(),

  alias: Joi.string()
    .trim()
    .lowercase()
    .min(3)
    .max(30)
    .pattern(/^[a-zA-Z0-9_-]+$/)
    .optional(),
});

module.exports = { createUrlSchema };
