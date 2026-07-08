const prisma = require("../config/db");
const generateShortCode = require("../utils/generateShortCode");
const { RESERVED_ALIASES } = require("../config/constants");
const ApiError = require("../utils/ApiError");

const createShortUrl = async ({ originalUrl, alias, userId }) => {
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
};
