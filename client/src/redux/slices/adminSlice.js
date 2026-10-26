import {
  createAsyncThunk,
  createSlice,
} from "@reduxjs/toolkit";

import {
  getDashboardStats,
  getRecentOrders,
  getSalesData,
} from "../../services/adminService";


/* =========================================================
   DASHBOARD STATS
========================================================= */

export const fetchDashboardStats =
  createAsyncThunk(
    "admin/fetchDashboardStats",

    async (
      _,
      { rejectWithValue }
    ) => {
      try {
        return await getDashboardStats();
      } catch (error) {
        return rejectWithValue(
          error.response?.data?.message ||
            "Failed to fetch dashboard statistics"
        );
      }
    }
  );


/* =========================================================
   RECENT ORDERS
========================================================= */

export const fetchRecentOrders =
  createAsyncThunk(
    "admin/fetchRecentOrders",

    async (
      _,
      { rejectWithValue }
    ) => {
      try {
        return await getRecentOrders();
      } catch (error) {
        return rejectWithValue(
          error.response?.data?.message ||
            "Failed to fetch recent orders"
        );
      }
    }
  );


/* =========================================================
   SALES DATA
========================================================= */

export const fetchSalesData =
  createAsyncThunk(
    "admin/fetchSalesData",

    async (
      _,
      { rejectWithValue }
    ) => {
      try {
        return await getSalesData();
      } catch (error) {
        return rejectWithValue(
          error.response?.data?.message ||
            "Failed to fetch sales data"
        );
      }
    }
  );


/* =========================================================
   INITIAL STATE
========================================================= */

const initialState = {

  stats: {
    totalUsers: 0,
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    deliveredOrders: 0,
  },

  recentOrders: [],

  sales: [],

  loading: false,

  error: null,
};


/* =========================================================
   SLICE
========================================================= */

const adminSlice = createSlice({

  name: "admin",

  initialState,

  reducers: {

    clearAdminError: (state) => {
      state.error = null;
    },

  },


  extraReducers: (builder) => {

    /* =====================================================
       DASHBOARD STATS
    ===================================================== */

    builder

      .addCase(
        fetchDashboardStats.pending,
        (state) => {

          state.loading = true;

          state.error = null;
        }
      )

      .addCase(
        fetchDashboardStats.fulfilled,
        (state, action) => {

          state.stats =
            action.payload?.data ||
            state.stats;

          state.loading = false;
        }
      )

      .addCase(
        fetchDashboardStats.rejected,
        (state, action) => {

          state.loading = false;

          state.error =
            action.payload ||
            "Failed to fetch dashboard statistics";
        }
      );


    /* =====================================================
       RECENT ORDERS
    ===================================================== */

    builder

      .addCase(
        fetchRecentOrders.pending,
        (state) => {

          state.error = null;
        }
      )

      .addCase(
        fetchRecentOrders.fulfilled,
        (state, action) => {

          state.recentOrders =
            action.payload?.data ||
            [];
        }
      )

      .addCase(
        fetchRecentOrders.rejected,
        (state, action) => {

          state.error =
            action.payload ||
            "Failed to fetch recent orders";
        }
      );


    /* =====================================================
       SALES
    ===================================================== */

    builder

      .addCase(
        fetchSalesData.pending,
        (state) => {

          state.error = null;
        }
      )

      .addCase(
        fetchSalesData.fulfilled,
        (state, action) => {

          state.sales =
            action.payload?.data ||
            [];
        }
      )

      .addCase(
        fetchSalesData.rejected,
        (state, action) => {

          state.error =
            action.payload ||
            "Failed to fetch sales data";
        }
      );

  },
});


export const {
  clearAdminError,
} = adminSlice.actions;


export default adminSlice.reducer;