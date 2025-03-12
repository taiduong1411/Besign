const cloudinary = require("cloudinary");
require("dotenv");
const delImg = async (id) => {
  cloudinary.v2.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET,
    secure: true,
  });
  await cloudinary.v2.api.delete_resources([`${id}`], {
    type: "upload",
    resource_type: "image",
  });
};

module.exports = { delImg };
