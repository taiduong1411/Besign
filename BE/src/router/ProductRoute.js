const express = require("express");
const router = express.Router();
const SellerController = require("../controller/SellerController");
const userAuth = require("../middleware/userAuth");

// Public routes
router.get("/all-products", SellerController.getAllProducts);

module.exports = router;
