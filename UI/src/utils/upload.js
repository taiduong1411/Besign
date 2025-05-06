import axios from "axios";
const upload = async (file, folder) => {
  const data = new FormData();
  data.append("file", file);
  data.append("upload_preset", "DATN2025");
  data.append("folder", folder);

  try {
    const res = await axios.post(
      // "https://api.cloudinary.com/v1_1/de0cr9ny3/image/upload",
          "https://api.cloudinary.com/v1_1/dn0ooxspr/image/upload",
      data
    );
    const { url, public_id } = res.data;
    return { url, public_id };
  } catch (err) {
    console.log(err);
  }
};

export default upload;
