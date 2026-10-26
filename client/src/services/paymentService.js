import api from "./api";

// Create Razorpay Order
const createRazorpayOrder = async (orderId) => {
  const response = await api.post(
    "/payment/create-order",
    {
      orderId,
    }
  );

  return response.data.data;
};

// Verify Razorpay Payment
const verifyRazorpayPayment = async (paymentData) => {
  const response = await api.post(
    "/payment/verify",
    paymentData
  );

  return response.data.data;
};

export {
  createRazorpayOrder,
  verifyRazorpayPayment,
};