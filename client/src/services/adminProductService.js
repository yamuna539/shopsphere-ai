import api from "./api";

export const getAdminProducts =
  async (params = {}) => {
    const response =
      await api.get(
        "/admin/products",
        {
          params,
        }
      );

    return response.data;
  };

export const createAdminProduct =
  async (productData) => {
    const response =
      await api.post(
        "/admin/products",
        productData
      );

    return response.data;
  };

export const updateAdminProduct =
  async (
    productId,
    productData
  ) => {
    const response =
      await api.put(
        `/admin/products/${productId}`,
        productData
      );

    return response.data;
  };

export const deleteAdminProduct =
  async (productId) => {
    const response =
      await api.delete(
        `/admin/products/${productId}`
      );

    return response.data;
  };