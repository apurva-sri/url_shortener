const { errorResponse } = require("../utils/apiResponse");

const errorMiddleware = (err, req, res, next) => {
  console.error(err);

  const statusCode = err.statusCode || 500;

  const message = err.statusCode ? err.message : "Internal Server Error";

  return errorResponse(res, {
    statusCode,
    message,
  });
};

module.exports = errorMiddleware;
