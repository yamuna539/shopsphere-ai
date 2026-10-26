import {
  createAsyncThunk,
  createSlice,
} from "@reduxjs/toolkit";

import {
  getProducts,
  getProductById,
} from "../../services/productService";

export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async (params = {}, thunkAPI) => {
    try {
      return await getProducts(params);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message ||
          "Failed to fetch products"
      );
    }
  }
);

export const fetchProductById = createAsyncThunk(
  "products/fetchProductById",
  async (productId, thunkAPI) => {
    try {
      return await getProductById(productId);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message ||
          "Failed to fetch product"
      );
    }
  }
);

const initialState = {
  products: [],
  product: null,

  pagination: {
    currentPage: 1,
    limit: 12,
    totalProducts: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPreviousPage: false,
  },

  filters: {
    search: "",
    category: "",
    brand: "",
    minPrice: "",
    maxPrice: "",
    rating: "",
    inStock: false,
    sort: "newest",
  },

  loading: false,
  productLoading: false,
  error: null,
  productError: null,
};

const productSlice = createSlice({
  name: "products",

  initialState,

  reducers: {
    setFilters: (state, action) => {
      state.filters = {
        ...state.filters,
        ...action.payload,
      };
    },

    setPage: (state, action) => {
    state.pagination.currentPage =
      action.payload;
  },

    resetFilters: (state) => {
      state.filters = {
        search: "",
        category: "",
        brand: "",
        minPrice: "",
        maxPrice: "",
        rating: "",
        inStock: false,
        sort: "newest",
      };
    },

    clearProduct: (state) => {
      state.product = null;
      state.productError = null;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(
        fetchProducts.pending,
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )

      .addCase(
        fetchProducts.fulfilled,
        (state, action) => {
          state.loading = false;

          state.products =
            action.payload.products || [];

          state.pagination =
            action.payload.pagination ||
            state.pagination;
        }
      )

      .addCase(
        fetchProducts.rejected,
        (state, action) => {
          state.loading = false;

          state.error =
            action.payload ||
            "Failed to fetch products";
        }
      )

      .addCase(
        fetchProductById.pending,
        (state) => {
          state.productLoading = true;
          state.productError = null;
        }
      )

      .addCase(
        fetchProductById.fulfilled,
        (state, action) => {
          state.productLoading = false;
          state.product =
            action.payload.product || null;
        }
      )

      .addCase(
        fetchProductById.rejected,
        (state, action) => {
          state.productLoading = false;

          state.productError =
            action.payload ||
            "Failed to fetch product";
        }
      );
  },
});

export const {
  setFilters,
  setPage,
  resetFilters,
  clearProduct,
} = productSlice.actions;

export default productSlice.reducer;