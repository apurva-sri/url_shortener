const validator = require("validator");
const urlService = require("../services/url.service");
const catchAsync = require("../utils/catchAsync");
const ApiError = require("../utils/ApiError");
const { successResponse } = require("../utils/apiResponse");
const isExpired = require("../utils/isExpired");

const createShortUrl = catchAsync(async (req, res) => {
  const result = await urlService.createShortUrl({
    originalUrl: req.body.originalUrl,
    alias: req.body.alias,
    expiresAt: req.body.expiresAt,
    userId: req.user.id,
  });

  return successResponse(res, {
    statusCode: 201,
    message: "Short URL created successfully",
    data: {
      shortCode: result.shortCode,
      shortUrl: `${process.env.BASE_URL}/${result.shortCode}`,
      expiresAt: result.expiresAt,
    },
  });
});

const redirectUrl = catchAsync(async (req, res) => {
  const { shortCode } = req.params;

  const url = await urlService.getUrlByShortCode(shortCode);

  if (!url) {
    throw new ApiError(404, "Short URL not found");
  }

  if (isExpired(url.expiresAt)) {
    throw new ApiError(410, "This link has expired");
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
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  const search = req.query.search?.trim() || "";

  const allowedSortFields = ["createdAt", "clicks", "originalUrl"];

  const sortBy = allowedSortFields.includes(req.query.sortBy)
    ? req.query.sortBy
    : "createdAt";

  const order = req.query.order === "asc" ? "asc" : "desc";

  const result = await urlService.getMyUrls(
    req.user.id,
    page,
    limit,
    search,
    sortBy,
    order,
  );

  return successResponse(res, {
    statusCode: 200,
    message: "URLs fetched successfully",
    data: result.urls,
    pagination: result.pagination,
  });
});

const updateUrl = catchAsync(async (req, res) => {
  const { originalUrl, isActive } = req.body;

  // Object that will be sent to Prisma
  const updateData = {};

  if (originalUrl !== undefined) {
    if (!validator.isURL(originalUrl)) {
      throw new ApiError(400, "Invalid URL");
    }

    updateData.originalUrl = originalUrl;
  }

  if (isActive !== undefined) {
    updateData.isActive = isActive;
  }

  // Nothing to update
  if (Object.keys(updateData).length === 0) {
    throw new ApiError(400, "No fields provided to update");
  }

  const updatedUrl = await urlService.updateUrl(
    req.params.id,
    req.user.id,
    updateData,
  );

  return successResponse(res, {
    statusCode: 200,
    message: "URL updated successfully",
    data: updatedUrl,
  });
});

const deleteUrl = catchAsync(async (req, res) => {
  await urlService.deleteUrl(req.params.id, req.user.id);

  return successResponse(res, {
    statusCode: 200,
    message: "URL deleted successfully",
  });
});

module.exports = {
  createShortUrl,
  redirectUrl,
  getUrlStats,
  getMyUrls,
  updateUrl,
  deleteUrl,
};
