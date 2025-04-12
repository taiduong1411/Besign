const express = require("express");
const router = express.Router();
const AccountController = require("../controller/AccountController");

// Authentication routes
router.post("/login", AccountController.login);
router.post("/register", AccountController.register);
router.post("/verify-email", AccountController.verifyEmail);
router.post("/reset-password", AccountController.resetPassword);

// User info routes
router.get("/user-info/:id", AccountController.userInfo);
router.post("/update-information/:id", AccountController.updateInfo);

module.exports = router;
