const express = require("express");

const {
  createRazorpayOrder,
  verifyRazorpayPayment,
} = require("../controllers/paymentController");

const {
  authenticate,
} = require("../middleware/authMiddleware");

const router = express.Router();

router.post(
  "/create-order",
  authenticate,
  createRazorpayOrder
);

router.post(
  "/verify",
  authenticate,
  verifyRazorpayPayment
);

module.exports = router;