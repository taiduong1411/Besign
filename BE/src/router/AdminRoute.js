const express = require("express");
const router = express.Router();
const AdminController = require("../controller/AdminController");
const adminAuth = require("../middleware/AdminAuth");

router.post("/reply-customer-email", adminAuth, AdminController.replyCustomer);

module.exports = router;
