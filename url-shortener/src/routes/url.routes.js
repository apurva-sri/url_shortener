const express = require("express");
const router = express.Router();

const urlController = require("../controllers/url.controller");

router.post("/shorten", urlController.createShortUrl);
router.get("/:shortCode/stats", urlController.getUrlStats);

module.exports = router;
