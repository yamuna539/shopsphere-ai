import { Link, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  FaCheckCircle,
  FaBoxOpen,
  FaShoppingBag,
  FaListAlt,
  FaArrowRight,
  FaShieldAlt,
} from "react-icons/fa";

const OrderSuccess = () => {
  const { id } = useParams();

  const { selectedOrder, loading, error } = useSelector(
    (state) => state.orders
  );

  if (loading) {
    return (
      <div className="shopsphere-order-success-page">
        <div className="shopsphere-order-success-loading">
          <div className="shopsphere-success-spinner"></div>
          <h3>Loading your order...</h3>
          <p>Please wait while we fetch your order details.</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="shopsphere-order-success-page">
        <div className="shopsphere-order-success-error">
          <div className="shopsphere-error-icon">!</div>

          <h2>Unable to Load Order</h2>

          <p>{error}</p>

          <div className="shopsphere-success-actions">
            <Link
              to="/orders"
              className="shopsphere-success-secondary-btn"
            >
              <FaListAlt />
              View My Orders
            </Link>

            <Link
              to="/products"
              className="shopsphere-success-primary-btn"
            >
              <FaShoppingBag />
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const order = selectedOrder;

  return (
    <div className="shopsphere-order-success-page">
      <div className="container">
        <div className="shopsphere-order-success-container">

          {/* SUCCESS ICON */}
          <div className="shopsphere-success-icon-wrapper">
            <FaCheckCircle />
          </div>

          {/* HEADER */}
          <div className="shopsphere-success-header">
            <span className="shopsphere-success-label">
              ORDER CONFIRMED
            </span>

            <h1>Thank You for Your Order! 🎉</h1>

            <p>
              Your order has been successfully placed and your payment
              has been confirmed.
            </p>
          </div>

          {/* ORDER ID */}
          <div className="shopsphere-order-id-card">
            <div className="shopsphere-order-id-icon">
              <FaBoxOpen />
            </div>

            <div>
              <span>Order ID</span>

              <strong>
                #{order?._id || id}
              </strong>
            </div>
          </div>

          {/* PAYMENT STATUS */}
          <div className="shopsphere-payment-confirmed">
            <div className="shopsphere-payment-confirmed-icon">
              <FaCheckCircle />
            </div>

            <div>
              <strong>Payment Confirmed</strong>

              <p>
                Your Razorpay test payment was successfully verified.
              </p>
            </div>
          </div>

          {/* WHAT HAPPENS NEXT */}
          <div className="shopsphere-next-steps">
            <h3>What happens next?</h3>

            <div className="shopsphere-next-step-list">

              <div className="shopsphere-next-step">
                <div className="shopsphere-step-number">1</div>

                <div>
                  <strong>Order Processing</strong>

                  <p>
                    Your order will be prepared for shipment.
                  </p>
                </div>
              </div>

              <div className="shopsphere-next-step">
                <div className="shopsphere-step-number">2</div>

                <div>
                  <strong>Order Shipped</strong>

                  <p>
                    You will be able to track your order once it is shipped.
                  </p>
                </div>
              </div>

              <div className="shopsphere-next-step">
                <div className="shopsphere-step-number">3</div>

                <div>
                  <strong>Order Delivered</strong>

                  <p>
                    Your order will be delivered to your shipping address.
                  </p>
                </div>
              </div>

            </div>
          </div>

          {/* ACTION BUTTONS */}
          <div className="shopsphere-success-actions">

            <Link
              to="/orders"
              className="shopsphere-success-primary-btn"
            >
              <FaListAlt />
              View My Orders
              <FaArrowRight />
            </Link>

            <Link
              to="/products"
              className="shopsphere-success-secondary-btn"
            >
              <FaShoppingBag />
              Continue Shopping
            </Link>

          </div>

          {/* SECURITY NOTE */}
          <div className="shopsphere-success-security">
            <FaShieldAlt />

            <span>
              Your order and payment information are securely processed.
            </span>
          </div>

        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;