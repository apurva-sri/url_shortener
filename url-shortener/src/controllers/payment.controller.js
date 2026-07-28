const paymentService = require("../services/payment.service");
const catchAsync = require("../utils/catchAsync");
const { successResponse } = require("../utils/apiResponse");

const createOrder = catchAsync(async (req, res) => {
  const { plan } = req.body;
  const result = await paymentService.createOrder(req.user.id, plan);

  return successResponse(res, {
    statusCode: 200,
    message: "Razorpay order created successfully",
    data: result,
  });
});

const verifyPayment = catchAsync(async (req, res) => {
  const result = await paymentService.verifyPayment(req.user.id, req.body);

  return successResponse(res, {
    statusCode: 200,
    message: "Payment verified and plan upgraded successfully!",
    data: result,
  });
});

const getMyInvoices = catchAsync(async (req, res) => {
  const invoices = await paymentService.getMyInvoices(req.user.id);
  return successResponse(res, {
    statusCode: 200,
    message: "Invoices retrieved successfully",
    data: invoices,
  });
});

module.exports = {
  createOrder,
  verifyPayment,
  getMyInvoices,
};
