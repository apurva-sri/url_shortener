const authService = require("../services/auth.service");
const catchAsync = require("../utils/catchAsync");
const ApiError = require("../utils/ApiError");
const { successResponse } = require("../utils/apiResponse");

const register = catchAsync(async (req, res) => {
  const result = await authService.register(req.body);

  return successResponse(res, {
    statusCode: 201,
    message: "Registration successful",
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

module.exports = {
  register,
  login,
};
