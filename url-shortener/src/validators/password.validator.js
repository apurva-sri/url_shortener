const Joi = require("joi");

const setPasswordSchema = Joi.object({
  password: Joi.string().min(6).max(100).required(),
});

const verifyPasswordSchema = Joi.object({
  shortCode: Joi.string().required(),

  password: Joi.string().required(),
});

module.exports = {
  setPasswordSchema,
  verifyPasswordSchema,
};
