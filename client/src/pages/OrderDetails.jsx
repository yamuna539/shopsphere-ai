import { useEffect } from "react";

import {
  Link,
  useParams,
} from "react-router-dom";

import {
  useDispatch,
  useSelector,
} from "react-redux";

import {
  fetchOrderById,
  clearSelectedOrder,
} from "../redux/slices/orderSlice";

import LoadingSpinner from "../components/LoadingSpinner";
import ErrorMessage from "../components/ErrorMessage";


const OrderDetails = () => {
  const { id } = useParams();

  const dispatch = useDispatch();

  const {
    selectedOrder,
    loading,
    error,
  } = useSelector(
    (state) => state.orders
  );


  /* =====================================================
     FETCH ORDER
  ===================================================== */

  useEffect(() => {
    if (id) {
      dispatch(fetchOrderById(id));
    }

    return () => {
      dispatch(clearSelectedOrder());
    };
  }, [dispatch, id]);


  /* =====================================================
     LOADING
  ===================================================== */

  if (loading) {
    return (
      <div className="shopsphere-order-details-page">
        <LoadingSpinner />
      </div>
    );
  }


  /* =====================================================
     ERROR
  ===================================================== */

  if (error) {
    return (
      <div className="shopsphere-order-details-page">

        <div className="container">

          <div className="shopsphere-order-error">

            <div className="shopsphere-order-error-icon">
              !
            </div>

            <h2>
              Unable to Load Order
            </h2>

            <p>
              {error}
            </p>

            <Link
              to="/orders"
              className="shopsphere-order-back-btn"
            >
              ← Back to Orders
            </Link>

          </div>

        </div>

      </div>
    );
  }


  /* =====================================================
     NO ORDER
  ===================================================== */

  if (!selectedOrder) {
    return null;
  }


  /* =====================================================
     ORDER STATUS
  ===================================================== */

  const statuses = [
    "PENDING",
    "CONFIRMED",
    "PROCESSING",
    "SHIPPED",
    "DELIVERED",
  ];


  const currentIndex =
    statuses.indexOf(
      selectedOrder.orderStatus
    );


  /* =====================================================
     RETURN
  ===================================================== */

  return (
    <div className="shopsphere-order-details-page">

      <div className="container">


        {/* =================================================
            HEADER
        ================================================= */}

        <div className="shopsphere-order-details-header">

          <div>

            <span className="shopsphere-order-details-label">
              ORDER INFORMATION
            </span>

            <h1>
              Order Details
            </h1>

            <p>
              Order #{selectedOrder._id}
            </p>

          </div>


          <Link
            to="/orders"
            className="shopsphere-order-back-btn"
          >
            ← Back to Orders
          </Link>

        </div>


        {/* =================================================
            ORDER OVERVIEW
        ================================================= */}

        <div className="shopsphere-order-overview">

          {/* ORDER STATUS */}

          <div className="shopsphere-overview-item">

            <div className="shopsphere-overview-icon">
              📦
            </div>

            <div>

              <span>
                ORDER STATUS
              </span>

              <strong className="shopsphere-overview-status">
                {selectedOrder.orderStatus}
              </strong>

            </div>

          </div>


          {/* PAYMENT STATUS */}

          <div className="shopsphere-overview-item">

            <div className="shopsphere-overview-icon payment">
              💳
            </div>

            <div>

              <span>
                PAYMENT STATUS
              </span>

              <strong
                className={
                  selectedOrder.paymentStatus === "PAID"
                    ? "shopsphere-paid-status"
                    : "shopsphere-pending-status"
                }
              >
                {selectedOrder.paymentStatus}
              </strong>

            </div>

          </div>


          {/* ORDER DATE */}

          <div className="shopsphere-overview-item">

            <div className="shopsphere-overview-icon date">
              📅
            </div>

            <div>

              <span>
                ORDERED ON
              </span>

              <strong>
                {selectedOrder.createdAt
                  ? new Date(
                      selectedOrder.createdAt
                    ).toLocaleDateString(
                      "en-IN",
                      {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      }
                    )
                  : "N/A"}
              </strong>

            </div>

          </div>

        </div>


        {/* =================================================
            HORIZONTAL ORDER TRACKING
        ================================================= */}

        <div className="shopsphere-order-tracking-card">

          <div className="shopsphere-order-tracking-header">

            <div>

              <span className="shopsphere-section-label">
                ORDER PROGRESS
              </span>

              <h3>
                Order Tracking
              </h3>

            </div>


            <span className="shopsphere-current-status">
              {selectedOrder.orderStatus}
            </span>

          </div>


          <div className="shopsphere-order-tracking">

            {statuses.map(
              (status, index) => {

                const completed =
                  currentIndex >= 0 &&
                  index <= currentIndex;

                const isCurrent =
                  status ===
                  selectedOrder.orderStatus;

                const isLast =
                  index ===
                  statuses.length - 1;

                return (
                  <div
                    key={status}
                    className="shopsphere-tracking-step-wrapper"
                  >

                    {/* STEP */}

                    <div
                      className={`shopsphere-tracking-step ${
                        completed
                          ? "completed"
                          : ""
                      } ${
                        isCurrent
                          ? "current"
                          : ""
                      }`}
                    >

                      <div className="shopsphere-tracking-circle">

                        {completed
                          ? "✓"
                          : index + 1}

                      </div>


                      <div className="shopsphere-tracking-label">

                        <strong>
                          {status}
                        </strong>

                        {isCurrent && (
                          <span>
                            Current Status
                          </span>
                        )}

                      </div>

                    </div>


                    {/* CONNECTING LINE */}

                    {!isLast && (
                      <div
                        className={`shopsphere-tracking-line ${
                          index < currentIndex
                            ? "completed"
                            : ""
                        }`}
                      />
                    )}

                  </div>
                );
              }
            )}

          </div>

        </div>


        {/* =================================================
            THREE COLUMN ORDER CONTENT
        ================================================= */}

        <div className="shopsphere-order-content">


          {/* =================================================
              1. ORDERED ITEMS
          ================================================= */}

          <div className="shopsphere-order-items-section">

            <div className="shopsphere-order-section-header">

              <div className="shopsphere-order-section-title">

                <div className="shopsphere-order-section-icon">
                  🛍️
                </div>

                <div>

                  <span>
                    YOUR ORDER
                  </span>

                  <h3>
                    Ordered Items
                  </h3>

                </div>

              </div>


              <div className="shopsphere-items-count">

                {selectedOrder.items?.length || 0}{" "}

                {selectedOrder.items?.length === 1
                  ? "Item"
                  : "Items"}

              </div>

            </div>


            <div className="shopsphere-order-items-list">

              {selectedOrder.items?.map(
                (item, index) => (

                  <div
                    className="shopsphere-order-item"
                    key={
                      item.product?._id ||
                      item.product ||
                      index
                    }
                  >

                    {/* IMAGE */}

                    <div className="shopsphere-order-item-image">

                      {item.image ? (

                        <img
                          src={item.image}
                          alt={
                            item.name ||
                            "Product"
                          }
                        />

                      ) : (

                        <div className="shopsphere-order-no-image">
                          🛍️
                        </div>

                      )}

                    </div>


                    {/* PRODUCT INFO */}

                    <div className="shopsphere-order-item-info">

                      <span className="shopsphere-order-item-category">
                        SHOPSPHERE PRODUCT
                      </span>

                      <h4>
                        {item.name}
                      </h4>

                      <div className="shopsphere-order-item-meta">

                        <span>
                          Qty:{" "}
                          <strong>
                            {item.quantity}
                          </strong>
                        </span>

                        <span className="shopsphere-order-item-dot">
                          •
                        </span>

                        <span>
                          ₹
                          {Number(
                            item.price || 0
                          ).toLocaleString(
                            "en-IN"
                          )}{" "}
                          each
                        </span>

                      </div>

                    </div>


                    {/* ITEM TOTAL */}

                    <div className="shopsphere-order-item-total">

                      <span>
                        Total
                      </span>

                      <strong>
                        ₹
                        {(
                          Number(
                            item.price || 0
                          ) *
                          Number(
                            item.quantity || 0
                          )
                        ).toLocaleString(
                          "en-IN"
                        )}
                      </strong>

                    </div>

                  </div>

                )
              )}

            </div>

          </div>


          {/* =================================================
              2. PRICE SUMMARY
          ================================================= */}

          <div className="shopsphere-price-card">

            <div className="shopsphere-price-card-header">

              <div className="shopsphere-price-icon">
                🧾
              </div>

              <div>

                <span>
                  PAYMENT
                </span>

                <h3>
                  Price Summary
                </h3>

              </div>

            </div>


            <div className="shopsphere-price-rows">

              {/* SUBTOTAL */}

              <div className="shopsphere-price-row">

                <span>
                  Subtotal
                </span>

                <strong>
                  ₹
                  {Number(
                    selectedOrder.subtotal || 0
                  ).toLocaleString(
                    "en-IN"
                  )}
                </strong>

              </div>


              {/* TAX */}

              <div className="shopsphere-price-row">

                <span>
                  Tax
                </span>

                <strong>
                  ₹
                  {Number(
                    selectedOrder.tax || 0
                  ).toLocaleString(
                    "en-IN"
                  )}
                </strong>

              </div>


              {/* SHIPPING */}

              <div className="shopsphere-price-row">

                <span>
                  Shipping
                </span>

                <strong className="shopsphere-free-shipping">

                  {Number(
                    selectedOrder.shippingFee || 0
                  ) === 0
                    ? "FREE"
                    : `₹${Number(
                        selectedOrder.shippingFee || 0
                      ).toLocaleString(
                        "en-IN"
                      )}`}

                </strong>

              </div>

            </div>


            <div className="shopsphere-price-divider"></div>


            {/* TOTAL */}

            <div className="shopsphere-price-total">

              <span>
                Total Amount
              </span>

              <strong>
                ₹
                {Number(
                  selectedOrder.totalAmount || 0
                ).toLocaleString(
                  "en-IN"
                )}
              </strong>

            </div>


            {/* PAYMENT BADGE */}

            <div className="shopsphere-payment-badge">

              <span className="shopsphere-payment-check">
                ✓
              </span>

              <div>

                <strong>
                  Payment{" "}
                  {selectedOrder.paymentStatus}
                </strong>

                <small>
                  Payment securely processed
                </small>

              </div>

            </div>

          </div>


          {/* =================================================
              3. SHIPPING ADDRESS
          ================================================= */}

          <div className="shopsphere-address-card">

            <div className="shopsphere-address-header">

              <div className="shopsphere-address-icon">
                📍
              </div>

              <div>

                <span>
                  DELIVERY
                </span>

                <h3>
                  Shipping Address
                </h3>

              </div>

            </div>


            <div className="shopsphere-address-body">

              <h4>
                {
                  selectedOrder
                    .shippingAddress
                    ?.fullName
                }
              </h4>


              <p>
                {
                  selectedOrder
                    .shippingAddress
                    ?.address
                }
              </p>


              <p>

                {
                  selectedOrder
                    .shippingAddress
                    ?.city
                }

                {", "}

                {
                  selectedOrder
                    .shippingAddress
                    ?.state
                }

              </p>


              <p>
                {
                  selectedOrder
                    .shippingAddress
                    ?.postalCode
                }
              </p>


              <div className="shopsphere-address-phone">

                <span>
                  ☎
                </span>

                <span>
                  {
                    selectedOrder
                      .shippingAddress
                      ?.phone
                  }
                </span>

              </div>

            </div>

          </div>


        </div>


        {/* =================================================
            BOTTOM ACTIONS
        ================================================= */}

        <div className="shopsphere-order-bottom-actions">

          <Link
            to="/orders"
            className="shopsphere-order-secondary-btn"
          >
            ← My Orders
          </Link>


          <Link
            to="/products"
            className="shopsphere-order-primary-btn"
          >
            Continue Shopping →
          </Link>

        </div>


      </div>

    </div>
  );
};


export default OrderDetails;