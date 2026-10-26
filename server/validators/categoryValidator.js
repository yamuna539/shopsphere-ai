const validateCategory = ({ name, description }) => {
  const errors = {};

  if (!name || !name.trim()) {
    errors.name = "Category name is required";
  } else if (name.trim().length < 2) {
    errors.name = "Category name must contain at least 2 characters";
  } else if (name.trim().length > 100) {
    errors.name = "Category name cannot exceed 100 characters";
  }

  if (description !== undefined && description.length > 500) {
    errors.description =
      "Category description cannot exceed 500 characters";
  }

  return errors;
};

module.exports = {
  validateCategory,
};