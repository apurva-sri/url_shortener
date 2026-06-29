const ApiError = require("../utils/ApiError");
const catchAsync = require("../utils/catchAsync");
const urlService = require("../services/url.service");

const checkUrlOwnership = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const url = await urlService.getUrlById(id);

  if (!url) {
    throw new ApiError(404, "URL not found");
  }

  if (url.userId !== req.user.id) {
    throw new ApiError(403, "Forbidden");
  }

  req.urlData = url;

  next();
});

module.exports = {
  checkUrlOwnership,
};
