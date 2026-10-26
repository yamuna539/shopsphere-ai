import {
  createAsyncThunk,
  createSlice,
} from "@reduxjs/toolkit";

import {
  getProductReviews,
  createReview,
  updateReview,
  deleteReview,
} from "../../services/reviewService";

export const fetchProductReviews =
  createAsyncThunk(
    "reviews/fetchProductReviews",
    async (
      productId,
      { rejectWithValue }
    ) => {
      try {
        return await getProductReviews(
          productId
        );
      } catch (error) {
        return rejectWithValue(
          error.response?.data?.message ||
            "Failed to fetch reviews"
        );
      }
    }
  );

export const submitReview =
  createAsyncThunk(
    "reviews/submitReview",
    async (
      { productId, reviewData },
      { rejectWithValue }
    ) => {
      try {
        return await createReview(
          productId,
          reviewData
        );
      } catch (error) {
        return rejectWithValue(
          error.response?.data?.message ||
            "Failed to submit review"
        );
      }
    }
  );

export const editReview =
  createAsyncThunk(
    "reviews/editReview",
    async (
      { reviewId, reviewData },
      { rejectWithValue }
    ) => {
      try {
        return await updateReview(
          reviewId,
          reviewData
        );
      } catch (error) {
        return rejectWithValue(
          error.response?.data?.message ||
            "Failed to update review"
        );
      }
    }
  );

export const removeReview =
  createAsyncThunk(
    "reviews/removeReview",
    async (
      reviewId,
      { rejectWithValue }
    ) => {
      try {
        await deleteReview(reviewId);

        return reviewId;
      } catch (error) {
        return rejectWithValue(
          error.response?.data?.message ||
            "Failed to delete review"
        );
      }
    }
  );

const initialState = {
  reviews: [],
  rating: 0,
  numReviews: 0,
  distribution: {
    5: 0,
    4: 0,
    3: 0,
    2: 0,
    1: 0,
  },
  loading: false,
  submitting: false,
  error: null,
};

const reviewSlice = createSlice({
  name: "reviews",

  initialState,

  reducers: {
    clearReviewError: (state) => {
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder

      .addCase(
        fetchProductReviews.pending,
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )

      .addCase(
        fetchProductReviews.fulfilled,
        (state, action) => {
          state.loading = false;

          const data =
            action.payload.data;

          state.reviews =
            data?.reviews || [];

          state.rating =
            data?.rating || 0;

          state.numReviews =
            data?.numReviews || 0;

          state.distribution =
            data?.distribution || {
              5: 0,
              4: 0,
              3: 0,
              2: 0,
              1: 0,
            };
        }
      )

      .addCase(
        fetchProductReviews.rejected,
        (state, action) => {
          state.loading = false;
          state.error = action.payload;
        }
      )

      .addCase(
        submitReview.pending,
        (state) => {
          state.submitting = true;
          state.error = null;
        }
      )

      .addCase(
        submitReview.fulfilled,
        (state, action) => {
          state.submitting = false;

          state.reviews.unshift(
            action.payload.data
          );

          state.numReviews += 1;
        }
      )

      .addCase(
        submitReview.rejected,
        (state, action) => {
          state.submitting = false;
          state.error = action.payload;
        }
      )

      .addCase(
        editReview.fulfilled,
        (state, action) => {
          const index =
            state.reviews.findIndex(
              (review) =>
                review._id ===
                action.payload.data._id
            );

          if (index !== -1) {
            state.reviews[index] =
              action.payload.data;
          }
        }
      )

      .addCase(
        removeReview.fulfilled,
        (state, action) => {
          state.reviews =
            state.reviews.filter(
              (review) =>
                review._id !==
                action.payload
            );

          state.numReviews =
            Math.max(
              0,
              state.numReviews - 1
            );
        }
      );
  },
});

export const {
  clearReviewError,
} = reviewSlice.actions;

export default reviewSlice.reducer;