const prisma = require("../config/db");
const generateShortCode = require("../utils/generateShortCode");

const createShortUrl = async (originalUrl) => {
  const shortCode = generateShortCode();

  const url = await prisma.url.create({
    data: {
      originalUrl,
      shortCode,
    },
  });

  return url;
};

const getUrlByShortCode = async (shortCode) => {
  return await prisma.url.findUnique({
    where: {
      shortCode,
    },
  });
};

const incrementClicks = async (shortCode) => {
  return await prisma.url.update({
    where: {
      shortCode,
    },
    data: {
      clicks: {
        increment: 1,
      },
    },
  });
};

const getUrlStats = async (shortCode) => {
  return await prisma.url.findUnique({
    where: {
      shortCode,
    },
    select: {
      originalUrl: true,
      shortCode: true,
      clicks: true,
      createdAt: true,
      isActive: true,
    },
  });
};

module.exports = {
  createShortUrl,
  getUrlByShortCode,
  incrementClicks,
  getUrlStats,
};
