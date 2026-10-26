const mongoose = require("mongoose");

const Product = require("../models/Product");

const { generateJSON } = require("./geminiService");

const MIN_PRODUCTS = 2;
const MAX_PRODUCTS = 4;


// ======================================================
// SANITIZE PRODUCT FOR GEMINI
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

  specifications:
    product.specifications || {},

  rating: product.rating || 0,

  numReviews:
    product.numReviews || 0,

  stock: product.stock,
});


// ======================================================
// COMPARE PRODUCTS WITH AI
// ======================================================

const compareProductsWithAI = async (
  productIds
) => {

  // ----------------------------------------------------
  // 1. Validate Array
  // ----------------------------------------------------

  if (!Array.isArray(productIds)) {

    const error = new Error(
      "productIds must be an array."
    );

    error.statusCode = 400;

    throw error;
  }


  // ----------------------------------------------------
  // 2. Minimum / Maximum Products
  // ----------------------------------------------------

  if (
    productIds.length < MIN_PRODUCTS ||
    productIds.length > MAX_PRODUCTS
  ) {

    const error = new Error(
      `Please select between ${MIN_PRODUCTS} and ${MAX_PRODUCTS} products.`
    );

    error.statusCode = 400;

    throw error;
  }


  // ----------------------------------------------------
  // 3. Check Duplicate IDs
  // ----------------------------------------------------

  const uniqueProductIds = [
    ...new Set(productIds),
  ];

  if (
    uniqueProductIds.length !==
    productIds.length
  ) {

    const error = new Error(
      "Duplicate products are not allowed."
    );

    error.statusCode = 400;

    throw error;
  }


  // ----------------------------------------------------
  // 4. Validate MongoDB ObjectIds
  // ----------------------------------------------------

  const invalidIds =
    uniqueProductIds.filter(
      (id) =>
        !mongoose.Types.ObjectId.isValid(id)
    );

  if (invalidIds.length) {

    const error = new Error(
      "One or more product IDs are invalid."
    );

    error.statusCode = 400;

    throw error;
  }


  // ----------------------------------------------------
  // 5. Get Products From MongoDB
  // ----------------------------------------------------

  const products = await Product.find({
    _id: {
      $in: uniqueProductIds,
    },
  })
    .populate(
      "category",
      "name slug"
    )
    .select(
      "_id name description price originalPrice category brand images stock specifications features rating numReviews"
    )
    .lean();


  // ----------------------------------------------------
  // 6. Check Missing Products
  // ----------------------------------------------------

  if (
    products.length !==
    uniqueProductIds.length
  ) {

    const foundIds = new Set(
      products.map((product) =>
        product._id.toString()
      )
    );

    const missingIds =
      uniqueProductIds.filter(
        (id) => !foundIds.has(id)
      );

    const error = new Error(
      `Product(s) not found: ${missingIds.join(
        ", "
      )}`
    );

    error.statusCode = 404;

    throw error;
  }


  // ----------------------------------------------------
  // 7. Preserve User Selection Order
  // ----------------------------------------------------

  const productMap = new Map(
    products.map((product) => [
      product._id.toString(),
      product,
    ])
  );


  const orderedProducts =
    uniqueProductIds.map((id) =>
      productMap.get(id)
    );


  // ----------------------------------------------------
  // 8. Prepare Products For Gemini
  // ----------------------------------------------------

  const aiProducts =
    orderedProducts.map(
      sanitizeProductForAI
    );


  // ----------------------------------------------------
  // 9. Gemini Prompt
  // ----------------------------------------------------

  const prompt = `
You are the ShopSphere AI Product Comparison Assistant.

The customer wants to compare these products:

${JSON.stringify(
  aiProducts,
  null,
  2
)}

Your job is to explain the comparison using ONLY the supplied product information.

Analyze:

- Key differences
- Similarities
- Important specifications
- Features
- Price differences
- Ratings and review counts
- Suitable use cases

STRICT RULES:

1. Use ONLY the supplied products.
2. Never invent products.
3. Never invent product IDs.
4. Never invent prices.
5. Never invent specifications.
6. Never invent features.
7. Never invent ratings.
8. Never invent stock information.
9. Do not recommend a universal "winner".
10. Do not rank products as first, second, third, etc.
11. Do not claim that one product is universally better.
12. Explain which product characteristics may matter for different use cases.
13. Keep the explanation concise and useful.
14. Use the exact product IDs supplied.
15. If information is missing, say that it is not provided.

Return valid JSON according to the provided schema.
`;


  // ----------------------------------------------------
  // 10. JSON Schema
  // ----------------------------------------------------

  const schema = {

    type: "object",

    properties: {

      summary: {
        type: "string",

        description:
          "A concise neutral overview of the main similarities and differences.",
      },


      keyDifferences: {

        type: "array",

        items: {
          type: "string",
        },

        description:
          "Important differences based only on supplied product information.",
      },


      similarities: {

        type: "array",

        items: {
          type: "string",
        },

        description:
          "Important similarities based only on supplied product information.",
      },


      importantSpecifications: {

        type: "array",

        items: {

          type: "object",

          properties: {

            productId: {
              type: "string",
            },

            points: {

              type: "array",

              items: {
                type: "string",
              },

            },
          },

          required: [
            "productId",
            "points",
          ],
        },
      },


      useCases: {

        type: "array",

        items: {

          type: "object",

          properties: {

            productId: {
              type: "string",
            },

            useCase: {
              type: "string",
            },

            explanation: {
              type: "string",
            },
          },

          required: [
            "productId",
            "useCase",
            "explanation",
          ],
        },
      },
    },


    required: [
      "summary",
      "keyDifferences",
      "similarities",
      "importantSpecifications",
      "useCases",
    ],
  };


  // ----------------------------------------------------
  // 11. Call Gemini
  // ----------------------------------------------------

  const aiResponse =
  await generateJSON(
    prompt,
    schema,
    {
      temperature: 0.1,
      maxOutputTokens: 3000,
    }
  );


  // ----------------------------------------------------
  // 12. Validate Product IDs Returned By Gemini
  // ----------------------------------------------------

  const validProductIds = new Set(
    orderedProducts.map(
      (product) =>
        product._id.toString()
    )
  );


  // ----------------------------------------------------
  // 13. Validate Important Specifications
  // ----------------------------------------------------

  const validatedImportantSpecifications =
    (
      aiResponse.importantSpecifications ||
      []
    )
      .filter((item) =>
        validProductIds.has(
          item.productId
        )
      )
      .map((item) => ({
        productId:
          item.productId,

        points:
          Array.isArray(item.points)
            ? item.points
            : [],
      }));


  // ----------------------------------------------------
  // 14. Validate Use Cases
  // ----------------------------------------------------

  const validatedUseCases =
    (
      aiResponse.useCases || []
    )
      .filter((item) =>
        validProductIds.has(
          item.productId
        )
      )
      .map((item) => ({
        productId:
          item.productId,

        useCase:
          item.useCase,

        explanation:
          item.explanation,
      }));


  // ----------------------------------------------------
  // 15. Return Final Response
  // ----------------------------------------------------

  return {

    products:
      orderedProducts.map(
        (product) => ({
          _id: product._id,

          name: product.name,

          description:
            product.description,

          price: product.price,

          originalPrice:
            product.originalPrice,

          images:
            product.images,

          brand:
            product.brand,

          stock:
            product.stock,

          rating:
            product.rating,

          numReviews:
            product.numReviews,

          category:
            product.category,

          features:
            product.features,

          specifications:
            product.specifications,
        })
      ),


    comparison: {

      summary:
        aiResponse.summary ||
        "Here is a comparison based on the available product information.",


      keyDifferences:
        Array.isArray(
          aiResponse.keyDifferences
        )
          ? aiResponse.keyDifferences
          : [],


      similarities:
        Array.isArray(
          aiResponse.similarities
        )
          ? aiResponse.similarities
          : [],


      importantSpecifications:
        validatedImportantSpecifications,


      useCases:
        validatedUseCases,
    },
  };
};


module.exports = {
  compareProductsWithAI,
};