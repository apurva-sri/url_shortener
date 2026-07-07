const prisma = require("../config/db");
const bcrypt = require("bcrypt");
const { generateToken } = require("../utils/jwt");
const ApiError = require("../utils/ApiError");
const otpService = require("./otp.service");
const emailService = require("./email.service");

const register = async ({ email, password }) => {
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    if (existingUser.isVerified) {
      throw new ApiError(409, "User already exists");
    }

    throw new ApiError(400, "Email already registered but not verified.");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      isVerified: false,
    },
  });

  try {
    const otp = await otpService.storeOTP(email);

    await emailService.sendEmail({
      to: email,
      subject: "Verify Your Email",
      html: `
        <h2>Verify Your Email</h2>
        <p>Your OTP is:</p>
        <h1>${otp}</h1>
        <p>This OTP expires in 5 minutes.</p>
      `,
    });

    return {
      email: user.email,
    };
  } catch (error) {

    try {
      await otpService.deleteOTP(email);
    } catch (err) {
      console.error("Failed to delete OTP:", err);
    }

    try {
      await prisma.user.delete({
        where: { id: user.id },
      });
    } catch (err) {
      console.error("Failed to delete user:", err);
    }

    throw error;
  }
};

const verifyEmail = async ({ email, otp }) => {
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  if (user.isVerified) {
    throw new ApiError(400, "Email already verified");
  }

  await otpService.verifyOTP(email, otp);

  const updatedUser = await prisma.user.update({
    where: {
      email,
    },

    data: {
      isVerified: true,
    },
  });

  await otpService.deleteOTP(email);

  const token = generateToken({
    userId: updatedUser.id,

    email: updatedUser.email,
  });

  return {
    user: {
      id: updatedUser.id,

      email: updatedUser.email,

      createdAt: updatedUser.createdAt,
    },

    token,
  };
};

const login = async ({ email, password }) => {
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!user) {
    throw new ApiError(401, "Invalid email or password");
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid email or password");
  }

  const token = generateToken({
    userId: user.id,
    email: user.email,
  });

  return {
    user: {
      id: user.id,
      email: user.email,
      createdAt: user.createdAt,
    },
    token,
  };
};

const resendOTP = async ({ email }) => {
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  if (user.isVerified) {
    throw new ApiError(400, "Email already verified");
  }

  const otp = await otpService.resendOTP(email);

  await emailService.sendEmail({
    to: email,

    subject: "Verify Your Email",

    html: `
      <h2>Verify Your Email</h2>

      <p>Your OTP is:</p>

      <h1>${otp}</h1>

      <p>This OTP expires in 5 minutes.</p>
    `,
  });

  return {
    email,
  };
};


module.exports = {
  register,
  login,
  verifyEmail,
  resendOTP,
};
