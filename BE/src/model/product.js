const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ProductModel = new Schema(
  {
    seller_email: {
      type: String,
      required: true,
    },
    product_name: {
      type: String,
      required: true,
    },
    product_title: {
      type: String,
      required: true,
    },
    product_description: {
      type: String,
      required: true,
    },
    product_price: {
      type: Number,
      required: true,
    },
    product_image: {
      type: [Object],
      required: true,
    },
    product_category: {
      type: [String],
      required: true,
    },
    isPublic: {
      type: Boolean,
    },
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("Product", ProductModel);
