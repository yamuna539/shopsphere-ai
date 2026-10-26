import {
  createAsyncThunk,
  createSlice,
} from "@reduxjs/toolkit";

import api from "../../services/api";


// ======================================================
// REGISTER USER
// ======================================================

export const registerUser = createAsyncThunk(
  "auth/registerUser",

  async (userData, thunkAPI) => {
    try {
      const response = await api.post(
        "/auth/register",
        userData
      );

      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message ||
          "Registration failed. Please try again."
      );
    }
  }
);


// ======================================================
// LOGIN USER
// ======================================================

export const loginUser = createAsyncThunk(
  "auth/loginUser",

  async (credentials, thunkAPI) => {
    try {
      const response = await api.post(
        "/auth/login",
        credentials
      );

      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message ||
          "Login failed. Please check your email and password."
      );
    }
  }
);


// ======================================================
// INITIAL STATE
// ======================================================

const savedUser = localStorage.getItem("user");
const savedToken = localStorage.getItem("token");

const initialState = {
  user: savedUser
    ? JSON.parse(savedUser)
    : null,

  token: savedToken || null,

  isAuthenticated: !!savedToken,

  loading: false,

  error: null,
};


// ======================================================
// AUTH SLICE
// ======================================================

const authSlice = createSlice({
  name: "auth",

  initialState,

  reducers: {

    // ==============================================
    // LOGOUT
    // ==============================================

    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;

      localStorage.removeItem("token");
      localStorage.removeItem("user");
    },


    // ==============================================
    // CLEAR AUTH ERROR
    // ==============================================

    clearAuthError: (state) => {
      state.error = null;
    },

  },


  // ==================================================
  // ASYNC ACTIONS
  // ==================================================

  extraReducers: (builder) => {

    // =================================================
    // REGISTER
    // =================================================

    builder

      .addCase(
        registerUser.pending,
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )

      .addCase(
        registerUser.fulfilled,
        (state) => {
          state.loading = false;
          state.error = null;
        }
      )

      .addCase(
        registerUser.rejected,
        (state, action) => {
          state.loading = false;
          state.error = action.payload;
        }
      );


    // =================================================
    // LOGIN
    // =================================================

    builder

      .addCase(
        loginUser.pending,
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )

      .addCase(
        loginUser.fulfilled,
        (state, action) => {

          state.loading = false;
          state.error = null;

          /*
            Backend may return:

            {
              token,
              user
            }

            OR:

            {
              data: {
                token,
                user
              }
            }
          */

          const responseData =
            action.payload?.data ||
            action.payload;

          const token =
            responseData?.token;

          const user =
            responseData?.user;


          // Save Redux state

          state.token = token || null;

          state.user = user || null;

          state.isAuthenticated =
            !!token;


          // Save token

          if (token) {
            localStorage.setItem(
              "token",
              token
            );
          }


          // Save user

          if (user) {
            localStorage.setItem(
              "user",
              JSON.stringify(user)
            );
          }
        }
      )

      .addCase(
        loginUser.rejected,
        (state, action) => {
          state.loading = false;
          state.error = action.payload;
        }
      );
  },
});


// ======================================================
// ACTIONS
// ======================================================

export const {
  logout,
  clearAuthError,
} = authSlice.actions;


// ======================================================
// REDUCER
// ======================================================

export default authSlice.reducer;