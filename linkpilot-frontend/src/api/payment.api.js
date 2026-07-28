import api from "./axios";

// POST /api/payments/create-order — body: { plan: "STARTER" | "PRO" }
export const createOrder = (plan) =>
  api.post("/payments/create-order", { plan }).then((res) => res.data);

// POST /api/payments/verify — body: { razorpay_order_id, razorpay_payment_id, razorpay_signature, plan }
export const verifyPayment = (payload) =>
  api.post("/payments/verify", payload).then((res) => res.data);
