const express = require("express");

const {
  getAdminUsers,
  getAdminUserById,
  updateUserRole,
  deleteAdminUser,
} = require("../controllers/adminUserController");

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
  getAdminUsers
);

router.get(
  "/:id",
  getAdminUserById
);

router.patch(
  "/:id/role",
  updateUserRole
);

router.delete(
  "/:id",
  deleteAdminUser
);

module.exports = router;