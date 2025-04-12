const jwt = require("jsonwebtoken");
const Account = require("../model/account");

const userAuth = async (req, res, next) => {
  let token = req.headers["authorization"];
  const token_decode = jwt.decode(token);
  await jwt.verify(token, process.env.SESSION_SECRET, function (err) {
    if (err) {
      // console.log(err);
      return res.status(401).json({ msg: "Bạn Chưa Đăng Nhập" });
    } else {
      if (token_decode.level != "1") {
        return res.status(404).json({ msg: "Bạn Không Phải Seller !!!" });
      } else {
        next();
      }
    }
  });
};

module.exports = userAuth;
