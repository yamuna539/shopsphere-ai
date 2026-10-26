import api from "./api";

const getWishlist = async () => {
  const response = await api.get(
    "/wishlist"
  );

  return response.data;
};

const addToWishlist = async (productId) => {
  const response = await api.post(
    `/wishlist/${productId}`
  );

  return response.data;
};

const removeFromWishlist = async (
  productId
) => {
  const response = await api.delete(
    `/wishlist/${productId}`
  );

  return response.data;
};

const clearWishlist = async () => {
  const response = await api.delete(
    "/wishlist"
  );

  return response.data;
};

export {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  clearWishlist,
};