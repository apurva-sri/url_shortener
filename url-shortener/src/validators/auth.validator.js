const Joi = require("joi");

const registerSchema = Joi.object({
  email: Joi.string().email().trim().required(),

  password: Joi.string().min(8).max(30).required(),
});

const loginSchema = Joi.object({
  email: Joi.string().email().trim().required(),

  password: Joi.string().required(),
});

module.exports = {
  registerSchema,
  loginSchema,
};
