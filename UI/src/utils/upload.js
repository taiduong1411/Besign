import axios from "axios";
const upload = async (file, folder) => {
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "DACNTT2");
    data.append('folder', folder);

    try {
        const res = await axios.post(
            "https://api.cloudinary.com/v1_1/dljdvysp7/image/upload",
            data);
        const { url, public_id } = res.data;
        // console.log(url, public_id);
        return { url, public_id };
    } catch (err) {
        console.log(err);
    }
};

export default upload;