const express = require("express");
const router = express.Router();
const paymentController = require("../controllers/payment.controller");
const { protect } = require("../middlewares/auth.middleware");

router.post("/create-order", protect, paymentController.createOrder);
router.post("/verify", protect, paymentController.verifyPayment);
router.get("/invoices", protect, paymentController.getMyInvoices);

module.exports = router;
