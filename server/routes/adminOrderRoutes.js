const express = require("express");

const {
  getAdminOrders,
  getAdminOrderById,
  updateAdminOrderStatus,
} = require("../controllers/adminOrderController");

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
  getAdminOrders
);

router.get(
  "/:id",
  getAdminOrderById
);

router.patch(
  "/:id/status",
  updateAdminOrderStatus
);

module.exports = router;