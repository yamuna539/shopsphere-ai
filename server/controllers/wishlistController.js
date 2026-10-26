const Wishlist = require("../models/Wishlist");
const Product = require("../models/Product");

/*
 * GET /api/wishlist
 *
 * Get the logged-in user's wishlist
 */
const getWishlist = async (req, res, next) => {
  try {
    let wishlist = await Wishlist.findOne({
      user: req.user._id,
    }).populate({
      path: "products",
      select:
        "name slug description price originalPrice images stock brand category rating numReviews",
      populate: {
        path: "category",
        select: "name slug",
      },
    });

    /*
     * If user doesn't have a wishlist yet,
     * create an empty one.
     */
    if (!wishlist) {
      wishlist = await Wishlist.create({
        user: req.user._id,
        products: [],
      });
    }

    res.status(200).json({
      success: true,
      wishlist: {
        _id: wishlist._id,
        user: wishlist.user,
        products: wishlist.products,
      },
    });
  } catch (error) {
    next(error);
  }
};

/*
 * POST /api/wishlist/:productId
 *
 * Add product to wishlist
 */
const addToWishlist = async (req, res, next) => {
  try {
    const { productId } = req.params;

    /*
     * Validate product
     */
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    /*
     * Find or create user's wishlist
     */
    let wishlist = await Wishlist.findOne({
      user: req.user._id,
    });

    if (!wishlist) {
      wishlist = new Wishlist({
        user: req.user._id,
        products: [],
      });
    }

    /*
     * Prevent duplicate product
     */
    const alreadyExists = wishlist.products.some(
      (id) => id.toString() === productId
    );

    if (alreadyExists) {
      return res.status(409).json({
        success: false,
        message: "Product is already in your wishlist",
      });
    }

    wishlist.products.push(product._id);

    await wishlist.save();

    await wishlist.populate({
      path: "products",
      select:
        "name slug description price originalPrice images stock brand category rating numReviews",
      populate: {
        path: "category",
        select: "name slug",
      },
    });

    res.status(201).json({
      success: true,
      message: "Product added to wishlist",
      wishlist,
    });
  } catch (error) {
    next(error);
  }
};

/*
 * DELETE /api/wishlist/:productId
 *
 * Remove product from wishlist
 */
const removeFromWishlist = async (
  req,
  res,
  next
) => {
  try {
    const { productId } = req.params;

    const wishlist = await Wishlist.findOne({
      user: req.user._id,
    });

    if (!wishlist) {
      return res.status(404).json({
        success: false,
        message: "Wishlist not found",
      });
    }

    const originalLength =
      wishlist.products.length;

    wishlist.products = wishlist.products.filter(
      (product) =>
        product.toString() !== productId
    );

    if (
      wishlist.products.length === originalLength
    ) {
      return res.status(404).json({
        success: false,
        message: "Product is not in your wishlist",
      });
    }

    await wishlist.save();

    await wishlist.populate({
      path: "products",
      select:
        "name slug description price originalPrice images stock brand category rating numReviews",
      populate: {
        path: "category",
        select: "name slug",
      },
    });

    res.status(200).json({
      success: true,
      message: "Product removed from wishlist",
      wishlist,
    });
  } catch (error) {
    next(error);
  }
};

/*
 * DELETE /api/wishlist
 *
 * Clear entire wishlist
 */
const clearWishlist = async (
  req,
  res,
  next
) => {
  try {
    const wishlist = await Wishlist.findOne({
      user: req.user._id,
    });

    if (!wishlist) {
      return res.status(200).json({
        success: true,
        message: "Wishlist is already empty",
        wishlist: {
          products: [],
        },
      });
    }

    wishlist.products = [];

    await wishlist.save();

    res.status(200).json({
      success: true,
      message: "Wishlist cleared successfully",
      wishlist: {
        _id: wishlist._id,
        user: wishlist.user,
        products: [],
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  clearWishlist,
};