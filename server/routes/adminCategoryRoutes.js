const express = require("express");

const {
  getAdminCategories,
  createAdminCategory,
  updateAdminCategory,
  deleteAdminCategory,
} = require("../controllers/adminCategoryController");

const {
  authenticate,
  authorizeAdmin,
} = require("../middleware/authMiddleware");

const router = express.Router();

router.use(
  authenticate,
  authorizeAdmin
);

router.get(
  "/",
  getAdminCategories
);

router.post(
  "/",
  createAdminCategory
);

router.put(
  "/:id",
  updateAdminCategory
);

router.delete(
  "/:id",
  deleteAdminCategory
);

module.exports = router;