const express = require("express");
const cors = require("cors");
const errorMiddleware = require("./middlewares/error.middleware");
const urlRoutes = require("./routes/url.routes");
const urlController = require("./controllers/url.controller");
const authRoutes = require("./routes/auth.routes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/url", urlRoutes);
app.get("/:shortCode", urlController.redirectUrl);

app.use(errorMiddleware);

app.get("/", (req,res)=>{
    res.json({
        success: true,
        message: "URL Shortener API Running"
    });
});

module.exports = app;