const env = require("../config/env");
const cloudinary = require("cloudinary").v2;
cloudinary.config({
  cloud_name: env.CLOUDINARY_CLOUD_NAME,
  api_key: env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET,
});

async function uploadStream(stream, folder) {
  return new Promise((resolve, reject) => {
    const upload = cloudinary.uploader.upload_stream(
      { folder, resource_type: "image" },
      (error, result) => (error ? reject(error) : resolve(result.secure_url)),
    );
    stream.pipe(upload);
  });
}

module.exports = { uploadStream };
