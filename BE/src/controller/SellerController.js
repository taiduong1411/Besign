const Products = require("../model/product");
const Accounts = require("../model/account");
const jwt_decode = require("../services/tokenDecode");
const mongoose = require("mongoose");

const SellerController = {
  // Trang seller
  getAllProductsBySeller: async (req, res, next) => {
    const token = jwt_decode.decodeToken(req.headers["authorization"]);
    const seller = await Accounts.findOne({ _id: token._id });
    try {
      const products = await Products.find({ seller_email: seller.email });
      res.status(200).json(products);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  // Trang home
  getAllProducts: async (req, res, next) => {
    try {
      const products = await Products.find();
      const rating = await Products.aggregate([
        {
          $lookup: {
            from: "reviews",
            localField: "_id",
            foreignField: "product_id",
            as: "reviews",
          },
        },
        {
          $addFields: {
            averageRating: {
              $avg: "$reviews.rating",
            },
            reviewCount: {
              $size: "$reviews", // Count the number of reviews
            },
          },
        },
      ]);

      res.status(200).json(rating);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  getPublicProducts: async (req, res) => {
    try {
      // Find all products that are public (isPublic: true)
      const products = await Products.find({ isPublic: true })
        .sort({ createdAt: -1 }) // Sort by newest first
        .limit(20); // Limit to 20 products initially

      if (!products || products.length === 0) {
        return res.status(200).json([]); // Return empty array instead of 404
      }

      return res.status(200).json(products);
    } catch (error) {
      console.error("Error fetching public products:", error);
      return res.status(500).json({
        msg: "Lỗi khi tải danh sách sản phẩm",
        error: error.message,
      });
    }
  },

  getProductById: async (req, res) => {
    try {
      const productId = req.params.id;
      const product = await Products.findById(productId);

      if (!product) {
        return res.status(404).json({
          msg: "Không tìm thấy sản phẩm",
        });
      }

      // Get reviews data for this product if Reviews model is available
      let reviewSummary = {
        totalReviews: 0,
        averageRating: 0,
      };

      try {
        // Only try to get reviews if the Reviews model exists
        if (mongoose.models.Review) {
          const Reviews = mongoose.models.Review;
          const reviews = await Reviews.find({
            product_id: productId,
            is_approved: true,
          });

          if (reviews && reviews.length > 0) {
            const totalReviews = reviews.length;
            const totalRating = reviews.reduce(
              (sum, review) => sum + review.rating,
              0
            );
            const averageRating = totalRating / totalReviews;

            reviewSummary = {
              totalReviews,
              averageRating: parseFloat(averageRating.toFixed(1)),
            };
          }
        }
      } catch (error) {
        console.error("Error fetching review data:", error);
        // Continue without review data if there's an error
      }

      // Add review summary to the product data
      const productWithReviews = {
        ...product.toJSON(),
        reviews: reviewSummary,
      };

      return res.status(200).json(productWithReviews);
    } catch (error) {
      console.error("Error fetching product:", error);
      return res.status(500).json({
        msg: "Lỗi khi tải thông tin sản phẩm",
      });
    }
  },

  createProduct: async (req, res) => {
    const data = req.body;
    const token = jwt_decode.decodeToken(req.headers["authorization"]);
    const seller = await Accounts.findOne({ _id: token._id });
    const handleData = {
      seller_email: seller.email,
      product_name: data.product_name,
      product_title: data.product_title,
      product_description: data.content,
      product_price: data.product_price,
      product_image: data.product_image,
      product_category: data.product_category || data.hashtags,
      isPublic: data.isPublic || data.status,
    };
    try {
      await Products(handleData).save();
      return res.status(200).json({
        msg: "Sản phẩm đã được tạo thành công",
      });
    } catch (error) {
      return res.status(500).json({
        msg: "Lỗi khi tạo sản phẩm",
      });
    }
  },

  updateProduct: async (req, res) => {
    try {
      const productId = req.params.id;
      const data = req.body;
      const token = jwt_decode.decodeToken(req.headers["authorization"]);
      const seller = await Accounts.findOne({ _id: token._id });

      // Find the product first to check if it exists and belongs to this seller
      const existingProduct = await Products.findOne({ _id: productId });

      if (!existingProduct) {
        return res.status(404).json({
          msg: "Không tìm thấy sản phẩm",
        });
      }

      if (existingProduct.seller_email !== seller.email) {
        return res.status(403).json({
          msg: "Không có quyền cập nhật sản phẩm này",
        });
      }

      // Update the product with fallbacks to existing values
      const updateData = {
        product_name: data.product_name || existingProduct.product_name,
        product_title: data.product_title || existingProduct.product_title,
        product_description:
          data.content || existingProduct.product_description,
        product_price: data.product_price || existingProduct.product_price,
        product_image: data.product_image || existingProduct.product_image,
        product_category:
          data.product_category ||
          data.hashtags ||
          existingProduct.product_category,
        isPublic:
          data.isPublic !== undefined
            ? data.isPublic
            : data.status !== undefined
            ? data.status
            : existingProduct.isPublic,
      };

      console.log("Updating product with data:", updateData);

      await Products.findByIdAndUpdate(productId, updateData, { new: true });

      return res.status(200).json({
        msg: "Sản phẩm đã được cập nhật thành công",
      });
    } catch (error) {
      console.error("Error updating product:", error);
      return res.status(500).json({
        msg: "Lỗi khi cập nhật sản phẩm",
      });
    }
  },

  updateProductStatus: async (req, res) => {
    try {
      const productId = req.params.id;
      const { isPublic } = req.body;

      const token = jwt_decode.decodeToken(req.headers["authorization"]);
      const seller = await Accounts.findOne({ _id: token._id });

      // Find the product first to check if it exists and belongs to this seller
      const existingProduct = await Products.findOne({ _id: productId });

      if (!existingProduct) {
        return res.status(404).json({
          msg: "Không tìm thấy sản phẩm",
        });
      }

      if (existingProduct.seller_email !== seller.email) {
        return res.status(403).json({
          msg: "Không có quyền cập nhật sản phẩm này",
        });
      }

      // Update only the status
      await Products.findByIdAndUpdate(productId, { isPublic });

      return res.status(200).json({
        msg: `Sản phẩm đã chuyển sang trạng thái ${
          isPublic ? "Public" : "Private"
        }`,
      });
    } catch (error) {
      return res.status(500).json({
        msg: "Lỗi khi cập nhật trạng thái sản phẩm",
      });
    }
  },

  deleteProduct: async (req, res) => {
    try {
      const productId = req.params.id;
      const token = jwt_decode.decodeToken(req.headers["authorization"]);
      const seller = await Accounts.findOne({ _id: token._id });

      // Find the product first to check if it exists and belongs to this seller
      const existingProduct = await Products.findOne({ _id: productId });

      if (!existingProduct) {
        return res.status(404).json({
          msg: "Không tìm thấy sản phẩm",
        });
      }

      if (existingProduct.seller_email !== seller.email) {
        return res.status(403).json({
          msg: "Không có quyền xóa sản phẩm này",
        });
      }

      // Delete the product
      await Products.findByIdAndDelete(productId);

      return res.status(200).json({
        msg: "Sản phẩm đã được xóa thành công",
      });
    } catch (error) {
      return res.status(500).json({
        msg: "Lỗi khi xóa sản phẩm",
      });
    }
  },
};
module.exports = SellerController;
