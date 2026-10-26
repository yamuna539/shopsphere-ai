import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  FaMapMarkerAlt,
  FaEnvelope,
  FaPhone,
  FaLock,
  FaArrowLeft,
  FaArrowRight,
  FaCreditCard,
} from "react-icons/fa";

import { placeOrder } from "../redux/slices/orderSlice";

import {
  createPaymentOrder,
  verifyPayment,
} from "../redux/slices/paymentSlice";

function Checkout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  /* =====================================================
     CART STATE
  ===================================================== */

  const {
    items,
    subtotal,
    tax,
    shippingFee,
    totalAmount,
  } = useSelector((state) => state.cart);


  /* =====================================================
     ORDER STATE
  ===================================================== */

  const {
    loading,
    error,
  } = useSelector((state) => state.orders);


  /* =====================================================
     CHECKOUT FORM
  ===================================================== */

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    postalCode: "",
  });


  /* =====================================================
     HANDLE FORM CHANGE
  ===================================================== */

  const handleChange = (event) => {
    const {
      name,
      value,
    } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };


  /* =====================================================
     RAZORPAY CHECKOUT
  ===================================================== */

  const openRazorpayCheckout = (
    paymentOrder,
    shopSphereOrderId
  ) => {
    const options = {
      key:
        import.meta.env
          .VITE_RAZORPAY_KEY_ID,

      amount:
        paymentOrder.amount,

      currency:
        paymentOrder.currency,

      name:
        "ShopSphere AI",

      description:
        "ShopSphere AI Order",

      order_id:
        paymentOrder.razorpayOrderId,

      prefill: {
        name:
          form.fullName,

        email:
          form.email,

        contact:
          form.phone,
      },

      theme: {
        color: "#4f46e5",
      },

      handler:
        async function (response) {
          try {
            console.log(
              "Razorpay payment response:",
              response
            );

            await dispatch(
              verifyPayment({
                orderId:
                  shopSphereOrderId,

                razorpay_order_id:
                  response.razorpay_order_id,

                razorpay_payment_id:
                  response.razorpay_payment_id,

                razorpay_signature:
                  response.razorpay_signature,
              })
            ).unwrap();

            navigate(
              `/order-success/${shopSphereOrderId}`
            );
          } catch (error) {
            console.error(
              "Payment verification failed:",
              error
            );

            alert(
              "Payment verification failed. Please contact support."
            );
          }
        },

      modal: {
        ondismiss:
          function () {
            console.log(
              "Razorpay checkout closed"
            );
          },
      },
    };


    if (!window.Razorpay) {
      console.error(
        "Razorpay SDK is not loaded."
      );

      alert(
        "Razorpay is not available. Please refresh the page and try again."
      );

      return;
    }


    const razorpay =
      new window.Razorpay(
        options
      );

    razorpay.open();
  };


  /* =====================================================
     SUBMIT CHECKOUT
  ===================================================== */

  const handleSubmit = async (
    event
  ) => {
    event.preventDefault();

    if (
      !items ||
      items.length === 0
    ) {
      return;
    }

    try {
      /* Create ShopSphere Order */

      const result =
        await dispatch(
          placeOrder(form)
        ).unwrap();

      console.log(
        "ShopSphere order created:",
        result
      );

      const shopSphereOrderId =
        result?._id;

      if (!shopSphereOrderId) {
        throw new Error(
          "Order was created, but order ID was not returned."
        );
      }


      /* Create Razorpay Order */

      const paymentResult =
        await dispatch(
          createPaymentOrder(
            shopSphereOrderId
          )
        ).unwrap();

      console.log(
        "Razorpay order created:",
        paymentResult
      );


      /* Open Razorpay */

      openRazorpayCheckout(
        paymentResult,
        shopSphereOrderId
      );

    } catch (error) {
      console.error(
        "Checkout error:",
        error
      );
    }
  };


  /* =====================================================
     EMPTY CART
  ===================================================== */

  if (
    !items ||
    items.length === 0
  ) {
    return (
      <div className="shopsphere-checkout-page">

        <div className="container py-5">

          <div className="shopsphere-checkout-empty">

            <div className="shopsphere-checkout-empty-icon">
              🛒
            </div>

            <h2>
              Your cart is empty
            </h2>

            <p>
              Add some products before
              proceeding to checkout.
            </p>

            <Link
              to="/products"
              className="shopsphere-checkout-back-btn"
            >
              <FaArrowLeft />
              Continue Shopping
            </Link>

          </div>

        </div>

      </div>
    );
  }


  /* =====================================================
     CHECKOUT UI
  ===================================================== */

  return (
    <div className="shopsphere-checkout-page">

      <div className="container py-5">

        {/* =================================================
            HEADER
        ================================================= */}

        <div className="shopsphere-checkout-header">

          <div>

            <span className="shopsphere-checkout-label">
              SECURE CHECKOUT
            </span>

            <h1>
              Complete Your Purchase
            </h1>

            <p>
              Enter your shipping details and
              continue to secure payment.
            </p>

          </div>

        </div>


        {/* =================================================
            ERROR
        ================================================= */}

        {error && (
          <div className="shopsphere-checkout-error">
            {error}
          </div>
        )}


        <div className="row g-4">


          {/* =================================================
              SHIPPING INFORMATION
          ================================================= */}

          <div className="col-12 col-lg-7">

            <div className="shopsphere-checkout-card">

              <div className="shopsphere-checkout-card-header">

                <div className="shopsphere-checkout-card-icon">
                  <FaMapMarkerAlt />
                </div>

                <div>
                  <span>
                    DELIVERY DETAILS
                  </span>

                  <h2>
                    Shipping Information
                  </h2>
                </div>

              </div>


              <form
                onSubmit={handleSubmit}
              >

                {/* Full Name + Email */}

                <div className="row g-3">

                  <div className="col-md-6">

                    <label
                      htmlFor="checkout-fullName"
                      className="shopsphere-checkout-label-text"
                    >
                      Full Name
                    </label>

                    <div className="shopsphere-input-wrapper">

                      <input
                        id="checkout-fullName"
                        type="text"
                        name="fullName"
                        placeholder="Enter your full name"
                        value={
                          form.fullName
                        }
                        onChange={
                          handleChange
                        }
                        required
                      />

                    </div>

                  </div>


                  <div className="col-md-6">

                    <label
                      htmlFor="checkout-email"
                      className="shopsphere-checkout-label-text"
                    >
                      Email Address
                    </label>

                    <div className="shopsphere-input-wrapper">

                      <FaEnvelope />

                      <input
                        id="checkout-email"
                        type="email"
                        name="email"
                        placeholder="you@example.com"
                        value={
                          form.email
                        }
                        onChange={
                          handleChange
                        }
                        required
                      />

                    </div>

                  </div>

                </div>


                {/* Phone */}

                <div className="shopsphere-form-group">

                  <label
                    htmlFor="checkout-phone"
                    className="shopsphere-checkout-label-text"
                  >
                    Phone Number
                  </label>

                  <div className="shopsphere-input-wrapper">

                    <FaPhone />

                    <input
                      id="checkout-phone"
                      type="tel"
                      name="phone"
                      placeholder="Enter your phone number"
                      value={
                        form.phone
                      }
                      onChange={
                        handleChange
                      }
                      required
                    />

                  </div>

                </div>


                {/* Address */}

                <div className="shopsphere-form-group">

                  <label
                    htmlFor="checkout-address"
                    className="shopsphere-checkout-label-text"
                  >
                    Full Address
                  </label>

                  <textarea
                    id="checkout-address"
                    name="address"
                    rows="3"
                    placeholder="House / Flat / Street / Area"
                    value={
                      form.address
                    }
                    onChange={
                      handleChange
                    }
                    required
                  />

                </div>


                {/* City / State / Postal */}

                <div className="row g-3">

                  <div className="col-md-4">

                    <label
                      htmlFor="checkout-city"
                      className="shopsphere-checkout-label-text"
                    >
                      City
                    </label>

                    <input
                      id="checkout-city"
                      type="text"
                      name="city"
                      placeholder="City"
                      value={
                        form.city
                      }
                      onChange={
                        handleChange
                      }
                      required
                    />

                  </div>


                  <div className="col-md-4">

                    <label
                      htmlFor="checkout-state"
                      className="shopsphere-checkout-label-text"
                    >
                      State
                    </label>

                    <input
                      id="checkout-state"
                      type="text"
                      name="state"
                      placeholder="State"
                      value={
                        form.state
                      }
                      onChange={
                        handleChange
                      }
                      required
                    />

                  </div>


                  <div className="col-md-4">

                    <label
                      htmlFor="checkout-postalCode"
                      className="shopsphere-checkout-label-text"
                    >
                      Postal Code
                    </label>

                    <input
                      id="checkout-postalCode"
                      type="text"
                      name="postalCode"
                      placeholder="PIN Code"
                      value={
                        form.postalCode
                      }
                      onChange={
                        handleChange
                      }
                      required
                    />

                  </div>

                </div>


                {/* Payment Button */}

                <button
                  type="submit"
                  className="shopsphere-payment-btn"
                  disabled={loading}
                >

                  {loading ? (
                    <>
                      <span className="shopsphere-btn-spinner" />
                      Creating Order...
                    </>
                  ) : (
                    <>
                      <FaCreditCard />
                      Proceed to Payment
                      <FaArrowRight />
                    </>
                  )}

                </button>


                <div className="shopsphere-payment-security">

                  <FaLock />

                  <span>
                    Your information is protected
                    with secure checkout.
                  </span>

                </div>

              </form>

            </div>

          </div>


          {/* =================================================
              ORDER SUMMARY
          ================================================= */}

          <div className="col-12 col-lg-5">

            <div className="shopsphere-checkout-summary">

              <div className="shopsphere-summary-title">

                <div className="shopsphere-summary-title-icon">
                  🛍️
                </div>

                <div>
                  <span>
                    YOUR ORDER
                  </span>

                  <h2>
                    Order Summary
                  </h2>
                </div>

              </div>


              {/* Products */}

              <div className="shopsphere-checkout-products">

                {items.map(
                  (item) => (

                    <div
                      className="shopsphere-checkout-product"
                      key={
                        item._id ||
                        item.product?._id
                      }
                    >

                      <div className="shopsphere-checkout-product-image">

                        <img
                          src={
                            item.product
                              ?.images?.[0] ||
                            "https://placehold.co/100x100?text=ShopSphere"
                          }
                          alt={
                            item.product
                              ?.name
                          }
                        />

                        <span>
                          {item.quantity}
                        </span>

                      </div>


                      <div className="shopsphere-checkout-product-info">

                        <strong>
                          {
                            item.product
                              ?.name
                          }
                        </strong>

                        <small>
                          ₹
                          {Number(
                            item.price
                          ).toLocaleString(
                            "en-IN"
                          )}{" "}
                          ×{" "}
                          {item.quantity}
                        </small>

                      </div>


                      <strong className="shopsphere-checkout-product-total">
                        ₹
                        {Number(
                          item.price *
                            item.quantity
                        ).toLocaleString(
                          "en-IN"
                        )}
                      </strong>

                    </div>

                  )
                )}

              </div>


              {/* Totals */}

              <div className="shopsphere-checkout-totals">

                <div>
                  <span>
                    Subtotal
                  </span>

                  <strong>
                    ₹
                    {Number(
                      subtotal
                    ).toLocaleString(
                      "en-IN"
                    )}
                  </strong>
                </div>


                <div>
                  <span>
                    Tax
                  </span>

                  <strong>
                    ₹
                    {Number(
                      tax
                    ).toLocaleString(
                      "en-IN"
                    )}
                  </strong>
                </div>


                <div>
                  <span>
                    Shipping
                  </span>

                  <strong
                    className={
                      shippingFee === 0
                        ? "shopsphere-free-text"
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

              </div>


              <div className="shopsphere-checkout-total">

                <span>
                  Total
                </span>

                <strong>
                  ₹
                  {Number(
                    totalAmount
                  ).toLocaleString(
                    "en-IN"
                  )}
                </strong>

              </div>


              {/* Razorpay notice */}

              <div className="shopsphere-razorpay-notice">

                <FaCreditCard />

                <div>
                  <strong>
                    Secure Payment
                  </strong>

                  <p>
                    Payment will be processed
                    securely through Razorpay
                    Test Mode.
                  </p>
                </div>

              </div>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Checkout;