const mongoose = require("mongoose");

const Cart = require("../models/Cart");
const Order = require("../models/Order");
const Product = require("../models/Product");

const TAX_RATE = 0.18;

const SHIPPING_FEE = 100;

const FREE_SHIPPING_THRESHOLD = 2000;

/*
 * ==========================================
 * Calculate Totals
 * ==========================================
 */

const calculateTotals = (items) => {
  const subtotal = items.reduce(
    (sum, item) => {
      return (
        sum +
        item.price *
          item.quantity
      );
    },
    0
  );

  const tax =
    subtotal * TAX_RATE;

  const shippingFee =
    subtotal === 0 ||
    subtotal >=
      FREE_SHIPPING_THRESHOLD
      ? 0
      : SHIPPING_FEE;

  const totalAmount =
    subtotal +
    tax +
    shippingFee;

  return {
    subtotal: Number(
      subtotal.toFixed(2)
    ),

    tax: Number(
      tax.toFixed(2)
    ),

    shippingFee: Number(
      shippingFee.toFixed(2)
    ),

    totalAmount: Number(
      totalAmount.toFixed(2)
    ),
  };
};

/*
 * ==========================================
 * Validate Shipping Address
 * ==========================================
 */

const validateShippingAddress = (
  shippingAddress
) => {
  const requiredFields = [
    "fullName",
    "email",
    "phone",
    "address",
    "city",
    "state",
    "postalCode",
  ];

  for (const field of requiredFields) {
    if (
      !shippingAddress?.[field] ||
      String(
        shippingAddress[field]
      ).trim() === ""
    ) {
      return `${field} is required`;
    }
  }

  return null;
};

/*
 * ==========================================
 * POST /api/orders
 * Create Order
 * ==========================================
 */

const createOrder = async (
  req,
  res,
  next
) => {
  const session =
    await mongoose.startSession();

  try {
    /*
     * Get shipping address
     */
    const {
      shippingAddress,
    } = req.body;

    /*
     * Get authenticated user ID.
     *
     * Support both:
     *
     * req.user._id
     * req.user.id
     */
    const userId =
      req.user?._id ||
      req.user?.id;

    console.log(
      "Order creation user:",
      req.user
    );

    console.log(
      "Order creation userId:",
      userId
    );

    /*
     * Authentication check
     */
    if (!userId) {
      return res.status(401).json({
        success: false,
        message:
          "User authentication information is missing.",
      });
    }

    /*
     * Validate shipping address
     */
    const addressError =
      validateShippingAddress(
        shippingAddress
      );

    if (addressError) {
      return res.status(400).json({
        success: false,
        message: addressError,
      });
    }

    /*
     * Start transaction
     */
    session.startTransaction();

    /*
     * Find current user's cart
     */
    const cart =
      await Cart.findOne({
        user: userId,
      }).session(session);

    console.log(
      "Cart found for order:",
      cart
        ? cart._id
        : null
    );

    console.log(
      "Cart item count:",
      cart?.items?.length || 0
    );

    /*
     * Check cart
     */
    if (
      !cart ||
      cart.items.length === 0
    ) {
      await session.abortTransaction();

      return res.status(400).json({
        success: false,
        message:
          "Your cart is empty",
      });
    }

    /*
     * ======================================
     * Build Order Items
     * ======================================
     */

    const orderItems = [];

    /*
     * Re-read every product
     * from MongoDB.
     */
    for (const cartItem of cart.items) {
      const product =
        await Product.findById(
          cartItem.product
        ).session(session);

      /*
       * Product no longer exists
       */
      if (!product) {
        await session.abortTransaction();

        return res.status(404).json({
          success: false,
          message:
            "One or more products in your cart no longer exist",
        });
      }

      /*
       * Stock validation
       */
      if (
        product.stock <
        cartItem.quantity
      ) {
        await session.abortTransaction();

        return res.status(400).json({
          success: false,
          message: `${product.name} has only ${product.stock} item(s) available`,
        });
      }

      /*
       * Always use current
       * MongoDB product price.
       */
      const currentPrice =
        product.price;

      orderItems.push({
        product:
          product._id,

        name:
          product.name,

        image:
          product.images?.[0] ||
          "",

        quantity:
          cartItem.quantity,

        price:
          currentPrice,
      });
    }

    /*
     * ======================================
     * Calculate Totals
     * ======================================
     */

    const totals =
      calculateTotals(
        orderItems
      );

    /*
     * ======================================
     * Create Order
     * ======================================
     */

    const [order] =
      await Order.create(
        [
          {
            user:
              userId,

            items:
              orderItems,

            shippingAddress: {
              fullName:
                shippingAddress.fullName.trim(),

              email:
                shippingAddress.email
                  .trim()
                  .toLowerCase(),

              phone:
                shippingAddress.phone.trim(),

              address:
                shippingAddress.address.trim(),

              city:
                shippingAddress.city.trim(),

              state:
                shippingAddress.state.trim(),

              postalCode:
                shippingAddress.postalCode.trim(),
            },

            subtotal:
              totals.subtotal,

            shippingFee:
              totals.shippingFee,

            tax:
              totals.tax,

            totalAmount:
              totals.totalAmount,

            paymentMethod:
              "RAZORPAY",

            paymentStatus:
              "PENDING",

            orderStatus:
              "PENDING",
          },
        ],
        {
          session,
        }
      );

    /*
     * ======================================
     * Reduce Product Stock
     * ======================================
     */

    for (const item of orderItems) {
      const updatedProduct =
        await Product.findOneAndUpdate(
          {
            _id:
              item.product,

            stock: {
              $gte:
                item.quantity,
            },
          },
          {
            $inc: {
              stock:
                -item.quantity,
            },
          },
          {
            new: true,
            session,
          }
        );

      /*
       * Stock changed while
       * creating order
       */
      if (!updatedProduct) {
        await session.abortTransaction();

        return res.status(409).json({
          success: false,
          message:
            "Stock changed while creating the order. Please review your cart and try again.",
        });
      }
    }

    /*
     * ======================================
     * Clear Cart
     * ======================================
     */

    cart.items = [];

    await cart.save({
      session,
    });

    /*
     * ======================================
     * Commit Transaction
     * ======================================
     */

    await session.commitTransaction();

    /*
     * ======================================
     * Get Created Order
     * ======================================
     */

    const createdOrder =
      await Order.findById(
        order._id
      ).populate(
        "items.product",
        "name slug images price"
      );

    console.log(
      "Created ShopSphere order:",
      createdOrder?._id
    );

    /*
     * ======================================
     * Response
     * ======================================
     */

    return res.status(201).json({
      success: true,

      message:
        "Order created successfully",

      order:
        createdOrder,
    });
  } catch (error) {
    /*
     * Abort transaction only
     * if it is still active.
     */
    if (
      session.inTransaction()
    ) {
      await session.abortTransaction();
    }

    next(error);
  } finally {
    await session.endSession();
  }
};

/*
 * ==========================================
 * GET /api/orders
 * Get My Orders
 * ==========================================
 */

const getMyOrders = async (
  req,
  res,
  next
) => {
  try {
    const userId =
      req.user?._id ||
      req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message:
          "User authentication information is missing.",
      });
    }

    const orders =
      await Order.find({
        user: userId,
      })
        .sort({
          createdAt: -1,
        })
        .populate(
          "items.product",
          "name slug images"
        );

    return res.status(200).json({
      success: true,
      count:
        orders.length,
      orders,
    });
  } catch (error) {
    next(error);
  }
};

/*
 * ==========================================
 * GET /api/orders/:id
 * Get One Order
 * ==========================================
 */

const getOrderById = async (
  req,
  res,
  next
) => {
  try {
    const {
      id,
    } = req.params;

    if (
      !mongoose.Types.ObjectId.isValid(
        id
      )
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid order ID",
      });
    }

    const userId =
      req.user?._id ||
      req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message:
          "User authentication information is missing.",
      });
    }

    const order =
      await Order.findOne({
        _id: id,
        user: userId,
      }).populate(
        "items.product",
        "name slug images price"
      );

    if (!order) {
      return res.status(404).json({
        success: false,
        message:
          "Order not found",
      });
    }

    return res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createOrder,
  getMyOrders,
  getOrderById,
};