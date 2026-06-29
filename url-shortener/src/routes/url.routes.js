const express = require("express");
const router = express.Router();
const { protect } = require("../middlewares/auth.middleware");
const urlController = require("../controllers/url.controller");

router.post("/shorten", protect, urlController.createShortUrl);
router.get("/my-urls", protect, urlController.getMyUrls);
router.get("/:shortCode/stats", urlController.getUrlStats);

module.exports = router;
