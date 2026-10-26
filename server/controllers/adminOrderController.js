const mongoose = require("mongoose");

const Order = require("../models/Order");

const getAdminOrders = async (
  req,
  res
) => {
  try {
    const {
      search = "",
      status = "",
      paymentStatus = "",
      page = 1,
      limit = 10,
    } = req.query;

    const currentPage = Math.max(
      Number(page) || 1,
      1
    );

    const pageLimit = Math.min(
      Math.max(Number(limit) || 10, 1),
      100
    );

    const filter = {};

    if (status) {
      filter.orderStatus = status;
    }

    if (paymentStatus) {
      filter.paymentStatus =
        paymentStatus;
    }

    if (search.trim()) {
      const searchRegex = new RegExp(
        search.trim(),
        "i"
      );

      const matchingUsers =
        await mongoose
          .model("User")
          .find({
            $or: [
              {
                name: searchRegex,
              },
              {
                email: searchRegex,
              },
            ],
          })
          .select("_id");

      const userIds =
        matchingUsers.map(
          (user) => user._id
        );

      const searchConditions = [
        {
          razorpayOrderId:
            searchRegex,
        },
      ];

      if (mongoose.Types.ObjectId.isValid(
        search.trim()
      )) {
        searchConditions.push({
          _id: search.trim(),
        });
      }

      if (userIds.length > 0) {
        searchConditions.push({
          user: {
            $in: userIds,
          },
        });
      }

      filter.$or = searchConditions;
    }

    const skip =
      (currentPage - 1) * pageLimit;

    const [
      orders,
      totalOrders,
    ] = await Promise.all([
      Order.find(filter)
        .populate(
          "user",
          "name email phone"
        )
        .sort({
          createdAt: -1,
        })
        .skip(skip)
        .limit(pageLimit),

      Order.countDocuments(filter),
    ]);

    return res.status(200).json({
      success: true,
      data: orders,

      pagination: {
        page: currentPage,
        limit: pageLimit,
        total: totalOrders,
        pages: Math.ceil(
          totalOrders / pageLimit
        ),
      },
    });
  } catch (error) {
    console.error(
      "Admin Get Orders Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to fetch orders",
    });
  }
};

const getAdminOrderById = async (
  req,
  res
) => {
  try {
    const { id } = req.params;

    if (
      !mongoose.Types.ObjectId.isValid(id)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid order ID",
      });
    }

    const order =
      await Order.findById(id).populate(
        "user",
        "name email phone"
      );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error) {
    console.error(
      "Admin Order Details Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to fetch order details",
    });
  }
};

const allowedTransitions = {
  PENDING: [
    "CONFIRMED",
    "CANCELLED",
  ],

  CONFIRMED: [
    "PROCESSING",
    "CANCELLED",
  ],

  PROCESSING: [
    "SHIPPED",
    "CANCELLED",
  ],

  SHIPPED: [
    "DELIVERED",
  ],

  DELIVERED: [],

  CANCELLED: [],
};

const updateAdminOrderStatus =
  async (req, res) => {
    try {
      const { id } = req.params;
      const { orderStatus } = req.body;

      if (
        !mongoose.Types.ObjectId.isValid(
          id
        )
      ) {
        return res.status(400).json({
          success: false,
          message: "Invalid order ID",
        });
      }

      const validStatuses = [
        "PENDING",
        "CONFIRMED",
        "PROCESSING",
        "SHIPPED",
        "DELIVERED",
        "CANCELLED",
      ];

      if (
        !validStatuses.includes(
          orderStatus
        )
      ) {
        return res.status(400).json({
          success: false,
          message: "Invalid order status",
        });
      }

      const order =
        await Order.findById(id);

      if (!order) {
        return res.status(404).json({
          success: false,
          message: "Order not found",
        });
      }

      if (
        order.orderStatus ===
        orderStatus
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Order is already in this status",
        });
      }

      const allowed =
        allowedTransitions[
          order.orderStatus
        ] || [];

      if (
        !allowed.includes(
          orderStatus
        )
      ) {
        return res.status(409).json({
          success: false,
          message:
            `Cannot change order status from ${order.orderStatus} to ${orderStatus}`,
        });
      }

      if (
        orderStatus === "CONFIRMED" &&
        order.paymentStatus !== "PAID"
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Only paid orders can be confirmed",
        });
      }

      order.orderStatus =
        orderStatus;

      await order.save();

      return res.status(200).json({
        success: true,
        message:
          "Order status updated successfully",
        data: order,
      });
    } catch (error) {
      console.error(
        "Admin Update Order Status Error:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Failed to update order status",
      });
    }
  };

  module.exports = {
  getAdminOrders,
  getAdminOrderById,
  updateAdminOrderStatus,
};