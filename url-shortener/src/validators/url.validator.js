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
    .pattern(/^[a-z0-9_-]+$/)
    .optional(),

  expiresAt: Joi.date().greater("now").optional(),
});

module.exports = {
  createUrlSchema,
};
