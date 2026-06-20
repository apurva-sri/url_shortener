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

module.exports = {
  createShortUrl,
};
