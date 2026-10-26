
require("dotenv").config();

const mongoose = require("mongoose");
const Product = require("../models/Product");
const Category = require("../models/Category");
const slugify = require("../utils/slugify");

const API_URL = "https://dummyjson.com";

async function fetchJSON(url) {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(
      `External API failed: ${response.status} ${url}`
    );
  }

  return response.json();
}

async function syncExternalProducts() {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error(
        "MONGODB_URI is missing from server/.env"
      );
    }

    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB Atlas");

    // Fetch every available sample product and its categories.
    const [productResult, externalCategories] =
      await Promise.all([
        fetchJSON(`${API_URL}/products?limit=0`),
        fetchJSON(`${API_URL}/products/categories`),
      ]);

    const categoryBySlug = new Map();

    // Create or update categories without deleting existing ones.
    for (const externalCategory of externalCategories) {
      const category = await Category.findOneAndUpdate(
        { slug: externalCategory.slug },
        {
          $set: {
            name: externalCategory.name,
            slug: externalCategory.slug,
          },
        },
        {
          upsert: true,
          new: true,
          runValidators: true,
          setDefaultsOnInsert: true,
        }
      );

      categoryBySlug.set(
        externalCategory.slug,
        category._id
      );
    }

    let synced = 0;
    let skipped = 0;

    for (const item of productResult.products) {
      const categoryId = categoryBySlug.get(item.category);

      if (!categoryId) {
        console.warn(
          `Skipping "${item.title}": category not found`
        );
        skipped++;
        continue;
      }

      // Prefix the slug to keep imported products separate
      // from products created manually in ShopSphere.
      const externalSlug = slugify(
        item.slug || item.title
      );

      const slug = `dummyjson-${externalSlug}`;

      const images =
        Array.isArray(item.images) && item.images.length
          ? item.images
          : item.thumbnail
            ? [item.thumbnail]
            : [];

      const discount = Number(item.discountPercentage) || 0;

      const originalPrice =
        discount > 0 && discount < 100
          ? Number(
              (item.price / (1 - discount / 100)).toFixed(2)
            )
          : item.price;

      await Product.findOneAndUpdate(
        { slug },
        {
          $set: {
            name: item.title,
            slug,
            description: item.description || "",
            price: Number(item.price),
            originalPrice,
            category: categoryId,
            brand: item.brand || "",
            images,
            stock: Math.max(0, Number(item.stock) || 0),
            
specifications: {
  sku: String(item.sku || ""),
  weight: String(item.weight ?? ""),
  width: String(item.dimensions?.width ?? ""),
  height: String(item.dimensions?.height ?? ""),
  depth: String(item.dimensions?.depth ?? ""),
},

            features: Array.isArray(item.tags)
              ? item.tags
              : [],
            rating: Number(item.rating) || 0,
            numReviews: 0,
          },
        },
        {
          upsert: true,
          returnDocument: "after",
          runValidators: true,
          setDefaultsOnInsert: true,
        }
      );

      synced++;
    }

    console.log(`Products synchronized: ${synced}`);
    console.log(`Products skipped: ${skipped}`);
    console.log(
      `External categories processed: ${externalCategories.length}`
    );
  } catch (error) {
    console.error("External product sync failed:", error);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect().catch(() => {});
  }
}

syncExternalProducts();
