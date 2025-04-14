const express = require("express");
const router = express.Router();
const SellerController = require("../controller/SellerController");
const userAuth = require("../middleware/userAuth");

// Public routes
router.get("/all-products", SellerController.getAllProducts);
router.post("/checkout", userAuth, SellerController.checkout);
router.get("/category", SellerController.getCategory);
router.get("/price", SellerController.getPrice);
router.get("/rating", SellerController.getRating);
module.exports = router;
