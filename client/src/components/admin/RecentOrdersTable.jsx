import { Link } from "react-router-dom";

import {
  FiArrowRight,
  FiPackage,
} from "react-icons/fi";

const RecentOrdersTable = ({
  orders = [],
}) => {

  const getStatusClass = (
    status
  ) => {
    switch (status) {
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
        return "pending";
    }
  };


  const getPaymentClass = (
    paymentStatus
  ) => {
    switch (paymentStatus) {
      case "PAID":
        return "paid";

      case "FAILED":
        return "failed";

      default:
        return "payment-pending";
    }
  };


  return (
    <div className="shopsphere-admin-orders-card">

      {/* Header */}

      <div className="shopsphere-admin-orders-header">

        <div className="shopsphere-admin-orders-title">

          <div className="shopsphere-admin-orders-icon">
            <FiPackage />
          </div>

          <div>
            <h3>
              Recent Orders
            </h3>

            <p>
              Latest orders placed by customers
            </p>
          </div>

        </div>

        <Link
          to="/admin/orders"
          className="shopsphere-admin-view-all"
        >
          View All
          <FiArrowRight />
        </Link>

      </div>


      {/* Empty */}

      {orders.length === 0 ? (

        <div className="shopsphere-admin-orders-empty">

          <div className="shopsphere-admin-empty-icon">
            📦
          </div>

          <h4>
            No orders yet
          </h4>

          <p>
            Customer orders will appear
            here once they are placed.
          </p>

        </div>

      ) : (

        <div className="shopsphere-admin-table-wrapper">

          <table className="shopsphere-admin-orders-table">

            <thead>

              <tr>
                <th>ORDER</th>
                <th>CUSTOMER</th>
                <th>AMOUNT</th>
                <th>PAYMENT</th>
                <th>STATUS</th>
                <th>DATE</th>
              </tr>

            </thead>

            <tbody>

              {orders.map(
                (order) => {

                  const orderId =
                    order._id || "";

                  const customerName =
                    order.user?.name ||
                    "Unknown Customer";

                  const customerEmail =
                    order.user?.email ||
                    "No email";

                  const amount =
                    Number(
                      order.totalAmount
                    ) || 0;

                  return (
                    <tr
                      key={orderId}
                    >

                      <td>
                        <span className="shopsphere-admin-order-id">
                          #
                          {orderId.slice(
                            -8
                          )}
                        </span>
                      </td>


                      <td>

                        <div className="shopsphere-admin-customer">

                          <div className="shopsphere-admin-customer-avatar">
                            {customerName
                              .charAt(0)
                              .toUpperCase()}
                          </div>

                          <div>

                            <strong>
                              {customerName}
                            </strong>

                            <small>
                              {customerEmail}
                            </small>

                          </div>

                        </div>

                      </td>


                      <td>
                        <strong className="shopsphere-admin-order-amount">
                          ₹
                          {amount.toLocaleString(
                            "en-IN",
                            {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            }
                          )}
                        </strong>
                      </td>


                      <td>
                        <span
                          className={`shopsphere-admin-badge shopsphere-admin-payment-${getPaymentClass(
                            order.paymentStatus
                          )}`}
                        >
                          {order.paymentStatus ||
                            "PENDING"}
                        </span>
                      </td>


                      <td>
                        <span
                          className={`shopsphere-admin-badge shopsphere-admin-status-${getStatusClass(
                            order.orderStatus
                          )}`}
                        >
                          {order.orderStatus ||
                            "PENDING"}
                        </span>
                      </td>


                      <td>
                        <span className="shopsphere-admin-order-date">
                          {order.createdAt
                            ? new Date(
                                order.createdAt
                              ).toLocaleDateString(
                                "en-IN",
                                {
                                  day: "2-digit",
                                  month: "short",
                                  year: "numeric",
                                }
                              )
                            : "-"}
                        </span>
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
  );
};

export default RecentOrdersTable;