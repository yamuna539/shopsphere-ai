import api from "./api";

/*
 * Create order
 */
const createOrder = async (shippingAddress) => {
  const response = await api.post("/orders", {
    shippingAddress,
  });

  return response.data;
};

/*
 * Get logged-in user's orders
 */
const getMyOrders = async () => {
  const response = await api.get("/orders");

  return response.data;
};

/*
 * Get one order by ID
 */
const getOrderById = async (orderId) => {
  const response = await api.get(
    `/orders/${orderId}`
  );

  return response.data;
};

export {
  createOrder,
  getMyOrders,
  getOrderById,
};