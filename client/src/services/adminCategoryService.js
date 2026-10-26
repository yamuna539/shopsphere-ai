import api from "./api";

export const getAdminCategories =
  async () => {
    const response =
      await api.get(
        "/admin/categories"
      );

    return response.data;
  };

export const createAdminCategory =
  async (categoryData) => {
    const response =
      await api.post(
        "/admin/categories",
        categoryData
      );

    return response.data;
  };

export const updateAdminCategory =
  async (
    categoryId,
    categoryData
  ) => {
    const response =
      await api.put(
        `/admin/categories/${categoryId}`,
        categoryData
      );

    return response.data;
  };

export const deleteAdminCategory =
  async (categoryId) => {
    const response =
      await api.delete(
        `/admin/categories/${categoryId}`
      );

    return response.data;
  };