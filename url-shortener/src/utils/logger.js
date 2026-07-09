const pino = require("pino");
// const env = require("./config/env");

const logger = pino({
//   level: env.NODE_ENV === "production" ? "info" : "debug",
  transport: {
    target: "pino-pretty",
    options: {
      colorize: true,
      translateTime: "SYS:standard",
      ignore: "pid,hostname",
    },
  },
});

module.exports = logger;
