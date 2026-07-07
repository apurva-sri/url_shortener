const bcrypt = require("bcrypt");
const { redisClient } = require("../config/redis");
const { generateOTP } = require("../utils/otp");
const { OTP_TTL_SECONDS, OTP_MAX_ATTEMPTS } = require("../config/constants");
const ApiError = require("../utils/ApiError");


const storeOTP = async (email) => {
  const otp = generateOTP();

  const otpHash = await bcrypt.hash(otp, 10);

  const payload = JSON.stringify({
    otpHash,
    attempts: 0,
  });

  await redisClient.set(`otp:${email}`, payload, {
    EX: OTP_TTL_SECONDS,
  });

  return otp;
};



const verifyOTP = async (
  email,
  otp
) => {

  const data =
    await redisClient.get(
      `otp:${email}`
    );

  if (!data) {
    throw new ApiError(
      400,
      "OTP expired or not found"
    );
  }

  const payload = JSON.parse(data);

  const isMatch =
    await bcrypt.compare(
      otp,
      payload.otpHash
    );

  if (!isMatch) {

    payload.attempts++;

    if (payload.attempts >= OTP_MAX_ATTEMPTS) {
      await redisClient.del(`otp:${email}`);

      throw new ApiError(
        400,
        "Too many attempts. Please request a new OTP."
      );
    }

    const ttl = await redisClient.ttl(`otp:${email}`);

    await redisClient.set(
      `otp:${email}`,
      JSON.stringify(payload),
      {
        EX: ttl,
      }
    );

    throw new ApiError(
      400,
      "Invalid OTP"
    );
  }

  await redisClient.del(
    `otp:${email}`
  );

  return true;
};

const deleteOTP = async (email) => {
  await redisClient.del(`otp:${email}`);
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
