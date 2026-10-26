const express = require("express");

const {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
  clearCart,
} = require("../controllers/cartController");

const {
  authenticate,
} = require("../middleware/authMiddleware");

const router = express.Router();

/*
 * All cart APIs require authentication.
 */

router.get("/", authenticate, getCart);

router.post(
  "/items",
  authenticate,
  addToCart
);

router.put(
  "/items/:productId",
  authenticate,
  updateCartItem
);

router.delete(
  "/items/:productId",
  authenticate,
  removeCartItem
);

router.delete(
  "/",
  authenticate,
  clearCart
);

module.exports = router;