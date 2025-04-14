const Products = require("../model/product");
const Accounts = require("../model/account");
const jwt_decode = require("../services/tokenDecode");
const mongoose = require("mongoose");
const { generateOrderCode } = require("../utils/orderHelper");
const Order = require("../model/order");
const emailService = require("../services/email");
const Review = require("../model/review");
const SellerController = {
  // Trang seller
  getAllProductsBySeller: async (req, res, next) => {
    const token = jwt_decode.decodeToken(req.headers["authorization"]);
    const seller = await Accounts.findOne({ _id: token._id });
    try {
      // Lấy danh sách sản phẩm của seller
      const products = await Products.find({ seller_email: seller.email });

      // Lấy tất cả đơn hàng đã xác nhận của seller
      const orders = await Order.find({
        status: true,
      });

      console.log("Số lượng đơn hàng:", orders.length);
      // Log cấu trúc của đơn hàng đầu tiên để kiểm tra
      if (orders.length > 0) {
        console.log("Cấu trúc đơn hàng:", JSON.stringify(orders[0], null, 2));
      }

      // Tính số lượt mua và doanh thu cho mỗi sản phẩm
      const productsWithStats = await Promise.all(
        products.map(async (product) => {
          console.log(
            "Đang tính cho sản phẩm:",
            product._id,
            product.product_name
          );

          // Đếm số lượng đơn hàng có chứa sản phẩm này
          let totalSold = 0;
          let totalRevenue = 0;

          // Lặp qua từng đơn hàng để tính
          for (const order of orders) {
            // Kiểm tra xem đơn hàng có chứa sản phẩm không (dựa vào productId)
            if (
              order.productId &&
              order.productId.toString() === product._id.toString()
            ) {
              console.log(
                `Đơn hàng ${order._id} chứa sản phẩm ${product.product_name}`
              );
              // Mỗi đơn hàng chỉ mua 1 sản phẩm, vì vậy chỉ cần đếm số đơn hàng
              totalSold += order.quantity || 1;
              totalRevenue += order.totalAmount || product.product_price || 0;
            }
          }

          console.log(
            `Tổng số lượng đã bán của ${product.product_name}: ${totalSold}`
          );

          // Lấy đánh giá trung bình của sản phẩm
          const reviews = await Review.find({ product_id: product._id });
          const averageRating =
            reviews.length > 0
              ? reviews.reduce((sum, review) => sum + review.rating, 0) /
                reviews.length
              : 0;

          // Trả về sản phẩm với thông tin thống kê
          const a = {
            ...product._doc,
            total_sold: totalSold,
            total_revenue: totalRevenue,
            average_rating: parseFloat(averageRating.toFixed(1)),
            review_count: reviews.length,
          };
          console.log(a);
          return a;
        })
      );
      res.status(200).json(productsWithStats);
    } catch (err) {
      console.error("Error getting products with stats:", err);
      res.status(500).json({
        message: "Có lỗi xảy ra khi lấy thông tin sản phẩm",
        error: err.message,
      });
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
  getCategory: async (req, res) => {
    const categories = await Products.distinct("product_category");
    console.log(categories);
    return res.status(200).json(categories);
  },
  getPrice: async (req, res) => {
    const prices = await Products.distinct("product_price");
    console.log(prices);
    return res.status(200).json(prices);
  },
  getRating: async (req, res) => {
    const ratings = await Review.distinct("rating");
    console.log(ratings);
    return res.status(200).json(ratings);
  },
  checkout: async (req, res) => {
    let data = req.body;
    let orderName;
    let isUnique = false;

    // Tạo mã đơn hàng mới cho đến khi tìm được mã không trùng
    while (!isUnique) {
      orderName = generateOrderCode();
      const existingOrder = await Order.findOne({ order_name: orderName });
      if (!existingOrder) {
        isUnique = true;
      }
    }

    data = {
      ...data,
      order_name: orderName,
      status: false,
    };

    try {
      await Order(data).save();
      return res.status(200).json({
        msg: "Đơn hàng đã được tạo thành công",
        order_name: data.order_name,
      });
    } catch (error) {
      return res.status(500).json({
        msg: "Lỗi khi tạo đơn hàng",
      });
    }
  },
  getOrders: async (req, res) => {
    const token = jwt_decode.decodeToken(req.headers["authorization"]);
    const seller = await Accounts.findOne({ _id: token._id });
    const product = await Products.findOne({ seller_email: seller.email });
    let orders = await Order.find({ productId: product._id });
    orders = await Promise.all(
      orders.map(async (order) => {
        const product = await Products.findById(order.productId);
        return {
          ...order._doc,
          product_name: product?.product_name || "Sản phẩm đã bị xóa",
          product_image: product?.product_image || [],
          product_price: product?.product_price || 0,
        };
      })
    );
    return res.status(200).json(orders);
  },
  updateOrderStatus: async (req, res) => {
    const token = jwt_decode.decodeToken(req.headers["authorization"]);
    const seller = await Accounts.findOne({ _id: token._id });
    const { orderId, status } = req.body;

    try {
      const order = await Order.findById(orderId);
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }

      const product = await Products.findById(order.productId);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      // Update order status
      order.status = status;
      await order.save();

      // Send confirmation email to buyer
      emailService.confirmOrder(
        "Trạng thái đơn hàng đã được cập nhật",
        `Đơn hàng ${order.order_name} đã được xác nhận`,
        order.email,
        product.product_name
      );

      return res
        .status(200)
        .json({ message: "Order status updated successfully" });
    } catch (error) {
      console.error("Error updating order status:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  },
};
module.exports = SellerController;
