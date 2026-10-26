const express = require("express");

const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");

const {
  authenticate,
  authorizeAdmin,
} = require("../middleware/authMiddleware");

const router = express.Router();

/*
 * Public/customer product browsing
 */
router.get("/", getProducts);
router.get("/:id", getProductById);

/*
 * Admin product management
 */
router.post(
  "/",
  authenticate,
  authorizeAdmin,
  createProduct
);

router.put(
  "/:id",
  authenticate,
  authorizeAdmin,
  updateProduct
);

router.delete(
  "/:id",
  authenticate,
  authorizeAdmin,
  deleteProduct
);

module.exports = router;