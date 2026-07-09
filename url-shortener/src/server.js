const app = require("./app");
const { connectRedis, redisClient } = require("./config/redis");
const prisma = require("./config/db");

const PORT = process.env.PORT || 5000;

let server;

const startServer = async () => {
  try {
    await connectRedis();

    server = app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error("Failed to start server:", err);
    process.exit(1);
  }
};

startServer();

const shutdown = async () => {
  console.log("\n🛑 Shutting down server...");

  try {
    server.close(async () => {
      await prisma.$disconnect();

      if (redisClient.isOpen) {
        await redisClient.quit();
      }

      console.log("✅ Resources released successfully.");
      process.exit(0);
    });
  } catch (err) {
    console.error("Shutdown error:", err);
    process.exit(1);
  }
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
