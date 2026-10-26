import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import {
  fetchProducts,
} from "../redux/slices/productSlice";

import {
  fetchCategories,
} from "../redux/slices/categorySlice";

const Home = () => {
  const dispatch = useDispatch();

  // =========================
  // PRODUCTS
  // =========================

  const {
    products = [],
    loading: productsLoading,
  } = useSelector((state) => state.products);

  // =========================
  // CATEGORIES
  // =========================

  const {
    categories = [],
    loading: categoriesLoading,
  } = useSelector((state) => state.categories);

  // =========================
  // FETCH DATA
  // =========================

  useEffect(() => {
    dispatch(
      fetchProducts({
        page: 1,
        limit: 8,
      })
    );

    dispatch(fetchCategories());
  }, [dispatch]);

  // =========================
  // FEATURED PRODUCTS
  // =========================

  const featuredProducts = products.slice(0, 4);

  // =========================
  // PRODUCT IMAGE
  // =========================

  const getProductImage = (product) => {
    return (
      product.images?.[0] ||
      `https://placehold.co/600x400?text=${encodeURIComponent(
        product.name
      )}`
    );
  };

  // =========================
  // DISCOUNT
  // =========================

  const getDiscountPercentage = (product) => {
    if (
      product.originalPrice &&
      product.originalPrice > product.price
    ) {
      return Math.round(
        ((product.originalPrice - product.price) /
          product.originalPrice) *
          100
      );
    }

    return 0;
  };

  return (
    <div className="shopsphere-home">

      {/* =====================================================
          HERO SECTION
      ====================================================== */}

      <section className="shopsphere-hero">

        <div className="container">

          <div className="row align-items-center g-5">

            {/* LEFT */}

            <div className="col-lg-7">

              <div className="hero-badge">
                <span>✨</span>
                AI-Powered Shopping
              </div>

              <h1 className="hero-title">
                Shop Smarter.
                <br />
                <span>Choose Better.</span>
              </h1>

              <p className="hero-description">
                Discover amazing products, compare your
                options, and get intelligent shopping
                recommendations powered by AI.
              </p>

              <div className="hero-actions">

                <Link
                  to="/products"
                  className="hero-primary-btn"
                >
                  <span>🛍️</span>
                  Shop Now
                </Link>

                <Link
                  to="/ai-assistant"
                  className="hero-secondary-btn"
                >
                  <span>🤖</span>
                  Ask AI Assistant
                </Link>

              </div>

              {/* TRUST POINTS */}

              <div className="hero-trust">

                <div className="hero-trust-item">
                  <span>✓</span>
                  Smart Recommendations
                </div>

                <div className="hero-trust-item">
                  <span>✓</span>
                  Easy Comparison
                </div>

                <div className="hero-trust-item">
                  <span>✓</span>
                  Secure Checkout
                </div>

              </div>

            </div>

            {/* RIGHT */}

            <div className="col-lg-5">

              <div className="hero-ai-card">

                <div className="hero-ai-glow"></div>

                <div className="hero-shopping-icon">
                  🛍️
                </div>

                <div className="hero-ai-label">
                  POWERED BY AI
                </div>

                <h2>
                  ShopSphere
                  <span> AI</span>
                </h2>

                <p>
                  Your intelligent shopping
                  companion.
                </p>

                <div className="hero-ai-features">

                  <div>
                    <span>✨</span>
                    AI Recommendations
                  </div>

                  <div>
                    <span>⚖️</span>
                    Product Comparison
                  </div>

                  <div>
                    <span>💡</span>
                    Smart Shopping Help
                  </div>

                </div>

              </div>

            </div>

          </div>

        </div>

      </section>

      {/* =====================================================
          FEATURE HIGHLIGHTS
      ====================================================== */}

      <section className="home-features-section">

        <div className="container">

          <div className="row g-4">

            <div className="col-md-4">

              <div className="home-feature-card">

                <div className="feature-icon purple">
                  🤖
                </div>

                <div>
                  <h5>
                    AI Shopping Assistant
                  </h5>

                  <p>
                    Get personalized product
                    recommendations using AI.
                  </p>
                </div>

              </div>

            </div>

            <div className="col-md-4">

              <div className="home-feature-card">

                <div className="feature-icon blue">
                  ⚖️
                </div>

                <div>
                  <h5>
                    Compare Products
                  </h5>

                  <p>
                    Compare multiple products
                    before making your choice.
                  </p>
                </div>

              </div>

            </div>

            <div className="col-md-4">

              <div className="home-feature-card">

                <div className="feature-icon green">
                  🔒
                </div>

                <div>
                  <h5>
                    Secure Shopping
                  </h5>

                  <p>
                    Enjoy a secure checkout and
                    reliable order tracking.
                  </p>
                </div>

              </div>

            </div>

          </div>

        </div>

      </section>

      {/* =====================================================
          CATEGORIES
      ====================================================== */}

      <section className="home-section">

        <div className="container">

          <div className="home-section-header">

            <div>

              <span className="section-label">
                EXPLORE
              </span>

              <h2>
                Shop by Category
              </h2>

              <p>
                Find products from your favorite
                categories.
              </p>

            </div>

            <Link
              to="/products"
              className="section-view-link"
            >
              View All
              <span>→</span>
            </Link>

          </div>

          {categoriesLoading ? (

            <div className="home-loading">
              <div className="spinner-border text-primary"></div>
              <p>Loading categories...</p>
            </div>

          ) : categories.length === 0 ? (

            <div className="home-empty">
              No categories available.
            </div>

          ) : (

            <div className="row g-4">

              {categories.map((category) => (

                <div
                  className="col-6 col-md-4 col-lg"
                  key={category._id}
                >

  <Link
      to={`/products?category=${category._id}`}
      className="category-card-link"
    >

                    <div className="home-category-card">

                      <div className="category-icon">
                        🛍️
                      </div>

                      <h5>
                        {category.name}
                      </h5>

                      <span>
                        {category.productCount || 0}
                        {" "}
                        products
                      </span>

                      <div className="category-arrow">
                        →
                      </div>

                    </div>

                  </Link>

                </div>

              ))}

            </div>

          )}

        </div>

      </section>

      {/* =====================================================
          FEATURED PRODUCTS
      ====================================================== */}

      <section className="home-featured-section">

        <div className="container">

          <div className="home-section-header">

            <div>

              <span className="section-label">
                TRENDING NOW
              </span>

              <h2>
                Featured Products
              </h2>

              <p>
                Explore some of the products
                available in our catalog.
              </p>

            </div>

            <Link
              to="/products"
              className="section-view-link"
            >
              View All Products
              <span>→</span>
            </Link>

          </div>

          {productsLoading ? (

            <div className="row g-4">

              {[1, 2, 3, 4].map((item) => (

                <div
                  className="col-sm-6 col-lg-3"
                  key={item}
                >

                  <div className="home-product-skeleton">

                    <div className="skeleton-image"></div>

                    <div className="skeleton-line large"></div>

                    <div className="skeleton-line"></div>

                    <div className="skeleton-line small"></div>

                  </div>

                </div>

              ))}

            </div>

          ) : featuredProducts.length === 0 ? (

            <div className="home-empty">
              No products available.
            </div>

          ) : (

            <div className="row g-4">

              {featuredProducts.map((product) => {

                const discountPercentage =
                  getDiscountPercentage(product);

                return (

                  <div
                    className="col-sm-6 col-lg-3"
                    key={product._id}
                  >

                    <div className="home-product-card">

                      {/* IMAGE */}

                      <div className="home-product-image-wrapper">

                        {discountPercentage > 0 && (

                          <span className="product-discount">
                            {discountPercentage}% OFF
                          </span>

                        )}

                        <img
                          src={getProductImage(product)}
                          alt={product.name}
                          className="home-product-image"
                        />

                      </div>

                      {/* CONTENT */}

                      <div className="home-product-content">

                        <small className="product-brand">
                          {product.brand}
                        </small>

                        <h5>
                          {product.name}
                        </h5>

                        <p>
                          {product.description?.slice(
                            0,
                            85
                          )}

                          {product.description?.length > 85
                            ? "..."
                            : ""}
                        </p>

                        <div className="product-price-row">

                          <span className="product-price">
                            ₹
                            {product.price?.toLocaleString(
                              "en-IN"
                            )}
                          </span>

                          {discountPercentage > 0 && (

                            <span className="product-original-price">
                              ₹
                              {product.originalPrice?.toLocaleString(
                                "en-IN"
                              )}
                            </span>

                          )}

                        </div>

                        <Link
                          to={`/products/${product._id}`}
                          className="product-view-btn"
                        >
                          View Product
                          <span>→</span>
                        </Link>

                      </div>

                    </div>

                  </div>

                );
              })}

            </div>

          )}

        </div>

      </section>

      {/* =====================================================
          AI ASSISTANT SECTION
      ====================================================== */}

      <section className="home-ai-section">

        <div className="container">

          <div className="home-ai-banner">

            <div className="ai-banner-decoration one"></div>
            <div className="ai-banner-decoration two"></div>

            <div className="row align-items-center">

              <div className="col-lg-8">

                <span className="ai-powered-label">
                  ✨ POWERED BY GEMINI AI
                </span>

                <h2>
                  Not sure what to buy?
                </h2>

                <p>
                  Tell our AI Shopping Assistant what
                  you're looking for and get
                  recommendations from the ShopSphere
                  product catalog.
                </p>

              </div>

              <div className="col-lg-4 text-lg-end mt-4 mt-lg-0">

                <Link
                  to="/ai-assistant"
                  className="ai-banner-btn"
                >
                  🤖 Try AI Assistant
                  <span>→</span>
                </Link>

              </div>

            </div>

          </div>

        </div>

      </section>

      {/* =====================================================
          FINAL CTA
      ====================================================== */}

      <section className="home-final-cta">

        <div className="container text-center">

          <div className="cta-icon">
            🛍️
          </div>

          <h2>
            Ready to start shopping?
          </h2>

          <p>
            Discover products, compare options,
            and shop smarter with ShopSphere AI.
          </p>

          <Link
            to="/products"
            className="cta-button"
          >
            Browse Products
            <span>→</span>
          </Link>

        </div>

      </section>

    </div>
  );
};

export default Home;