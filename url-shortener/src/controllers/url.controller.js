const urlService = require("../services/url.service");

const createShortUrl = async (req, res) => {
  try {
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({
        success: false,
        message: "URL is required",
      });
    }

    const result = await urlService.createShortUrl(url);

    return res.status(201).json({
      success: true,
      data: {
        shortCode: result.shortCode,
        shortUrl: `${process.env.BASE_URL}/${result.shortCode}`,
      },
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

module.exports = {
  createShortUrl,
};
