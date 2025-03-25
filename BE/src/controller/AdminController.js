require("dotenv");
const errorMsg = process.env.ERROR;
const successMSG = process.env.SUCCESS;
const cloudinary = require("cloudinary");
const services = require("../services/email");
const Contact = require("../model/contact");
const Sellers = require("../model/seller");
const Accounts = require("../model/account");
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
  getSeller: async (req, res, next) => {
    try {
      const sellers = await Sellers.find();
      res.status(200).json(sellers);
    } catch (error) {
      res.status(500).json({ msg: "Có lỗi xảy ra. Vui lòng thử lại !" });
    }
  },
  updateSellerStatus: async (req, res, next) => {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const seller = await Sellers.findById(id);
      const account = await Accounts.findOne({ email: seller.email });
      seller.approved = status;
      account.level = "2";
      await seller.save();
      await account.save();
      if (status === "approved") {
        services.confirmSeller(
          "Xác nhận tài khoản người bán",
          "Tài khoản của bạn đã được phê duyệt",
          seller.email
        );
      } else if (status === "rejected") {
        services.rejectSeller(
          "Tài khoản không được phê duyệt",
          "Tài khoản của bạn không được phê duyệt",
          seller.email
        );
      }
      return res.status(200).json({ msg: "Đã phê duyệt thành công" });
    } catch (error) {
      return res.status(500).json({ msg: "Có lỗi xảy ra. Vui lòng thử lại !" });
    }
  },
  blockSeller: async (req, res, next) => {
    try {
      const { id } = req.params;
      const { isActive } = req.body;
      await Sellers.findByIdAndUpdate(id, { isActive });
      const seller = await Sellers.findById(id);
      console.log(seller);

      services.blockSeller(
        "Tài khoản người bán bị khóa",
        "Tài khoản của bạn đã bị khóa",
        seller.email
      );
      return res.status(200).json({ msg: "Đã chặn người bán thành công" });
    } catch (error) {
      return res.status(500).json({ msg: "Có lỗi xảy ra. Vui lòng thử lại !" });
    }
  },
};
module.exports = AdminController;
