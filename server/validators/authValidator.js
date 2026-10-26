const isValidEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

const validateRegistration = ({ name, email, password }) => {
  const errors = {};

  if (!name || !name.trim()) {
    errors.name = "Name is required";
  } else if (name.trim().length < 2) {
    errors.name = "Name must contain at least 2 characters";
  }

  if (!email || !email.trim()) {
    errors.email = "Email is required";
  } else if (!isValidEmail(email.trim())) {
    errors.email = "Please provide a valid email address";
  }

  if (!password) {
    errors.password = "Password is required";
  } else if (password.length < 6) {
    errors.password = "Password must contain at least 6 characters";
  }

  return errors;
};

const validateLogin = ({ email, password }) => {
  const errors = {};

  if (!email || !email.trim()) {
    errors.email = "Email is required";
  }

  if (!password) {
    errors.password = "Password is required";
  }

  return errors;
};

const validateChangePassword = ({
  currentPassword,
  newPassword,
}) => {
  const errors = {};

  if (!currentPassword) {
    errors.currentPassword = "Current password is required";
  }

  if (!newPassword) {
    errors.newPassword = "New password is required";
  } else if (newPassword.length < 6) {
    errors.newPassword =
      "New password must contain at least 6 characters";
  }

  return errors;
};

module.exports = {
  validateRegistration,
  validateLogin,
  validateChangePassword,
};