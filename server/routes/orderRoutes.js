const express = require("express");

const {
  createOrder,
  getMyOrders,
  getOrderById,
} = require("../controllers/orderController");

const {
  authenticate,
} = require("../middleware/authMiddleware");

const router = express.Router();

/*
 * Create order
 */
router.post(
  "/",
  authenticate,
  createOrder
);

/*
 * Get current user's orders
 */
router.get(
  "/",
  authenticate,
  getMyOrders
);

/*
 * Get current user's specific order
 */
router.get(
  "/:id",
  authenticate,
  getOrderById
);

module.exports = router;