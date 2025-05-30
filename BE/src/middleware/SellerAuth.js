const jwt = require("jsonwebtoken");
// const services = require('../services/tokenDecode');
module.exports = sellerRole = async (req, res, next) => {
  let token = req.headers["authorization"];
  const token_decode = jwt.decode(token);
  await jwt.verify(token, process.env.SESSION_SECRET, function (err) {
    if (err) {
      // console.log(err);
      return res.status(401).json({ msg: "Bạn Chưa Đăng Nhập" });
    } else {
      if (token_decode.level != "2") {
        return res.status(404).json({ msg: "Bạn Không Phải Seller !!!" });
      } else {
        next();
      }
    }
  });
};
