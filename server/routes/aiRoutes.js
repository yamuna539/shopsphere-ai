const express = require("express");

const {
  testGemini,
  shoppingAssistant,
  getProductRecommendations,
  compareProducts,
  getReviewSummary,
} = require("../controllers/aiController");

const router =
  express.Router();

/* =====================================================
   GEMINI TEST
===================================================== */

router.get(
  "/test",
  testGemini
);

/* =====================================================
   PHASE 15 - AI SHOPPING ASSISTANT
===================================================== */

router.post(
  "/chat",
  shoppingAssistant
);

/* =====================================================
   PHASE 16 - AI RECOMMENDATIONS
===================================================== */

router.get(
  "/recommendations/:productId",
  getProductRecommendations
);

/* =====================================================
   PHASE 17 - AI PRODUCT COMPARISON
===================================================== */

router.post(
  "/compare",
  compareProducts
);

/* =====================================================
   PHASE 18 - AI REVIEW SUMMARY
===================================================== */

router.get(
  "/reviews/:productId",
  getReviewSummary
);

module.exports = router;