const { createClient } = require("redis");
const env = require("../config/env");

const redisClient = createClient({
  url: env.REDIS_URL,
});

redisClient.on("error", (err) => {
  logger.error("Redis Error:", err);
});

const connectRedis = async () => {
  if (!redisClient.isOpen) {
    await redisClient.connect();
    logger.info("✅ Redis Connected");
  }
};

module.exports = {
  redisClient,
  connectRedis,
};
