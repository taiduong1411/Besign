const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const SellerModel = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phone: {
      type: String,
      required: true,
      unique: true,
    },
    fullname: {
      type: String,
    },
    idCardNumber: {
      type: Number,
      required: true,
      unique: true,
    },
    address: {
      type: String,
    },
    approved: {
      type: String,
      default: "pending",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    shopName: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    agreeTerms: {
      type: Boolean,
    },
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("Seller", SellerModel);
