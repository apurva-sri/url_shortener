const express = require("express");
const router = express.Router();
const validate = require("../middlewares/validation.middleware");
const authController = require("../controllers/auth.controller");
const {
  registerSchema,
  loginSchema,
  verifyEmailSchema,
} = require("../validators/auth.validator");

router.post("/register", validate(registerSchema), authController.register);
router.post("/login", validate(loginSchema), authController.login);
router.post("/verify-email", validate(verifyEmailSchema), authController.verifyEmail);
// router.post("/test-email", authController.testEmail);po
module.exports = router;
