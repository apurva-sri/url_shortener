const express = require("express");
const cors = require("cors");
const {
  helmetMiddleware,
  compressionMiddleware,
  requestLogger,
  rateLimiter,
} = require("./config/security");
const errorMiddleware = require("./middlewares/error.middleware");
const healthRoutes = require("./routes/health.routes");
const urlRoutes = require("./routes/url.routes");
const urlController = require("./controllers/url.controller");
const authRoutes = require("./routes/auth.routes");
const analyticsRoutes = require("./routes/analytics.routes");

const app = express();
app.set("trust proxy", 1);

app.disable("x-powered-by");

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(cors());

app.use(helmetMiddleware);

app.use(compressionMiddleware);

app.use(requestLogger);

app.use("/health", healthRoutes);

app.use("/api", rateLimiter);

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "URL Shortener API Running",
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/url", urlRoutes);
app.use("/api/analytics", analyticsRoutes);
app.get("/favicon.ico", (req, res) => {
  res.status(204).end();
});
app.get("/:shortCode", urlController.redirectUrl);

app.use(errorMiddleware);

module.exports = app;