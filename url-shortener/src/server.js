const app = require("./app");
const { connectRedis } = require("./config/redis");

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectRedis();

    app.listen(PORT, () => {
      console.log(`Server running on ${PORT}`);
    });
  } catch (err) {
    console.error(err);
  }
};

startServer();

