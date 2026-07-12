const PREFIX = "urlshort";

const redisKey = (...parts) => {
  return `${PREFIX}:${parts.join(":")}`;
};

module.exports = redisKey;
