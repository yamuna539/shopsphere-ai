const validateProduct = ({
  name,
  description,
  price,
  originalPrice,
  category,
  brand,
  stock,
}) => {
  const errors = {};

  if (!name || !name.trim()) {
    errors.name = "Product name is required";
  }

  if (!description || !description.trim()) {
    errors.description = "Product description is required";
  }

  if (price === undefined || price === null || price === "") {
    errors.price = "Product price is required";
  } else if (Number.isNaN(Number(price)) || Number(price) < 0) {
    errors.price = "Product price must be a valid non-negative number";
  }

  if (
    originalPrice !== undefined &&
    originalPrice !== null &&
    originalPrice !== "" &&
    (Number.isNaN(Number(originalPrice)) ||
      Number(originalPrice) < 0)
  ) {
    errors.originalPrice =
      "Original price must be a valid non-negative number";
  }

  if (!category) {
    errors.category = "Product category is required";
  }

  if (
    stock === undefined ||
    stock === null ||
    stock === ""
  ) {
    errors.stock = "Stock is required";
  } else if (
    Number.isNaN(Number(stock)) ||
    Number(stock) < 0 ||
    !Number.isInteger(Number(stock))
  ) {
    errors.stock = "Stock must be a non-negative integer";
  }

  if (brand !== undefined && brand.length > 100) {
    errors.brand = "Brand cannot exceed 100 characters";
  }

  return errors;
};

module.exports = {
  validateProduct,
};