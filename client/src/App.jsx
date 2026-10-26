import {
  Routes,
  Route,
  useLocation,
} from "react-router-dom";

import Register from "./pages/Register";
import Login from "./pages/Login";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Profile from "./pages/Profile";
import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetails from "./pages/ProductDetails";

import Cart from "./pages/Cart";
import Wishlist from "./pages/Wishlist";
import Checkout from "./pages/Checkout";
import OrderSuccess from "./pages/OrderSuccess";
import Orders from "./pages/Orders";
import OrderDetails from "./pages/OrderDetails";

import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminProductForm from "./pages/admin/AdminProductForm";
import AdminCategories from "./pages/admin/AdminCategories";
import AdminCategoryForm from "./pages/admin/AdminCategoryForm";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminOrderDetails from "./pages/admin/AdminOrderDetails";

import AdminRoute from "./components/AdminRoute";
import AdminLayout from "./components/admin/AdminLayout";

import AIAssistant from "./pages/AIAssistant";
import ProductCompare from "./pages/ProductCompare";


function App() {
  const location = useLocation();

  /*
  ========================================================
  ADMIN ROUTE CHECK
  ========================================================
  */

  const isAdminRoute =
    location.pathname.startsWith("/admin");


  return (
    <div className="shopsphere-app">

      {/* ==================================================
          PUBLIC NAVBAR
          Hide on Admin pages
      ================================================== */}

      {!isAdminRoute && <Navbar />}


      {/* ==================================================
          APPLICATION ROUTES
      ================================================== */}

      <Routes>

        {/* ==================================================
            PUBLIC ROUTES
        ================================================== */}

        <Route
          path="/"
          element={<Home />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/products"
          element={<Products />}
        />

        <Route
          path="/products/:id"
          element={<ProductDetails />}
        />

        <Route
          path="/ai-assistant"
          element={<AIAssistant />}
        />

        <Route
          path="/compare"
          element={<ProductCompare />}
        />

        <Route
          path="/cart"
          element={<Cart />}
        />

        <Route
          path="/wishlist"
          element={<Wishlist />}
        />

        <Route
          path="/profile"
          element={<Profile />}
        />

        <Route
          path="/checkout"
          element={<Checkout />}
        />

        <Route
          path="/order-success/:id"
          element={<OrderSuccess />}
        />

        <Route
          path="/orders"
          element={<Orders />}
        />

        <Route
          path="/orders/:id"
          element={<OrderDetails />}
        />


        {/* ==================================================
            ADMIN ROUTES
        ================================================== */}

        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminLayout />
            </AdminRoute>
          }
        >

          <Route
            index
            element={<AdminDashboard />}
          />

          <Route
            path="products"
            element={<AdminProducts />}
          />

          <Route
            path="products/new"
            element={<AdminProductForm />}
          />

          <Route
            path="products/:id/edit"
            element={<AdminProductForm />}
          />

          <Route
  path="categories"
  element={<AdminCategories />}
/>

<Route
  path="categories/new"
  element={<AdminCategoryForm />}
/>

<Route
  path="categories/:id/edit"
  element={<AdminCategoryForm />}
/>

          <Route
            path="orders"
            element={<AdminOrders />}
          />

          <Route
  path="orders"
  element={<AdminOrders />}
/>

<Route
  path="orders/:id"
  element={<AdminOrderDetails />}
/>

          <Route
            path="users"
            element={<AdminUsers />}
          />

        </Route>


        {/* ==================================================
            404
        ================================================== */}

        <Route
          path="*"
          element={
            <div className="shopsphere-404">
              <h1>404</h1>

              <p>
                The page you are looking for
                does not exist.
              </p>
            </div>
          }
        />

      </Routes>


      {/* ==================================================
          PUBLIC FOOTER
          Hide on Admin pages
      ================================================== */}

      {!isAdminRoute && <Footer />}

    </div>
  );
}

export default App;