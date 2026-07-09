const prisma = require("../config/db");
const { redisClient } = require("../config/redis");

const healthCheck = async (req, res) => {
  let database = "disconnected";
  let redis = "disconnected";

  try {
    await prisma.$queryRaw`SELECT 1`;
    database = "connected";
  } catch {}

  try {
    if (redisClient.isOpen) {
      await redisClient.ping();
      redis = "connected";
    }
  } catch {}

  return res.status(200).json({
    success: true,
    status: "OK",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    services: {
      database,
      redis,
    },
  });
};

module.exports = {
  healthCheck,
};
