import { useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";

import {
  FaShoppingCart,
  FaHeart,
  FaRegHeart,
  FaBalanceScale,
  FaCheck,
} from "react-icons/fa";

import {
  addWishlistItem,
} from "../redux/slices/wishlistSlice";

import {
  addCartItem,
} from "../redux/slices/cartSlice";

import Rating from "./Rating";

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();

  /* =====================================================
     COMPARE SELECTION
  ===================================================== */

  const [isSelectedForCompare, setIsSelectedForCompare] =
    useState(() => {
      try {
        const stored = JSON.parse(
          localStorage.getItem("compareProducts") || "[]"
        );

        return stored.includes(product._id);
      } catch {
        return false;
      }
    });

  /* =====================================================
     WISHLIST STATE
  ===================================================== */

  const [isWishlistClicked, setIsWishlistClicked] =
    useState(false);

  /* =====================================================
     PRODUCT DATA
  ===================================================== */

  const image =
    product.images?.[0] || "";

  const isInStock = product.stock > 0;

  const hasDiscount =
    product.originalPrice &&
    product.originalPrice > product.price;

  const discountPercentage = hasDiscount
    ? Math.round(
        ((product.originalPrice - product.price) /
          product.originalPrice) *
          100
      )
    : 0;

  /* =====================================================
     ADD TO CART
  ===================================================== */

  const handleAddToCart = (event) => {
    event.preventDefault();
    event.stopPropagation();

    if (!isInStock) {
      return;
    }

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

  const handleAddToWishlist = (event) => {
    event.preventDefault();
    event.stopPropagation();

    dispatch(
      addWishlistItem(product._id)
    );

    setIsWishlistClicked(true);

    /*
      Return the icon to normal after a short time.
      The backend wishlist state remains unchanged.
    */
    setTimeout(() => {
      setIsWishlistClicked(false);
    }, 1200);
  };

  /* =====================================================
     COMPARE
  ===================================================== */

  const handleCompareChange = (event) => {
    event.preventDefault();
    event.stopPropagation();

    const compareIds =
      JSON.parse(
        localStorage.getItem(
          "compareProducts"
        ) || "[]"
      );

    if (!isSelectedForCompare) {

      /*
        Maximum 4 products
      */

      if (compareIds.length >= 4) {
        alert(
          "You can compare up to 4 products."
        );

        return;
      }

      /*
        Add product
      */

      if (!compareIds.includes(product._id)) {
        compareIds.push(product._id);
      }

      setIsSelectedForCompare(true);

    } else {

      /*
        Remove product
      */

      const index =
        compareIds.indexOf(product._id);

      if (index !== -1) {
        compareIds.splice(index, 1);
      }

      setIsSelectedForCompare(false);
    }

    /*
      Save selected IDs
    */

    localStorage.setItem(
      "compareProducts",
      JSON.stringify(compareIds)
    );

    /*
      Notify Navbar
    */

    window.dispatchEvent(
      new Event("compareProductsChanged")
    );
  };

  return (
    <article className="shopsphere-product-card">

      {/* =================================================
          IMAGE SECTION
      ================================================= */}

      <div className="shopsphere-product-image-wrapper">

        <Link
          to={`/products/${product._id}`}
          className="shopsphere-product-image-link"
        >

          {image ? (
            <img
              src={image}
              alt={product.name}
              className="shopsphere-product-image"
              loading="lazy"
            />
          ) : (
            <div className="shopsphere-product-image-placeholder">
              <span>
                🛍️
              </span>

              <small>
                {product.name}
              </small>
            </div>
          )}

        </Link>

        {/* =================================================
            DISCOUNT
        ================================================= */}

        {hasDiscount && (
          <span className="shopsphere-discount-badge">
            {discountPercentage}% OFF
          </span>
        )}

        {/* =================================================
            OUT OF STOCK
        ================================================= */}

        {!isInStock && (
          <span className="shopsphere-stock-badge">
            Out of Stock
          </span>
        )}

        {/* =================================================
            TOP ACTIONS
        ================================================= */}

        <div className="shopsphere-product-actions">

          {/* Wishlist */}

          <button
            type="button"
            className={`shopsphere-icon-btn ${
              isWishlistClicked
                ? "wishlist-clicked"
                : ""
            }`}
            onClick={handleAddToWishlist}
            aria-label="Add to wishlist"
            title="Add to Wishlist"
          >
            {isWishlistClicked ? (
              <FaHeart />
            ) : (
              <FaRegHeart />
            )}
          </button>

          {/* Compare */}

          <button
            type="button"
            className={`shopsphere-icon-btn ${
              isSelectedForCompare
                ? "compare-selected"
                : ""
            }`}
            onClick={handleCompareChange}
            aria-label={
              isSelectedForCompare
                ? "Remove from compare"
                : "Add to compare"
            }
            title={
              isSelectedForCompare
                ? "Remove from Compare"
                : "Add to Compare"
            }
          >
            {isSelectedForCompare ? (
              <FaCheck />
            ) : (
              <FaBalanceScale />
            )}
          </button>

        </div>

      </div>

      {/* =================================================
          PRODUCT CONTENT
      ================================================= */}

      <div className="shopsphere-product-content">

        {/* Category */}

        <div className="shopsphere-product-category">
          {product.category?.name ||
            "Uncategorized"}
        </div>

        {/* Product Name */}

        <Link
          to={`/products/${product._id}`}
          className="shopsphere-product-name-link"
        >
          <h3 className="shopsphere-product-name">
            {product.name}
          </h3>
        </Link>

        {/* Description */}

        <p className="shopsphere-product-description">
          {product.description?.length > 85
            ? `${product.description.slice(
                0,
                85
              )}...`
            : product.description}
        </p>

        {/* Rating */}

        <div className="shopsphere-product-rating">

          <Rating
            rating={product.rating || 0}
            numReviews={
              product.numReviews || 0
            }
          />

        </div>

        {/* =================================================
            PRICE
        ================================================= */}

        <div className="shopsphere-product-price-row">

          <span className="shopsphere-product-price">
            ₹
            {Number(
              product.price
            ).toLocaleString("en-IN")}
          </span>

          {hasDiscount && (
            <span className="shopsphere-product-original-price">
              ₹
              {Number(
                product.originalPrice
              ).toLocaleString("en-IN")}
            </span>
          )}

        </div>

        {/* =================================================
            STOCK INFO
        ================================================= */}

        <div className="shopsphere-stock-info">

          {isInStock ? (
            <>
              <span className="stock-dot"></span>

              <span>
                In stock
              </span>
            </>
          ) : (
            <span className="out-stock-text">
              Currently unavailable
            </span>
          )}

        </div>

        {/* =================================================
            ADD TO CART
        ================================================= */}

        <button
          type="button"
          className="shopsphere-add-cart-btn"
          onClick={handleAddToCart}
          disabled={!isInStock}
        >

          {isInStock ? (
            <>
              <FaShoppingCart />

              <span>
                Add to Cart
              </span>
            </>
          ) : (
            <span>
              Out of Stock
            </span>
          )}

        </button>

      </div>

    </article>
  );
};

export default ProductCard;