import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import {
  getAdminProducts,
  createAdminProduct,
  updateAdminProduct,
  deleteAdminProduct,
} from "../../services/adminProductService";

/*
====================================================
GET ADMIN PRODUCTS
====================================================
*/
export const fetchAdminProducts = createAsyncThunk(
  "adminProducts/fetchAdminProducts",

  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await getAdminProducts(params);

      /*
        Backend response:

        {
          success: true,
          data: [...],
          pagination: {
            page,
            limit,
            total,
            pages
          }
        }
      */

      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to fetch products"
      );
    }
  }
);

/*
====================================================
CREATE ADMIN PRODUCT
====================================================
*/
export const createProduct = createAsyncThunk(
  "adminProducts/createProduct",

  async (productData, { rejectWithValue }) => {
    try {
      const response =
        await createAdminProduct(productData);

      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to create product"
      );
    }
  }
);

/*
====================================================
UPDATE ADMIN PRODUCT
====================================================
*/
export const updateProduct = createAsyncThunk(
  "adminProducts/updateProduct",

  async (
    { productId, productData },
    { rejectWithValue }
  ) => {
    try {
      const response =
        await updateAdminProduct(
          productId,
          productData
        );

      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to update product"
      );
    }
  }
);

/*
====================================================
DELETE ADMIN PRODUCT
====================================================
*/
export const deleteProduct = createAsyncThunk(
  "adminProducts/deleteProduct",

  async (productId, { rejectWithValue }) => {
    try {
      const response =
        await deleteAdminProduct(productId);

      return {
        productId,
        ...response,
      };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to delete product"
      );
    }
  }
);

/*
====================================================
INITIAL STATE
====================================================
*/
const initialState = {
  products: [],

  loading: false,

  error: null,

  totalProducts: 0,

  totalPages: 1,

  currentPage: 1,

  limit: 10,

  createLoading: false,

  updateLoading: false,

  deleteLoading: false,

  successMessage: null,
};

/*
====================================================
SLICE
====================================================
*/
const adminProductSlice = createSlice({
  name: "adminProducts",

  initialState,

  reducers: {
    clearAdminProductError: (state) => {
      state.error = null;
    },

    clearAdminProductMessage: (state) => {
      state.successMessage = null;
    },

    resetAdminProducts: (state) => {
      state.products = [];
      state.loading = false;
      state.error = null;
      state.totalProducts = 0;
      state.totalPages = 1;
      state.currentPage = 1;
      state.limit = 10;
      state.createLoading = false;
      state.updateLoading = false;
      state.deleteLoading = false;
      state.successMessage = null;
    },
  },

  extraReducers: (builder) => {
    /*
    ================================================
    FETCH PRODUCTS
    ================================================
    */

    builder

      .addCase(
        fetchAdminProducts.pending,
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )

      .addCase(
        fetchAdminProducts.fulfilled,
        (state, action) => {
          state.loading = false;

          state.products =
            action.payload.data || [];

          state.totalProducts =
            action.payload.pagination?.total || 0;

          state.totalPages =
            action.payload.pagination?.pages || 1;

          state.currentPage =
            action.payload.pagination?.page || 1;

          state.limit =
            action.payload.pagination?.limit || 10;
        }
      )

      .addCase(
        fetchAdminProducts.rejected,
        (state, action) => {
          state.loading = false;

          state.error =
            action.payload ||
            "Failed to fetch products";
        }
      );

    /*
    ================================================
    CREATE PRODUCT
    ================================================
    */

    builder

      .addCase(
        createProduct.pending,
        (state) => {
          state.createLoading = true;
          state.error = null;
          state.successMessage = null;
        }
      )

      .addCase(
        createProduct.fulfilled,
        (state, action) => {
          state.createLoading = false;

          state.successMessage =
            action.payload.message ||
            "Product created successfully";

          /*
            Add newly created product
            to the beginning of the list.
          */
          if (action.payload.data) {
            state.products.unshift(
              action.payload.data
            );

            state.totalProducts += 1;
          }
        }
      )

      .addCase(
        createProduct.rejected,
        (state, action) => {
          state.createLoading = false;

          state.error =
            action.payload ||
            "Failed to create product";
        }
      );

    /*
    ================================================
    UPDATE PRODUCT
    ================================================
    */

    builder

      .addCase(
        updateProduct.pending,
        (state) => {
          state.updateLoading = true;
          state.error = null;
          state.successMessage = null;
        }
      )

      .addCase(
        updateProduct.fulfilled,
        (state, action) => {
          state.updateLoading = false;

          state.successMessage =
            action.payload.message ||
            "Product updated successfully";

          const updatedProduct =
            action.payload.data;

          if (updatedProduct) {
            const index =
              state.products.findIndex(
                (product) =>
                  product._id ===
                  updatedProduct._id
              );

            if (index !== -1) {
              state.products[index] =
                updatedProduct;
            }
          }
        }
      )

      .addCase(
        updateProduct.rejected,
        (state, action) => {
          state.updateLoading = false;

          state.error =
            action.payload ||
            "Failed to update product";
        }
      );

    /*
    ================================================
    DELETE PRODUCT
    ================================================
    */

    builder

      .addCase(
        deleteProduct.pending,
        (state) => {
          state.deleteLoading = true;
          state.error = null;
          state.successMessage = null;
        }
      )

      .addCase(
        deleteProduct.fulfilled,
        (state, action) => {
          state.deleteLoading = false;

          state.successMessage =
            action.payload.message ||
            "Product deleted successfully";

          state.products =
            state.products.filter(
              (product) =>
                product._id !==
                action.payload.productId
            );

          state.totalProducts = Math.max(
            state.totalProducts - 1,
            0
          );
        }
      )

      .addCase(
        deleteProduct.rejected,
        (state, action) => {
          state.deleteLoading = false;

          state.error =
            action.payload ||
            "Failed to delete product";
        }
      );
  },
});

/*
====================================================
EXPORT ACTIONS
====================================================
*/

export const {
  clearAdminProductError,
  clearAdminProductMessage,
  resetAdminProducts,
} = adminProductSlice.actions;

/*
====================================================
EXPORT REDUCER
====================================================
*/

export default adminProductSlice.reducer;