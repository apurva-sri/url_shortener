const { errorResponse } = require("../utils/apiResponse");
const logger = require("../utils/logger");

const errorMiddleware = (err, req, res, next) => {
  logger.error(err);

  const statusCode = err.statusCode || 500;

  const message = err.statusCode ? err.message : "Internal Server Error";

  return errorResponse(res, {
    statusCode,
    message,
  });
};

module.exports = errorMiddleware;
