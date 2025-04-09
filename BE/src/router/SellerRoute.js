const express = require("express");
const router = express.Router();
const SellerController = require("../controller/SellerController");
const sellerAuth = require("../middleware/sellerAuth");

router.get("/all-products", SellerController.getAllProducts);
router.post("/create-product", sellerAuth, SellerController.createProduct);

// Add new routes for updating and deleting products
router.put("/update-product/:id", sellerAuth, SellerController.updateProduct);
router.patch(
  "/update-product-status/:id",
  sellerAuth,
  SellerController.updateProductStatus
);
router.delete(
  "/delete-product/:id",
  sellerAuth,
  SellerController.deleteProduct
);

module.exports = router;
