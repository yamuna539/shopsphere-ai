require("dotenv").config();
const express = require("express");
const cors = require("cors");
// const dotenv = require("dotenv");

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const productRoutes = require("./routes/productRoutes");
const cartRoutes = require("./routes/cartRoutes");
const wishlistRoutes = require("./routes/wishlistRoutes");
const orderRoutes = require("./routes/orderRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const adminRoutes = require("./routes/adminRoutes");
const adminProductRoutes = require(
  "./routes/adminProductRoutes"
);
const adminCategoryRoutes = require(
  "./routes/adminCategoryRoutes"
);
const adminOrderRoutes = require(
  "./routes/adminOrderRoutes"
);
const adminUserRoutes = require(
  "./routes/adminUserRoutes"
);
const aiRoutes = require("./routes/aiRoutes");

// dotenv.config();

const app = express();

const PORT = process.env.PORT || 5000;

// Database
connectDB();

// Middleware
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use(
  "/api/orders",
  orderRoutes
);
app.use("/api/payment", paymentRoutes);
app.use(
  "/api/reviews",
  reviewRoutes
);
app.use(
  "/api/admin",
  adminRoutes
);

app.use(
  "/api/admin/products",
  adminProductRoutes
);

app.use(
  "/api/admin/categories",
  adminCategoryRoutes
);

app.use(
  "/api/admin/orders",
  adminOrderRoutes
);
app.use(
  "/api/admin/users",
  adminUserRoutes
);

app.use("/api/ai", aiRoutes);

// Health check
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "ShopSphere AI server is running",
    environment: process.env.NODE_ENV || "development",
  });
});
console.log(
  "Gemini API Key loaded:",
  !!process.env.GEMINI_API_KEY
);
// Root
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Welcome to ShopSphere AI API",
  });
});

// 404
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err);

  res.status(500).json({
    success: false,
    message: "Internal server error",
  });
});

app.listen(PORT, () => {
  console.log(`ShopSphere AI server running on port ${PORT}`);
  console.log(`http://localhost:${PORT}`);
});