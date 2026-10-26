const Cart = require("../models/Cart");
const Product = require("../models/Product");

/*
 * Cart pricing configuration
 *
 * Keep these values in one place so they can easily
 * be changed later during checkout/order development.
 */
const TAX_RATE = 0.18;
const SHIPPING_FEE = 100;
const FREE_SHIPPING_THRESHOLD = 2000;

/*
 * Calculate cart totals
 */
const calculateTotals = (items) => {
  const subtotal = items.reduce((total, item) => {
    return total + item.price * item.quantity;
  }, 0);

  const tax = subtotal * TAX_RATE;

  const shippingFee =
    subtotal === 0 || subtotal >= FREE_SHIPPING_THRESHOLD
      ? 0
      : SHIPPING_FEE;

  const totalAmount = subtotal + tax + shippingFee;

  return {
    subtotal: Number(subtotal.toFixed(2)),
    tax: Number(tax.toFixed(2)),
    shippingFee: Number(shippingFee.toFixed(2)),
    totalAmount: Number(totalAmount.toFixed(2)),
  };
};

/*
 * GET /api/cart
 *
 * Get current user's cart
 */
const getCart = async (req, res, next) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id }).populate({
      path: "items.product",
      select:
        "name slug price originalPrice images stock brand category rating numReviews",
      populate: {
        path: "category",
        select: "name slug",
      },
    });

    if (!cart) {
      cart = await Cart.create({
        user: req.user._id,
        items: [],
      });
    }

    const totals = calculateTotals(cart.items);

    res.status(200).json({
      success: true,
      cart: {
        _id: cart._id,
        user: cart.user,
        items: cart.items,
        ...totals,
      },
    });
  } catch (error) {
    next(error);
  }
};

/*
 * POST /api/cart/items
 *
 * Add product to cart
 */
const addToCart = async (req, res, next) => {
  try {
    const { productId, quantity = 1 } = req.body;

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: "Product ID is required",
      });
    }

    const requestedQuantity = Number(quantity);

    if (
      !Number.isInteger(requestedQuantity) ||
      requestedQuantity < 1
    ) {
      return res.status(400).json({
        success: false,
        message: "Quantity must be a positive integer",
      });
    }

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    if (product.stock <= 0) {
      return res.status(400).json({
        success: false,
        message: "Product is out of stock",
      });
    }

    let cart = await Cart.findOne({
      user: req.user._id,
    });

    if (!cart) {
      cart = new Cart({
        user: req.user._id,
        items: [],
      });
    }

    const existingItem = cart.items.find(
      (item) => item.product.toString() === productId
    );

    const newQuantity = existingItem
      ? existingItem.quantity + requestedQuantity
      : requestedQuantity;

    if (newQuantity > product.stock) {
      return res.status(400).json({
        success: false,
        message: `Only ${product.stock} item(s) available in stock`,
      });
    }

    if (existingItem) {
      existingItem.quantity = newQuantity;

      /*
       * Always take price from MongoDB.
       */
      existingItem.price = product.price;
    } else {
      cart.items.push({
        product: product._id,
        quantity: requestedQuantity,
        price: product.price,
      });
    }

    await cart.save();

    await cart.populate({
      path: "items.product",
      select:
        "name slug price originalPrice images stock brand category rating numReviews",
      populate: {
        path: "category",
        select: "name slug",
      },
    });

    const totals = calculateTotals(cart.items);

    res.status(200).json({
      success: true,
      message: "Product added to cart",
      cart: {
        _id: cart._id,
        user: cart.user,
        items: cart.items,
        ...totals,
      },
    });
  } catch (error) {
    next(error);
  }
};

/*
 * PUT /api/cart/items/:productId
 *
 * Update product quantity
 */
const updateCartItem = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const requestedQuantity = Number(req.body.quantity);

    if (
      !Number.isInteger(requestedQuantity) ||
      requestedQuantity < 1
    ) {
      return res.status(400).json({
        success: false,
        message: "Quantity must be a positive integer",
      });
    }

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    if (product.stock < requestedQuantity) {
      return res.status(400).json({
        success: false,
        message: `Only ${product.stock} item(s) available in stock`,
      });
    }

    const cart = await Cart.findOne({
      user: req.user._id,
    });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    const item = cart.items.find(
      (item) => item.product.toString() === productId
    );

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Product is not in your cart",
      });
    }

    item.quantity = requestedQuantity;

    /*
     * Always synchronize price from database.
     */
    item.price = product.price;

    await cart.save();

    await cart.populate({
      path: "items.product",
      select:
        "name slug price originalPrice images stock brand category rating numReviews",
      populate: {
        path: "category",
        select: "name slug",
      },
    });

    const totals = calculateTotals(cart.items);

    res.status(200).json({
      success: true,
      message: "Cart quantity updated",
      cart: {
        _id: cart._id,
        user: cart.user,
        items: cart.items,
        ...totals,
      },
    });
  } catch (error) {
    next(error);
  }
};

/*
 * DELETE /api/cart/items/:productId
 *
 * Remove one product
 */
const removeCartItem = async (req, res, next) => {
  try {
    const { productId } = req.params;

    const cart = await Cart.findOne({
      user: req.user._id,
    });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    const originalLength = cart.items.length;

    cart.items = cart.items.filter(
      (item) => item.product.toString() !== productId
    );

    if (cart.items.length === originalLength) {
      return res.status(404).json({
        success: false,
        message: "Product is not in your cart",
      });
    }

    await cart.save();

    await cart.populate({
      path: "items.product",
      select:
        "name slug price originalPrice images stock brand category rating numReviews",
      populate: {
        path: "category",
        select: "name slug",
      },
    });

    const totals = calculateTotals(cart.items);

    res.status(200).json({
      success: true,
      message: "Product removed from cart",
      cart: {
        _id: cart._id,
        user: cart.user,
        items: cart.items,
        ...totals,
      },
    });
  } catch (error) {
    next(error);
  }
};

/*
 * DELETE /api/cart
 *
 * Clear entire cart
 */
const clearCart = async (req, res, next) => {
  try {
    const cart = await Cart.findOne({
      user: req.user._id,
    });

    if (!cart) {
      return res.status(200).json({
        success: true,
        message: "Cart is already empty",
        cart: {
          items: [],
          subtotal: 0,
          tax: 0,
          shippingFee: 0,
          totalAmount: 0,
        },
      });
    }

    cart.items = [];

    await cart.save();

    res.status(200).json({
      success: true,
      message: "Cart cleared successfully",
      cart: {
        _id: cart._id,
        user: cart.user,
        items: [],
        subtotal: 0,
        tax: 0,
        shippingFee: 0,
        totalAmount: 0,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
  clearCart,
};