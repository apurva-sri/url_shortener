const express = require("express");
const router = express.Router();
const { protect } = require("../middlewares/auth.middleware");
const urlController = require("../controllers/url.controller");
const { checkUrlOwnership } = require("../middlewares/ownership.middleware");

router.post("/shorten", protect, urlController.createShortUrl);
router.get("/my-urls", protect, urlController.getMyUrls);
router.get("/:shortCode/stats", urlController.getUrlStats);
router.patch("/:id", protect, checkUrlOwnership, urlController.updateUrl);
router.delete("/:id", protect, checkUrlOwnership, urlController.deleteUrl);
module.exports = router;
