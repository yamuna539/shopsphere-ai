const mongoose = require("mongoose");

const Product = require("../models/Product");
const { generateJSON } = require("./geminiService");

const MAX_CANDIDATES = 12;
const MAX_RECOMMENDATIONS = 4;


// ======================================================
// GET CANDIDATE PRODUCTS
// ======================================================

const getProductCandidates = async (product) => {
  const filters = {
    _id: {
      $ne: product._id,
    },
  };

  // Prefer products from the same category
  if (product.category?._id) {
    filters.category = product.category._id;
  }

  const candidates = await Product.find(filters)
    .populate("category", "name slug")
    .select(
      "_id name description price originalPrice category brand images stock specifications features rating numReviews"
    )
    .sort({
      rating: -1,
      numReviews: -1,
      createdAt: -1,
    })
    .limit(MAX_CANDIDATES)
    .lean();

  return candidates;
};


// ======================================================
// SANITIZE PRODUCT BEFORE SENDING TO GEMINI
// ======================================================

const sanitizeProductForAI = (product) => ({
  id: product._id.toString(),
  name: product.name,
  description: product.description,
  price: product.price,
  originalPrice: product.originalPrice,
  category: product.category?.name || null,
  brand: product.brand || null,
  features: product.features || [],
  specifications: product.specifications || {},
  rating: product.rating || 0,
  numReviews: product.numReviews || 0,
  stock: product.stock,
});


// ======================================================
// MAIN AI RECOMMENDATION FUNCTION
// ======================================================

const getAIRecommendations = async (productId) => {
  // ----------------------------------------------------
  // 1. Validate Product ID
  // ----------------------------------------------------

  if (!mongoose.Types.ObjectId.isValid(productId)) {
    const error = new Error("Invalid product ID.");
    error.statusCode = 400;
    throw error;
  }


  // ----------------------------------------------------
  // 2. Find Current Product
  // ----------------------------------------------------

  const product = await Product.findById(productId)
    .populate("category", "name slug")
    .select(
      "_id name description price originalPrice category brand images stock specifications features rating numReviews"
    )
    .lean();

  if (!product) {
    const error = new Error("Product not found.");
    error.statusCode = 404;
    throw error;
  }


  // ----------------------------------------------------
  // 3. Find Similar Products From MongoDB
  // ----------------------------------------------------

  const candidates = await getProductCandidates(product);


  // ----------------------------------------------------
  // 4. No Similar Products
  // ----------------------------------------------------

  if (!candidates.length) {
    return {
      message:
        "There are no similar products available right now.",
      recommendations: [],
    };
  }


  // ----------------------------------------------------
  // 5. Prepare Data For Gemini
  // ----------------------------------------------------

  const sourceProduct = sanitizeProductForAI(product);

  const candidateProducts = candidates.map(
    sanitizeProductForAI
  );


  // ----------------------------------------------------
  // 6. Gemini Prompt
  // ----------------------------------------------------

  const prompt = `
You are the ShopSphere AI Product Recommendation Assistant.

The customer is currently viewing this product:

${JSON.stringify(sourceProduct, null, 2)}

These are the ONLY alternative products available:

${JSON.stringify(candidateProducts, null, 2)}

Your task is to select the most relevant alternative products.

Consider:

- Category
- Brand
- Price
- Features
- Specifications
- Description
- Rating
- Number of reviews

Rules:

1. Recommend ONLY products from the supplied alternatives.
2. Never invent products.
3. Never invent product IDs.
4. Never invent prices.
5. Never invent specifications.
6. Never invent stock information.
7. Use the exact supplied product IDs.
8. Do not recommend the currently viewed product.
9. Return at most ${MAX_RECOMMENDATIONS} recommendations.
10. Explain briefly why each selected product may be relevant.
11. Base explanations only on supplied product information.

Return valid JSON according to the provided schema.
`;


  // ----------------------------------------------------
  // 7. Gemini JSON Schema
  // ----------------------------------------------------

  const schema = {
    type: "object",

    properties: {
      message: {
        type: "string",
        description:
          "Short explanation of why these alternatives were selected.",
      },

      recommendations: {
        type: "array",

        items: {
          type: "object",

          properties: {
            productId: {
              type: "string",
              description:
                "Exact MongoDB ID of one supplied candidate product.",
            },

            reason: {
              type: "string",
              description:
                "Short reason based only on supplied product information.",
            },
          },

          required: [
            "productId",
            "reason",
          ],
        },
      },
    },

    required: [
      "message",
      "recommendations",
    ],
  };


  // ----------------------------------------------------
  // 8. Ask Gemini To Rank Products
  // ----------------------------------------------------

  const aiResponse = await generateJSON(
    prompt,
    schema,
    {
      temperature: 0.2,
      maxOutputTokens: 1200,
    }
  );


  // ----------------------------------------------------
  // 9. Create Map Of Real MongoDB Products
  // ----------------------------------------------------

  const candidateMap = new Map(
    candidates.map((candidate) => [
      candidate._id.toString(),
      candidate,
    ])
  );


  // ----------------------------------------------------
  // 10. Validate Gemini Recommendations
  // ----------------------------------------------------

  const validRecommendations =
    (aiResponse.recommendations || [])
      .filter(
        (recommendation) =>
          recommendation.productId !==
            product._id.toString() &&
          candidateMap.has(
            recommendation.productId
          )
      )
      .slice(0, MAX_RECOMMENDATIONS)
      .map((recommendation) => {
        const recommendedProduct =
          candidateMap.get(
            recommendation.productId
          );

        return {
          productId: recommendedProduct._id,

          reason: recommendation.reason,

          product: {
            _id: recommendedProduct._id,
            name: recommendedProduct.name,
            price: recommendedProduct.price,
            originalPrice:
              recommendedProduct.originalPrice,
            images: recommendedProduct.images,
            brand: recommendedProduct.brand,
            stock: recommendedProduct.stock,
            rating: recommendedProduct.rating,
            numReviews:
              recommendedProduct.numReviews,
            category:
              recommendedProduct.category,
            features:
              recommendedProduct.features,
            specifications:
              recommendedProduct.specifications,
          },
        };
      });


  // ----------------------------------------------------
  // 11. Return Final Result
  // ----------------------------------------------------

  return {
    message:
      aiResponse.message ||
      "Here are some products you may also like.",

    recommendations:
      validRecommendations,
  };
};


module.exports = {
  getAIRecommendations,
};