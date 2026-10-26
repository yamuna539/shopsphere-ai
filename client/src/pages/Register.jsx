import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import {
  FiUser,
  FiMail,
  FiLock,
  FiEye,
  FiEyeOff,
  FiArrowRight,
  FiShoppingBag,
  FiCheck,
  FiStar,
} from "react-icons/fi";

import { registerUser } from "../redux/slices/authSlice";

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error } = useSelector(
    (state) => state.auth
  );

  const [showPassword, setShowPassword] =
    useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const result = await dispatch(
      registerUser(formData)
    );

    if (registerUser.fulfilled.match(result)) {
      navigate("/login");
    }
  };

  return (
    <div className="shopsphere-register-page">

      {/* Background decoration */}
      <div className="shopsphere-register-orb shopsphere-register-orb-one" />
      <div className="shopsphere-register-orb shopsphere-register-orb-two" />

      <div className="shopsphere-register-container">

        {/* =========================
            LEFT BRAND PANEL
        ========================== */}

        <div className="shopsphere-register-brand-panel">

          <Link
            to="/"
            className="shopsphere-register-brand"
          >
            <div className="shopsphere-register-brand-icon">
              <FiShoppingBag />
            </div>

            <div>
              <div className="shopsphere-register-brand-name">
                ShopSphere
              </div>

              <div className="shopsphere-register-brand-ai">
                AI Powered Shopping
              </div>
            </div>
          </Link>

          <div className="shopsphere-register-brand-content">

            <div className="shopsphere-register-badge">
              <FiStar />
              Smart Shopping Experience
            </div>

            <h1>
              Shop smarter.
              <br />
              <span>Discover more.</span>
            </h1>

            <p>
              Create your ShopSphere account and
              experience a smarter way to discover,
              compare and shop your favorite products.
            </p>

            <div className="shopsphere-register-benefits">

              <div className="shopsphere-register-benefit">
                <div className="shopsphere-register-benefit-icon">
                  <FiCheck />
                </div>

                <div>
                  <strong>AI-powered recommendations</strong>
                  <span>
                    Find products that match your needs.
                  </span>
                </div>
              </div>

              <div className="shopsphere-register-benefit">
                <div className="shopsphere-register-benefit-icon">
                  <FiCheck />
                </div>

                <div>
                  <strong>Easy product comparison</strong>
                  <span>
                    Compare products before you buy.
                  </span>
                </div>
              </div>

              <div className="shopsphere-register-benefit">
                <div className="shopsphere-register-benefit-icon">
                  <FiCheck />
                </div>

                <div>
                  <strong>Secure shopping experience</strong>
                  <span>
                    Manage your orders in one place.
                  </span>
                </div>
              </div>

            </div>

          </div>

          <div className="shopsphere-register-brand-footer">
            © {new Date().getFullYear()} ShopSphere
          </div>

        </div>

        {/* =========================
            RIGHT FORM PANEL
        ========================== */}

        <div className="shopsphere-register-form-panel">

          <div className="shopsphere-register-form-header">

            <div className="shopsphere-register-mobile-logo">
              <FiShoppingBag />
            </div>

            <span className="shopsphere-register-welcome">
              Welcome to ShopSphere
            </span>

            <h2>
              Create your account
              <span>✨</span>
            </h2>

            <p>
              Join us and start shopping smarter with AI.
            </p>

          </div>

          {/* Error */}
          {error && (
            <div
              className="shopsphere-register-error"
              role="alert"
            >
              <span className="shopsphere-register-error-icon">
                ⚠️
              </span>

              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form
            className="shopsphere-register-form"
            onSubmit={handleSubmit}
          >

            {/* Full Name */}
            <div className="shopsphere-register-field">

              <label htmlFor="register-name">
                Full Name
              </label>

              <div className="shopsphere-register-input-wrapper">

                <FiUser className="shopsphere-register-input-icon" />

                <input
                  id="register-name"
                  type="text"
                  name="name"
                  className="shopsphere-register-input"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  minLength={2}
                  autoComplete="name"
                />

              </div>

            </div>

            {/* Email */}
            <div className="shopsphere-register-field">

              <label htmlFor="register-email">
                Email Address
              </label>

              <div className="shopsphere-register-input-wrapper">

                <FiMail className="shopsphere-register-input-icon" />

                <input
                  id="register-email"
                  type="email"
                  name="email"
                  className="shopsphere-register-input"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  autoComplete="email"
                />

              </div>

            </div>

            {/* Password */}
            <div className="shopsphere-register-field">

              <div className="shopsphere-register-label-row">
                <label htmlFor="register-password">
                  Password
                </label>

                <span>
                  Minimum 6 characters
                </span>
              </div>

              <div className="shopsphere-register-input-wrapper">

                <FiLock className="shopsphere-register-input-icon" />

                <input
                  id="register-password"
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  name="password"
                  className="shopsphere-register-input shopsphere-register-password-input"
                  placeholder="Create a strong password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  minLength={6}
                  autoComplete="new-password"
                />

                <button
                  type="button"
                  className="shopsphere-register-password-toggle"
                  onClick={() =>
                    setShowPassword(
                      (previous) => !previous
                    )
                  }
                  aria-label={
                    showPassword
                      ? "Hide password"
                      : "Show password"
                  }
                >
                  {showPassword ? (
                    <FiEyeOff />
                  ) : (
                    <FiEye />
                  )}
                </button>

              </div>

              {formData.password && (
                <div className="shopsphere-register-password-status">
                  {formData.password.length >= 6 ? (
                    <>
                      <FiCheck />
                      Password length is valid
                    </>
                  ) : (
                    <>
                      <FiLock />
                      Use at least 6 characters
                    </>
                  )}
                </div>
              )}

            </div>

            {/* Submit */}
            <button
              type="submit"
              className="shopsphere-register-submit"
              disabled={loading}
            >

              {loading ? (
                <>
                  <span className="shopsphere-register-spinner" />
                  Creating account...
                </>
              ) : (
                <>
                  Create Account
                  <FiArrowRight />
                </>
              )}

            </button>

          </form>

          {/* Login */}
          <div className="shopsphere-register-login">

            <span>
              Already have an account?
            </span>

            <Link to="/login">
              Login
              <FiArrowRight />
            </Link>

          </div>

          {/* Security note */}
          <div className="shopsphere-register-secure">

            <span>🔒</span>

            <div>
              <strong>Your information is secure</strong>
              <span>
                We protect your account information.
              </span>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};

export default Register;