import { configureStore } from "@reduxjs/toolkit";

import authReducer from "./slices/authSlice";
import productReducer from "./slices/productSlice";
import categoryReducer from "./slices/categorySlice";
import cartReducer from "./slices/cartSlice";
import wishlistReducer from "./slices/wishlistSlice";
import orderReducer from "./slices/orderSlice";
import paymentReducer from "./slices/paymentSlice";
import reviewReducer from "./slices/reviewSlice";
import adminReducer from "./slices/adminSlice";
import adminProductReducer from "./slices/adminProductSlice";
import aiReducer from "./slices/aiSlice";


export const store = configureStore({
  reducer: {
    auth: authReducer,
    products: productReducer,
    categories: categoryReducer,
    cart: cartReducer,
    wishlist: wishlistReducer,
    orders: orderReducer,
    payment: paymentReducer,
    review: reviewReducer,
    admin: adminReducer,
    adminProducts: adminProductReducer,
    ai: aiReducer,
    
  },
});