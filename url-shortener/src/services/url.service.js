const prisma = require("../config/db");
const generateShortCode = require("../utils/generateShortCode");

const createShortUrl = async ({originalUrl, userId,}) => {
  const shortCode = generateShortCode();

  const url = await prisma.url.create({
    data: {
      originalUrl,
      shortCode,
      userId,
    },
  });

  return url;
};

const getUrlById = async (id) => {
  return await prisma.url.findFirst({
    //Findunique() only accepts unique fields. the query is no longer based solely on a unique field, so Prisma requires findFirst()
    where: {
      id,
      isActive: true,
    },
  });
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

const logClick = async (urlId, ipAddress, userAgent) => {
  return await prisma.click.create({
    data: {
      urlId,
      ipAddress,
      userAgent,
    },
  });
};

const logClickAndIncrement = async (urlId, shortCode, ipAddress, userAgent) => {
  return await prisma.$transaction(async (tx) => {
    await tx.click.create({
      data: {
        urlId,
        ipAddress,
        userAgent,
      },
    });

    await tx.url.update({
      where: {
        shortCode,
      },
      data: {
        clicks: {
          increment: 1,
        },
      },
    });
  });
};

const getMyUrls = async (userId) => {
  return await prisma.url.findMany({
    where: {
      userId,
      isActive: true,
    },
    orderBy: {
      createdAt: "desc",
    },
    select: {
      id: true,
      originalUrl: true,
      shortCode: true,
      clicks: true,
      isActive: true,
      createdAt: true,
    },
  });
};

const updateUrl = async (id, data) => {
  return await prisma.url.update({
    where: {
      id,
    },
    data,
  });
};

const deleteUrl = async (id) => {
  return await prisma.url.update({
    where: {
      id,
    },
    data: {
      isActive: false,
    },
  });
};

module.exports = {
  createShortUrl,
  getUrlById,
  getUrlByShortCode,
  incrementClicks,
  getUrlStats,
  logClick,
  logClickAndIncrement,
  getMyUrls,
  updateUrl,
  deleteUrl,
};
