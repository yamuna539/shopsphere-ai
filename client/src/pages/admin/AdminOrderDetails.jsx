import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Package,
  User,
  MapPin,
  CreditCard,
  Truck,
  CheckCircle2,
  Clock3,
  RefreshCw,
  XCircle,
} from "lucide-react";

import api from "../../services/api";

const AdminOrderDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [order, setOrder] = useState(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [updating, setUpdating] =
    useState(false);

  const [success, setSuccess] =
    useState("");

  /*
  ==================================================
  FETCH ORDER
  ==================================================
  */

  const fetchOrder = async () => {
    try {
      setLoading(true);
      setError("");

      const response =
        await api.get(
          `/admin/orders/${id}`
        );

      const orderData =
        response.data.data ||
        response.data.order ||
        response.data;

      setOrder(orderData);
    } catch (error) {
      console.error(
        "Failed to fetch order:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to load order details"
      );
    } finally {
      setLoading(false);
    }
  };

  /*
  ==================================================
  INITIAL LOAD
  ==================================================
  */

  useEffect(() => {
    fetchOrder();
  }, [id]);

  /*
  ==================================================
  FORMAT DATE
  ==================================================
  */

  const formatDate = (date) => {
    if (!date) {
      return "—";
    }

    return new Date(date).toLocaleString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }
    );
  };

  /*
  ==================================================
  FORMAT MONEY
  ==================================================
  */

  const formatAmount = (amount) => {
    return `₹${Number(
      amount || 0
    ).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  /*
  ==================================================
  CUSTOMER
  ==================================================
  */

  const getCustomerName = () => {
    return (
      order?.user?.name ||
      order?.shippingAddress?.fullName ||
      order?.fullName ||
      "Customer"
    );
  };

  const getCustomerEmail = () => {
    return (
      order?.user?.email ||
      order?.email ||
      "—"
    );
  };

  /*
  ==================================================
  STATUS CLASS
  ==================================================
  */

  const getStatusClass = (status) => {
    switch (status) {
      case "PENDING":
        return "pending";

      case "CONFIRMED":
        return "confirmed";

      case "PROCESSING":
        return "processing";

      case "SHIPPED":
        return "shipped";

      case "DELIVERED":
        return "delivered";

      case "CANCELLED":
        return "cancelled";

      default:
        return "default";
    }
  };

  /*
  ==================================================
  STATUS ICON
  ==================================================
  */

  const getStatusIcon = (status) => {
    switch (status) {
      case "PENDING":
        return <Clock3 size={15} />;

      case "CONFIRMED":
        return <CheckCircle2 size={15} />;

      case "PROCESSING":
        return <Package size={15} />;

      case "SHIPPED":
        return <Truck size={15} />;

      case "DELIVERED":
        return <CheckCircle2 size={15} />;

      case "CANCELLED":
        return <XCircle size={15} />;

      default:
        return <Package size={15} />;
    }
  };

  /*
  ==================================================
  UPDATE STATUS
  ==================================================
  */

  const handleStatusChange = async (
    event
  ) => {
    const newStatus =
      event.target.value;

    if (
      !newStatus ||
      newStatus === order.orderStatus
    ) {
      return;
    }

    try {
      setUpdating(true);
      setError("");
      setSuccess("");

      const response =
        await api.patch(
          `/admin/orders/${id}/status`,
          {
            orderStatus: newStatus,
          }
        );

      const updatedOrder =
        response.data.data ||
        response.data.order;

      if (updatedOrder) {
        setOrder(updatedOrder);
      } else {
        setOrder((previous) => ({
          ...previous,
          orderStatus: newStatus,
        }));
      }

      setSuccess(
        `Order status updated to ${newStatus}.`
      );
    } catch (error) {
      console.error(
        "Order status update error:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to update order status"
      );
    } finally {
      setUpdating(false);
    }
  };

  /*
  ==================================================
  LOADING
  ==================================================
  */

  if (loading) {
    return (
      <div className="admin-order-details-loading">

        <div className="admin-order-details-loading-icon">
          <RefreshCw size={21} />
        </div>

        <h4>
          Loading Order
        </h4>

        <p>
          Fetching order details...
        </p>

      </div>
    );
  }

  /*
  ==================================================
  ERROR / NO ORDER
  ==================================================
  */

  if (!order) {
    return (
      <div className="admin-order-details-page">

        <button
          type="button"
          className="admin-order-back-button"
          onClick={() =>
            navigate("/admin/orders")
          }
        >
          <ArrowLeft size={15} />
          Back to Orders
        </button>

        <div className="admin-order-details-error">

          <div className="admin-order-details-error-icon">
            !
          </div>

          <h3>
            Order Not Found
          </h3>

          <p>
            {error ||
              "The requested order could not be found."}
          </p>

          <button
            type="button"
            onClick={() =>
              navigate("/admin/orders")
            }
          >
            Back to Orders
          </button>

        </div>

      </div>
    );
  }

  const shipping =
    order.shippingAddress || {};

  const items =
    order.items || [];

  const orderStatus =
    order.orderStatus || "PENDING";

  const paymentStatus =
    order.paymentStatus || "PENDING";

  /*
  ==================================================
  UI
  ==================================================
  */

  return (
    <div className="admin-order-details-page">

      {/* =========================================
          HEADER
      ========================================= */}

      <div className="admin-order-details-header">

        <div>

          <button
            type="button"
            className="admin-order-back-button"
            onClick={() =>
              navigate("/admin/orders")
            }
          >
            <ArrowLeft size={15} />
            Back to Orders
          </button>

          <span className="admin-order-details-eyebrow">
            ORDER MANAGEMENT
          </span>

          <h1>
            Order Details
          </h1>

          <p>
            Order #
            {String(order._id).slice(-8)}
          </p>

        </div>

        <div
          className={`admin-order-details-status ${getStatusClass(
            orderStatus
          )}`}
        >
          {getStatusIcon(orderStatus)}
          {orderStatus}
        </div>

      </div>

      {/* =========================================
          ALERTS
      ========================================= */}

      {error && (
        <div className="admin-order-details-alert error">
          <strong>
            Error:
          </strong>

          <span>
            {error}
          </span>
        </div>
      )}

      {success && (
        <div className="admin-order-details-alert success">
          <strong>
            Success:
          </strong>

          <span>
            {success}
          </span>
        </div>
      )}

      {/* =========================================
          STATUS UPDATE
      ========================================= */}

      <div className="admin-order-status-card">

        <div className="admin-order-status-card-left">

          <div className="admin-order-status-icon">
            <Truck size={19} />
          </div>

          <div>

            <h3>
              Order Status
            </h3>

            <p>
              Update the fulfillment status
              of this order.
            </p>

          </div>

        </div>

        <div className="admin-order-status-control">

          <label htmlFor="orderStatus">
            Current Status
          </label>

          <select
            id="orderStatus"
            value={orderStatus}
            onChange={
              handleStatusChange
            }
            disabled={
              updating ||
              paymentStatus !== "PAID"
            }
          >

            <option value="PENDING">
              Pending
            </option>

            <option value="CONFIRMED">
              Confirmed
            </option>

            <option value="PROCESSING">
              Processing
            </option>

            <option value="SHIPPED">
              Shipped
            </option>

            <option value="DELIVERED">
              Delivered
            </option>

            <option value="CANCELLED">
              Cancelled
            </option>

          </select>

          {updating && (
            <span>
              Updating...
            </span>
          )}

        </div>

      </div>

      {paymentStatus !== "PAID" && (
        <div className="admin-order-payment-warning">
          <CreditCard size={15} />

          <span>
            Order status updates are disabled
            until payment is completed.
          </span>
        </div>
      )}

      {/* =========================================
          THREE COLUMNS
      ========================================= */}

      <div className="admin-order-info-grid">

        {/* CUSTOMER */}

        <div className="admin-order-info-card">

          <div className="admin-order-info-header">

            <div className="admin-order-info-icon purple">
              <User size={17} />
            </div>

            <div>
              <h3>
                Customer
              </h3>

              <span>
                Customer information
              </span>
            </div>

          </div>

          <div className="admin-order-info-content">

            <strong>
              {getCustomerName()}
            </strong>

            <span>
              {getCustomerEmail()}
            </span>

            {order.phone && (
              <span>
                {order.phone}
              </span>
            )}

          </div>

        </div>

        {/* SHIPPING */}

        <div className="admin-order-info-card">

          <div className="admin-order-info-header">

            <div className="admin-order-info-icon blue">
              <MapPin size={17} />
            </div>

            <div>
              <h3>
                Shipping Address
              </h3>

              <span>
                Delivery information
              </span>
            </div>

          </div>

          <div className="admin-order-info-content">

            <strong>
              {shipping.fullName ||
                getCustomerName()}
            </strong>

            {shipping.address && (
              <span>
                {shipping.address}
              </span>
            )}

            <span>
              {[
                shipping.city,
                shipping.state,
                shipping.postalCode,
              ]
                .filter(Boolean)
                .join(", ")}
            </span>

            {shipping.phone && (
              <span>
                {shipping.phone}
              </span>
            )}

          </div>

        </div>

        {/* PAYMENT */}

        <div className="admin-order-info-card">

          <div className="admin-order-info-header">

            <div className="admin-order-info-icon green">
              <CreditCard size={17} />
            </div>

            <div>
              <h3>
                Payment
              </h3>

              <span>
                Payment information
              </span>
            </div>

          </div>

          <div className="admin-order-info-content">

            <div className="admin-payment-row">

              <span>
                Status
              </span>

              <strong
                className={
                  paymentStatus === "PAID"
                    ? "paid"
                    : "pending"
                }
              >
                {paymentStatus}
              </strong>

            </div>

            <div className="admin-payment-row">

              <span>
                Method
              </span>

              <strong>
                {order.paymentMethod ||
                  "Razorpay"}
              </strong>

            </div>

            {order.razorpayPaymentId && (
              <div className="admin-payment-row">

                <span>
                  Payment ID
                </span>

                <strong className="payment-id">
                  {
                    order.razorpayPaymentId
                  }
                </strong>

              </div>
            )}

          </div>

        </div>

      </div>

      {/* =========================================
          ORDER ITEMS
      ========================================= */}

      <div className="admin-order-items-card">

        <div className="admin-order-items-header">

          <div>

            <h2>
              Ordered Items
            </h2>

            <span>
              {items.length}{" "}
              {items.length === 1
                ? "item"
                : "items"}
            </span>

          </div>

          <span className="admin-order-created">
            Ordered on{" "}
            {formatDate(
              order.createdAt
            )}
          </span>

        </div>

        <div className="admin-order-items-list">

          {items.map(
            (item, index) => {

              const product =
                item.product || {};

              const image =
                item.image ||
                product.image ||
                product.images?.[0];

              const name =
                item.name ||
                product.name ||
                "Product";

              const quantity =
                Number(
                  item.quantity || 1
                );

              const price =
                Number(
                  item.price || 0
                );

              return (
                <div
                  className="admin-order-item"
                  key={
                    item._id ||
                    item.product ||
                    index
                  }
                >

                  <div className="admin-order-item-image">

                    {image ? (
                      <img
                        src={image}
                        alt={name}
                      />
                    ) : (
                      <Package
                        size={22}
                      />
                    )}

                  </div>

                  <div className="admin-order-item-details">

                    <strong>
                      {name}
                    </strong>

                    <span>
                      Quantity: {quantity}
                    </span>

                  </div>

                  <div className="admin-order-item-price">

                    <span>
                      {formatAmount(
                        price
                      )}{" "}
                      × {quantity}
                    </span>

                    <strong>
                      {formatAmount(
                        price * quantity
                      )}
                    </strong>

                  </div>

                </div>
              );
            }
          )}

        </div>

      </div>

      {/* =========================================
          BOTTOM GRID
      ========================================= */}

      <div className="admin-order-bottom-grid">

        {/* PRICE SUMMARY */}

        <div className="admin-order-summary-card">

          <h2>
            Price Summary
          </h2>

          <div className="admin-order-summary-row">
            <span>
              Subtotal
            </span>

            <strong>
              {formatAmount(
                order.subtotal
              )}
            </strong>
          </div>

          <div className="admin-order-summary-row">
            <span>
              Tax
            </span>

            <strong>
              {formatAmount(
                order.tax
              )}
            </strong>
          </div>

          <div className="admin-order-summary-row">
            <span>
              Shipping
            </span>

            <strong>
              {Number(
                order.shippingFee || 0
              ) === 0
                ? "FREE"
                : formatAmount(
                    order.shippingFee
                  )}
            </strong>
          </div>

          <div className="admin-order-summary-divider" />

          <div className="admin-order-summary-total">
            <span>
              Total
            </span>

            <strong>
              {formatAmount(
                order.totalAmount
              )}
            </strong>
          </div>

        </div>

        {/* ORDER TIMELINE */}

        <div className="admin-order-timeline-card">

          <h2>
            Order Timeline
          </h2>

          <div className="admin-order-timeline">

            <div className="admin-order-timeline-item active">

              <div className="admin-order-timeline-dot">
                <CheckCircle2
                  size={13}
                />
              </div>

              <div>
                <strong>
                  Order Placed
                </strong>

                <span>
                  {formatDate(
                    order.createdAt
                  )}
                </span>
              </div>

            </div>

            {order.paidAt && (
              <div className="admin-order-timeline-item active">

                <div className="admin-order-timeline-dot">
                  <CreditCard
                    size={13}
                  />
                </div>

                <div>
                  <strong>
                    Payment Completed
                  </strong>

                  <span>
                    {formatDate(
                      order.paidAt
                    )}
                  </span>
                </div>

              </div>
            )}

            <div
              className={`admin-order-timeline-item ${
                [
                  "CONFIRMED",
                  "PROCESSING",
                  "SHIPPED",
                  "DELIVERED",
                ].includes(
                  orderStatus
                )
                  ? "active"
                  : ""
              }`}
            >

              <div className="admin-order-timeline-dot">
                <Package
                  size={13}
                />
              </div>

              <div>
                <strong>
                  Order Confirmed
                </strong>

                <span>
                  {[
                    "CONFIRMED",
                    "PROCESSING",
                    "SHIPPED",
                    "DELIVERED",
                  ].includes(
                    orderStatus
                  )
                    ? "Completed"
                    : "Waiting"}
                </span>
              </div>

            </div>

            <div
              className={`admin-order-timeline-item ${
                [
                  "SHIPPED",
                  "DELIVERED",
                ].includes(
                  orderStatus
                )
                  ? "active"
                  : ""
              }`}
            >

              <div className="admin-order-timeline-dot">
                <Truck size={13} />
              </div>

              <div>
                <strong>
                  Shipped
                </strong>

                <span>
                  {[
                    "SHIPPED",
                    "DELIVERED",
                  ].includes(
                    orderStatus
                  )
                    ? "Completed"
                    : "Waiting"}
                </span>
              </div>

            </div>

            <div
              className={`admin-order-timeline-item ${
                orderStatus ===
                "DELIVERED"
                  ? "active"
                  : ""
              }`}
            >

              <div className="admin-order-timeline-dot">
                <CheckCircle2
                  size={13}
                />
              </div>

              <div>
                <strong>
                  Delivered
                </strong>

                <span>
                  {orderStatus ===
                  "DELIVERED"
                    ? "Completed"
                    : "Waiting"}
                </span>
              </div>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
};

export default AdminOrderDetails;