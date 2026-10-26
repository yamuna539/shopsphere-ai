const express = require("express");

const {
  createReview,
  getProductReviews,
  updateReview,
  deleteReview,
} = require("../controllers/reviewController");

const {
  authenticate,
} = require("../middleware/authMiddleware");

const router = express.Router();

router.get(
  "/product/:productId",
  getProductReviews
);

router.post(
  "/product/:productId",
  authenticate,
  createReview
);

router.put(
  "/:reviewId",
  authenticate,
  updateReview
);

router.delete(
  "/:reviewId",
  authenticate,
  deleteReview
);

module.exports = router;