import api from "./api";

export const getAdminUsers =
  async (params = {}) => {
    const response =
      await api.get(
        "/admin/users",
        {
          params,
        }
      );

    return response.data;
  };

export const getAdminUserById =
  async (userId) => {
    const response =
      await api.get(
        `/admin/users/${userId}`
      );

    return response.data;
  };

export const updateUserRole =
  async (
    userId,
    role
  ) => {
    const response =
      await api.patch(
        `/admin/users/${userId}/role`,
        {
          role,
        }
      );

    return response.data;
  };

export const deleteAdminUser =
  async (userId) => {
    const response =
      await api.delete(
        `/admin/users/${userId}`
      );

    return response.data;
  };