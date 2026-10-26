import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  RefreshCw,
  Eye,
  ShoppingBag,
  Clock3,
  CheckCircle2,
  Truck,
  PackageCheck,
  XCircle,
} from "lucide-react";

import api from "../../services/api";

const AdminOrders = () => {
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [search, setSearch] = useState("");

  const [statusFilter, setStatusFilter] =
    useState("ALL");

  const [refreshing, setRefreshing] =
    useState(false);

  /*
  ==================================================
  FETCH ORDERS
  ==================================================
  */

  const fetchOrders = async (
    showRefresh = false
  ) => {
    try {
      if (showRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      const response =
        await api.get("/admin/orders");

      const orderData =
        response.data.data ||
        response.data.orders ||
        [];

      setOrders(
        Array.isArray(orderData)
          ? orderData
          : []
      );
    } catch (error) {
      console.error(
        "Failed to fetch orders:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to load orders"
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  /*
  ==================================================
  INITIAL LOAD
  ==================================================
  */

  useEffect(() => {
    fetchOrders();
  }, []);

  /*
  ==================================================
  FILTER ORDERS
  ==================================================
  */

  const filteredOrders = useMemo(() => {
    const searchValue =
      search.trim().toLowerCase();

    return orders.filter((order) => {
      const orderId =
        String(order._id || "")
          .toLowerCase();

      const customerName =
        order.user?.name ||
        order.shippingAddress?.fullName ||
        order.fullName ||
        "";

      const customerEmail =
        order.user?.email ||
        order.email ||
        "";

      const matchesSearch =
        !searchValue ||
        orderId.includes(searchValue) ||
        customerName
          .toLowerCase()
          .includes(searchValue) ||
        customerEmail
          .toLowerCase()
          .includes(searchValue);

      const matchesStatus =
        statusFilter === "ALL" ||
        order.orderStatus ===
          statusFilter;

      return (
        matchesSearch &&
        matchesStatus
      );
    });
  }, [
    orders,
    search,
    statusFilter,
  ]);

  /*
  ==================================================
  STATUS COUNTS
  ==================================================
  */

  const statusCounts = {
    all: orders.length,

    pending: orders.filter(
      (order) =>
        order.orderStatus === "PENDING"
    ).length,

    confirmed: orders.filter(
      (order) =>
        order.orderStatus === "CONFIRMED"
    ).length,

    processing: orders.filter(
      (order) =>
        order.orderStatus === "PROCESSING"
    ).length,

    shipped: orders.filter(
      (order) =>
        order.orderStatus === "SHIPPED"
    ).length,

    delivered: orders.filter(
      (order) =>
        order.orderStatus === "DELIVERED"
    ).length,

    cancelled: orders.filter(
      (order) =>
        order.orderStatus === "CANCELLED"
    ).length,
  };

  /*
  ==================================================
  FORMAT DATE
  ==================================================
  */

  const formatDate = (date) => {
    if (!date) {
      return "—";
    }

    return new Date(date).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  /*
  ==================================================
  FORMAT AMOUNT
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
  CUSTOMER NAME
  ==================================================
  */

  const getCustomerName = (order) => {
    return (
      order.user?.name ||
      order.shippingAddress?.fullName ||
      order.fullName ||
      "Customer"
    );
  };

  /*
  ==================================================
  CUSTOMER EMAIL
  ==================================================
  */

  const getCustomerEmail = (order) => {
    return (
      order.user?.email ||
      order.email ||
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
        return <Clock3 size={13} />;

      case "CONFIRMED":
        return <CheckCircle2 size={13} />;

      case "PROCESSING":
        return <PackageCheck size={13} />;

      case "SHIPPED":
        return <Truck size={13} />;

      case "DELIVERED":
        return <CheckCircle2 size={13} />;

      case "CANCELLED":
        return <XCircle size={13} />;

      default:
        return <ShoppingBag size={13} />;
    }
  };

  /*
  ==================================================
  LOADING
  ==================================================
  */

  if (loading) {
    return (
      <div className="admin-orders-loading">

        <div className="admin-orders-loading-icon">
          <RefreshCw size={21} />
        </div>

        <h4>
          Loading Orders
        </h4>

        <p>
          Fetching your ShopSphere orders...
        </p>

      </div>
    );
  }

  /*
  ==================================================
  UI
  ==================================================
  */

  return (
    <div className="admin-orders-page">

      {/* =========================================
          HEADER
      ========================================= */}

      <div className="admin-orders-header">

        <div className="admin-orders-title">

          <div className="admin-orders-title-icon">
            <ShoppingBag size={22} />
          </div>

          <div>

            <span className="admin-orders-eyebrow">
              ORDER MANAGEMENT
            </span>

            <h1>
              Orders
            </h1>

            <p>
              Manage customer orders and
              track their fulfillment status.
            </p>

          </div>

        </div>

        <button
          type="button"
          className="admin-orders-refresh"
          onClick={() =>
            fetchOrders(true)
          }
          disabled={refreshing}
        >
          <RefreshCw
            size={15}
            className={
              refreshing
                ? "admin-orders-spin"
                : ""
            }
          />

          Refresh
        </button>

      </div>

      {/* =========================================
          ERROR
      ========================================= */}

      {error && (
        <div className="admin-orders-error">
          <strong>
            Error:
          </strong>

          <span>
            {error}
          </span>
        </div>
      )}

      {/* =========================================
          STATS
      ========================================= */}

      <div className="admin-orders-stats">

        <button
          type="button"
          className={`admin-order-stat ${
            statusFilter === "ALL"
              ? "active"
              : ""
          }`}
          onClick={() =>
            setStatusFilter("ALL")
          }
        >
          <div className="admin-order-stat-icon purple">
            <ShoppingBag size={17} />
          </div>

          <div>
            <span>
              Total Orders
            </span>

            <strong>
              {statusCounts.all}
            </strong>
          </div>
        </button>

        <button
          type="button"
          className={`admin-order-stat ${
            statusFilter === "PENDING"
              ? "active"
              : ""
          }`}
          onClick={() =>
            setStatusFilter("PENDING")
          }
        >
          <div className="admin-order-stat-icon orange">
            <Clock3 size={17} />
          </div>

          <div>
            <span>
              Pending
            </span>

            <strong>
              {statusCounts.pending}
            </strong>
          </div>
        </button>

        <button
          type="button"
          className={`admin-order-stat ${
            statusFilter === "PROCESSING"
              ? "active"
              : ""
          }`}
          onClick={() =>
            setStatusFilter("PROCESSING")
          }
        >
          <div className="admin-order-stat-icon blue">
            <PackageCheck size={17} />
          </div>

          <div>
            <span>
              Processing
            </span>

            <strong>
              {statusCounts.processing}
            </strong>
          </div>
        </button>

        <button
          type="button"
          className={`admin-order-stat ${
            statusFilter === "SHIPPED"
              ? "active"
              : ""
          }`}
          onClick={() =>
            setStatusFilter("SHIPPED")
          }
        >
          <div className="admin-order-stat-icon indigo">
            <Truck size={17} />
          </div>

          <div>
            <span>
              Shipped
            </span>

            <strong>
              {statusCounts.shipped}
            </strong>
          </div>
        </button>

        <button
          type="button"
          className={`admin-order-stat ${
            statusFilter === "DELIVERED"
              ? "active"
              : ""
          }`}
          onClick={() =>
            setStatusFilter("DELIVERED")
          }
        >
          <div className="admin-order-stat-icon green">
            <CheckCircle2 size={17} />
          </div>

          <div>
            <span>
              Delivered
            </span>

            <strong>
              {statusCounts.delivered}
            </strong>
          </div>
        </button>

      </div>

      {/* =========================================
          MAIN CARD
      ========================================= */}

      <div className="admin-orders-card">

        <div className="admin-orders-card-header">

          <div>

            <h2>
              Order List
            </h2>

            <span>
              {filteredOrders.length} orders shown
            </span>

          </div>

          <div className="admin-orders-filter-label">
            {statusFilter === "ALL"
              ? "All orders"
              : statusFilter}
          </div>

        </div>

        {/* SEARCH */}

        <div className="admin-orders-toolbar">

          <div className="admin-orders-search">

            <Search size={16} />

            <input
              type="text"
              placeholder="Search by order ID, customer name or email..."
              value={search}
              onChange={(event) =>
                setSearch(
                  event.target.value
                )
              }
            />

          </div>

          <select
            value={statusFilter}
            onChange={(event) =>
              setStatusFilter(
                event.target.value
              )
            }
            className="admin-orders-select"
          >
            <option value="ALL">
              All Status
            </option>

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

        </div>

        {/* =====================================
            EMPTY
        ====================================== */}

        {filteredOrders.length === 0 ? (

          <div className="admin-orders-empty">

            <div className="admin-orders-empty-icon">
              <ShoppingBag size={29} />
            </div>

            <h3>
              No orders found
            </h3>

            <p>
              {search ||
              statusFilter !== "ALL"
                ? "Try changing your search or status filter."
                : "There are no customer orders yet."}
            </p>

          </div>

        ) : (

          <div className="admin-orders-table-wrapper">

            <table className="admin-orders-table">

              <thead>

                <tr>

                  <th>
                    ORDER
                  </th>

                  <th>
                    CUSTOMER
                  </th>

                  <th>
                    AMOUNT
                  </th>

                  <th>
                    PAYMENT
                  </th>

                  <th>
                    STATUS
                  </th>

                  <th>
                    DATE
                  </th>

                  <th>
                    ACTION
                  </th>

                </tr>

              </thead>

              <tbody>

                {filteredOrders.map(
                  (order) => {

                    const status =
                      order.orderStatus ||
                      "PENDING";

                    const paymentStatus =
                      order.paymentStatus ||
                      "PENDING";

                    return (
                      <tr
                        key={order._id}
                      >

                        {/* ORDER */}

                        <td>

                          <div className="admin-order-id">

                            <strong>
                              #
                              {String(
                                order._id
                              ).slice(-8)}
                            </strong>

                            <span>
                              {order.items?.length ||
                                0}{" "}
                              items
                            </span>

                          </div>

                        </td>

                        {/* CUSTOMER */}

                        <td>

                          <div className="admin-order-customer">

                            <strong>
                              {
                                getCustomerName(
                                  order
                                )
                              }
                            </strong>

                            <span>
                              {
                                getCustomerEmail(
                                  order
                                )
                              }
                            </span>

                          </div>

                        </td>

                        {/* AMOUNT */}

                        <td>

                          <strong className="admin-order-amount">
                            {
                              formatAmount(
                                order.totalAmount
                              )
                            }
                          </strong>

                        </td>

                        {/* PAYMENT */}

                        <td>

                          <span
                            className={`admin-payment-status ${
                              paymentStatus.toLowerCase()
                            }`}
                          >
                            {paymentStatus}
                          </span>

                        </td>

                        {/* ORDER STATUS */}

                        <td>

                          <span
                            className={`admin-order-status ${getStatusClass(
                              status
                            )}`}
                          >
                            {getStatusIcon(
                              status
                            )}

                            {status}
                          </span>

                        </td>

                        {/* DATE */}

                        <td>

                          <span className="admin-order-date">
                            {formatDate(
                              order.createdAt
                            )}
                          </span>

                        </td>

                        {/* ACTION */}

                        <td>

                          <button
                            type="button"
                            className="admin-order-view-button"
                            onClick={() =>
                              navigate(
                                `/admin/orders/${order._id}`
                              )
                            }
                          >
                            <Eye size={14} />
                            View
                          </button>

                        </td>

                      </tr>
                    );
                  }
                )}

              </tbody>

            </table>

          </div>

        )}

      </div>

    </div>
  );
};

export default AdminOrders;