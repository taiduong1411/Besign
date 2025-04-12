const express = require("express");
const router = express.Router();
const SellerController = require("../controller/SellerController");
const sellerAuth = require("../middleware/sellerAuth");

router.get("/all-products", SellerController.getAllProducts);
router.get("/seller-products", SellerController.getAllProductsBySeller);
router.get("/public-products", SellerController.getPublicProducts);
router.get("/product/:id", SellerController.getProductById);
router.post("/create-product", sellerAuth, SellerController.createProduct);

// Add new routes for updating and deleting products
router.put("/update-product/:id", sellerAuth, SellerController.updateProduct);
router.post(
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
