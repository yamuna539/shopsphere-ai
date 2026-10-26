import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import {
  createRazorpayOrder,
  verifyRazorpayPayment,
} from "../../services/paymentService";

export const createPaymentOrder = createAsyncThunk(
  "payment/createPaymentOrder",
  async (orderId, { rejectWithValue }) => {
    try {
      return await createRazorpayOrder(orderId);
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to create payment order"
      );
    }
  }
);

export const verifyPayment = createAsyncThunk(
  "payment/verifyPayment",
  async (paymentData, { rejectWithValue }) => {
    try {
      return await verifyRazorpayPayment(paymentData);
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Payment verification failed"
      );
    }
  }
);

const initialState = {
  loading: false,
  verifying: false,
  error: null,
  paymentSuccess: false,
};

const paymentSlice = createSlice({
  name: "payment",
  initialState,

  reducers: {
    resetPayment: (state) => {
      state.loading = false;
      state.verifying = false;
      state.error = null;
      state.paymentSuccess = false;
    },
  },

  extraReducers: (builder) => {
    builder

      .addCase(createPaymentOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(createPaymentOrder.fulfilled, (state) => {
        state.loading = false;
      })

      .addCase(createPaymentOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(verifyPayment.pending, (state) => {
        state.verifying = true;
        state.error = null;
      })

      .addCase(verifyPayment.fulfilled, (state) => {
        state.verifying = false;
        state.paymentSuccess = true;
      })

      .addCase(verifyPayment.rejected, (state, action) => {
        state.verifying = false;
        state.error = action.payload;
      });
  },
});

export const { resetPayment } = paymentSlice.actions;

export default paymentSlice.reducer;