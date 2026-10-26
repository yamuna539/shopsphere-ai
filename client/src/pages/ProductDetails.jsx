import { useEffect } from "react";
import {
  Link,
  useParams,
} from "react-router-dom";

import {
  useDispatch,
  useSelector,
} from "react-redux";

import { addCartItem } from "../redux/slices/cartSlice";

import {
  clearProduct,
  fetchProductById,
} from "../redux/slices/productSlice";

import {
  addWishlistItem,
} from "../redux/slices/wishlistSlice";

import {
  fetchProductReviews,
} from "../redux/slices/reviewSlice";

import AIReviewSummary from "../components/AIReviewSummary";
import AIRecommendations from "../components/AIRecommendations";
import Rating from "../components/Rating";
import RatingSummary from "../components/RatingSummary";
import ReviewForm from "../components/ReviewForm";
import ReviewList from "../components/ReviewList";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorMessage from "../components/ErrorMessage";

const ProductDetails = () => {
  const { id } = useParams();

  const dispatch = useDispatch();

  /* =====================================================
     PRODUCT STATE
  ===================================================== */

  const {
    product,
    productLoading,
    productError,
  } = useSelector(
    (state) => state.products
  );

  /* =====================================================
     AUTH STATE
  ===================================================== */

  const { isAuthenticated } = useSelector(
    (state) => state.auth
  );

  /* =====================================================
     REVIEW STATE
  ===================================================== */

  const {
    reviews,
    rating,
    numReviews,
    distribution,
    loading: reviewsLoading,
  } = useSelector(
    (state) => state.review
  );

  /* =====================================================
     FETCH PRODUCT
  ===================================================== */

  useEffect(() => {
    dispatch(fetchProductById(id));

    return () => {
      dispatch(clearProduct());
    };
  }, [dispatch, id]);

  /* =====================================================
     FETCH REVIEWS
  ===================================================== */

  useEffect(() => {
    if (product?._id) {
      dispatch(
        fetchProductReviews(product._id)
      );
    }
  }, [dispatch, product?._id]);

  /* =====================================================
     LOADING
  ===================================================== */

  if (productLoading) {
    return (
      <div className="container py-5">
        <LoadingSpinner
          message="Loading product..."
        />
      </div>
    );
  }

  /* =====================================================
     ERROR
  ===================================================== */

  if (productError) {
    return (
      <div className="container py-5">
        <ErrorMessage
          message={productError}
          onRetry={() =>
            dispatch(
              fetchProductById(id)
            )
          }
        />
      </div>
    );
  }

  /* =====================================================
     PRODUCT NOT FOUND
  ===================================================== */

  if (!product) {
    return (
      <div className="container py-5 text-center">

        <h3>
          Product not found
        </h3>

        <Link
          to="/products"
          className="btn btn-primary mt-3"
        >
          Back to Products
        </Link>

      </div>
    );
  }

  /* =====================================================
     PRODUCT DATA
  ===================================================== */

  const image =
    product.images?.[0] ||
    "https://placehold.co/800x600?text=ShopSphere";

  const isInStock =
    product.stock > 0;

  const hasDiscount =
    product.originalPrice &&
    product.originalPrice >
      product.price;

  const discountPercentage =
    hasDiscount
      ? Math.round(
          ((product.originalPrice -
            product.price) /
            product.originalPrice) *
            100
        )
      : 0;

  /* =====================================================
     ADD TO CART
  ===================================================== */

  const handleAddToCart = () => {
    dispatch(
      addCartItem({
        productId: product._id,
        quantity: 1,
      })
    );
  };

  /* =====================================================
     ADD TO WISHLIST
  ===================================================== */

  const handleAddToWishlist = () => {
    dispatch(
      addWishlistItem(product._id)
    );
  };

  return (
    <div className="shopsphere-product-details-page">

      <div className="container py-5">

        {/* =================================================
            BACK LINK
        ================================================= */}

        <Link
          to="/products"
          className="shopsphere-back-link"
        >
          ← Back to Products
        </Link>

        {/* =================================================
            PRODUCT MAIN SECTION
        ================================================= */}

        <div className="row g-5 mt-2 align-items-stretch">

          {/* =================================================
              PRODUCT IMAGE
          ================================================= */}

          <div className="col-12 col-lg-6">

            <div className="shopsphere-details-image-card">

              {/* Discount */}

              {hasDiscount && (
                <span className="shopsphere-details-discount">
                  {discountPercentage}% OFF
                </span>
              )}

              {/* Image */}

              <img
                src={image}
                alt={product.name}
                className="shopsphere-details-image"
              />

            </div>

          </div>

          {/* =================================================
              PRODUCT INFORMATION
          ================================================= */}

          <div className="col-12 col-lg-6">

            <div className="shopsphere-details-info">

              {/* Category */}

              <span className="shopsphere-details-category">
                {product.category?.name ||
                  "Uncategorized"}
              </span>

              {/* Product Name */}

              <h1 className="shopsphere-details-title">
                {product.name}
              </h1>

              {/* Rating */}

              <div className="shopsphere-details-rating">

                <Rating
                  rating={
                    rating ??
                    product.rating ??
                    0
                  }
                  numReviews={
                    numReviews ??
                    product.numReviews ??
                    0
                  }
                />

              </div>

              {/* Description */}

              <p className="shopsphere-details-description">
                {product.description}
              </p>

              {/* Price */}

              <div className="shopsphere-details-price-row">

                <span className="shopsphere-details-price">
                  ₹
                  {Number(
                    product.price
                  ).toLocaleString("en-IN")}
                </span>

                {hasDiscount && (
                  <span className="shopsphere-details-original-price">
                    ₹
                    {Number(
                      product.originalPrice
                    ).toLocaleString(
                      "en-IN"
                    )}
                  </span>
                )}

              </div>

              {/* Discount text */}

              {hasDiscount && (
                <div className="shopsphere-details-save">
                  You save ₹
                  {Number(
                    product.originalPrice -
                      product.price
                  ).toLocaleString(
                    "en-IN"
                  )}
                </div>
              )}

              {/* Stock */}

              <div className="shopsphere-details-stock">

                {isInStock ? (
                  <>
                    <span className="shopsphere-stock-dot"></span>

                    <strong>
                      In Stock
                    </strong>

                    <span>
                      {product.stock} units available
                    </span>
                  </>
                ) : (
                  <span className="shopsphere-out-stock">
                    Out of Stock
                  </span>
                )}

              </div>

              {/* Actions */}

              <div className="shopsphere-details-actions">

                <button
                  type="button"
                  className="shopsphere-details-cart-btn"
                  onClick={
                    handleAddToCart
                  }
                  disabled={!isInStock}
                >
                  {isInStock
                    ? "🛒 Add to Cart"
                    : "Out of Stock"}
                </button>

                <button
                  type="button"
                  className="shopsphere-details-wishlist-btn"
                  onClick={
                    handleAddToWishlist
                  }
                >
                  ♡ Wishlist
                </button>
                <Link
                to="/products"
                className="shopsphere-continue-shopping"
              >
                Continue Shopping
              </Link>

              </div>

              {/* Continue Shopping */}

              {/* <Link
                to="/products"
                className="shopsphere-continue-shopping"
              >
                Continue Shopping
              </Link> */}

            </div>

          </div>

        </div>

        {/* =================================================
            FEATURES + SPECIFICATIONS
        ================================================= */}

        <div className="row g-4 mt-5">

          {/* Features */}

          <div className="col-12 col-lg-7">

            <div className="shopsphere-details-section-card">

              <div className="shopsphere-section-heading">

                <span>
                  ✨
                </span>

                <h3>
                  Product Features
                </h3>

              </div>

              {product.features?.length > 0 ? (
                <ul className="shopsphere-features-list">

                  {product.features.map(
                    (feature, index) => (
                      <li key={index}>
                        <span>
                          ✓
                        </span>

                        {feature}
                      </li>
                    )
                  )}

                </ul>
              ) : (
                <p className="text-muted">
                  No features available.
                </p>
              )}

            </div>

          </div>

          {/* Specifications */}

          <div className="col-12 col-lg-5">

            <div className="shopsphere-details-section-card">

              <div className="shopsphere-section-heading">

                <span>
                  📋
                </span>

                <h3>
                  Specifications
                </h3>

              </div>

              {product.specifications &&
              Object.keys(
                product.specifications
              ).length > 0 ? (

                <div className="shopsphere-specifications">

                  {Object.entries(
                    product.specifications
                  ).map(
                    ([key, value]) => (
                      <div
                        key={key}
                        className="shopsphere-spec-row"
                      >

                        <strong>
                          {key}
                        </strong>

                        <span>
                          {value}
                        </span>

                      </div>
                    )
                  )}

                </div>

              ) : (
                <p className="text-muted">
                  No specifications available.
                </p>
              )}

            </div>

          </div>

        </div>

        {/* =================================================
            CUSTOMER REVIEWS
        ================================================= */}

        <section className="shopsphere-reviews-section">

          <div className="shopsphere-section-title">

            <span className="section-label">
              CUSTOMER FEEDBACK
            </span>

            <h2>
              Customer Reviews
            </h2>

            <p>
              See what other customers think
              about this product.
            </p>

          </div>

          {/* Rating Summary */}

          <div className="shopsphere-rating-summary-card">

            <RatingSummary
              rating={rating}
              numReviews={numReviews}
              distribution={distribution}
            />

          </div>

          {/* Review Form */}

          {isAuthenticated && (
            <div className="shopsphere-review-form-wrapper">

              <ReviewForm
                productId={product._id}
              />

            </div>
          )}

          {!isAuthenticated && (
            <div className="shopsphere-login-review-message">

              <span>
                🔐
              </span>

              <div>
                <strong>
                  Want to write a review?
                </strong>

                <p>
                  Please login to share
                  your experience.
                </p>
              </div>

              <Link
                to="/login"
                className="btn btn-primary"
              >
                Login
              </Link>

            </div>
          )}

          {/* Review List */}

          <div className="shopsphere-review-list-card">

            {reviewsLoading ? (
              <LoadingSpinner
                message="Loading reviews..."
              />
            ) : (
              <ReviewList
                reviews={reviews}
              />
            )}

          </div>

        </section>

        {/* =================================================
            AI REVIEW SUMMARY
        ================================================= */}

        <AIReviewSummary
          productId={product?._id}
        />

        {/* =================================================
            AI RECOMMENDATIONS
        ================================================= */}

        <AIRecommendations
          productId={product?._id}
        />

      </div>

    </div>
  );
};

export default ProductDetails;