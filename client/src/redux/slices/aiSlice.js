import {
  createAsyncThunk,
  createSlice,
} from "@reduxjs/toolkit";

import aiService from "../../services/aiService";

/* =====================================================
   PHASE 15 - AI SHOPPING ASSISTANT
===================================================== */

export const sendAIMessage =
  createAsyncThunk(
    "ai/sendMessage",
    async (message, thunkAPI) => {
      try {
        return await aiService.sendAIMessage(
          message
        );
      } catch (error) {
        return thunkAPI.rejectWithValue(
          error.response?.data?.message ||
            "Unable to connect to AI Shopping Assistant."
        );
      }
    }
  );

/* =====================================================
   PHASE 16 - AI PRODUCT RECOMMENDATIONS
===================================================== */

export const fetchAIRecommendations =
  createAsyncThunk(
    "ai/fetchRecommendations",
    async (productId, thunkAPI) => {
      try {
        return await aiService.getAIRecommendations(
          productId
        );
      } catch (error) {
        return thunkAPI.rejectWithValue(
          error.response?.data?.message ||
            "Unable to load AI recommendations."
        );
      }
    }
  );

/* =====================================================
   PHASE 17 - AI PRODUCT COMPARISON
===================================================== */

export const compareProducts =
  createAsyncThunk(
    "ai/compareProducts",
    async (productIds, thunkAPI) => {
      try {
        return await aiService.compareProducts(
          productIds
        );
      } catch (error) {
        return thunkAPI.rejectWithValue(
          error.response?.data?.message ||
            "Unable to compare products."
        );
      }
    }
  );

  // PHASE 18 - AI Review Summary
export const fetchAIReviewSummary = createAsyncThunk(
  "ai/fetchAIReviewSummary",
  async (productId, thunkAPI) => {
    try {
      return await aiService.getAIReviewSummary(productId);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message ||
          "Unable to generate AI review summary."
      );
    }
  }
);
/* =====================================================
   INITIAL STATE
===================================================== */

const initialState = {
  /* Phase 15 */
  messages: [],
  loading: false,
  error: null,

  /* Phase 16 */
  recommendations: [],
  recommendationMessage: "",
  recommendationsLoading: false,
  recommendationsError: null,

  /* Phase 17 */
  comparisonProducts: [],
  comparison: null,
  comparisonLoading: false,
  comparisonError: null,

  // PHASE 18
  reviewSummary: null,
  reviewSummaryLoading: false,
  reviewSummaryError: null,
};

/* =====================================================
   SLICE
===================================================== */

const aiSlice = createSlice({
  name: "ai",

  initialState,

  reducers: {
    addUserMessage: (
      state,
      action
    ) => {
      state.messages.push({
        type: "user",
        text: action.payload,
      });
    },

    clearAIChat: (state) => {
      state.messages = [];
      state.error = null;
    },
  },

  extraReducers: (builder) => {

    /* =================================================
       PHASE 15 - SEND AI MESSAGE
    ================================================= */

    builder
      .addCase(
        sendAIMessage.pending,
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )

      .addCase(
        sendAIMessage.fulfilled,
        (state, action) => {
          state.loading = false;

          const data =
            action.payload.data;

          state.messages.push({
            type: "ai",
            text: data.message,
            recommendations:
              data.recommendations || [],
          });
        }
      )

      .addCase(
        sendAIMessage.rejected,
        (state, action) => {
          state.loading = false;

          state.error =
            action.payload;

          state.messages.push({
            type: "ai",
            text:
              action.payload ||
              "Sorry, something went wrong.",
            recommendations: [],
          });
        }
      );

    /* =================================================
       PHASE 16 - AI RECOMMENDATIONS
    ================================================= */

    builder
      .addCase(
        fetchAIRecommendations.pending,
        (state) => {
          state.recommendationsLoading =
            true;

          state.recommendationsError =
            null;
        }
      )

      .addCase(
        fetchAIRecommendations.fulfilled,
        (state, action) => {
          state.recommendationsLoading =
            false;

          const data =
            action.payload.data;

          state.recommendations =
            data.recommendations || [];

          state.recommendationMessage =
            data.message || "";
        }
      )

      .addCase(
        fetchAIRecommendations.rejected,
        (state, action) => {
          state.recommendationsLoading =
            false;

          state.recommendationsError =
            action.payload ||
            "Unable to load AI recommendations.";

          state.recommendations = [];
        }
      );

    /* =================================================
       PHASE 17 - PRODUCT COMPARISON
    ================================================= */

    builder
      .addCase(
        compareProducts.pending,
        (state) => {
          state.comparisonLoading =
            true;

          state.comparisonError =
            null;
        }
      )

      .addCase(
        compareProducts.fulfilled,
        (state, action) => {
          state.comparisonLoading =
            false;

          const data =
            action.payload.data;

          state.comparisonProducts =
            data.products || [];

          state.comparison =
            data.comparison || null;
        }
      )

      .addCase(
        compareProducts.rejected,
        (state, action) => {
          state.comparisonLoading =
            false;

          state.comparisonError =
            action.payload ||
            "Unable to compare products.";

          state.comparisonProducts = [];
          state.comparison = null;
        }
      );

      builder
         // PHASE 18 - AI Review Summary
.addCase(fetchAIReviewSummary.pending, (state) => {
  state.reviewSummaryLoading = true;
  state.reviewSummaryError = null;
})
.addCase(fetchAIReviewSummary.fulfilled, (state, action) => {
  state.reviewSummaryLoading = false;
  state.reviewSummary = action.payload.data || null;
})
.addCase(fetchAIReviewSummary.rejected, (state, action) => {
  state.reviewSummaryLoading = false;
  state.reviewSummaryError =
    action.payload || "Unable to generate AI review summary.";
})
  },
});

export const {
  addUserMessage,
  clearAIChat,
} = aiSlice.actions;

export default aiSlice.reducer;

