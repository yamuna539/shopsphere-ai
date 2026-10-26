import {
  createAsyncThunk,
  createSlice,
} from "@reduxjs/toolkit";

import {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  clearWishlist,
} from "../../services/wishlistService";

/*
 * Get wishlist
 */
export const fetchWishlist =
  createAsyncThunk(
    "wishlist/fetchWishlist",
    async (_, { rejectWithValue }) => {
      try {
        const data = await getWishlist();

        return data.wishlist;
      } catch (error) {
        return rejectWithValue(
          error.response?.data?.message ||
            "Failed to load wishlist"
        );
      }
    }
  );

/*
 * Add product
 */
export const addWishlistItem =
  createAsyncThunk(
    "wishlist/addWishlistItem",
    async (productId, { rejectWithValue }) => {
      try {
        const data =
          await addToWishlist(productId);

        return data.wishlist;
      } catch (error) {
        return rejectWithValue(
          error.response?.data?.message ||
            "Failed to add product to wishlist"
        );
      }
    }
  );

/*
 * Remove product
 */
export const removeWishlistItem =
  createAsyncThunk(
    "wishlist/removeWishlistItem",
    async (
      productId,
      { rejectWithValue }
    ) => {
      try {
        const data =
          await removeFromWishlist(productId);

        return data.wishlist;
      } catch (error) {
        return rejectWithValue(
          error.response?.data?.message ||
            "Failed to remove product"
        );
      }
    }
  );

/*
 * Clear wishlist
 */
export const clearWishlistItems =
  createAsyncThunk(
    "wishlist/clearWishlist",
    async (_, { rejectWithValue }) => {
      try {
        const data =
          await clearWishlist();

        return data.wishlist;
      } catch (error) {
        return rejectWithValue(
          error.response?.data?.message ||
            "Failed to clear wishlist"
        );
      }
    }
  );

const initialState = {
  products: [],

  loading: false,

  actionLoading: false,

  error: null,
};

const wishlistSlice = createSlice({
  name: "wishlist",

  initialState,

  reducers: {
    clearWishlistError: (state) => {
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder

      /*
       * Fetch
       */
      .addCase(
        fetchWishlist.pending,
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )

      .addCase(
        fetchWishlist.fulfilled,
        (state, action) => {
          state.loading = false;

          state.products =
            action.payload.products || [];
        }
      )

      .addCase(
        fetchWishlist.rejected,
        (state, action) => {
          state.loading = false;
          state.error = action.payload;
        }
      )

      /*
       * Add
       */
      .addCase(
        addWishlistItem.pending,
        (state) => {
          state.actionLoading = true;
          state.error = null;
        }
      )

      .addCase(
        addWishlistItem.fulfilled,
        (state, action) => {
          state.actionLoading = false;

          state.products =
            action.payload.products || [];
        }
      )

      .addCase(
        addWishlistItem.rejected,
        (state, action) => {
          state.actionLoading = false;
          state.error = action.payload;
        }
      )

      /*
       * Remove
       */
      .addCase(
        removeWishlistItem.pending,
        (state) => {
          state.actionLoading = true;
          state.error = null;
        }
      )

      .addCase(
        removeWishlistItem.fulfilled,
        (state, action) => {
          state.actionLoading = false;

          state.products =
            action.payload.products || [];
        }
      )

      .addCase(
        removeWishlistItem.rejected,
        (state, action) => {
          state.actionLoading = false;
          state.error = action.payload;
        }
      )

      /*
       * Clear
       */
      .addCase(
        clearWishlistItems.pending,
        (state) => {
          state.actionLoading = true;
          state.error = null;
        }
      )

      .addCase(
        clearWishlistItems.fulfilled,
        (state) => {
          state.actionLoading = false;
          state.products = [];
        }
      )

      .addCase(
        clearWishlistItems.rejected,
        (state, action) => {
          state.actionLoading = false;
          state.error = action.payload;
        }
      );
  },
});

export const {
  clearWishlistError,
} = wishlistSlice.actions;

export default wishlistSlice.reducer;