import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
  clearCart,
} from "../../services/cartService";

/*
 * Get cart
 */
export const fetchCart = createAsyncThunk(
  "cart/fetchCart",
  async (_, { rejectWithValue }) => {
    try {
      const data = await getCart();
      return data.cart;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to load cart"
      );
    }
  }
);

/*
 * Add item
 */
export const addCartItem = createAsyncThunk(
  "cart/addCartItem",
  async ({ productId, quantity = 1 }, { rejectWithValue }) => {
    try {
      const data = await addToCart(
        productId,
        quantity
      );

      return data.cart;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to add product to cart"
      );
    }
  }
);

/*
 * Update quantity
 */
export const updateCartItemQuantity = createAsyncThunk(
  "cart/updateCartItemQuantity",
  async (
    { productId, quantity },
    { rejectWithValue }
  ) => {
    try {
      const data = await updateCartItem(
        productId,
        quantity
      );

      return data.cart;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to update quantity"
      );
    }
  }
);

/*
 * Remove item
 */
export const removeCartItemById = createAsyncThunk(
  "cart/removeCartItem",
  async (productId, { rejectWithValue }) => {
    try {
      const data = await removeCartItem(productId);

      return data.cart;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to remove product"
      );
    }
  }
);

/*
 * Clear cart
 */
export const clearCartItems = createAsyncThunk(
  "cart/clearCart",
  async (_, { rejectWithValue }) => {
    try {
      const data = await clearCart();

      return data.cart;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to clear cart"
      );
    }
  }
);

const initialState = {
  items: [],
  subtotal: 0,
  tax: 0,
  shippingFee: 0,
  totalAmount: 0,

  loading: false,
  actionLoading: false,

  error: null,
};

const cartSlice = createSlice({
  name: "cart",

  initialState,

  reducers: {
    clearCartError: (state) => {
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder

      /*
       * Fetch cart
       */
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;

        state.items = action.payload.items || [];

        state.subtotal = action.payload.subtotal || 0;
        state.tax = action.payload.tax || 0;
        state.shippingFee =
          action.payload.shippingFee || 0;
        state.totalAmount =
          action.payload.totalAmount || 0;
      })

      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /*
       * Add item
       */
      .addCase(addCartItem.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
      })

      .addCase(addCartItem.fulfilled, (state, action) => {
        state.actionLoading = false;

        state.items = action.payload.items || [];

        state.subtotal = action.payload.subtotal || 0;
        state.tax = action.payload.tax || 0;
        state.shippingFee =
          action.payload.shippingFee || 0;
        state.totalAmount =
          action.payload.totalAmount || 0;
      })

      .addCase(addCartItem.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload;
      })

      /*
       * Update quantity
       */
      .addCase(
        updateCartItemQuantity.pending,
        (state) => {
          state.actionLoading = true;
          state.error = null;
        }
      )

      .addCase(
        updateCartItemQuantity.fulfilled,
        (state, action) => {
          state.actionLoading = false;

          state.items = action.payload.items || [];

          state.subtotal =
            action.payload.subtotal || 0;

          state.tax =
            action.payload.tax || 0;

          state.shippingFee =
            action.payload.shippingFee || 0;

          state.totalAmount =
            action.payload.totalAmount || 0;
        }
      )

      .addCase(
        updateCartItemQuantity.rejected,
        (state, action) => {
          state.actionLoading = false;
          state.error = action.payload;
        }
      )

      /*
       * Remove item
       */
      .addCase(
        removeCartItemById.pending,
        (state) => {
          state.actionLoading = true;
          state.error = null;
        }
      )

      .addCase(
        removeCartItemById.fulfilled,
        (state, action) => {
          state.actionLoading = false;

          state.items = action.payload.items || [];

          state.subtotal =
            action.payload.subtotal || 0;

          state.tax =
            action.payload.tax || 0;

          state.shippingFee =
            action.payload.shippingFee || 0;

          state.totalAmount =
            action.payload.totalAmount || 0;
        }
      )

      .addCase(
        removeCartItemById.rejected,
        (state, action) => {
          state.actionLoading = false;
          state.error = action.payload;
        }
      )

      /*
       * Clear cart
       */
      .addCase(
        clearCartItems.pending,
        (state) => {
          state.actionLoading = true;
          state.error = null;
        }
      )

      .addCase(
        clearCartItems.fulfilled,
        (state, action) => {
          state.actionLoading = false;

          state.items = [];

          state.subtotal = 0;
          state.tax = 0;
          state.shippingFee = 0;
          state.totalAmount = 0;
        }
      )

      .addCase(
        clearCartItems.rejected,
        (state, action) => {
          state.actionLoading = false;
          state.error = action.payload;
        }
      );
  },
});

export const {
  clearCartError,
} = cartSlice.actions;

export default cartSlice.reducer;