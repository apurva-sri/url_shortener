const prisma = require("../config/db");
const env = require("../config/env");
const crypto = require("crypto");
const ApiError = require("../utils/ApiError");

const PLAN_PRICES = {
  STARTER: { amount: 8900, currency: "INR", label: "Starter Plan ($1)" }, // ₹89
  PRO: { amount: 149900, currency: "INR", label: "Pro Plan ($19)" },      // ₹1499
};

const createOrder = async (userId, plan) => {
  const targetPlan = (plan || "").toUpperCase();
  if (!PLAN_PRICES[targetPlan]) {
    throw new ApiError(400, "Invalid plan specified. Choose STARTER or PRO.");
  }

  const planDetails = PLAN_PRICES[targetPlan];
  const keyId = env.RAZORPAY_KEY_ID;
  const keySecret = env.RAZORPAY_KEY_SECRET;

  let orderId = `order_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

  if (keyId && keyId !== "rzp_test_dummy_key") {
    const authHeader = Buffer.from(`${keyId}:${keySecret}`).toString("base64");
    const response = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: {
        "Authorization": `Basic ${authHeader}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: planDetails.amount,
        currency: planDetails.currency,
        receipt: `receipt_${userId.substring(0, 8)}_${Date.now()}`,
        notes: {
          userId,
          plan: targetPlan,
        },
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new ApiError(500, `Razorpay Order Creation Failed: ${errText}`);
    }

    const orderData = await response.json();
    orderId = orderData.id;
  }

  return {
    orderId,
    amount: planDetails.amount,
    currency: planDetails.currency,
    keyId: env.RAZORPAY_KEY_ID,
    plan: targetPlan,
  };
};

const verifyPayment = async (userId, { razorpay_order_id, razorpay_payment_id, razorpay_signature, plan }) => {
  const targetPlan = (plan || "").toUpperCase();
  if (!["STARTER", "PRO"].includes(targetPlan)) {
    throw new ApiError(400, "Invalid plan specified.");
  }

  const keySecret = env.RAZORPAY_KEY_SECRET;

  if (env.RAZORPAY_KEY_ID !== "rzp_test_dummy_key") {
    const body = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expectedSignature = crypto
      .createHmac("sha256", keySecret)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      throw new ApiError(400, "Invalid payment signature verification failed.");
    }
  }

  // Update user plan directly in DB
  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: {
      plan: targetPlan,
    },
    select: {
      id: true,
      email: true,
      name: true,
      username: true,
      phone: true,
      avatar: true,
      plan: true,
      createdAt: true,
    },
  });

  return updatedUser;
};

module.exports = {
  createOrder,
  verifyPayment,
};
