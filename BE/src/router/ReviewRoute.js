const express = require("express");
const router = express.Router();
const ReviewController = require("../controller/ReviewController");
const userAuth = require("../middleware/userAuth");

// Public routes
router.get("/product/:product_id", ReviewController.getProductReviews);
router.post("/like/:review_id", ReviewController.likeReview);

// User authenticated routes
router.post("/create", ReviewController.createReview);
router.put("/update/:review_id", userAuth, ReviewController.updateReview);
router.delete("/delete/:review_id", userAuth, ReviewController.deleteReview);

module.exports = router;
