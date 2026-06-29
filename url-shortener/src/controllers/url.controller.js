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

  const result = await urlService.createShortUrl({
    originalUrl: url,
    userId: req.user.id,
  });

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

  await urlService.logClickAndIncrement(
    url.id,
    shortCode,
    req.ip,
    req.get("User-Agent"), //Because Express normalizes headers and req.get() is the cleaner Express API.
  );

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

const getMyUrls = catchAsync(async (req, res) => {
  const urls = await urlService.getMyUrls(req.user.id);

  return successResponse(res, {
    statusCode: 200,
    message: "URLs fetched successfully",
    data: urls,
  });
});

module.exports = {
  createShortUrl,
  redirectUrl,
  getUrlStats,
  getMyUrls,
};
