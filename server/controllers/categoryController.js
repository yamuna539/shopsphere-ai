const mongoose = require("mongoose");

const Category = require("../models/Category");
const Product = require("../models/Product");

const slugify = require("../utils/slugify");

const {
  validateCategory,
} = require("../validators/categoryValidator");

/*
==================================================
GET ALL CATEGORIES
==================================================

Returns:

{
  success: true,
  count: 7,
  categories: [
    {
      _id,
      name,
      slug,
      description,
      image,
      productCount
    }
  ]
}

productCount is calculated from the
actual Product collection.
*/

const getCategories = async (
  req,
  res,
  next
) => {
  try {
    const categories =
      await Category.aggregate([
        /*
        ------------------------------------------
        SORT
        ------------------------------------------
        */

        {
          $sort: {
            name: 1,
          },
        },

        /*
        ------------------------------------------
        LOOKUP PRODUCTS
        ------------------------------------------

        Match:

        Category._id
              ↓
        Product.category
        */

        {
          $lookup: {
            from: Product.collection.name,

            localField: "_id",

            foreignField: "category",

            as: "categoryProducts",
          },
        },

        /*
        ------------------------------------------
        COUNT PRODUCTS
        ------------------------------------------
        */

        {
          $addFields: {
            productCount: {
              $size:
                "$categoryProducts",
            },
          },
        },

        /*
        ------------------------------------------
        REMOVE TEMP PRODUCT ARRAY
        ------------------------------------------
        */

        {
          $project: {
            categoryProducts: 0,
          },
        },
      ]);

    return res.status(200).json({
      success: true,

      count:
        categories.length,

      categories,
    });
  } catch (error) {
    next(error);
  }
};

/*
==================================================
GET CATEGORY BY ID
==================================================
*/

const getCategoryById = async (
  req,
  res,
  next
) => {
  try {
    const { id } =
      req.params;

    if (
      !mongoose.Types.ObjectId.isValid(
        id
      )
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid category ID",
      });
    }

    const category =
      await Category.findById(id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message:
          "Category not found",
      });
    }

    /*
    ----------------------------------------------
    PRODUCT COUNT
    ----------------------------------------------
    */

    const productCount =
      await Product.countDocuments({
        category: id,
      });

    return res.status(200).json({
      success: true,

      category: {
        ...category.toObject(),

        productCount,
      },
    });
  } catch (error) {
    next(error);
  }
};

/*
==================================================
CREATE CATEGORY
==================================================
*/

const createCategory = async (
  req,
  res,
  next
) => {
  try {
    const {
      name,
      description,
      image,
    } = req.body;

    const errors =
      validateCategory({
        name,
        description,
      });

    if (
      Object.keys(errors)
        .length > 0
    ) {
      return res.status(422).json({
        success: false,
        message:
          "Validation failed",
        errors,
      });
    }

    const trimmedName =
      name.trim();

    const slug =
      slugify(trimmedName);

    const existingCategory =
      await Category.findOne({
        $or: [
          {
            name: trimmedName,
          },

          {
            slug,
          },
        ],
      });

    if (existingCategory) {
      return res.status(409).json({
        success: false,
        message:
          "A category with this name already exists",
      });
    }

    const category =
      await Category.create({
        name: trimmedName,

        slug,

        description: description
          ? description.trim()
          : "",

        image: image
          ? image.trim()
          : "",
      });

    return res.status(201).json({
      success: true,

      message:
        "Category created successfully",

      category: {
        ...category.toObject(),

        productCount: 0,
      },
    });
  } catch (error) {
    next(error);
  }
};

/*
==================================================
UPDATE CATEGORY
==================================================
*/

const updateCategory = async (
  req,
  res,
  next
) => {
  try {
    const { id } =
      req.params;

    if (
      !mongoose.Types.ObjectId.isValid(
        id
      )
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid category ID",
      });
    }

    const category =
      await Category.findById(id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message:
          "Category not found",
      });
    }

    const {
      name,
      description,
      image,
    } = req.body;

    const errors =
      validateCategory({
        name,
        description,
      });

    if (
      Object.keys(errors)
        .length > 0
    ) {
      return res.status(422).json({
        success: false,
        message:
          "Validation failed",
        errors,
      });
    }

    const trimmedName =
      name.trim();

    const newSlug =
      slugify(trimmedName);

    const duplicateCategory =
      await Category.findOne({
        _id: {
          $ne: id,
        },

        $or: [
          {
            name: trimmedName,
          },

          {
            slug: newSlug,
          },
        ],
      });

    if (duplicateCategory) {
      return res.status(409).json({
        success: false,
        message:
          "Another category with this name already exists",
      });
    }

    category.name =
      trimmedName;

    category.slug =
      newSlug;

    if (
      description !== undefined
    ) {
      category.description =
        description.trim();
    }

    if (
      image !== undefined
    ) {
      category.image =
        image.trim();
    }

    await category.save();

    const productCount =
      await Product.countDocuments({
        category: id,
      });

    return res.status(200).json({
      success: true,

      message:
        "Category updated successfully",

      category: {
        ...category.toObject(),

        productCount,
      },
    });
  } catch (error) {
    next(error);
  }
};

/*
==================================================
DELETE CATEGORY
==================================================
*/

const deleteCategory = async (
  req,
  res,
  next
) => {
  try {
    const { id } =
      req.params;

    if (
      !mongoose.Types.ObjectId.isValid(
        id
      )
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid category ID",
      });
    }

    const category =
      await Category.findById(id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message:
          "Category not found",
      });
    }

    const productsUsingCategory =
      await Product.countDocuments({
        category: id,
      });

    if (
      productsUsingCategory > 0
    ) {
      return res.status(409).json({
        success: false,

        message:
          "Cannot delete category because products are assigned to it",

        productCount:
          productsUsingCategory,
      });
    }

    await category.deleteOne();

    return res.status(200).json({
      success: true,

      message:
        "Category deleted successfully",
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
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
};