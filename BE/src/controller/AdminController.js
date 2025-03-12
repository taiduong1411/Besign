require("dotenv");
const errorMsg = process.env.ERROR;
const successMSG = process.env.SUCCESS;
const cloudinary = require("cloudinary");
const services = require("../services/email");
const Contact = require("../model/contact");
const AdminController = {
  replyCustomer: async (req, res, next) => {
    try {
      const { to, text, subject } = req.body;
      services.replyEmail(subject, text, to);
      await Contact.findOneAndUpdate({ email: to }).then((contact) => {
        contact.status = true;
        contact.save();
      });
      return res.status(200).json({ msg: "Email đã được gửi thành công" });
    } catch (error) {
      return res.status(500).json({ msg: "Có lỗi xảy ra. Vui lòng thử lại !" });
    }
  },
};
module.exports = AdminController;
