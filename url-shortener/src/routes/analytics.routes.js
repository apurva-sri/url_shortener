const express = require("express");
const router = express.Router();

const analyticsController = require("../controllers/analytics.controller");
const { protect } = require("../middlewares/auth.middleware");

router.get("/:id", protect, analyticsController.getUrlAnalytics);

module.exports = router;
