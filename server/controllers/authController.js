const bcrypt = require("bcryptjs");

const User = require("../models/User");
const generateToken = require("../utils/generateToken");

const {
  validateRegistration,
  validateLogin,
  validateChangePassword,
} = require("../validators/authValidator");

const sanitizeUser = (user) => {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    avatar: user.avatar,
    phone: user.phone,
    address: user.address,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
};

const registerUser = async (req, res, next) => {
  try {
    console.log("REQUEST BODY:", req.body);
    const { name, email, password, phone, address } = req.body;

    const errors = validateRegistration({
      name,
      email,
      password,
    });

    if (Object.keys(errors).length > 0) {
      return res.status(422).json({
        success: false,
        message: "Validation failed",
        errors,
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const existingUser = await User.findOne({
      email: normalizedEmail,
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "An account with this email already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

   const user = await User.create({
  name: name.trim(),
  email: normalizedEmail,
  password: hashedPassword,
  role: "CUSTOMER",
  phone: phone ? phone.trim() : "",
  address: address || {},
});
    const token = generateToken(user._id);

    return res.status(201).json({
      success: true,
      message: "Registration successful",
      token,
      user: sanitizeUser(user),
    });
  } catch (error) {
    next(error);
  }
};

const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const errors = validateLogin({
      email,
      password,
    });

    if (Object.keys(errors).length > 0) {
      return res.status(422).json({
        success: false,
        message: "Validation failed",
        errors,
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const user = await User.findOne({
      email: normalizedEmail,
    }).select("+password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const passwordMatches = await bcrypt.compare(
      password,
      user.password
    );

    if (!passwordMatches) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const token = generateToken(user._id);

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: sanitizeUser(user),
    });
  } catch (error) {
    next(error);
  }
};

const loginAdmin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const errors = validateLogin({
      email,
      password,
    });

    if (Object.keys(errors).length > 0) {
      return res.status(422).json({
        success: false,
        message: "Validation failed",
        errors,
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const user = await User.findOne({
      email: normalizedEmail,
    }).select("+password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid admin credentials",
      });
    }

    if (user.role !== "ADMIN") {
      return res.status(403).json({
        success: false,
        message: "This account does not have admin access",
      });
    }

    const passwordMatches = await bcrypt.compare(
      password,
      user.password
    );

    if (!passwordMatches) {
      return res.status(401).json({
        success: false,
        message: "Invalid admin credentials",
      });
    }

    const token = generateToken(user._id);

    return res.status(200).json({
      success: true,
      message: "Admin login successful",
      token,
      user: sanitizeUser(user),
    });
  } catch (error) {
    next(error);
  }
};

const getCurrentUser = async (req, res, next) => {
  try {
    return res.status(200).json({
      success: true,
      user: sanitizeUser(req.user),
    });
  } catch (error) {
    next(error);
  }
};

const updateProfile = async (req, res, next) => {
  try {
    const {
      name,
      phone,
      address,
      avatar,
    } = req.body;

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (name !== undefined) {
      if (!name.trim() || name.trim().length < 2) {
        return res.status(422).json({
          success: false,
          message: "Name must contain at least 2 characters",
        });
      }

      user.name = name.trim();
    }

    if (phone !== undefined) {
      user.phone = phone.trim();
    }

    if (address !== undefined) {
      user.address = {
        ...user.address.toObject(),
        ...address,
      };
    }

    if (avatar !== undefined) {
      user.avatar = avatar.trim();
    }

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: sanitizeUser(user),
    });
  } catch (error) {
    next(error);
  }
};

const changePassword = async (req, res, next) => {
  try {
    const {
      currentPassword,
      newPassword,
    } = req.body;

    const errors = validateChangePassword({
      currentPassword,
      newPassword,
    });

    if (Object.keys(errors).length > 0) {
      return res.status(422).json({
        success: false,
        message: "Validation failed",
        errors,
      });
    }

    const user = await User.findById(req.user._id).select(
      "+password"
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const passwordMatches = await bcrypt.compare(
      currentPassword,
      user.password
    );

    if (!passwordMatches) {
      return res.status(401).json({
        success: false,
        message: "Current password is incorrect",
      });
    }

    const samePassword = await bcrypt.compare(
      newPassword,
      user.password
    );

    if (samePassword) {
      return res.status(422).json({
        success: false,
        message:
          "New password must be different from the current password",
      });
    }

    user.password = await bcrypt.hash(newPassword, 12);

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    next(error);
  }
};

const logoutUser = async (req, res) => {
  return res.status(200).json({
    success: true,
    message:
      "Logout successful. Remove the authentication token on the client.",
  });
};

module.exports = {
  registerUser,
  loginUser,
  loginAdmin,
  getCurrentUser,
  updateProfile,
  changePassword,
  logoutUser,
};