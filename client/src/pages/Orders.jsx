import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  FaBoxOpen,
  FaShoppingBag,
  FaArrowRight,
  FaCalendarAlt,
  FaCreditCard,
  FaTruck,
  FaCheckCircle,
  FaClock,
  FaTimesCircle,
} from "react-icons/fa";

import {
  fetchMyOrders,
  clearOrderError,
} from "../redux/slices/orderSlice";

const Orders = () => {
  const dispatch = useDispatch();

  const {
    orders,
    loading,
    error,
  } = useSelector((state) => state.orders);

  useEffect(() => {
    dispatch(fetchMyOrders());

    return () => {
      dispatch(clearOrderError());
    };
  }, [dispatch]);

  const getStatusIcon = (status) => {
    switch (status) {
      case "PAID":
      case "CONFIRMED":
      case "DELIVERED":
        return <FaCheckCircle />;

      case "PROCESSING":
      case "SHIPPED":
        return <FaTruck />;

      case "PENDING":
        return <FaClock />;

      case "CANCELLED":
        return <FaTimesCircle />;

      default:
        return <FaBoxOpen />;
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "PAID":
      case "CONFIRMED":
      case "DELIVERED":
        return "success";

      case "PROCESSING":
      case "SHIPPED":
        return "processing";

      case "PENDING":
        return "pending";

      case "CANCELLED":
        return "cancelled";

      default:
        return "default";
    }
  };

  const formatDate = (date) => {
    if (!date) return "N/A";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="shopsphere-orders-page">
        <div className="shopsphere-orders-loading">
          <div className="shopsphere-orders-spinner"></div>

          <h3>Loading your orders...</h3>

          <p>
            Please wait while we fetch your order history.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="shopsphere-orders-page">
      <div className="container">

        {/* PAGE HEADER */}
        <div className="shopsphere-orders-header">
          <div>
            <span className="shopsphere-orders-label">
              MY ACCOUNT
            </span>

            <h1>My Orders</h1>

            <p>
              Track and manage all your ShopSphere orders.
            </p>
          </div>

          <Link
            to="/products"
            className="shopsphere-orders-shop-btn"
          >
            <FaShoppingBag />
            Continue Shopping
          </Link>
        </div>

        {/* ERROR */}
        {error && (
          <div className="shopsphere-orders-error">
            <strong>Unable to load orders</strong>
            <span>{error}</span>
          </div>
        )}

        {/* EMPTY ORDERS */}
        {!error && (!orders || orders.length === 0) && (
          <div className="shopsphere-orders-empty">
            <div className="shopsphere-orders-empty-icon">
              <FaBoxOpen />
            </div>

            <h2>No Orders Yet</h2>

            <p>
              You haven't placed any orders yet.
              Start shopping and your orders will appear here.
            </p>

            <Link
              to="/products"
              className="shopsphere-orders-empty-btn"
            >
              <FaShoppingBag />
              Start Shopping
              <FaArrowRight />
            </Link>
          </div>
        )}

        {/* ORDERS LIST */}
        {orders && orders.length > 0 && (
          <div className="shopsphere-orders-list">

            {orders.map((order) => {
              const statusClass = getStatusClass(
                order.orderStatus
              );

              return (
                <div
                  className="shopsphere-order-card"
                  key={order._id}
                >

                  {/* ORDER HEADER */}
                  <div className="shopsphere-order-card-header">

                    <div className="shopsphere-order-info">

                      <div className="shopsphere-order-icon">
                        <FaBoxOpen />
                      </div>

                      <div>
                        <span>Order ID</span>

                        <strong>
                          #{order._id}
                        </strong>
                      </div>

                    </div>

                    <div
                      className={`shopsphere-order-status ${statusClass}`}
                    >
                      {getStatusIcon(order.orderStatus)}

                      <span>
                        {order.orderStatus || "PENDING"}
                      </span>
                    </div>

                  </div>

                  {/* ORDER DETAILS */}
                  <div className="shopsphere-order-meta">

                    <div className="shopsphere-order-meta-item">
                      <FaCalendarAlt />

                      <div>
                        <span>Order Date</span>

                        <strong>
                          {formatDate(
                            order.createdAt
                          )}
                        </strong>
                      </div>
                    </div>

                    <div className="shopsphere-order-meta-item">
                      <FaCreditCard />

                      <div>
                        <span>Payment</span>

                        <strong>
                          {order.paymentStatus || "PENDING"}
                        </strong>
                      </div>
                    </div>

                    <div className="shopsphere-order-meta-item">
                      <FaBoxOpen />

                      <div>
                        <span>Items</span>

                        <strong>
                          {order.items?.length || 0}{" "}
                          {order.items?.length === 1
                            ? "item"
                            : "items"}
                        </strong>
                      </div>
                    </div>

                    <div className="shopsphere-order-meta-item">

                      <FaCreditCard />

                      <div>
                        <span>Total Amount</span>

                        <strong className="shopsphere-order-total">
                          ₹
                          {Number(
                            order.totalAmount || 0
                          ).toLocaleString("en-IN")}
                        </strong>
                      </div>

                    </div>

                  </div>

                  {/* PRODUCT PREVIEW */}
                  {order.items && order.items.length > 0 && (
                    <div className="shopsphere-order-products">

                      {order.items
                        .slice(0, 3)
                        .map((item, index) => (
                          <div
                            className="shopsphere-order-product"
                            key={
                              item._id ||
                              item.product?._id ||
                              index
                            }
                          >

                            <div className="shopsphere-order-product-image">

                              {item.product?.image ? (
                                <img
                                  src={item.product.image}
                                  alt={
                                    item.product?.name ||
                                    "Product"
                                  }
                                />
                              ) : (
                                <FaShoppingBag />
                              )}

                            </div>

                            <div className="shopsphere-order-product-info">

                              <strong>
                                {item.product?.name ||
                                  item.name ||
                                  "Product"}
                              </strong>

                              <span>
                                Qty: {item.quantity || 1}
                              </span>

                            </div>

                          </div>
                        ))}

                      {order.items.length > 3 && (
                        <div className="shopsphere-more-items">
                          +{order.items.length - 3} more
                        </div>
                      )}

                    </div>
                  )}

                  {/* FOOTER */}
                  <div className="shopsphere-order-card-footer">

                    <div className="shopsphere-order-footer-note">
                      <FaTruck />

                      <span>
                        {order.orderStatus === "DELIVERED"
                          ? "Order delivered successfully"
                          : order.orderStatus === "SHIPPED"
                          ? "Your order is on the way"
                          : "Order is being processed"}
                      </span>
                    </div>

                    <Link
                      to={`/orders/${order._id}`}
                      className="shopsphere-order-details-btn"
                    >
                      View Details
                      <FaArrowRight />
                    </Link>

                  </div>

                </div>
              );
            })}

          </div>
        )}

      </div>
    </div>
  );
};

export default Orders;