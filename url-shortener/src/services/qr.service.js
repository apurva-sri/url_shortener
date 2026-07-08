const QRCode = require("qrcode");
const { QR_CODE_OPTIONS } = require("../config/constants");

const generateQRCode = async (text) => {
  return await QRCode.toDataURL(text, QR_CODE_OPTIONS);
};

module.exports = {
  generateQRCode,
};
