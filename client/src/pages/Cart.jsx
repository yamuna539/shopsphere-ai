import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  FaShoppingBag,
  FaTrashAlt,
  FaArrowLeft,
  FaLock,
  FaArrowRight,
} from "react-icons/fa";

import CartItem from "../components/CartItem";
import LoadingSpinner from "../components/LoadingSpinner";

import {
  fetchCart,
  clearCartItems,
} from "../redux/slices/cartSlice";

function Cart() {
  const dispatch = useDispatch();

  const {
    items,
    subtotal,
    tax,
    shippingFee,
    totalAmount,
    loading,
    actionLoading,
    error,
  } = useSelector((state) => state.cart);

  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  if (loading) {
    return (
      <div className="shopsphere-cart-page">
        <div className="container py-5">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  return (
    <div className="shopsphere-cart-page">
      <div className="container py-5">

        {/* =====================================================
            PAGE HEADER
        ===================================================== */}

        <div className="shopsphere-cart-header">
          <div>
            <span className="shopsphere-cart-label">
              SHOPPING BAG
            </span>

            <h1>
              Your Shopping Cart
            </h1>

            <p>
              {items.length} product
              {items.length !== 1 ? "s" : ""} in your cart
            </p>
          </div>

          {items.length > 0 && (
            <button
              type="button"
              className="shopsphere-clear-cart-btn"
              onClick={() =>
                dispatch(clearCartItems())
              }
              disabled={actionLoading}
            >
              <FaTrashAlt />
              Clear Cart
            </button>
          )}
        </div>


        {/* =====================================================
            ERROR
        ===================================================== */}

        {error && (
          <div className="shopsphere-cart-error">
            {error}
          </div>
        )}


        {/* =====================================================
            EMPTY CART
        ===================================================== */}

        {items.length === 0 ? (
          <div className="shopsphere-empty-cart">

            <div className="shopsphere-empty-cart-icon">
              <FaShoppingBag />
            </div>

            <h2>
              Your cart is empty
            </h2>

            <p>
              Looks like you haven't added anything
              to your cart yet.
            </p>

            <Link
              to="/products"
              className="shopsphere-empty-cart-btn"
            >
              <FaArrowLeft />
              Continue Shopping
            </Link>

          </div>
        ) : (

          /* =====================================================
             CART CONTENT
          ===================================================== */

          <div className="row g-4">

            {/* =================================================
                CART ITEMS
            ================================================= */}

            <div className="col-12 col-lg-8">

              <div className="shopsphere-cart-items-card">

                <div className="shopsphere-cart-items-header">

                  <div>
                    <h3>
                      Cart Items
                    </h3>

                    <p>
                      Review your selected products
                    </p>
                  </div>

                  <div className="shopsphere-items-count">
                    {items.length}{" "}
                    {items.length === 1
                      ? "Item"
                      : "Items"}
                  </div>

                </div>


                <div className="shopsphere-cart-items-list">

                  {items.map((item) => (
                    <div
                      className="shopsphere-cart-item-wrapper"
                      key={item._id}
                    >
                      <CartItem item={item} />
                    </div>
                  ))}

                </div>


                {/* Continue Shopping */}

                <div className="shopsphere-cart-footer">

                  <Link
                    to="/products"
                    className="shopsphere-continue-cart"
                  >
                    <FaArrowLeft />
                    Continue Shopping
                  </Link>

                </div>

              </div>

            </div>


            {/* =================================================
                ORDER SUMMARY
            ================================================= */}

            <div className="col-12 col-lg-4">

              <div className="shopsphere-order-summary">

                <div className="shopsphere-summary-header">
                  <span className="shopsphere-summary-icon">
                    🛍️
                  </span>

                  <div>
                    <span>
                      ORDER SUMMARY
                    </span>

                    <h3>
                      Your Order
                    </h3>
                  </div>
                </div>


                {/* Subtotal */}

                <div className="shopsphere-summary-row">
                  <span>
                    Subtotal
                  </span>

                  <strong>
                    ₹
                    {Number(subtotal).toLocaleString(
                      "en-IN"
                    )}
                  </strong>
                </div>


                {/* Tax */}

                <div className="shopsphere-summary-row">
                  <span>
                    Tax
                  </span>

                  <strong>
                    ₹
                    {Number(tax).toLocaleString(
                      "en-IN"
                    )}
                  </strong>
                </div>


                {/* Shipping */}

                <div className="shopsphere-summary-row">
                  <span>
                    Shipping
                  </span>

                  <strong
                    className={
                      shippingFee === 0
                        ? "shopsphere-free-shipping"
                        : ""
                    }
                  >
                    {shippingFee === 0
                      ? "FREE"
                      : `₹${Number(
                          shippingFee
                        ).toLocaleString(
                          "en-IN"
                        )}`}
                  </strong>
                </div>


                {/* Free Shipping Message */}

                {shippingFee === 0 && (
                  <div className="shopsphere-free-shipping-box">
                    ✓ You qualify for free shipping
                  </div>
                )}


                <div className="shopsphere-summary-divider" />


                {/* Total */}

                <div className="shopsphere-total-row">
                  <span>
                    Total
                  </span>

                  <strong>
                    ₹
                    {Number(totalAmount).toLocaleString(
                      "en-IN"
                    )}
                  </strong>
                </div>


                {/* Checkout */}

                <Link
                  to="/checkout"
                  className="shopsphere-checkout-btn"
                >
                  Proceed to Checkout
                  <FaArrowRight />
                </Link>


                {/* Secure checkout */}

                <div className="shopsphere-secure-checkout">
                  <FaLock />

                  <span>
                    Secure checkout
                  </span>
                </div>

              </div>


              {/* Payment reassurance */}

              <div className="shopsphere-cart-note">

                <span>
                  🔒
                </span>

                <div>
                  <strong>
                    Safe & Secure Shopping
                  </strong>

                  <p>
                    Your payment information is
                    protected with secure checkout.
                  </p>
                </div>

              </div>

            </div>

          </div>
        )}

      </div>
    </div>
  );
}

export default Cart;