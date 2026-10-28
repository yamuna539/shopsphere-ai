const {
  generateText,
  getGeminiModel,
} = require("../services/geminiService");

const {
  getShoppingAssistantResponse,
} = require("../services/aiShoppingService");

const {
  getAIRecommendations,
} = require("../services/aiRecommendationService");

const {
  compareProductsWithAI,
} = require("../services/aiComparisonService");
const {
  getAIReviewSummary,
} = require("../services/aiReviewService");
/**
 * Test Gemini API
 */
const testGemini = async (req, res) => {
  try {
    const prompt =
      "Give a short welcome message for a customer visiting ShopSphere.";

    const response =
      await generateText(prompt, {
        temperature: 0.3,
        maxOutputTokens: 200,
      });

    res.status(200).json({
      success: true,
      message: "Gemini API is working.",
      model: getGeminiModel(),
      response,
    });
  } catch (error) {
    console.error(
      "Test Gemini Error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Gemini service is currently unavailable.",
    });
  }
};

/**
 * AI Shopping Assistant
 */
const shoppingAssistant = async (
  req,
  res
) => {
  try {
    const { message } = req.body;

    // Check message exists
    if (
      !message ||
      typeof message !== "string"
    ) {
      return res.status(400).json({
        success: false,
        message:
          "A valid message is required.",
      });
    }

    const trimmedMessage =
      message.trim();

    // Empty message
    if (!trimmedMessage) {
      return res.status(400).json({
        success: false,
        message:
          "Message cannot be empty.",
      });
    }

    // Maximum 500 characters
    if (trimmedMessage.length > 500) {
      return res.status(422).json({
        success: false,
        message:
          "Message must be 500 characters or less.",
      });
    }

    // Get AI recommendation
    const result =
      await getShoppingAssistantResponse(
        trimmedMessage
      );

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error(
      "Shopping Assistant Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "The AI Shopping Assistant is temporarily unavailable.",
    });
  }
};

// ======================================================
// AI PRODUCT RECOMMENDATIONS
// ======================================================

const getProductRecommendations = async (
  req,
  res
) => {
  try {
    const { productId } = req.params;

    const result =
      await getAIRecommendations(productId);

    return res.status(200).json({
      success: true,
      data: result,
    });

  } catch (error) {
    console.error(
      "AI Product Recommendation Error:",
      error
    );

    const statusCode =
      error.statusCode || 500;

    return res.status(statusCode).json({
      success: false,
      message:
        statusCode === 400
          ? "Invalid product ID."
          : statusCode === 404
          ? "Product not found."
          : "Unable to generate AI recommendations.",
    });
  }
};

// ======================================================
// PHASE 17 - AI PRODUCT COMPARISON
// ======================================================

const compareProducts = async (
  req,
  res
) => {
  try {

    const {
      productIds,
    } = req.body;


    const result =
      await compareProductsWithAI(
        productIds
      );


    return res.status(200).json({
      success: true,
      data: result,
    });

  } catch (error) {

    console.error(
      "AI Product Comparison Error:",
      error
    );


    const statusCode =
      error.statusCode || 500;


    return res.status(statusCode).json({

      success: false,

      message:
        error.message ||
        "Unable to compare products.",

    });
  }
};

const getReviewSummary = async (
  req,
  res
) => {
  try {
    const { productId } =
      req.params;

    const result =
      await getAIReviewSummary(
        productId
      );

    return res.status(200).json({
      success: true,
      data: result,
    });

  } catch (error) {

    console.error(
      "AI Review Summary Error:",
      error
    );

    const statusCode =
      error.statusCode || 500;

    return res.status(
      statusCode
    ).json({
      success: false,
      message:
        error.message ||
        "Unable to generate AI review summary.",
    });
  }
};

module.exports = {
  testGemini,
  shoppingAssistant,
  getProductRecommendations,
  compareProducts,
  getReviewSummary,
};