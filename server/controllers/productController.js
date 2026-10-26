const mongoose = require("mongoose");

const Product = require("../models/Product");
const Category = require("../models/Category");

const slugify = require("../utils/slugify");

const {
  validateProduct,
} = require("../validators/productValidator");

/*
==================================================
NORMALIZE SPECIFICATIONS
==================================================
*/

const normalizeSpecifications = (specifications) => {
  if (!specifications) {
    return {};
  }

  if (
    typeof specifications === "object" &&
    !Array.isArray(specifications)
  ) {
    return specifications;
  }

  return {};
};

/*
==================================================
ESCAPE REGEX
==================================================

Prevents special regex characters from causing
unexpected search behavior.
*/

const escapeRegex = (value) => {
  return value.replace(
    /[.*+?^${}()|[\]\\]/g,
    "\\$&"
  );
};

/*
==================================================
GET PRODUCTS
==================================================
*/

const getProducts = async (req, res, next) => {
  try {
    /*
    ----------------------------------------------
    PAGINATION
    ----------------------------------------------
    */

    const page = Math.max(
      Number.parseInt(req.query.page, 10) || 1,
      1
    );

    const limit = Math.min(
      Math.max(
        Number.parseInt(req.query.limit, 10) || 12,
        1
      ),
      100
    );

    /*
    ----------------------------------------------
    QUERY PARAMETERS
    ----------------------------------------------
    */

    const search =
      req.query.search?.trim() || "";

    const category =
      req.query.category?.trim() || "";

    const brand =
      req.query.brand?.trim() || "";

    /*
    ----------------------------------------------
    BASE FILTER
    ----------------------------------------------
    */

    const filter = {};

    /*
    ==================================================
    SEARCH
    ==================================================

    Case-insensitive PARTIAL search.

    Examples:

    m
    mo
    mob
    mobile
    MOBILE
    MoBiLe

    All can match:

    Mobile Phone
    Samsung Mobile
    etc.

    Search fields:

    - Product name
    - Brand
    - Description
    - Category name
    */

    if (search) {
      const safeSearch =
        escapeRegex(search);

      /*
      ----------------------------------------------
      FIND CATEGORIES MATCHING SEARCH
      ----------------------------------------------

      Example:

      search = "mobile"

      Category:
      "Mobile Phones"

      will also match.
      */

      const matchingCategories =
        await Category.find({
          name: {
            $regex: safeSearch,
            $options: "i",
          },
        })
          .select("_id")
          .lean();

      const matchingCategoryIds =
        matchingCategories.map(
          (item) => item._id
        );

      /*
      ----------------------------------------------
      PRODUCT SEARCH
      ----------------------------------------------
      */

      const searchConditions = [
        {
          name: {
            $regex: safeSearch,
            $options: "i",
          },
        },

        {
          brand: {
            $regex: safeSearch,
            $options: "i",
          },
        },

        {
          description: {
            $regex: safeSearch,
            $options: "i",
          },
        },
      ];

      /*
      Add category matching only when
      matching categories exist.
      */

      if (matchingCategoryIds.length > 0) {
        searchConditions.push({
          category: {
            $in: matchingCategoryIds,
          },
        });
      }

      filter.$or = searchConditions;
    }

    /*
    ==================================================
    CATEGORY FILTER
    ==================================================
    */

    if (category) {
      if (
        !mongoose.Types.ObjectId.isValid(
          category
        )
      ) {
        return res.status(400).json({
          success: false,
          message: "Invalid category ID",
        });
      }

      filter.category = category;
    }

    /*
    ==================================================
    BRAND FILTER
    ==================================================
    */

    if (brand) {
      const safeBrand =
        escapeRegex(brand);

      filter.brand = {
        $regex: `^${safeBrand}$`,
        $options: "i",
      };
    }

    /*
    ==================================================
    PRICE RANGE
    ==================================================
    */

    const minPrice =
      req.query.minPrice !== undefined
        ? Number(req.query.minPrice)
        : undefined;

    const maxPrice =
      req.query.maxPrice !== undefined
        ? Number(req.query.maxPrice)
        : undefined;

    /*
    ----------------------------------------------
    VALIDATE MIN PRICE
    ----------------------------------------------
    */

    if (
      minPrice !== undefined &&
      (Number.isNaN(minPrice) ||
        minPrice < 0)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid minimum price",
      });
    }

    /*
    ----------------------------------------------
    VALIDATE MAX PRICE
    ----------------------------------------------
    */

    if (
      maxPrice !== undefined &&
      (Number.isNaN(maxPrice) ||
        maxPrice < 0)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid maximum price",
      });
    }

    /*
    ----------------------------------------------
    VALIDATE PRICE RANGE
    ----------------------------------------------
    */

    if (
      minPrice !== undefined &&
      maxPrice !== undefined &&
      minPrice > maxPrice
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Minimum price cannot be greater than maximum price",
      });
    }

    /*
    ----------------------------------------------
    APPLY PRICE FILTER
    ----------------------------------------------
    */

    if (
      minPrice !== undefined ||
      maxPrice !== undefined
    ) {
      filter.price = {};

      if (minPrice !== undefined) {
        filter.price.$gte = minPrice;
      }

      if (maxPrice !== undefined) {
        filter.price.$lte = maxPrice;
      }
    }

    /*
    ==================================================
    RATING FILTER
    ==================================================
    */

    if (req.query.rating !== undefined) {
      const rating = Number(
        req.query.rating
      );

      if (
        Number.isNaN(rating) ||
        rating < 0 ||
        rating > 5
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Rating filter must be between 0 and 5",
        });
      }

      filter.rating = {
        $gte: rating,
      };
    }

    /*
    ==================================================
    STOCK FILTER
    ==================================================
    */

    if (req.query.inStock === "true") {
      filter.stock = {
        $gt: 0,
      };
    }

    /*
    ==================================================
    SORTING
    ==================================================
    */

    const sortOptions = {
      newest: {
        createdAt: -1,
      },

      oldest: {
        createdAt: 1,
      },

      priceLow: {
        price: 1,
      },

      priceHigh: {
        price: -1,
      },

      ratingHigh: {
        rating: -1,
        numReviews: -1,
      },

      nameAZ: {
        name: 1,
      },

      nameZA: {
        name: -1,
      },
    };

    const sort =
      sortOptions[req.query.sort] ||
      sortOptions.newest;

    /*
    ==================================================
    PAGINATION CALCULATION
    ==================================================
    */

    const skip = (page - 1) * limit;

    /*
    ==================================================
    FETCH PRODUCTS + COUNT
    ==================================================
    */

    const [
      products,
      totalProducts,
    ] = await Promise.all([
      Product.find(filter)
        .populate(
          "category",
          "name slug"
        )
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean(),

      Product.countDocuments(filter),
    ]);

    /*
    ==================================================
    TOTAL PAGES
    ==================================================
    */

    const totalPages = Math.ceil(
      totalProducts / limit
    );

    /*
    ==================================================
    RESPONSE
    ==================================================
    */

    return res.status(200).json({
      success: true,

      products,

      pagination: {
        currentPage: page,
        limit,
        totalProducts,
        totalPages,
        hasNextPage:
          page < totalPages,
        hasPreviousPage:
          page > 1,
      },

      filters: {
        search,
        category,
        brand,

        minPrice:
          minPrice !== undefined
            ? minPrice
            : null,

        maxPrice:
          maxPrice !== undefined
            ? maxPrice
            : null,

        rating:
          req.query.rating !== undefined
            ? Number(req.query.rating)
            : null,

        inStock:
          req.query.inStock === "true",

        sort:
          req.query.sort || "newest",
      },
    });
  } catch (error) {
    next(error);
  }
};

/*
==================================================
GET PRODUCT BY ID
==================================================
*/

const getProductById = async (
  req,
  res,
  next
) => {
  try {
    const { id } = req.params;

    if (
      !mongoose.Types.ObjectId.isValid(id)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID",
      });
    }

    const product =
      await Product.findById(id).populate(
        "category",
        "name slug description image"
      );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    return res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    next(error);
  }
};

/*
==================================================
CREATE PRODUCT
==================================================
*/

const createProduct = async (
  req,
  res,
  next
) => {
  try {
    const {
      name,
      description,
      price,
      originalPrice,
      category,
      brand,
      images,
      stock,
      specifications,
      features,
    } = req.body;

    const errors = validateProduct({
      name,
      description,
      price,
      originalPrice,
      category,
      brand,
      stock,
    });

    if (
      Object.keys(errors).length > 0
    ) {
      return res.status(422).json({
        success: false,
        message: "Validation failed",
        errors,
      });
    }

    if (
      !mongoose.Types.ObjectId.isValid(
        category
      )
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid category ID",
      });
    }

    const categoryExists =
      await Category.exists({
        _id: category,
      });

    if (!categoryExists) {
      return res.status(404).json({
        success: false,
        message:
          "Selected category does not exist",
      });
    }

    const trimmedName =
      name.trim();

    const slug =
      slugify(trimmedName);

    const existingProduct =
      await Product.findOne({
        slug,
      });

    if (existingProduct) {
      return res.status(409).json({
        success: false,
        message:
          "A product with this name already exists",
      });
    }

    const normalizedPrice =
      Number(price);

    let normalizedOriginalPrice =
      null;

    if (
      originalPrice !== undefined &&
      originalPrice !== null &&
      originalPrice !== ""
    ) {
      normalizedOriginalPrice =
        Number(originalPrice);
    }

    if (
      normalizedOriginalPrice !== null &&
      normalizedOriginalPrice <
        normalizedPrice
    ) {
      return res.status(422).json({
        success: false,
        message:
          "Original price should not be lower than the current price",
      });
    }

    const product =
      await Product.create({
        name: trimmedName,

        slug,

        description:
          description.trim(),

        price:
          normalizedPrice,

        originalPrice:
          normalizedOriginalPrice,

        category,

        brand: brand
          ? brand.trim()
          : "",

        images:
          Array.isArray(images)
            ? images
            : [],

        stock:
          Number(stock),

        specifications:
          normalizeSpecifications(
            specifications
          ),

        features:
          Array.isArray(features)
            ? features
            : [],
      });

    const populatedProduct =
      await Product.findById(
        product._id
      ).populate(
        "category",
        "name slug"
      );

    return res.status(201).json({
      success: true,
      message:
        "Product created successfully",
      product:
        populatedProduct,
    });
  } catch (error) {
    next(error);
  }
};

/*
==================================================
UPDATE PRODUCT
==================================================
*/

const updateProduct = async (
  req,
  res,
  next
) => {
  try {
    const { id } = req.params;

    if (
      !mongoose.Types.ObjectId.isValid(id)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID",
      });
    }

    const product =
      await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    const {
      name,
      description,
      price,
      originalPrice,
      category,
      brand,
      images,
      stock,
      specifications,
      features,
      rating,
      numReviews,
    } = req.body;

    const errors = validateProduct({
      name,
      description,
      price,
      originalPrice,
      category,
      brand,
      stock,
    });

    if (
      Object.keys(errors).length > 0
    ) {
      return res.status(422).json({
        success: false,
        message: "Validation failed",
        errors,
      });
    }

    if (
      !mongoose.Types.ObjectId.isValid(
        category
      )
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid category ID",
      });
    }

    const categoryExists =
      await Category.exists({
        _id: category,
      });

    if (!categoryExists) {
      return res.status(404).json({
        success: false,
        message:
          "Selected category does not exist",
      });
    }

    const normalizedPrice =
      Number(price);

    let normalizedOriginalPrice =
      null;

    if (
      originalPrice !== undefined &&
      originalPrice !== null &&
      originalPrice !== ""
    ) {
      normalizedOriginalPrice =
        Number(originalPrice);
    }

    if (
      normalizedOriginalPrice !== null &&
      normalizedOriginalPrice <
        normalizedPrice
    ) {
      return res.status(422).json({
        success: false,
        message:
          "Original price should not be lower than the current price",
      });
    }

    const newSlug =
      slugify(name.trim());

    const duplicateProduct =
      await Product.findOne({
        _id: {
          $ne: id,
        },

        slug: newSlug,
      });

    if (duplicateProduct) {
      return res.status(409).json({
        success: false,
        message:
          "Another product with this name already exists",
      });
    }

    product.name =
      name.trim();

    product.slug =
      newSlug;

    product.description =
      description.trim();

    product.price =
      normalizedPrice;

    product.originalPrice =
      normalizedOriginalPrice;

    product.category =
      category;

    product.brand =
      brand
        ? brand.trim()
        : "";

    product.stock =
      Number(stock);

    if (images !== undefined) {
      product.images =
        Array.isArray(images)
          ? images
          : [];
    }

    if (
      specifications !== undefined
    ) {
      product.specifications =
        normalizeSpecifications(
          specifications
        );
    }

    if (features !== undefined) {
      product.features =
        Array.isArray(features)
          ? features
          : [];
    }

    /*
    ================================================
    RATING AND REVIEWS
    ================================================
    */

    if (rating !== undefined) {
      const normalizedRating =
        Number(rating);

      if (
        Number.isNaN(
          normalizedRating
        ) ||
        normalizedRating < 0 ||
        normalizedRating > 5
      ) {
        return res.status(422).json({
          success: false,
          message:
            "Rating must be between 0 and 5",
        });
      }

      product.rating =
        normalizedRating;
    }

    if (
      numReviews !== undefined
    ) {
      const normalizedNumReviews =
        Number(numReviews);

      if (
        Number.isNaN(
          normalizedNumReviews
        ) ||
        normalizedNumReviews < 0 ||
        !Number.isInteger(
          normalizedNumReviews
        )
      ) {
        return res.status(422).json({
          success: false,
          message:
            "Number of reviews must be a non-negative integer",
        });
      }

      product.numReviews =
        normalizedNumReviews;
    }

    await product.save();

    const populatedProduct =
      await Product.findById(
        product._id
      ).populate(
        "category",
        "name slug"
      );

    return res.status(200).json({
      success: true,
      message:
        "Product updated successfully",
      product:
        populatedProduct,
    });
  } catch (error) {
    next(error);
  }
};

/*
==================================================
DELETE PRODUCT
==================================================
*/

const deleteProduct = async (
  req,
  res,
  next
) => {
  try {
    const { id } = req.params;

    if (
      !mongoose.Types.ObjectId.isValid(id)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID",
      });
    }

    const product =
      await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    await product.deleteOne();

    return res.status(200).json({
      success: true,
      message:
        "Product deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

/*
==================================================
EXPORT
==================================================
*/

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};