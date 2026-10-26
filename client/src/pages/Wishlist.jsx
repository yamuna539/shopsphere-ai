import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  FaHeart,
  FaTrashAlt,
  FaShoppingCart,
  FaArrowLeft,
  FaStar,
} from "react-icons/fa";

import {
  fetchWishlist,
  removeWishlistItem,
  clearWishlistItems,
} from "../redux/slices/wishlistSlice";

import {
  addCartItem,
} from "../redux/slices/cartSlice";

import LoadingSpinner from "../components/LoadingSpinner";

function Wishlist() {
  const dispatch = useDispatch();

  const {
    products,
    loading,
    actionLoading,
    error,
  } = useSelector(
    (state) => state.wishlist
  );

  useEffect(() => {
    dispatch(fetchWishlist());
  }, [dispatch]);

  const handleRemove = (productId) => {
    dispatch(
      removeWishlistItem(productId)
    );
  };

  const handleMoveToCart = async (productId) => {
    const result = await dispatch(
      addCartItem({
        productId,
        quantity: 1,
      })
    );

    /*
     * Remove from wishlist only when
     * adding to cart succeeds.
     */
    if (
      addCartItem.fulfilled.match(result)
    ) {
      dispatch(
        removeWishlistItem(productId)
      );
    }
  };

  if (loading) {
    return (
      <div className="shopsphere-wishlist-page">
        <div className="container py-5">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  return (
    <div className="shopsphere-wishlist-page">
      <div className="container py-5">

        {/* =================================================
            HEADER
        ================================================= */}

        <div className="shopsphere-wishlist-header">

          <div>
            <span className="shopsphere-wishlist-label">
              SAVED ITEMS
            </span>

            <h1>
              My Wishlist
            </h1>

            <p>
              {products.length} saved product
              {products.length !== 1
                ? "s"
                : ""}
            </p>
          </div>

          {products.length > 0 && (
            <button
              type="button"
              className="shopsphere-clear-wishlist-btn"
              disabled={actionLoading}
              onClick={() =>
                dispatch(
                  clearWishlistItems()
                )
              }
            >
              <FaTrashAlt />
              Clear Wishlist
            </button>
          )}

        </div>


        {/* =================================================
            ERROR
        ================================================= */}

        {error && (
          <div className="shopsphere-wishlist-error">
            {error}
          </div>
        )}


        {/* =================================================
            EMPTY WISHLIST
        ================================================= */}

        {products.length === 0 ? (
          <div className="shopsphere-empty-wishlist">

            <div className="shopsphere-empty-wishlist-icon">
              <FaHeart />
            </div>

            <h2>
              Your wishlist is empty
            </h2>

            <p>
              Save products you love and
              come back to them anytime.
            </p>

            <Link
              to="/products"
              className="shopsphere-wishlist-explore-btn"
            >
              <FaArrowLeft />
              Explore Products
            </Link>

          </div>
        ) : (

          /* =================================================
             PRODUCTS
          ================================================= */

          <div className="row g-4">

            {products.map((product) => {

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

              return (
                <div
                  className="col-12 col-sm-6 col-lg-4 col-xl-3"
                  key={product._id}
                >

                  <div className="shopsphere-wishlist-card">

                    {/* ==============================
                        IMAGE
                    ============================== */}

                    <div className="shopsphere-wishlist-image-wrapper">

                      {hasDiscount && (
                        <span className="shopsphere-wishlist-discount">
                          {discountPercentage}% OFF
                        </span>
                      )}

                      <button
                        type="button"
                        className="shopsphere-wishlist-remove-icon"
                        disabled={actionLoading}
                        onClick={() =>
                          handleRemove(
                            product._id
                          )
                        }
                        aria-label={`Remove ${product.name} from wishlist`}
                      >
                        <FaHeart />
                      </button>

                      <Link
                        to={`/products/${product._id}`}
                      >
                        <img
                          src={
                            product.images?.[0] ||
                            "https://placehold.co/600x400?text=ShopSphere"
                          }
                          alt={product.name}
                          className="shopsphere-wishlist-image"
                        />
                      </Link>

                    </div>


                    {/* ==============================
                        CONTENT
                    ============================== */}

                    <div className="shopsphere-wishlist-content">

                      {product.category && (
                        <span className="shopsphere-wishlist-category">
                          {product.category.name}
                        </span>
                      )}

                      <Link
                        to={`/products/${product._id}`}
                        className="shopsphere-wishlist-name"
                      >
                        {product.name}
                      </Link>

                      {/* Rating */}

                      {product.rating !== undefined && (
                        <div className="shopsphere-wishlist-rating">

                          <FaStar />

                          <span>
                            {Number(
                              product.rating
                            ).toFixed(1)}
                          </span>

                          {product.numReviews !==
                            undefined && (
                            <span className="shopsphere-wishlist-review-count">
                              ({product.numReviews})
                            </span>
                          )}

                        </div>
                      )}


                      {/* Price */}

                      <div className="shopsphere-wishlist-price-row">

                        <span className="shopsphere-wishlist-price">
                          ₹
                          {Number(
                            product.price
                          ).toLocaleString(
                            "en-IN"
                          )}
                        </span>

                        {hasDiscount && (
                          <span className="shopsphere-wishlist-original-price">
                            ₹
                            {Number(
                              product.originalPrice
                            ).toLocaleString(
                              "en-IN"
                            )}
                          </span>
                        )}

                      </div>


                      {/* Stock */}

                      {product.stock <= 0 ? (
                        <span className="shopsphere-wishlist-stock out">
                          Out of Stock
                        </span>
                      ) : (
                        <span className="shopsphere-wishlist-stock">
                          <span className="shopsphere-wishlist-stock-dot" />
                          In Stock
                        </span>
                      )}


                      {/* Actions */}

                      <div className="shopsphere-wishlist-actions">

                        <button
                          type="button"
                          className="shopsphere-move-cart-btn"
                          disabled={
                            product.stock <= 0 ||
                            actionLoading
                          }
                          onClick={() =>
                            handleMoveToCart(
                              product._id
                            )
                          }
                        >
                          <FaShoppingCart />
                          Move to Cart
                        </button>

                        <button
                          type="button"
                          className="shopsphere-remove-wishlist-btn"
                          disabled={actionLoading}
                          onClick={() =>
                            handleRemove(
                              product._id
                            )
                          }
                          aria-label="Remove from wishlist"
                        >
                          <FaTrashAlt />
                        </button>

                      </div>

                    </div>

                  </div>

                </div>
              );
            })}

          </div>
        )}


        {/* =================================================
            CONTINUE SHOPPING
        ================================================= */}

        {products.length > 0 && (
          <div className="shopsphere-wishlist-footer">

            <Link
              to="/products"
              className="shopsphere-wishlist-continue"
            >
              <FaArrowLeft />
              Continue Shopping
            </Link>

          </div>
        )}

      </div>
    </div>
  );
}

export default Wishlist;