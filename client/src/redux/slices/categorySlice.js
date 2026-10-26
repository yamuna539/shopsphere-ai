import {
  createAsyncThunk,
  createSlice,
} from "@reduxjs/toolkit";

import {
  getCategories,
} from "../../services/categoryService";

/*
==================================================
FETCH CATEGORIES
==================================================
*/

export const fetchCategories =
  createAsyncThunk(
    "categories/fetchCategories",

    async (_, thunkAPI) => {
      try {
        const response =
          await getCategories();

        return response;
      } catch (error) {
        return thunkAPI.rejectWithValue(
          error.response?.data
            ?.message ||
            "Failed to fetch categories"
        );
      }
    }
  );

/*
==================================================
INITIAL STATE
==================================================
*/

const initialState = {
  categories: [],

  loading: false,

  error: null,
};

/*
==================================================
SLICE
==================================================
*/

const categorySlice =
  createSlice({
    name: "categories",

    initialState,

    reducers: {},

    extraReducers: (builder) => {
      builder

        /*
        ==========================================
        PENDING
        ==========================================
        */

        .addCase(
          fetchCategories.pending,
          (state) => {
            state.loading =
              true;

            state.error =
              null;
          }
        )

        /*
        ==========================================
        SUCCESS
        ==========================================
        */

        .addCase(
          fetchCategories.fulfilled,
          (
            state,
            action
          ) => {
            state.loading =
              false;

            const payload =
              action.payload;

            /*
            Backend returns:

            {
              success: true,
              count: 7,
              categories: [...]
            }
            */

            if (
              Array.isArray(
                payload
              )
            ) {
              state.categories =
                payload;
            } else {
              state.categories =
                payload?.categories ||
                [];
            }
          }
        )

        /*
        ==========================================
        ERROR
        ==========================================
        */

        .addCase(
          fetchCategories.rejected,
          (
            state,
            action
          ) => {
            state.loading =
              false;

            state.error =
              action.payload ||
              "Failed to fetch categories";

            state.categories =
              [];
          }
        );
    },
  });

export default categorySlice.reducer;