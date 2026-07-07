const Joi = require("joi");

const registerSchema = Joi.object({
  email: Joi.string().email().trim().required(),

  password: Joi.string().min(8).max(30).required(),
});

const loginSchema = Joi.object({
  email: Joi.string().email().trim().required(),

  password: Joi.string().required(),
});

const verifyEmailSchema = Joi.object({
  email: Joi.string().email().trim().required(),

  otp: Joi.string().length(6).required(),
});

const resendOTPSchema = Joi.object({
  email: Joi.string().email().trim().required(),
});

module.exports = {
  registerSchema,
  loginSchema,
  verifyEmailSchema,
  resendOTPSchema,
};
