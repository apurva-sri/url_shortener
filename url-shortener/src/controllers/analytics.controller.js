const analyticsService = require("../services/analytics.service");
const catchAsync = require("../utils/catchAsync");
const { successResponse } = require("../utils/apiResponse");

const getUrlAnalytics = catchAsync(async (req, res) => {
  const analytics = await analyticsService.getUrlAnalytics(
    req.params.id,
    req.user.id,
  );

  return successResponse(res, {
    statusCode: 200,
    message: "Analytics fetched successfully",
    data: analytics,
  });
});

module.exports = {
  getUrlAnalytics,
};
