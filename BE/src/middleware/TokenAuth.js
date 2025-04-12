const jwt = require("jsonwebtoken");
const Account = require("../model/account");

const tokenAuth = async (req, res, next) => {
  let token = req.headers["authorization"];
  const token_decode = jwt.decode(token);
  await jwt.verify(token, process.env.SESSION_SECRET, function (err) {
    if (err) {
      // console.log(err);
      return res.status(401).json({ msg: "Bạn Chưa Đăng Nhập" });
    } else {
      next();
    }
  });
};

module.exports = tokenAuth;
