const express = require("express");
const router = express.Router();
const validate = require("../middlewares/validation.middleware");
const authController = require("../controllers/auth.controller");
const { registerSchema, loginSchema } = require("../validators/auth.validator");

router.post("/register", validate(registerSchema), authController.register);
router.post("/login", validate(loginSchema), authController.login);
router.post("/test-email", authController.testEmail);
module.exports = router;
