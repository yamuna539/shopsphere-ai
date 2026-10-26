const express = require("express");

const {
  getAdminProducts,
  getAdminProductById,
  createAdminProduct,
  updateAdminProduct,
  deleteAdminProduct,
} = require("../controllers/adminProductController");

const {
  authenticate,
  authorizeAdmin,
} = require("../middleware/authMiddleware");

const router = express.Router();

router.use(
  authenticate,
  authorizeAdmin
);

router.get("/", getAdminProducts);
router.get("/:id", getAdminProductById);
router.post(
  "/",
  createAdminProduct
);

router.put(
  "/:id",
  updateAdminProduct
);

router.delete(
  "/:id",
  deleteAdminProduct
);

module.exports = router;