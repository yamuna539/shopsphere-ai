const mongoose = require("mongoose");

const Category = require("../models/Category");
const Product = require("../models/Product");

const getAdminCategories = async (
  req,
  res
) => {
  try {
    const categories =
      await Category.find()
        .sort({
          createdAt: -1,
        });

    return res.status(200).json({
      success: true,
      data: categories,
    });
  } catch (error) {
    console.error(
      "Admin Categories Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to fetch categories",
    });
  }
};

const createAdminCategory = async (
  req,
  res
) => {
  try {
    const {
      name,
      description,
      image,
    } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Category name is required",
      });
    }

    const existingCategory =
      await Category.findOne({
        name: name.trim(),
      });

    if (existingCategory) {
      return res.status(409).json({
        success: false,
        message: "Category already exists",
      });
    }

    const category =
      await Category.create({
        name: name.trim(),
        description:
          description?.trim() || "",
        image: image || "",
      });

    return res.status(201).json({
      success: true,
      message:
        "Category created successfully",
      data: category,
    });
  } catch (error) {
    console.error(
      "Create Category Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to create category",
    });
  }
};

const updateAdminCategory = async (
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
        message: "Invalid category ID",
      });
    }

    const category =
      await Category.findById(id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    const {
      name,
      description,
      image,
    } = req.body;

    if (name !== undefined) {
      if (!name.trim()) {
        return res.status(400).json({
          success: false,
          message: "Category name is required",
        });
      }

      const duplicate =
        await Category.findOne({
          name: name.trim(),
          _id: {
            $ne: id,
          },
        });

      if (duplicate) {
        return res.status(409).json({
          success: false,
          message:
            "Another category already uses this name",
        });
      }

      category.name = name.trim();
    }

    if (description !== undefined) {
      category.description =
        description.trim();
    }

    if (image !== undefined) {
      category.image = image;
    }

    await category.save();

    return res.status(200).json({
      success: true,
      message:
        "Category updated successfully",
      data: category,
    });
  } catch (error) {
    console.error(
      "Update Category Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to update category",
    });
  }
};

const deleteAdminCategory = async (
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
        message: "Invalid category ID",
      });
    }

    const category =
      await Category.findById(id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    const productCount =
      await Product.countDocuments({
        category: id,
      });

    if (productCount > 0) {
      return res.status(409).json({
        success: false,
        message:
          "Cannot delete category because products are assigned to it",
      });
    }

    await Category.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message:
        "Category deleted successfully",
    });
  } catch (error) {
    console.error(
      "Delete Category Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to delete category",
    });
  }
};

module.exports = {
  getAdminCategories,
  createAdminCategory,
  updateAdminCategory,
  deleteAdminCategory,
};