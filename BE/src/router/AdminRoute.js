const express = require("express");
const router = express.Router();
const AdminController = require("../controller/AdminController");
const adminAuth = require("../middleware/AdminAuth");

router.post("/reply-customer-email", adminAuth, AdminController.replyCustomer);
router.get("/get-sellers", adminAuth, AdminController.getSeller);
router.put(
  "/update-seller-status/:id",
  adminAuth,
  AdminController.updateSellerStatus
);
router.put("/block-seller/:id", adminAuth, AdminController.blockSeller);

module.exports = router;
