import api from "./api";


/* =========================================================
   DASHBOARD STATISTICS
========================================================= */

export const getDashboardStats =
  async () => {

    const response =
      await api.get(
        "/admin/dashboard"
      );

    return response.data;
  };


/* =========================================================
   RECENT ORDERS
========================================================= */

export const getRecentOrders =
  async () => {

    const response =
      await api.get(
        "/admin/recent-orders"
      );

    return response.data;
  };


/* =========================================================
   SALES DATA
========================================================= */

export const getSalesData =
  async () => {

    const response =
      await api.get(
        "/admin/sales"
      );

    return response.data;
  };