const User = require("../models/User");
const Product = require("../models/Product");
const Order = require("../models/Order");

const getDashboardStats = async (req, res) => {
  try {
    const [
      totalUsers,
      totalProducts,
      totalOrders,
      pendingOrders,
      deliveredOrders,
    ] = await Promise.all([
      User.countDocuments(),

      Product.countDocuments(),

      Order.countDocuments(),

      Order.countDocuments({
        orderStatus: "PENDING",
      }),

      Order.countDocuments({
        orderStatus: "DELIVERED",
      }),
    ]);

    const revenueResult =
      await Order.aggregate([
        {
          $match: {
            paymentStatus: "PAID",
            orderStatus: {
              $ne: "CANCELLED",
            },
          },
        },

        {
          $group: {
            _id: null,
            totalRevenue: {
              $sum: "$totalAmount",
            },
          },
        },
      ]);

    const totalRevenue =
      revenueResult.length > 0
        ? revenueResult[0].totalRevenue
        : 0;

    return res.status(200).json({
      success: true,

      data: {
        totalUsers,
        totalProducts,
        totalOrders,
        totalRevenue,
        pendingOrders,
        deliveredOrders,
      },
    });
  } catch (error) {
    console.error(
      "Dashboard Stats Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to fetch dashboard statistics",
    });
  }
};

const getRecentOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate(
        "user",
        "name email"
      )
      .sort({
        createdAt: -1,
      })
      .limit(10)
      .select(
        "_id user totalAmount paymentStatus orderStatus createdAt"
      );

    return res.status(200).json({
      success: true,
      count: orders.length,
      data: orders,
    });
  } catch (error) {
    console.error(
      "Recent Orders Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to fetch recent orders",
    });
  }
};

const getSalesData = async (req, res) => {
  try {
    const sales = await Order.aggregate([
      {
        $match: {
          paymentStatus: "PAID",
          orderStatus: {
            $ne: "CANCELLED",
          },
        },
      },

      {
        $group: {
          _id: {
            year: {
              $year: "$createdAt",
            },

            month: {
              $month: "$createdAt",
            },
          },

          revenue: {
            $sum: "$totalAmount",
          },

          orders: {
            $sum: 1,
          },
        },
      },

      {
        $sort: {
          "_id.year": 1,
          "_id.month": 1,
        },
      },
    ]);

    const formattedSales = sales.map(
      (item) => ({
        year: item._id.year,
        month: item._id.month,
        revenue: Number(
          item.revenue.toFixed(2)
        ),
        orders: item.orders,
      })
    );

    return res.status(200).json({
      success: true,
      data: formattedSales,
    });
  } catch (error) {
    console.error(
      "Sales Data Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to fetch sales data",
    });
  }
};

module.exports = {
  getDashboardStats,
  getRecentOrders,
  getSalesData,
};