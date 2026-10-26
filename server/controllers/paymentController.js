const crypto = require("crypto");
const Order = require("../models/Order");
const razorpay = require("../services/razorpayService");

const createRazorpayOrder = async (req, res) => {
  try {
    const { orderId } = req.body;

    if (!orderId) {
      return res.status(400).json({
        success: false,
        message: "Order ID is required",
      });
    }

    const order = await Order.findOne({
      _id: orderId,
      user: req.user._id,
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    if (order.paymentStatus === "PAID") {
      return res.status(400).json({
        success: false,
        message: "Order is already paid",
      });
    }

    /*
      IMPORTANT:
      Amount comes from the existing server-created
      ShopSphere order.

      We do NOT accept amount from React.
    */

    const amountInPaise = Math.round(order.totalAmount * 100);

    const razorpayOrder = await razorpay.orders.create({
      amount: amountInPaise,
      currency: "INR",
      receipt: `shopsphere_${order._id}`,
    });

    order.razorpayOrderId = razorpayOrder.id;

    await order.save();

    return res.status(200).json({
      success: true,
      message: "Razorpay order created",
      data: {
        razorpayOrderId: razorpayOrder.id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        keyId: process.env.RAZORPAY_KEY_ID,
        orderId: order._id,
      },
    });
  } catch (error) {
    console.error("Create Razorpay Order Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create Razorpay order",
    });
  }
};

const verifyRazorpayPayment = async (req, res) => {
  try {
    const {
      orderId,
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body;

    if (
      !orderId ||
      !razorpay_order_id ||
      !razorpay_payment_id ||
      !razorpay_signature
    ) {
      return res.status(400).json({
        success: false,
        message: "Payment verification data is incomplete",
      });
    }

    const order = await Order.findOne({
      _id: orderId,
      user: req.user._id,
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    if (!order.razorpayOrderId) {
      return res.status(400).json({
        success: false,
        message: "Razorpay order was not created",
      });
    }

    if (order.razorpayOrderId !== razorpay_order_id) {
      return res.status(400).json({
        success: false,
        message: "Razorpay order ID mismatch",
      });
    }

    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (generatedSignature !== razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment signature",
      });
    }

    order.razorpayPaymentId = razorpay_payment_id;
    order.razorpaySignature = razorpay_signature;
    order.paymentStatus = "PAID";
    order.orderStatus = "CONFIRMED";
    order.paidAt = new Date();

    await order.save();

    return res.status(200).json({
      success: true,
      message: "Payment verified successfully",
      data: {
        orderId: order._id,
        paymentStatus: order.paymentStatus,
        orderStatus: order.orderStatus,
        paidAt: order.paidAt,
      },
    });
  } catch (error) {
    console.error("Verify Razorpay Payment Error:", error);

    return res.status(500).json({
      success: false,
      message: "Payment verification failed",
    });
  }
};

module.exports = {
  createRazorpayOrder,
  verifyRazorpayPayment,
};