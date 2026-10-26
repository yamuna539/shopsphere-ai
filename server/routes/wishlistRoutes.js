const express = require("express");

const {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  clearWishlist,
} = require("../controllers/wishlistController");

const {
  authenticate,
} = require("../middleware/authMiddleware");

const router = express.Router();

/*
 * All wishlist routes require login.
 */

router.get(
  "/",
  authenticate,
  getWishlist
);

router.post(
  "/:productId",
  authenticate,
  addToWishlist
);

router.delete(
  "/:productId",
  authenticate,
  removeFromWishlist
);

router.delete(
  "/",
  authenticate,
  clearWishlist
);

module.exports = router;