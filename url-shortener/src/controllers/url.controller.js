const validator = require("validator");
const urlService = require("../services/url.service");
const catchAsync = require("../utils/catchAsync");
const ApiError = require("../utils/ApiError");
const { successResponse } = require("../utils/apiResponse");

const createShortUrl = catchAsync(async (req, res) => {
  const { url } = req.body;

  if (!url) {
    throw new ApiError(400, "URL is required");
  }

  if (!validator.isURL(url)) {
    throw new ApiError(400, "Invalid URL");
  }

  const result = await urlService.createShortUrl(url);

  return successResponse(res, {
    statusCode: 201,
    message: "Short URL created successfully",
    data: {
      shortCode: result.shortCode,
      shortUrl: `${process.env.BASE_URL}/${result.shortCode}`,
    },
  });
});

const redirectUrl = catchAsync(async (req, res) => {
  const { shortCode } = req.params;

  const url = await urlService.getUrlByShortCode(shortCode);

  if (!url) {
    throw new ApiError(404, "Short URL not found");
  }

  if (!url.isActive) {
    throw new ApiError(410, "This link has been disabled");
  }

  await urlService.incrementClicks(shortCode);

  return res.redirect(url.originalUrl);
});

const getUrlStats = catchAsync(async (req, res) => {
  const { shortCode } = req.params;

  const url = await urlService.getUrlStats(shortCode);

  if (!url) {
    throw new ApiError(404, "Short URL not found");
  }

  return successResponse(res, {
    statusCode: 200,
    message: "URL statistics fetched successfully",
    data: url,
  });
});

module.exports = {
  createShortUrl,
  redirectUrl,
  getUrlStats
};
