const mongoose = require("mongoose");

const Review = require("../models/Review");
const Product = require("../models/Product");

const {
  generateJSON,
} = require("./geminiService");



const MAX_REVIEWS = 50;

/* =====================================================
   SANITIZE REVIEW DATA
===================================================== */

const sanitizeReviewForAI = (review) => ({
  rating: review.rating,
  comment: review.comment,
  createdAt: review.createdAt,
});

/* =====================================================
   GET AI REVIEW SUMMARY
===================================================== */

const getAIReviewSummary = async (
  productId
) => {

  /* ===================================================
     1. VALIDATE PRODUCT ID
  =================================================== */

  if (
    !mongoose.Types.ObjectId.isValid(
      productId
    )
  ) {
    const error = new Error(
      "Invalid product ID."
    );

    error.statusCode = 400;

    throw error;
  }

  /* ===================================================
     2. VERIFY PRODUCT EXISTS
  =================================================== */

  const product =
    await Product.findById(productId)
      .select(
        "_id name rating numReviews"
      )
      .lean();

  if (!product) {
    const error = new Error(
      "Product not found."
    );

    error.statusCode = 404;

    throw error;
  }

  /* ===================================================
     3. GET REAL REVIEWS FROM MONGODB
  =================================================== */

  const reviews =
    await Review.find({
      product: productId,
    })
      .select(
        "rating comment createdAt"
      )
      .sort({
        createdAt: -1,
      })
      .limit(MAX_REVIEWS)
      .lean();

  /* ===================================================
     4. HANDLE NO REVIEWS
  =================================================== */

  if (!reviews.length) {
    return {
      product: {
        _id: product._id,
        name: product.name,
        rating: product.rating || 0,
        numReviews:
          product.numReviews || 0,
      },

      reviewCount: 0,

      summary: {
        positiveAspects: [],

        commonConcerns: [],

        overallSummary:
          "There are no customer reviews available for this product yet.",
      },
    };
  }

  /* ===================================================
     5. PREPARE REVIEW DATA FOR GEMINI
  =================================================== */

  const reviewData =
    reviews.map(
      sanitizeReviewForAI
    );

  /* ===================================================
     6. GEMINI PROMPT
  =================================================== */

  const prompt = `
You are the ShopSphere AI Review Summary Assistant.

Product:

${JSON.stringify(
  {
    id: product._id.toString(),
    name: product.name,
    rating: product.rating || 0,
    numReviews:
      product.numReviews || 0,
  },
  null,
  2
)}

The following are the ONLY customer reviews available:

${JSON.stringify(
  reviewData,
  null,
  2
)}

Your task is to summarize these customer reviews.

Provide:

1. Positive aspects customers commonly mention.
2. Common concerns or negative points customers mention.
3. A concise overall summary.

STRICT RULES:

1. Use ONLY the supplied reviews.
2. Never invent a review.
3. Never invent a customer opinion.
4. Never invent a feature.
5. Never invent a product specification.
6. Never invent a price.
7. Never invent a rating.
8. Never claim something was mentioned if it does not appear in the supplied reviews.
9. If there are no meaningful concerns, return an empty commonConcerns array.
10. If there are no meaningful positive aspects, return an empty positiveAspects array.
11. Do not identify individual customers.
12. Do not reveal personal information.
13. Do not make claims beyond what the reviews support.
14. Clearly summarize patterns rather than treating one review as a universal opinion.
15. Keep the overall summary concise.
16. Return valid JSON according to the provided schema.
`;

  /* ===================================================
     7. GEMINI JSON SCHEMA
  =================================================== */

  const schema = {
    type: "object",

    properties: {

      positiveAspects: {
        type: "array",

        items: {
          type: "string",
        },

        description:
          "Positive aspects commonly supported by the supplied reviews.",
      },

      commonConcerns: {
        type: "array",

        items: {
          type: "string",
        },

        description:
          "Common concerns supported by the supplied reviews.",
      },

      overallSummary: {
        type: "string",

        description:
          "A concise overall summary based only on the supplied reviews.",
      },
    },

    required: [
      "positiveAspects",
      "commonConcerns",
      "overallSummary",
    ],
  };

  /* ===================================================
     8. CALL GEMINI
  =================================================== */

  const aiResponse =
    await generateJSON(
      prompt,
      schema,
      {
        temperature: 0.2,
        maxOutputTokens: 1200,
      }
    );

  /* ===================================================
     9. RETURN RESULT
  =================================================== */

  return {
    product: {
      _id: product._id,
      name: product.name,
      rating: product.rating || 0,
      numReviews:
        product.numReviews || 0,
    },

    reviewCount: reviews.length,

    summary: {
      positiveAspects:
        Array.isArray(
          aiResponse.positiveAspects
        )
          ? aiResponse.positiveAspects
          : [],

      commonConcerns:
        Array.isArray(
          aiResponse.commonConcerns
        )
          ? aiResponse.commonConcerns
          : [],

      overallSummary:
        aiResponse.overallSummary ||
        "Unable to generate an overall review summary.",
    },
  };
};

module.exports = {
  getAIReviewSummary,
};