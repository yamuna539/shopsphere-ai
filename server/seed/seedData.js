require("dotenv").config();

const connectDB = require("../config/db");
const User = require("../models/User");
const Category = require("../models/Category");
const Product = require("../models/Product");
const Review = require("../models/Review");

const DUMMY_PRODUCTS_URL =
  "https://dummyjson.com/products?limit=0";

// Our ShopSphere categories
const categoryDefinitions = [
  {
    name: "Electronics",
    slug: "electronics",
  },
  {
    name: "Laptops",
    slug: "laptops",
  },
  {
    name: "Mobile Phones",
    slug: "mobile-phones",
  },
  {
    name: "Headphones",
    slug: "headphones",
  },
  {
    name: "Accessories",
    slug: "accessories",
  },
  {
    name: "Gaming",
    slug: "gaming",
  },
  {
    name: "Smart Watches",
    slug: "smart-watches",
  },
];

// Map DummyJSON categories to our ShopSphere categories
const categoryMap = {
  laptops: "laptops",
  smartphones: "mobile-phones",
  "mobile-accessories": "accessories",
  "mens-watches": "smart-watches",
  "womens-watches": "smart-watches",
  "sports-accessories": "gaming",
  tablets: "electronics",
  "kitchen-accessories": "accessories",
  "home-decoration": "electronics",
};

// Fetch real product images from DummyJSON
async function fetchRealProducts() {
  const response = await fetch(DUMMY_PRODUCTS_URL);

  if (!response.ok) {
    throw new Error(
      `Failed to fetch DummyJSON products: ${response.status}`
    );
  }

  const data = await response.json();

  return data.products || [];
}

async function seed() {
  try {
    await connectDB();

    console.log("Connected to MongoDB");

    // Clear old development data
    await Review.deleteMany();
    await Product.deleteMany();
    await Category.deleteMany();
    await User.deleteMany();

    console.log("Old data cleared");

    // --------------------------------
    // CREATE CATEGORIES
    // --------------------------------

    const createdCategories = await Category.insertMany(
      categoryDefinitions
    );

    const categoriesBySlug = {};

    createdCategories.forEach((category) => {
      categoriesBySlug[category.slug] = category;
    });

    console.log(
      `Created ${createdCategories.length} categories`
    );

    // --------------------------------
    // FETCH REAL PRODUCT DATA
    // --------------------------------

    console.log("Fetching real product images...");

    const dummyProducts = await fetchRealProducts();

    console.log(
      `Received ${dummyProducts.length} products from DummyJSON`
    );

    // --------------------------------
    // GROUP PRODUCTS BY CATEGORY
    // --------------------------------

    const groupedProducts = {};

    for (const product of dummyProducts) {
      const shopCategory =
        categoryMap[product.category];

      if (!shopCategory) {
        continue;
      }

      if (!groupedProducts[shopCategory]) {
        groupedProducts[shopCategory] = [];
      }

      groupedProducts[shopCategory].push(product);
    }

    // --------------------------------
    // CREATE SHOPSPHERE PRODUCTS
    // --------------------------------

    const productsToInsert = [];

    for (const category of categoryDefinitions) {
      const sourceProducts =
        groupedProducts[category.slug] || [];

      /*
       * We need 15 products per category.
       *
       * If the category has fewer than 15,
       * reuse available products with different
       * ShopSphere names.
       */

      if (sourceProducts.length === 0) {
        console.log(
          `No source products found for ${category.name}`
        );

        continue;
      }

      for (let i = 0; i < 15; i++) {
        const source =
          sourceProducts[i % sourceProducts.length];

        const productNumber = i + 1;

        const name =
          i < sourceProducts.length
            ? source.title
            : `${source.title} ${productNumber}`;

        const slug =
          `${name}-${category.slug}-${productNumber}`
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-|-$/g, "");

        const price = Math.round(
          Number(source.price) * 85
        );

        const originalPrice = Math.round(
          price * 1.15
        );

        productsToInsert.push({
          name,
          slug,

          description:
            source.description ||
            `High-quality ${name} designed for everyday use.`,

          price,

          originalPrice,

          category:
            categoriesBySlug[category.slug]._id,

          brand:
            source.brand || "ShopSphere",

          /*
           * THIS IS THE IMPORTANT PART
           *
           * We are storing the real product image
           * URL instead of our generated PNG.
           */
          images:
            source.images && source.images.length > 0
              ? source.images.slice(0, 3)
              : [source.thumbnail],

          stock:
            Number(source.stock) > 0
              ? Number(source.stock)
              : 20,

          specifications: {
            brand:
              source.brand || "ShopSphere",

            category:
              category.name,

            model:
              source.sku || `SS-${source.id}`,

            warranty:
              source.warrantyInformation ||
              "1 year warranty",
          },

          features: [
            "Premium quality",
            "Modern design",
            "Reliable performance",
          ],

          rating:
            Number(source.rating) || 4,

          numReviews:
            source.reviews
              ? source.reviews.length
              : 0,
        });
      }
    }

    // --------------------------------
    // INSERT PRODUCTS
    // --------------------------------

    await Product.insertMany(productsToInsert);

    console.log(
      `Created ${productsToInsert.length} products`
    );

    // --------------------------------
    // CREATE ADMIN
    // --------------------------------

    await User.create({
      name: "ShopSphere Admin",
      email: "admin@shopsphere.local",
      password: "Admin@123",
      role: "admin",
    });

    // --------------------------------
    // CREATE CUSTOMER
    // --------------------------------

    await User.create({
      name: "Demo Customer",
      email: "customer@shopsphere.local",
      password: "Customer@123",
      role: "customer",
    });

    console.log("");
    console.log("====================================");
    console.log("SHOPSPHERE SEED COMPLETED");
    console.log("====================================");
    console.log(
      `Categories : ${createdCategories.length}`
    );
    console.log(
      `Products   : ${productsToInsert.length}`
    );
    console.log("");
    console.log("ADMIN");
    console.log("Email    : admin@shopsphere.local");
    console.log("Password : Admin@123");
    console.log("");
    console.log("CUSTOMER");
    console.log("Email    : customer@shopsphere.local");
    console.log("Password : Customer@123");
    console.log("====================================");

    process.exit(0);
  } catch (error) {
    console.error("");
    console.error("SEED ERROR:");
    console.error(error);
    console.error("");

    process.exit(1);
  }
}

seed();