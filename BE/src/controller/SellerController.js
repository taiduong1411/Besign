const Products = require("../model/product");
const Accounts = require("../model/account");
const jwt_decode = require("../services/tokenDecode");
const SellerController = {
  getAllProducts: async (req, res, next) => {
    try {
      const products = await Products.find();
      res.status(200).json(products);
    } catch (err) {
      res.status(500).json(err);
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
