const express = requie("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req,res)=>{
    res.json({
        success: true,
        message: "URL Shortener API Running"
    });
});

module.exports = app;