const mongoose = require("mongoose");

const Review = require("../models/Review");
const Product = require("../models/Product");
const Order = require("../models/Order");

const hasPurchasedProduct = async (
  userId,
  productId
) => {
  const order = await Order.findOne({
    user: userId,
    paymentStatus: "PAID",
    orderStatus: {
      $in: [
        "CONFIRMED",
        "PROCESSING",
        "SHIPPED",
        "DELIVERED",
      ],
    },
    "items.product": productId,
  });

  return Boolean(order);
};

const createReview = async (req, res) => {
  try {
    const { productId } = req.params;
    const { rating, comment } = req.body;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID",
      });
    }

    const numericRating = Number(rating);

    if (
      !Number.isInteger(numericRating) ||
      numericRating < 1 ||
      numericRating > 5
    ) {
      return res.status(400).json({
        success: false,
        message: "Rating must be an integer between 1 and 5",
      });
    }

    if (
      !comment ||
      comment.trim().length < 3
    ) {
      return res.status(400).json({
        success: false,
        message: "Review comment must contain at least 3 characters",
      });
    }

    if (comment.trim().length > 1000) {
      return res.status(400).json({
        success: false,
        message: "Review comment cannot exceed 1000 characters",
      });
    }

    const product = await Product.findById(
      productId
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    const purchased = await hasPurchasedProduct(
      req.user._id,
      productId
    );

    if (!purchased) {
      return res.status(403).json({
        success: false,
        message:
          "You can review this product only after purchasing it",
      });
    }

    const existingReview = await Review.findOne({
      user: req.user._id,
      product: productId,
    });

    if (existingReview) {
      return res.status(409).json({
        success: false,
        message:
          "You have already reviewed this product",
      });
    }

    const review = await Review.create({
      user: req.user._id,
      product: productId,
      rating: numericRating,
      comment: comment.trim(),
    });

    await updateProductRating(productId);

    const populatedReview =
      await Review.findById(review._id).populate(
        "user",
        "name avatar"
      );

    return res.status(201).json({
      success: true,
      message: "Review submitted successfully",
      data: populatedReview,
    });
  } catch (error) {
    console.error("Create Review Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create review",
    });
  }
};

const updateProductRating = async (
  productId
) => {
  const result = await Review.aggregate([
    {
      $match: {
        product: new mongoose.Types.ObjectId(
          productId
        ),
      },
    },

    {
      $group: {
        _id: "$product",
        averageRating: {
          $avg: "$rating",
        },
        totalReviews: {
          $sum: 1,
        },
      },
    },
  ]);

  if (result.length === 0) {
    await Product.findByIdAndUpdate(
      productId,
      {
        rating: 0,
        numReviews: 0,
      }
    );

    return;
  }

  await Product.findByIdAndUpdate(
    productId,
    {
      rating: Number(
        result[0].averageRating.toFixed(1)
      ),
      numReviews: result[0].totalReviews,
    }
  );
};

const getProductReviews = async (
  req,
  res
) => {
  try {
    const { productId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID",
      });
    }

    const product = await Product.findById(
      productId
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    const reviews = await Review.find({
      product: productId,
    })
      .populate(
        "user",
        "name avatar"
      )
      .sort({
        createdAt: -1,
      });

    const distribution = {
      5: 0,
      4: 0,
      3: 0,
      2: 0,
      1: 0,
    };

    reviews.forEach((review) => {
      distribution[review.rating]++;
    });

    return res.status(200).json({
      success: true,
      count: reviews.length,

      data: {
        reviews,
        rating: product.rating,
        numReviews: product.numReviews,
        distribution,
      },
    });
  } catch (error) {
    console.error(
      "Get Product Reviews Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to fetch reviews",
    });
  }
};

const updateReview = async (
  req,
  res
) => {
  try {
    const { reviewId } = req.params;
    const { rating, comment } = req.body;

    if (
      !mongoose.Types.ObjectId.isValid(reviewId)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid review ID",
      });
    }

    const numericRating = Number(rating);

    if (
      !Number.isInteger(numericRating) ||
      numericRating < 1 ||
      numericRating > 5
    ) {
      return res.status(400).json({
        success: false,
        message: "Rating must be between 1 and 5",
      });
    }

    if (
      !comment ||
      comment.trim().length < 3
    ) {
      return res.status(400).json({
        success: false,
        message: "Comment is required",
      });
    }

    const review = await Review.findOne({
      _id: reviewId,
      user: req.user._id,
    });

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

    review.rating = numericRating;
    review.comment = comment.trim();

    await review.save();

    await updateProductRating(
      review.product
    );

    const updatedReview =
      await Review.findById(
        review._id
      ).populate(
        "user",
        "name avatar"
      );

    return res.status(200).json({
      success: true,
      message: "Review updated successfully",
      data: updatedReview,
    });
  } catch (error) {
    console.error(
      "Update Review Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to update review",
    });
  }
};

const deleteReview = async (
  req,
  res
) => {
  try {
    const { reviewId } = req.params;

    if (
      !mongoose.Types.ObjectId.isValid(reviewId)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid review ID",
      });
    }

    const review = await Review.findOne({
      _id: reviewId,
      user: req.user._id,
    });

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

    const productId = review.product;

    await review.deleteOne();

    await updateProductRating(productId);

    return res.status(200).json({
      success: true,
      message: "Review deleted successfully",
    });
  } catch (error) {
    console.error(
      "Delete Review Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to delete review",
    });
  }
};

module.exports = {
  createReview,
  getProductReviews,
  updateReview,
  deleteReview,
};