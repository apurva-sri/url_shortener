const maskIp = (ip) => {
  if (!ip) return "Unknown";

  const parts = ip.split(".");

  if (parts.length !== 4) {
    return ip;
  }

  return `${parts[0]}.${parts[1]}.xxx.xxx`;
};

module.exports = {maskIp};