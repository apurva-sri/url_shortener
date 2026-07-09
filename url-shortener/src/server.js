const app = require("./app");
const { connectRedis, redisClient } = require("./config/redis");
const prisma = require("./config/db");
const env = require("./config/env");
const logger = require("./utils/logger");

const PORT = env.PORT;

let server;

const startServer = async () => {
  try {
    await connectRedis();

    server = app.listen(PORT, () => {
      logger.info(`🚀 Server running on port ${PORT}`);
    });
  } catch (err) {
    logger.error("Failed to start server:", err);
    process.exit(1);
  }
};

startServer();

const shutdown = async () => {
  logger.info("\n🛑 Shutting down server...");

  try {
    server.close(async () => {
      await prisma.$disconnect();

      if (redisClient.isOpen) {
        await redisClient.quit();
      }

      logger.info("✅ Resources released successfully.");
      process.exit(0);
    });
  } catch (err) {
    logger.error("Shutdown error:", err);
    process.exit(1);
  }
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
