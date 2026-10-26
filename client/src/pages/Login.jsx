import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import {
  FiMail,
  FiLock,
  FiLogIn,
} from "react-icons/fi";

import { loginUser } from "../redux/slices/authSlice";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    loading,
    error,
  } = useSelector(
    (state) => state.auth
  );

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (event) => {
    const {
      name,
      value,
    } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const result = await dispatch(
      loginUser(formData)
    );

    if (
      loginUser.fulfilled.match(result)
    ) {
      const loggedInUser =
        result.payload?.data?.user ||
        result.payload?.user ||
        result.payload?.data;

      if (
        loggedInUser?.role === "ADMIN"
      ) {
        navigate("/admin");
      } else {
        navigate("/");
      }
    }
  };

  return (
    <div className="shopsphere-auth-page">

      <div className="shopsphere-auth-container">

        {/* LEFT SIDE */}

        <div className="shopsphere-auth-info">

          <div className="shopsphere-auth-brand-icon">
            🛍️
          </div>

          <span className="shopsphere-auth-badge">
            ✨ ShopSphere AI
          </span>

          <h1>
            Welcome back to
            <span>
              ShopSphere
            </span>
          </h1>

          <p>
            Sign in to explore products,
            manage your wishlist, track
            orders, and experience
            AI-powered shopping.
          </p>

          <div className="shopsphere-auth-features">

            <div>
              <span>✓</span>
              <p>
                AI-powered product
                recommendations
              </p>
            </div>

            <div>
              <span>✓</span>
              <p>
                Secure online payments
              </p>
            </div>

            <div>
              <span>✓</span>
              <p>
                Easy order tracking
              </p>
            </div>

          </div>

        </div>


        {/* RIGHT SIDE */}

        <div className="shopsphere-auth-card">

          <div className="shopsphere-auth-card-header">

            <h2>
              Welcome Back 👋
            </h2>

            <p>
              Login to your ShopSphere
              account
            </p>

          </div>


          {/* ERROR */}

          {error && (
            <div className="shopsphere-auth-error">
              <span>⚠️</span>

              <p>
                {error}
              </p>
            </div>
          )}


          {/* FORM */}

          <form
            onSubmit={handleSubmit}
            className="shopsphere-auth-form"
          >

            {/* EMAIL */}

            <div className="shopsphere-auth-field">

              <label htmlFor="email">
                Email Address
              </label>

              <div className="shopsphere-auth-input-wrapper">

                <FiMail />

                <input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  value={
                    formData.email
                  }
                  onChange={
                    handleChange
                  }
                  required
                />

              </div>

            </div>


            {/* PASSWORD */}

            <div className="shopsphere-auth-field">

              <label htmlFor="password">
                Password
              </label>

              <div className="shopsphere-auth-input-wrapper">

                <FiLock />

                <input
                  id="password"
                  type="password"
                  name="password"
                  placeholder="Enter your password"
                  value={
                    formData.password
                  }
                  onChange={
                    handleChange
                  }
                  required
                />

              </div>

            </div>


            {/* LOGIN BUTTON */}

            <button
              type="submit"
              className="shopsphere-auth-submit"
              disabled={loading}
            >

              {loading ? (
                <>
                  <span className="shopsphere-auth-spinner" />

                  Logging in...
                </>
              ) : (
                <>
                  <FiLogIn />

                  Login
                </>
              )}

            </button>

          </form>


          {/* REGISTER */}

          <div className="shopsphere-auth-footer">

            <span>
              Don't have an account?
            </span>

            <Link to="/register">
              Create Account
            </Link>

          </div>

        </div>

      </div>

    </div>
  );
};

export default Login;