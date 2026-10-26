import {
  createAsyncThunk,
  createSlice,
} from "@reduxjs/toolkit";

import {
  createOrder,
  getMyOrders,
  getOrderById,
} from "../../services/orderService";

/*
 * ==========================================
 * Create Order
 * ==========================================
 */

export const placeOrder = createAsyncThunk(
  "orders/placeOrder",
  async (
    shippingAddress,
    { rejectWithValue }
  ) => {
    try {
      const data =
        await createOrder(shippingAddress);

      /*
       * Backend response:
       *
       * {
       *   success: true,
       *   message: "Order created successfully",
       *   order: {...}
       * }
       *
       * Return ONLY the created order.
       *
       * This allows Checkout.jsx to use:
       *
       * result._id
       */

      return data.order;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to create order"
      );
    }
  }
);

/*
 * ==========================================
 * Get My Orders
 * ==========================================
 */

export const fetchMyOrders =
  createAsyncThunk(
    "orders/fetchMyOrders",
    async (
      _,
      { rejectWithValue }
    ) => {
      try {
        const data =
          await getMyOrders();

        return data.orders || [];
      } catch (error) {
        return rejectWithValue(
          error.response?.data?.message ||
            "Failed to load orders"
        );
      }
    }
  );

/*
 * ==========================================
 * Get Order By ID
 * ==========================================
 */

export const fetchOrderById =
  createAsyncThunk(
    "orders/fetchOrderById",
    async (
      orderId,
      { rejectWithValue }
    ) => {
      try {
        const data =
          await getOrderById(orderId);

        return data.order;
      } catch (error) {
        return rejectWithValue(
          error.response?.data?.message ||
            "Failed to load order"
        );
      }
    }
  );

/*
 * ==========================================
 * Initial State
 * ==========================================
 */

const initialState = {
  orders: [],
  selectedOrder: null,

  loading: false,
  error: null,
};

/*
 * ==========================================
 * Slice
 * ==========================================
 */

const orderSlice = createSlice({
  name: "orders",

  initialState,

  reducers: {
    clearOrderError: (state) => {
      state.error = null;
    },

    clearSelectedOrder: (state) => {
      state.selectedOrder = null;
    },
  },

  extraReducers: (builder) => {
    builder

      /*
       * ======================================
       * Place Order
       * ======================================
       */

      .addCase(
        placeOrder.pending,
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )

      .addCase(
        placeOrder.fulfilled,
        (state, action) => {
          state.loading = false;

          /*
           * Add newly created order
           * to the beginning.
           */
          if (action.payload) {
            state.orders.unshift(
              action.payload
            );

            state.selectedOrder =
              action.payload;
          }
        }
      )

      .addCase(
        placeOrder.rejected,
        (state, action) => {
          state.loading = false;
          state.error = action.payload;
        }
      )

      /*
       * ======================================
       * Fetch My Orders
       * ======================================
       */

      .addCase(
        fetchMyOrders.pending,
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )

      .addCase(
        fetchMyOrders.fulfilled,
        (state, action) => {
          state.loading = false;

          state.orders =
            action.payload || [];
        }
      )

      .addCase(
        fetchMyOrders.rejected,
        (state, action) => {
          state.loading = false;
          state.error = action.payload;
        }
      )

      /*
       * ======================================
       * Fetch Order By ID
       * ======================================
       */

      .addCase(
        fetchOrderById.pending,
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )

      .addCase(
        fetchOrderById.fulfilled,
        (state, action) => {
          state.loading = false;

          state.selectedOrder =
            action.payload;
        }
      )

      .addCase(
        fetchOrderById.rejected,
        (state, action) => {
          state.loading = false;
          state.error = action.payload;
        }
      );
  },
});

/*
 * ==========================================
 * Actions
 * ==========================================
 */

export const {
  clearOrderError,
  clearSelectedOrder,
} = orderSlice.actions;

/*
 * ==========================================
 * Reducer
 * ==========================================
 */

export default orderSlice.reducer;