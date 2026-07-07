const authService = require("../services/auth.service");
const catchAsync = require("../utils/catchAsync");
const ApiError = require("../utils/ApiError");
const { successResponse } = require("../utils/apiResponse");

const register = catchAsync(async (req, res) => {
  const result = await authService.register(req.body);

  return successResponse(res, {
    statusCode: 201,

    message: "OTP sent successfully",

    data: result,
  });
});

const login = catchAsync(async (req, res) => {
  const result = await authService.login(req.body);

  return successResponse(res, {
    statusCode: 200,
    message: "Login successful",
    data: result,
  });
});

const emailService = require("../services/email.service");

const testEmail = catchAsync(async (req, res) => {
  await emailService.sendEmail({
    to: req.body.email,
    subject: "Email Service Working",
    html: `
      <h1>Hello Apurva 🚀</h1>

      <p>Email service is working successfully.</p>
    `,
  });

  return successResponse(res, {
    statusCode: 200,
    message: "Email sent successfully",
  });
});

module.exports = {
  register,
  login,
  testEmail
};
