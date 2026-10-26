const express = require("express");

const {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} = require("../controllers/categoryController");

const {
  authenticate,
  authorizeAdmin,
} = require("../middleware/authMiddleware");

const router = express.Router();

/*
 * Public/customer category browsing
 */
router.get("/", getCategories);
router.get("/:id", getCategoryById);

/*
 * Admin category management
 */
router.post(
  "/",
  authenticate,
  authorizeAdmin,
  createCategory
);

router.put(
  "/:id",
  authenticate,
  authorizeAdmin,
  updateCategory
);

router.delete(
  "/:id",
  authenticate,
  authorizeAdmin,
  deleteCategory
);

module.exports = router;