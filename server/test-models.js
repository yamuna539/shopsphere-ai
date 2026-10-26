const mongoose = require("mongoose");

const User = require("./models/User");
const Product = require("./models/Product");
const Category = require("./models/Category");
const Cart = require("./models/Cart");
const Wishlist = require("./models/Wishlist");
const Review = require("./models/Review");
const Order = require("./models/Order");

const MONGODB_URI = process.env.MONGODB_URI;

async function testDatabase() {
    try {
        await mongoose.connect(MONGODB_URI);

        console.log("MongoDB connected successfully.");

        console.log("User model:", User.modelName);
        console.log("Product model:", Product.modelName);
        console.log("Category model:", Category.modelName);
        console.log("Cart model:", Cart.modelName);
        console.log("Wishlist model:", Wishlist.modelName);
        console.log("Review model:", Review.modelName);
        console.log("Order model:", Order.modelName);

        // Force MongoDB to create the collections
        await User.createCollection();
        await Product.createCollection();
        await Category.createCollection();
        await Cart.createCollection();
        await Wishlist.createCollection();
        await Review.createCollection();
        await Order.createCollection();

        console.log("Collections created successfully.");

    } catch (error) {
        console.error("Database error:", error);
    } finally {
        await mongoose.disconnect();
        console.log("MongoDB disconnected.");
    }
}

testDatabase();