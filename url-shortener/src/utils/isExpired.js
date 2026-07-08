const isExpired = (expiresAt) => {
  if (!expiresAt) {
    return false;
  }

  return expiresAt.getTime() <= Date.now();
};

module.exports = isExpired;
