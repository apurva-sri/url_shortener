const prisma = require("../config/db");
const env = require("../config/env");
const generateShortCode = require("../utils/generateShortCode");
const {
  RESERVED_ALIASES,
  BCRYPT_SALT_ROUNDS,
  QR_CACHE_TTL,
} = require("../config/constants");
const ApiError = require("../utils/ApiError");
const bcrypt = require("bcrypt");
const qrService = require("./qr.service");
const { redisClient } = require("../config/redis");

const createShortUrl = async ({ originalUrl, alias, expiresAt, userId }) => {
  if (alias && !userId) {
    throw new ApiError(403, "Login required to use custom alias.");
  }

  if (alias && RESERVED_ALIASES.includes(alias)) {
    throw new ApiError(400, "This alias is reserved.");
  }

  if (alias) {
    const existing = await prisma.url.findUnique({
      where: {
        shortCode: alias,
      },
    });

    if (existing) {
      throw new ApiError(409, "Alias already exists.");
    }
  }

  const shortCode = alias || generateShortCode();

  const url = await prisma.url.create({
    data: {
      originalUrl,
      shortCode,
      expiresAt,
      userId,
    },
  });

  return url;
};

// const getUrlById = async (id) => {
//   return await prisma.url.findFirst({
//     //Findunique() only accepts unique fields. the query is no longer based solely on a unique field, so Prisma requires findFirst()
//     where: {
//       id,
//       isActive: true,
//     },
//   });
// };

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
  await prisma.$transaction(async (tx) => {
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

  await redisClient.del(`analytics:${urlId}`);
};

const getMyUrls = async (userId, page, limit, search, sortBy, order) => {
  const skip = (page - 1) * limit;

  const where = {
    userId,
    isActive: true,
  };

  if (search) {
    where.OR = [
      {
        originalUrl: {
          contains: search,
          mode: "insensitive",
        },
      },
      {
        shortCode: {
          contains: search,
          mode: "insensitive",
        },
      },
    ];
  }

  const orderBy = {
    [sortBy]: order,
  };

  const [urls, totalUrls] = await Promise.all([
    prisma.url.findMany({
      where,
      orderBy,
      skip,
      take: limit,
      select: {
        id: true,
        originalUrl: true,
        shortCode: true,
        clicks: true,
        isActive: true,
        createdAt: true,
      },
    }),

    prisma.url.count({
      where,
    }),
  ]);

  return {
    urls,
    pagination: {
      total: totalUrls,
      page,
      limit,
      totalPages: Math.ceil(totalUrls / limit),
    },
  };
};

const updateUrl = async (id, userId, data) => {
  const url = await prisma.url.findFirst({
    where: {
      id,
      userId,
      isActive: true,
    },
  });

  if(!url){
    throw new ApiError(404, "URL not found");
  }

  return await prisma.url.update({
    where: {
      id,
    },

    data,
  });
};

const deleteUrl = async (id, userId) => {
  const url = await prisma.url.findFirst({
    where: {
      id,
      userId,
      isActive: true,
    },
  });

  if (!url) {
    throw new ApiError(404, "URL not found");
  }

  return await prisma.url.update({
    where: {
      id,
    },
    data: {
      isActive: false,
    },
  });
};

const enablePasswordProtection = async (id, userId, password) => {
  const url = await prisma.url.findFirst({
    where: {
      id,
      userId,
      isActive: true,
    },
  });

  if (!url) {
    throw new ApiError(404, "URL not found");
  }

  const hashedPassword = await bcrypt.hash(password, BCRYPT_SALT_ROUNDS);

  return await prisma.url.update({
    where: {
      id,
    },
    data: {
      password: hashedPassword,
    },
    select: {
      id: true,
      shortCode: true,
      password: false,
    },
  });
};

const removePasswordProtection = async (id, userId) => {
  const url = await prisma.url.findFirst({
    where: {
      id,
      userId,
      isActive: true,
    },
  });

  if (!url) {
    throw new ApiError(404, "URL not found");
  }

  return await prisma.url.update({
    where: {
      id,
    },
    data: {
      password: null,
    },
    select: {
      id: true,
      shortCode: true,
    },
  });
};

const verifyUrlPassword = async (shortCode, password, ipAddress, userAgent) => {
  const url = await prisma.url.findUnique({
    where: {
      shortCode,
    },
  });

  if (!url) {
    throw new ApiError(404, "Short URL not found");
  }

  if (!url.password) {
    throw new ApiError(400, "This URL is not password protected");
  }

  const isPasswordCorrect = await bcrypt.compare(password, url.password);

  if (!isPasswordCorrect) {
    throw new ApiError(401, "Invalid password");
  }

  await logClickAndIncrement(url.id, shortCode, ipAddress, userAgent);

  return {
    originalUrl: url.originalUrl,
  };
};

const getQRCode = async (id, userId) => {
  const url = await prisma.url.findFirst({
    where: {
      id,
      userId,
      isActive: true,
    },
  });

  if (!url) {
    throw new ApiError(404, "URL not found");
  }

  const cacheKey = `qr:${url.shortCode}`;

  const cachedQRCode = await redisClient.get(cacheKey);

  if (cachedQRCode) {
    return {
      qrCode: cachedQRCode,
    };
  }

  const shortUrl = `${env.BASE_URL}/${url.shortCode}`;

  const qrCode = await qrService.generateQRCode(shortUrl);

  await redisClient.set(cacheKey, qrCode, {
    EX: QR_CACHE_TTL, // 24 Hours
  });

  return {
    qrCode,
  };
};

module.exports = {
  createShortUrl,
  getUrlByShortCode,
  incrementClicks,
  getUrlStats,
  logClick,
  logClickAndIncrement,
  getMyUrls,
  updateUrl,
  deleteUrl,
  enablePasswordProtection,
  removePasswordProtection,
  verifyUrlPassword,
  getQRCode,
};
