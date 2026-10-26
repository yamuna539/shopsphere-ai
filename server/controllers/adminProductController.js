const mongoose = require("mongoose");

const Product = require("../models/Product");
const Category = require("../models/Category");
const Review = require("../models/Review");
const slugify = require("../utils/slugify");

const getAdminProducts = async (req, res) => {
  try {
    const {
      search = "",
      category = "",
      stock = "",
      page = 1,
      limit = 10,
    } = req.query;

    const currentPage = Math.max(
      Number(page) || 1,
      1
    );

    const pageLimit = Math.min(
      Math.max(Number(limit) || 10, 1),
      100
    );

    const filter = {};

    if (search.trim()) {
      filter.$or = [
        {
          name: {
            $regex: search.trim(),
            $options: "i",
          },
        },
        {
          brand: {
            $regex: search.trim(),
            $options: "i",
          },
        },
      ];
    }

    if (category) {
      if (
        mongoose.Types.ObjectId.isValid(
          category
        )
      ) {
        filter.category = category;
      }
    }

    if (stock === "in") {
      filter.stock = { $gt: 0 };
    }

    if (stock === "out") {
      filter.stock = { $eq: 0 };
    }

    const skip =
      (currentPage - 1) * pageLimit;

    const [
      products,
      totalProducts,
    ] = await Promise.all([
      Product.find(filter)
        .populate(
          "category",
          "name slug"
        )
        .sort({
          createdAt: -1,
        })
        .skip(skip)
        .limit(pageLimit),

      Product.countDocuments(filter),
    ]);

    return res.status(200).json({
      success: true,

      data: products,

      pagination: {
        page: currentPage,
        limit: pageLimit,
        total: totalProducts,
        pages: Math.ceil(
          totalProducts / pageLimit
        ),
      },
    });
  } catch (error) {
    console.error(
      "Admin Get Products Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to fetch products",
    });
  }
};

const getAdminProductById = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate product ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID",
      });
    }

    // Find product and populate category
    const product = await Product.findById(id).populate(
      "category",
      "name slug"
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    console.error(
      "Admin Get Product By ID Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to fetch product",
    });
  }
};

const createAdminProduct = async (
  req,
  res
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

    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Product name is required",
      });
    }

    if (
      price === undefined ||
      Number(price) < 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Valid price is required",
      });
    }

    if (
      stock === undefined ||
      Number(stock) < 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Valid stock is required",
      });
    }

    if (
      !category ||
      !mongoose.Types.ObjectId.isValid(
        category
      )
    ) {
      return res.status(400).json({
        success: false,
        message: "Valid category is required",
      });
    }

    const categoryExists =
      await Category.findById(category);

    if (!categoryExists) {
      return res.status(400).json({
        success: false,
        message: "Category not found",
      });
    }

  
const trimmedName = name.trim();
const slug = slugify(trimmedName);

// Check whether another product has this slug
const existingProduct = await Product.findOne({
  slug,
});

if (existingProduct) {
  return res.status(409).json({
    success: false,
    message: "A product with this name already exists",
  });
}

const product = await Product.create({
  name: trimmedName,
  slug,
  description: description?.trim() || "",
  price: Number(price),
  originalPrice:
    originalPrice !== undefined &&
    originalPrice !== null &&
    originalPrice !== ""
      ? Number(originalPrice)
      : Number(price),
  category,
  brand: brand?.trim() || "",
  images: Array.isArray(images) ? images : [],
  stock: Number(stock),
  specifications: specifications || {},
  features: Array.isArray(features) ? features : [],
  rating: 0,
  numReviews: 0,
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
      message: "Product created successfully",
      data: populatedProduct,
    });
  } catch (error) {
    console.error(
      "Admin Create Product Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to create product",
    });
  }
};

const updateAdminProduct = async (
  req,
  res
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
    } = req.body;

   
if (name !== undefined) {
  if (!name.trim()) {
    return res.status(400).json({
      success: false,
      message: "Product name cannot be empty",
    });
  }

  const trimmedName = name.trim();
  const newSlug = slugify(trimmedName);

  const duplicateProduct = await Product.findOne({
    _id: { $ne: id },
    slug: newSlug,
  });

  if (duplicateProduct) {
    return res.status(409).json({
      success: false,
      message: "A product with this name already exists",
    });
  }

  product.name = trimmedName;
  product.slug = newSlug;
}


    if (description !== undefined) {
      product.description =
        description.trim();
    }

    if (price !== undefined) {
      if (Number(price) < 0) {
        return res.status(400).json({
          success: false,
          message: "Invalid price",
        });
      }

      product.price = Number(price);
    }

    if (originalPrice !== undefined) {
      product.originalPrice =
        Number(originalPrice);
    }

    if (category !== undefined) {
      if (
        !mongoose.Types.ObjectId.isValid(
          category
        )
      ) {
        return res.status(400).json({
          success: false,
          message: "Invalid category",
        });
      }

      const categoryExists =
        await Category.findById(
          category
        );

      if (!categoryExists) {
        return res.status(400).json({
          success: false,
          message: "Category not found",
        });
      }

      product.category = category;
    }

    if (brand !== undefined) {
      product.brand = brand.trim();
    }

    if (images !== undefined) {
      product.images = Array.isArray(
        images
      )
        ? images
        : [];
    }

    if (stock !== undefined) {
      if (Number(stock) < 0) {
        return res.status(400).json({
          success: false,
          message: "Invalid stock",
        });
      }

      product.stock = Number(stock);
    }

    if (specifications !== undefined) {
      product.specifications =
        specifications;
    }

    if (features !== undefined) {
      product.features =
        Array.isArray(features)
          ? features
          : [];
    }

    await product.save();

    const updatedProduct =
      await Product.findById(id).populate(
        "category",
        "name slug"
      );

    return res.status(200).json({
      success: true,
      message: "Product updated successfully",
      data: updatedProduct,
    });
  } catch (error) {
    console.error(
      "Admin Update Product Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to update product",
    });
  }
};

const deleteAdminProduct = async (
  req,
  res
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

    await Review.deleteMany({
      product: id,
    });

    await Product.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.error(
      "Admin Delete Product Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to delete product",
    });
  }
};

module.exports = {
  getAdminProducts,
  getAdminProductById,
  createAdminProduct,
  updateAdminProduct,
  deleteAdminProduct,
};