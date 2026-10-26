const express = require("express");

const {
  registerUser,
  loginUser,
  loginAdmin,
  getCurrentUser,
  updateProfile,
  changePassword,
  logoutUser,
} = require("../controllers/authController");

const {
  authenticate,
} = require("../middleware/authMiddleware");

const router = express.Router();

// Public routes
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/admin/login", loginAdmin);

// Protected routes
router.get("/me", authenticate, getCurrentUser);
router.put("/profile", authenticate, updateProfile);
router.put("/change-password", authenticate, changePassword);
router.post("/logout", authenticate, logoutUser);

module.exports = router;