const bcrypt = require("bcrypt");
const redis = require("../config/redis");
const { generateOTP } = require("../utils/otp");
const ApiError = require("../utils/ApiError");

const storeOTP = async (email) => {
  const otp = generateOTP();

  const otpHash = await bcrypt.hash(otp, 10);

  const value = JSON.stringify({
    otpHash,
    attempts: 0,
  });

  await redis.set(`otp:${email}`, value, {
    EX: 300,
  });

  return otp;
};

const verifyOTP = async (email, otp) => {
  const data = await redis.get(`otp:${email}`);

  if (!data) {
    throw new ApiError(400, "OTP expired or not found");
  }

  const parsed = JSON.parse(data);

  const isValid = await bcrypt.compare(otp, parsed.otpHash);

  if (!isValid) {
    parsed.attempts++;

    await redis.set(`otp:${email}`, JSON.stringify(parsed), {
      EX: 300,
    });

    throw new ApiError(400, "Invalid OTP");
  }

  return true;
};

const deleteOTP = async (email) => {
  await redis.del(`otp:${email}`);
};

const resendOTP = async (email) => {
  return await storeOTP(email);
};

module.exports = {
  storeOTP,
  verifyOTP,
  deleteOTP,
  resendOTP,
};