const express = require("express");
const cors = require("cors");
const urlRoutes = require("./routes/url.routes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/url", urlRoutes);

app.get("/", (req,res)=>{
    res.json({
        success: true,
        message: "URL Shortener API Running"
    });
});

module.exports = app;