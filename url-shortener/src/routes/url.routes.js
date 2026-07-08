const express = require("express");
const router = express.Router();
const { protect } = require("../middlewares/auth.middleware");
const urlController = require("../controllers/url.controller");
const validate = require("../middlewares/validation.middleware");
const { createUrlSchema } = require("../validators/url.validator");


router.post(
  "/shorten",
  protect,
  validate(createUrlSchema),
  urlController.createShortUrl,
);
router.get("/my-urls", protect, urlController.getMyUrls);
router.get("/:shortCode/stats", urlController.getUrlStats);
router.patch("/:id", protect, urlController.updateUrl);
router.delete("/:id", protect, urlController.deleteUrl);
module.exports = router;
