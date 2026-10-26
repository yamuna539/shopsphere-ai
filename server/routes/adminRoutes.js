const express = require("express");

const {
  getDashboardStats,
  getRecentOrders,
  getSalesData,
} = require("../controllers/adminController");

const {
  authenticate,
  authorizeAdmin,
} = require("../middleware/authMiddleware");

const router = express.Router();

router.get(
  "/dashboard",
  authenticate,
  authorizeAdmin,
  getDashboardStats
);

router.get(
  "/recent-orders",
  authenticate,
  authorizeAdmin,
  getRecentOrders
);

router.get(
  "/sales",
  authenticate,
  authorizeAdmin,
  getSalesData
);

module.exports = router;