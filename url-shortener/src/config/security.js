const helmet = require("helmet");
const compression = require("compression");
const rateLimit = require("express-rate-limit");
const morgan = require("morgan");


const helmetMiddleware = helmet();

const compressionMiddleware = compression();

const requestLogger = morgan("dev");

const rateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes

    max: 200,

    standardHeaders: true,

    legacyHeaders: false,

    message: {
      success: false,
      message: "Too many requests. Please try again later.",
    },
});

module.exports = {
    helmetMiddleware,
    compressionMiddleware,
    requestLogger,
    rateLimiter
};
