const prisma = require("../config/db");
const UAParser = require("ua-parser-js");
const ApiError = require("../utils/ApiError");
const {maskIp} = require("../utils/maskIp");
const { redisClient } = require("../config/redis");
const { ANALYTICS_CACHE_TTL } = require("../config/constants");

const getUrlAnalytics = async (urlId, userId) => {
    const cacheKey = `analytics:${urlId}`;

    const cachedAnalytics = await redisClient.get(cacheKey);

    if (cachedAnalytics) {
      return JSON.parse(cachedAnalytics);
    }

  const url = await prisma.url.findFirst({
    where: {
      id: urlId,
      userId,
      isActive: true,
    },

    include: {
      clickLogs: {
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });

  if (!url) {
    throw new ApiError(404, "URL not found");
  }

  const parser = new UAParser();

  const deviceStats = {};
  const clicksPerDay = {};
  const browserStats = {};
  const recentVisitors = [];

  for (const click of url.clickLogs) {
    parser.setUA(click.userAgent || "");

    const device = parser.getDevice().type || "Desktop";

    const browser = parser.getBrowser().name || "Unknown";

    deviceStats[device] = (deviceStats[device] || 0) + 1;

    browserStats[browser] = (browserStats[browser] || 0) + 1;

    const date = click.createdAt.toISOString().split("T")[0];

    clicksPerDay[date] = (clicksPerDay[date] || 0) + 1;

    recentVisitors.push({
      browser,
      device,
      ipAddress: maskIp(click.ipAddress),
      visitedAt: click.createdAt,
    });
  }

  const deviceStatsArray = Object.entries(deviceStats).map(([name, count]) => ({
    name,
    count,
  }));

  const browserStatsArray = Object.entries(browserStats).map(
    ([name, count]) => ({
      name,
      count,
    }),
  );

  const clicksPerDayArray = Object.entries(clicksPerDay)
    .map(([date, clicks]) => ({
      date,
      clicks,
    }))
    .sort((a, b) => a.date.localeCompare(b.date));

  const latestVisitors = recentVisitors.slice(0, 10);

  const analytics = {
    totalClicks: url.clicks,

    deviceStats: deviceStatsArray,

    browserStats: browserStatsArray,

    clicksPerDay: clicksPerDayArray,

    recentVisitors: latestVisitors,
  };

  await redisClient.set(cacheKey, JSON.stringify(analytics), {
    EX: ANALYTICS_CACHE_TTL,
  });

  return analytics;
};

module.exports = {
  getUrlAnalytics,
};
