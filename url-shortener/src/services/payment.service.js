const prisma = require("../config/db");
const env = require("../config/env");
const crypto = require("crypto");
const Razorpay = require("razorpay");
const ApiError = require("../utils/ApiError");

const PLAN_PRICES = {
  STARTER: { amount: 100, currency: "INR", label: "Starter Plan (₹1 Test)" }, // 100 paise = ₹1
  PRO: { amount: 200, currency: "INR", label: "Pro Plan (₹2 Test)" },         // 200 paise = ₹2
};

const getRazorpayInstance = () => {
  const keyId = env.RAZORPAY_KEY_ID;
  const keySecret = env.RAZORPAY_KEY_SECRET;

  if (!keyId || !keySecret || keyId === "rzp_test_dummy_key") {
    throw new ApiError(400, "Razorpay API keys not configured. Please set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in backend environment variables.");
  }

  return new Razorpay({
    key_id: keyId,
    key_secret: keySecret,
  });
};

const createOrder = async (userId, plan) => {
  const targetPlan = (plan || "").toUpperCase();
  if (!PLAN_PRICES[targetPlan]) {
    throw new ApiError(400, "Invalid plan specified. Choose STARTER or PRO.");
  }

  const razorpay = getRazorpayInstance();
  const planDetails = PLAN_PRICES[targetPlan];

  try {
    const order = await razorpay.orders.create({
      amount: planDetails.amount,
      currency: planDetails.currency,
      receipt: `receipt_${userId.substring(0, 8)}_${Date.now()}`,
      notes: {
        userId,
        plan: targetPlan,
      },
    });

    return {
      orderId: order.id,
      amount: planDetails.amount,
      currency: planDetails.currency,
      keyId: env.RAZORPAY_KEY_ID,
      plan: targetPlan,
    };
  } catch (err) {
    throw new ApiError(500, `Razorpay Order Creation Error: ${err.message || err}`);
  }
};

const verifyPayment = async (userId, { razorpay_order_id, razorpay_payment_id, razorpay_signature, plan }) => {
  const targetPlan = (plan || "").toUpperCase();
  if (!["STARTER", "PRO"].includes(targetPlan)) {
    throw new ApiError(400, "Invalid plan specified.");
  }

  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    throw new ApiError(400, "Missing required Razorpay payment verification parameters.");
  }

  const keySecret = env.RAZORPAY_KEY_SECRET;
  const body = `${razorpay_order_id}|${razorpay_payment_id}`;
  const expectedSignature = crypto
    .createHmac("sha256", keySecret)
    .update(body.toString())
    .digest("hex");

  if (expectedSignature !== razorpay_signature) {
    throw new ApiError(400, "Invalid payment signature. Verification failed.");
  }

  // Create Invoice Record in DB
  const invoiceNumber = `INV-${Date.now().toString().slice(-6)}-${Math.floor(1000 + Math.random() * 9000)}`;
  try {
    await prisma.invoice.create({
      data: {
        invoiceNumber,
        amount: PLAN_PRICES[targetPlan]?.amount || 100,
        currency: "INR",
        plan: targetPlan,
        razorpayOrderId: razorpay_order_id,
        razorpayPaymentId: razorpay_payment_id,
        status: "PAID",
        userId,
      },
    });
  } catch (err) {
    console.error("Failed to save invoice record:", err);
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

const getMyInvoices = async (userId) => {
  let invoices = await prisma.invoice.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });

  // Auto-backfill: If user is on a paid plan (PRO or STARTER) but has no invoice record yet (from previous transaction), create one!
  if (invoices.length === 0) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { plan: true, createdAt: true },
    });

    const userPlan = (user?.plan || "FREE").toUpperCase();
    if (userPlan === "STARTER" || userPlan === "PRO") {
      const invoiceNumber = `INV-${Date.now().toString().slice(-6)}-${Math.floor(1000 + Math.random() * 9000)}`;
      const amount = userPlan === "STARTER" ? 100 : 200;
      const backfilled = await prisma.invoice.create({
        data: {
          invoiceNumber,
          amount,
          currency: "INR",
          plan: userPlan,
          razorpayOrderId: "order_prev_txn",
          razorpayPaymentId: "pay_prev_verified",
          status: "PAID",
          createdAt: user?.createdAt || new Date(),
          userId,
        },
      });
      invoices = [backfilled];
    }
  }

  return invoices;
};

module.exports = {
  createOrder,
  verifyPayment,
  getMyInvoices,
};
