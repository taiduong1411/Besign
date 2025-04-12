const Reviews = require("../model/review");
const Products = require("../model/product");
const Accounts = require("../model/account");
const jwt_decode = require("../services/tokenDecode");

const ReviewController = {
  // Create a new review
  createReview: async (req, res) => {
    try {
      const { product_id, rating, review_title, review_content } = req.body;
      const token = jwt_decode.decodeToken(req.headers["authorization"]);
      if (!token || !token._id) {
        return res.status(401).json({
          msg: "Token không hợp lệ hoặc đã hết hạn",
        });
      }
      const user = await Accounts.findOne({ _id: token._id });
      if (!user) {
        return res.status(401).json({
          msg: "Không tìm thấy thông tin người dùng",
        });
      }

      const product = await Products.findById(product_id);
      if (!product) {
        return res.status(404).json({
          msg: "Không tìm thấy sản phẩm",
        });
      }

      const existingReview = await Reviews.findOne({
        product_id,
        user_id: user._id,
      });

      if (existingReview) {
        return res.status(400).json({
          msg: "Bạn đã đánh giá sản phẩm này rồi",
        });
      }
      const newReview = new Reviews({
        product_id,
        user_id: user._id,
        email: user.email,
        rating,
        review_title: review_title || "",
        review_content,
        is_verified_purchase: false,
      });

      await newReview.save();

      return res.status(200).json({
        msg: "Đánh giá sản phẩm thành công",
        review: newReview,
      });
    } catch (error) {
      return res.status(500).json({
        msg: "Đã xảy ra lỗi khi đánh giá sản phẩm",
        error: error.message,
      });
    }
  },

  // Get all reviews for a product
  getProductReviews: async (req, res) => {
    try {
      const { product_id } = req.params;

      // Check if product exists
      const product = await Products.findById(product_id);
      if (!product) {
        return res.status(404).json({
          msg: "Không tìm thấy sản phẩm",
        });
      }

      // Get reviews for this product, newest first
      const reviews = await Reviews.find({
        product_id,
        is_approved: true,
      }).sort({ createdAt: -1 });

      // Calculate rating summary
      const totalReviews = reviews.length;
      let avgRating = 0;
      const ratingCounts = {
        1: 0,
        2: 0,
        3: 0,
        4: 0,
        5: 0,
      };

      if (totalReviews > 0) {
        reviews.forEach((review) => {
          avgRating += review.rating;
          ratingCounts[review.rating]++;
        });

        avgRating = (avgRating / totalReviews).toFixed(1);
      }

      const ratingSummary = {
        average: parseFloat(avgRating),
        total: totalReviews,
        distribution: ratingCounts,
      };

      return res.status(200).json({
        reviews,
        summary: ratingSummary,
      });
    } catch (error) {
      console.error("Error fetching reviews:", error);
      return res.status(500).json({
        msg: "Đã xảy ra lỗi khi tải đánh giá sản phẩm",
        error: error.message,
      });
    }
  },

  // Update a review
  updateReview: async (req, res) => {
    try {
      const { review_id } = req.params;
      const { rating, review_title, review_content, images } = req.body;
      const token = jwt_decode.decodeToken(req.headers["authorization"]);

      // Find the review
      const review = await Reviews.findById(review_id);

      if (!review) {
        return res.status(404).json({
          msg: "Không tìm thấy đánh giá",
        });
      }

      // Check if the user is the owner of the review
      if (review.user_id.toString() !== token._id) {
        return res.status(403).json({
          msg: "Bạn không có quyền cập nhật đánh giá này",
        });
      }

      // Update review
      review.rating = rating || review.rating;
      review.review_title =
        review_title !== undefined ? review_title : review.review_title;
      review.review_content = review_content || review.review_content;
      review.images = images || review.images;

      await review.save();

      return res.status(200).json({
        msg: "Cập nhật đánh giá thành công",
        review,
      });
    } catch (error) {
      console.error("Error updating review:", error);
      return res.status(500).json({
        msg: "Đã xảy ra lỗi khi cập nhật đánh giá",
        error: error.message,
      });
    }
  },

  // Delete a review
  deleteReview: async (req, res) => {
    try {
      const { review_id } = req.params;
      const token = jwt_decode.decodeToken(req.headers["authorization"]);

      // Find the review
      const review = await Reviews.findById(review_id);

      if (!review) {
        return res.status(404).json({
          msg: "Không tìm thấy đánh giá",
        });
      }

      // Check if the user is the owner of the review
      if (review.user_id.toString() !== token._id) {
        return res.status(403).json({
          msg: "Bạn không có quyền xóa đánh giá này",
        });
      }

      // Delete the review
      await Reviews.findByIdAndDelete(review_id);

      return res.status(200).json({
        msg: "Xóa đánh giá thành công",
      });
    } catch (error) {
      console.error("Error deleting review:", error);
      return res.status(500).json({
        msg: "Đã xảy ra lỗi khi xóa đánh giá",
        error: error.message,
      });
    }
  },

  // Like a review
  likeReview: async (req, res) => {
    try {
      const { review_id } = req.params;

      // Find the review
      const review = await Reviews.findById(review_id);

      if (!review) {
        return res.status(404).json({
          msg: "Không tìm thấy đánh giá",
        });
      }

      // Update likes count
      review.likes += 1;
      await review.save();

      return res.status(200).json({
        msg: "Đã thích đánh giá",
        likes: review.likes,
      });
    } catch (error) {
      console.error("Error liking review:", error);
      return res.status(500).json({
        msg: "Đã xảy ra lỗi",
        error: error.message,
      });
    }
  },

  // Get all reviews (for admin)
  getAllReviews: async (req, res) => {
    try {
      const reviews = await Reviews.find().sort({ createdAt: -1 });

      return res.status(200).json(reviews);
    } catch (error) {
      console.error("Error fetching all reviews:", error);
      return res.status(500).json({
        msg: "Đã xảy ra lỗi khi tải danh sách đánh giá",
        error: error.message,
      });
    }
  },

  // Approve or reject a review (for admin)
  moderateReview: async (req, res) => {
    try {
      const { review_id } = req.params;
      const { is_approved } = req.body;

      // Find the review
      const review = await Reviews.findById(review_id);

      if (!review) {
        return res.status(404).json({
          msg: "Không tìm thấy đánh giá",
        });
      }

      // Update approval status
      review.is_approved = is_approved;
      await review.save();

      return res.status(200).json({
        msg: is_approved ? "Đã phê duyệt đánh giá" : "Đã từ chối đánh giá",
        review,
      });
    } catch (error) {
      console.error("Error moderating review:", error);
      return res.status(500).json({
        msg: "Đã xảy ra lỗi khi quản lý đánh giá",
        error: error.message,
      });
    }
  },
};

module.exports = ReviewController;
