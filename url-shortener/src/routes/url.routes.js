const express = require("express");
const router = express.Router();
const { protect } = require("../middlewares/auth.middleware");
const urlController = require("../controllers/url.controller");
const validate = require("../middlewares/validation.middleware");
const { createUrlSchema } = require("../validators/url.validator");
const {
  setPasswordSchema,
  verifyPasswordSchema,
} = require("../validators/password.validator");

router.post(
  "/shorten",
  protect,
  validate(createUrlSchema),
  urlController.createShortUrl,
);
router.get("/my-urls", protect, urlController.getMyUrls);
router.post(
  "/verify-password",
  validate(verifyPasswordSchema),
  urlController.verifyUrlPassword,
);
router.get("/public/stats", urlController.getPublicStats);
router.get("/:shortCode/stats", urlController.getUrlStats);
router.patch("/:id", protect, urlController.updateUrl);
router.delete("/:id", protect, urlController.deleteUrl);
router.patch(
  "/:id/password",
  protect,
  validate(setPasswordSchema),
  urlController.enablePasswordProtection,
);
router.delete("/:id/password", protect, urlController.removePasswordProtection);
router.get("/:id/qr", protect, urlController.getQRCode);

module.exports = router;
