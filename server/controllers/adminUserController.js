const mongoose = require("mongoose");

const User = require("../models/User");
const Order = require("../models/Order");

const getAdminUsers = async (
  req,
  res
) => {
  try {
    const {
      search = "",
      role = "",
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

    if (role) {
      filter.role = role;
    }

    if (search.trim()) {
      const regex = new RegExp(
        search.trim(),
        "i"
      );

      filter.$or = [
        {
          name: regex,
        },
        {
          email: regex,
        },
      ];
    }

    const skip =
      (currentPage - 1) * pageLimit;

    const [
      users,
      totalUsers,
    ] = await Promise.all([
      User.find(filter)
        .select(
          "-password"
        )
        .sort({
          createdAt: -1,
        })
        .skip(skip)
        .limit(pageLimit),

      User.countDocuments(filter),
    ]);

    return res.status(200).json({
      success: true,
      data: users,

      pagination: {
        page: currentPage,
        limit: pageLimit,
        total: totalUsers,
        pages: Math.ceil(
          totalUsers / pageLimit
        ),
      },
    });
  } catch (error) {
    console.error(
      "Admin Get Users Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to fetch users",
    });
  }
};

const getAdminUserById =
  async (req, res) => {
    try {
      const { id } = req.params;

      if (
        !mongoose.Types.ObjectId.isValid(
          id
        )
      ) {
        return res.status(400).json({
          success: false,
          message: "Invalid user ID",
        });
      }

      const user =
        await User.findById(id)
          .select("-password");

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      const orderCount =
        await Order.countDocuments({
          user: id,
        });

      return res.status(200).json({
        success: true,
        data: {
          user,
          orderCount,
        },
      });
    } catch (error) {
      console.error(
        "Admin User Details Error:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Failed to fetch user details",
      });
    }
  };

  const updateUserRole =
  async (req, res) => {
    try {
      const { id } = req.params;
      const { role } = req.body;

      if (
        !mongoose.Types.ObjectId.isValid(
          id
        )
      ) {
        return res.status(400).json({
          success: false,
          message: "Invalid user ID",
        });
      }

      if (
        !["customer", "admin"].includes(
          role
        )
      ) {
        return res.status(400).json({
          success: false,
          message: "Invalid role",
        });
      }

      if (
        req.user._id.toString() ===
        id &&
        role !== "admin"
      ) {
        return res.status(400).json({
          success: false,
          message:
            "You cannot remove your own admin role",
        });
      }

      const user =
        await User.findById(id);

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      user.role = role;

      await user.save();

      return res.status(200).json({
        success: true,
        message:
          "User role updated successfully",
        data: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });
    } catch (error) {
      console.error(
        "Update User Role Error:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Failed to update user role",
      });
    }
  };

  const deleteAdminUser =
  async (req, res) => {
    try {
      const { id } = req.params;

      if (
        !mongoose.Types.ObjectId.isValid(
          id
        )
      ) {
        return res.status(400).json({
          success: false,
          message: "Invalid user ID",
        });
      }

      if (
        req.user._id.toString() ===
        id
      ) {
        return res.status(400).json({
          success: false,
          message:
            "You cannot delete your own account",
        });
      }

      const user =
        await User.findById(id);

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      await User.findByIdAndDelete(id);

      return res.status(200).json({
        success: true,
        message:
          "User deleted successfully",
      });
    } catch (error) {
      console.error(
        "Delete Admin User Error:",
        error
      );

      return res.status(500).json({
        success: false,
        message: "Failed to delete user",
      });
    }
  };

  module.exports = {
  getAdminUsers,
  getAdminUserById,
  updateUserRole,
  deleteAdminUser,
};

