const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
      maxlength: [200, "Product name cannot exceed 200 characters"],
    },

    slug: {
      type: String,
      required: [true, "Product slug is required"],
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },

    description: {
      type: String,
      required: [true, "Product description is required"],
      trim: true,
    },

    price: {
      type: Number,
      required: [true, "Product price is required"],
      min: [0, "Price cannot be negative"],
    },

    originalPrice: {
      type: Number,
      min: [0, "Original price cannot be negative"],
      default: null,
    },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "Product category is required"],
      index: true,
    },

    brand: {
      type: String,
      trim: true,
      default: "",
      index: true,
    },

    images: {
      type: [String],
      default: [],
    },

    stock: {
      type: Number,
      required: [true, "Stock is required"],
      min: [0, "Stock cannot be negative"],
      default: 0,
    },

    specifications: {
      type: Map,
      of: String,
      default: {},
    },

    features: {
      type: [String],
      default: [],
    },

    rating: {
      type: Number,
      min: 0,
      max: 5,
      default: 0,
    },

    numReviews: {
      type: Number,
      min: 0,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

productSchema.index({
  name: "text",
  description: "text",
  brand: "text",
});

productSchema.index({
  category: 1,
  price: 1,
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;