const Product = require("../models/Product");
const {
  generateJSON,
} = require("./geminiService");

const MAX_CANDIDATES = 12;

/**
 * Extract simple search terms from user's question.
 */
const extractSearchTerms = (query) => {
  return query
    .toLowerCase()
    .replace(/[^\w\s₹.-]/g, " ")
    .split(/\s+/)
    .filter((word) => word.length >= 2)
    .slice(0, 15);
};

/**
 * Build MongoDB search query.
 */
const buildProductSearchQuery = (query) => {
  const terms = extractSearchTerms(query);

  if (!terms.length) {
    return {};
  }

  const regex = new RegExp(
    terms.join("|"),
    "i"
  );

  return {
    $or: [
      { name: regex },
      { description: regex },
      { brand: regex },
      { features: regex },
    ],
  };
};

/**
 * Get candidate products from MongoDB.
 */
const getCandidateProducts = async (userQuery) => {
  const searchQuery =
    buildProductSearchQuery(userQuery);

  const products = await Product.find(
    searchQuery
  )
    .populate("category", "name slug")
    .select(
      "_id name description price originalPrice category brand images stock specifications features rating numReviews"
    )
    .limit(MAX_CANDIDATES)
    .lean();

  return products;
};

/**
 * Send only safe product information to Gemini.
 */
const sanitizeProductsForAI = (products) => {
  return products.map((product) => ({
    id: product._id.toString(),
    name: product.name,
    description: product.description,
    price: product.price,
    originalPrice: product.originalPrice,
    category:
      product.category?.name || null,
    brand: product.brand || null,
    specifications:
      product.specifications || {},
    features: product.features || [],
    rating: product.rating || 0,
    numReviews: product.numReviews || 0,
    stock: product.stock,
  }));
};

/**
 * Main AI Shopping Assistant function.
 */
const getShoppingAssistantResponse = async (
  userQuery
) => {
  // 1. Search MongoDB
  const products =
    await getCandidateProducts(userQuery);

  // 2. No matching products
  if (!products.length) {
    return {
      message:
        "I couldn't find products in our catalog that match your request.",
      recommendations: [],
    };
  }

  // 3. Prepare products for Gemini
  const aiProducts =
    sanitizeProductsForAI(products);

  const productData = JSON.stringify(
    aiProducts,
    null,
    2
  );

  // 4. Gemini prompt
  const prompt = `
You are the ShopSphere AI Shopping Assistant.

The customer asked:

"${userQuery}"

Below is the ONLY product data available from the ShopSphere MongoDB database:

${productData}

Your task:

1. Understand the customer's requirement.
2. Recommend only products from the supplied product data.
3. Never create or invent a product.
4. Never create or modify a product ID.
5. Never invent a price.
6. Never invent specifications.
7. Never invent stock information.
8. Use the exact product IDs supplied.
9. If none of the products are suitable, return an empty recommendations array.
10. Keep the explanation concise and useful.
11. Base every recommendation reason only on the supplied product data.

Return JSON matching the requested schema.
`;

  // 5. Gemini JSON schema
  const schema = {
    type: "object",

    properties: {
      message: {
        type: "string",
        description:
          "Short helpful response to the customer.",
      },

      recommendations: {
        type: "array",
        description:
          "Products selected from the supplied catalog only.",

        items: {
          type: "object",

          properties: {
            productId: {
              type: "string",
              description:
                "Exact MongoDB product ID from the supplied product data.",
            },

            reason: {
              type: "string",
              description:
                "Short explanation based only on supplied product information.",
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

  // 6. Ask Gemini
  const aiResponse = await generateJSON(
    prompt,
    schema,
    {
      temperature: 0.2,
      maxOutputTokens: 1200,
    }
  );

  // 7. Create map of REAL MongoDB products
  const productMap = new Map(
    products.map((product) => [
      product._id.toString(),
      product,
    ])
  );

  // 8. Validate Gemini recommendations
  const validRecommendations = (
    aiResponse.recommendations || []
  )
    .filter((recommendation) =>
      productMap.has(
        recommendation.productId
      )
    )
    .slice(0, 5)
    .map((recommendation) => {
      const product =
        productMap.get(
          recommendation.productId
        );

      return {
        productId: product._id,

        reason:
          recommendation.reason,

        product: {
          _id: product._id,
          name: product.name,
          price: product.price,
          originalPrice:
            product.originalPrice,
          images: product.images,
          brand: product.brand,
          stock: product.stock,
          rating: product.rating,
          numReviews:
            product.numReviews,
          category: product.category,
          features: product.features,
          specifications:
            product.specifications,
        },
      };
    });

  return {
    message: aiResponse.message,
    recommendations:
      validRecommendations,
  };
};

module.exports = {
  getShoppingAssistantResponse,
};