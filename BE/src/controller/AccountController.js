const Accounts = require("../model/account");
const OTP = require("../model/otp");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const service = require("../services/email");
const AccountController = {
  login: async (req, res, next) => {
    try {
      const { email, password } = req.body;
      await Accounts.findOne({ email: email }).then((account) => {
        if (!account)
          return res.status(404).json({ msg: "Tài Khoản Không Tồn Tại" });
        console.log(account);

        if (account.isActive == false)
          return res
            .status(400)
            .json({ msg: "Tài Khoản Của Bạn Bị Khoá. Vui Lòng Liên Hệ Admin" });
        if (!bcrypt.compareSync(password, account.password))
          return res.status(300).json({ msg: "Mật Khẩu Không Chính Xác" });
        const token = jwt.sign(
          {
            _id: account._id,
            level: account.level,
          },
          process.env.SESSION_SECRET,
          { expiresIn: 60 * 60 * 24 }
        );
        return res.status(200).json({ token: token });
      });
    } catch (error) {
      return res.status(500).json({ msg: "server error" });
    }
  },
  register: async (req, res, next) => {
    try {
      await Accounts.findOne({ email: req.body.email }).then(
        async (account) => {
          if (account)
            return res.status(300).json({ msg: "Tài Khoản Đã Tồn Tại" });
          const phone = await Accounts.findOne({ phone: req.body.phone });
          if (phone)
            return res
              .status(300)
              .json({ msg: "Số Điện Thoại Đã Được Sử Dụng" });
          const hash = bcrypt.hashSync(req.body.password, 5);
          const data = {
            ...req.body,
            password: hash,
          };
          await Accounts(data).save();
          return res.status(200).json({ msg: "Đăng Ký Thành Công !!!" });
        }
      );
    } catch (error) {
      console.log(error);
      return res.status(500).json({ msg: "server error" });
    }
  },
  verifyEmail: async (req, res, next) => {
    try {
      const { email } = req.body;
      await Accounts.findOne({ email: email }).then(async (account) => {
        if (!account)
          return res.status(404).json({ msg: "Tài Khoản Không Tồn Tại" });

        // Delete all existing OTPs for the email
        await OTP.deleteMany({ email: email });

        // Generate new OTP
        const data = {
          code: service.randomCode(),
          email: email,
        };

        // Send the new OTP via email
        await service.sendEmail(data.code, data.email).then(() => {
          return res.status(200).json({
            msg: "OTP đã được gửi. Vui lòng kiểm tra email của bạn.",
          });
        });
        // Save the new OTP to the database
        await OTP(data).save();
      });
    } catch (error) {
      return res.status(500).json({ msg: "server error" });
    }
  },
  resetPassword: async (req, res, next) => {
    try {
      await OTP.findOne({ email: req.body.email }).then(async (otp) => {
        if (!otp)
          return res
            .status(400)
            .json({ msg: "Mã Xác Thực Đã Hết Hiệu Lực Hoặc Không Tồn Tại" });
        if (otp.code !== req.body.code)
          return res.status(401).json({ msg: "Mã Xác Thực Không Đúng" });
        let user = await Accounts.findOne({ email: otp.email });
        const hash = bcrypt.hashSync(req.body.password, 5);
        user.password = hash;
        await user.save();
        return res.status(200).json({ msg: "Thay Đổi Mật Khẩu Thành Công" });
      });
    } catch (error) {
      return res.status(500).json({ msg: "server error" });
    }
  },
  userInfo: async (req, res, next) => {
    // khong tra ve passsword
    try {
      const _id = req.params.id;
      await Accounts.findById(_id).then((account) => {
        if (!account)
          return res.status(404).json({ msg: "Tài Khoản Không Tồn Tại" });
        return res.status(200).json(account);
      });
    } catch (error) {
      return res.status(500).json({ msg: "server error" });
    }
  },
  updateInfo: async (req, res, next) => {
    const _id = req.params.id;
    const data = req.body;
    const hash = bcrypt.hashSync(data.password, 5);
    const dataUpdate = {
      ...data,
      password: hash,
    };

    try {
      await Accounts.findByIdAndUpdate(_id, dataUpdate).then((account) => {
        if (!account)
          return res.status(404).json({ msg: "Tài Khoản Không Tồn Tại" });

        return res.status(200).json({ msg: "Cập Nhật Thành Công" });
      });
    } catch (error) {
      return res.status(500).json({ msg: "server error" });
    }
  },
};
module.exports = AccountController;
