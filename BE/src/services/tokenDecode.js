const jwt = require("jsonwebtoken");

module.exports = {
  decodeToken: (bearerHeader) => {
    if (!bearerHeader) {
      return null;
    }

    try {
      // Extract the token from the Authorization header
      // Handle both formats: "Bearer <token>" and direct "<token>"
      let token = bearerHeader;

      // If the token has "Bearer " prefix, remove it
      if (bearerHeader.startsWith("Bearer ")) {
        token = bearerHeader.substring(7);
      }

      // Decode the token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      return decoded;
    } catch (error) {
      console.error("Token decode error:", error.message);
      return null;
    }
  },
};
