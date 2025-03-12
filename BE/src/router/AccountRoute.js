const express = require("express");
const router = express.Router();
const AccountController = require("../controller/AccountController");

router.post("/login", AccountController.login);
router.post("/register", AccountController.register);
router.post("/verify-email", AccountController.verifyEmail);
router.post("/reset-password", AccountController.resetPassword);
router.get("/user-info/:id", AccountController.userInfo);
module.exports = router;
