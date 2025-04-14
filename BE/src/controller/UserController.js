require("dotenv");
const errorMsg = process.env.ERROR;
const successMSG = process.env.SUCCESS;
const cloudinary = require("cloudinary");
const services = require("../services/email");
const Contact = require("../model/contact");
const Sellers = require("../model/seller");
const Users = require("../model/account");
const Order = require("../model/order");
const AdminController = {
  becomeSeller: async (req, res, next) => {
    try {
      const {
        email,
        phone,
        fullname,
        idCardNumber,
        address,
        shopName,
        description,
        agreeTerms,
      } = req.body;
      const seller = await Sellers.findOne({ email: email });
      if (seller) {
        return res.status(400).json({ msg: "Email đã tồn tại!" });
      }
      const sellerPhone = await Sellers.findOne({ phone: phone });
      if (sellerPhone) {
        return res.status(400).json({ msg: "Số điện thoại đã tồn tại!" });
      }
      const sellerIdCard = await Sellers.findOne({
        idCardNumber: idCardNumber,
      });
      if (sellerIdCard) {
        return res.status(400).json({ msg: "Số CMND/CCCD đã tồn tại!" });
      }
      if (!agreeTerms) {
        return res.status(400).json({ msg: "Bạn phải đồng ý với điều khoản!" });
      }
      await Sellers(req.body).save();
      return res.status(200).json({ msg: "Đăng ký thành công!" });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ msg: "Có lỗi xảy ra. Vui lòng thử lại !" });
    }
  },
  getOrderHistory: async (req, res, next) => {
    const { userId } = req.params;
    console.log(userId);
    //lay ra thong tin don hang va thong tin san pham
    const orderHistory = await Order.find({ user_id: userId }).populate(
      "productId"
    );
    return res.status(200).json(orderHistory);
  },
};
module.exports = AdminController;
