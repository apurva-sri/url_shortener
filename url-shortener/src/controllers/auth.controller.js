const authService = require("../services/auth.service");
const catchAsync = require("../utils/catchAsync");
const ApiError = require("../utils/ApiError");
const { successResponse } = require("../utils/apiResponse");

const register = catchAsync(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError(400, "Email and password are required");
  }

  const result = await authService.register({
    email,
    password,
  });

  return successResponse(res, {
    statusCode: 201,
    message: "User registered successfully",
    data: result,
  });
});

const login = catchAsync(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError(400, "Email and password are required");
  }

  const result = await authService.login({
    email,
    password,
  });

  return successResponse(res, {
    statusCode: 200,
    message: "Login successful",
    data: result,
  });
});

module.exports = {
  register,
  login,
};
