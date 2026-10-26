import { useEffect } from "react";

import {
  useDispatch,
  useSelector,
} from "react-redux";

import {
  FiRefreshCw,
  FiTrendingUp,
  FiActivity,
} from "react-icons/fi";

import {
  fetchDashboardStats,
  fetchRecentOrders,
  fetchSalesData,
} from "../../redux/slices/adminSlice";

import AdminStatCard from "../../components/admin/AdminStatCard";
import SalesChart from "../../components/admin/SalesChart";
import RecentOrdersTable from "../../components/admin/RecentOrdersTable";

const AdminDashboard = () => {
  const dispatch = useDispatch();

  const {
    stats,
    recentOrders,
    sales,
    loading,
    error,
  } = useSelector(
    (state) => state.admin
  );

  const loadDashboard = () => {
    dispatch(fetchDashboardStats());
    dispatch(fetchRecentOrders());
    dispatch(fetchSalesData());
  };

  useEffect(() => {
    loadDashboard();
  }, [dispatch]);

  const safeStats = {
    totalUsers: stats?.totalUsers || 0,
    totalProducts: stats?.totalProducts || 0,
    totalOrders: stats?.totalOrders || 0,
    totalRevenue: stats?.totalRevenue || 0,
    pendingOrders: stats?.pendingOrders || 0,
    deliveredOrders:
      stats?.deliveredOrders || 0,
  };

  if (loading) {
    return (
      <div className="shopsphere-admin-loading">

        <div className="shopsphere-admin-loading-spinner" />

        <h3>Loading Dashboard</h3>

        <p>
          Please wait while we load your
          store analytics.
        </p>

      </div>
    );
  }

  if (error) {
    return (
      <div className="shopsphere-admin-error-page">

        <div className="shopsphere-admin-error-icon">
          ⚠️
        </div>

        <h2>
          Unable to load dashboard
        </h2>

        <p>{error}</p>

        <button
          type="button"
          className="shopsphere-admin-primary-button"
          onClick={loadDashboard}
        >
          <FiRefreshCw />
          Try Again
        </button>

      </div>
    );
  }

  return (
    <div className="shopsphere-admin-dashboard">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="shopsphere-admin-dashboard-header">

        <div>
          <span className="shopsphere-admin-eyebrow">
            SHOPSPHERE ADMIN
          </span>

          <h1>
            Dashboard
          </h1>

          <p>
            Monitor your store performance,
            sales, orders, and customers.
          </p>
        </div>

        <button
          type="button"
          className="shopsphere-admin-refresh-button"
          onClick={loadDashboard}
          title="Refresh dashboard"
        >
          <FiRefreshCw />
          <span>Refresh</span>
        </button>

      </div>


      {/* =====================================================
          QUICK OVERVIEW
      ===================================================== */}

      <div className="shopsphere-admin-section-heading">

        <div>
          <h2>
            Store Overview
          </h2>

          <p>
            A quick look at your ShopSphere
            store.
          </p>
        </div>

        <div className="shopsphere-admin-live-indicator">
          <span />
          Live Data
        </div>

      </div>


      {/* =====================================================
          STATISTICS
      ===================================================== */}

      <div className="shopsphere-admin-stats-grid">

        <AdminStatCard
          title="Total Users"
          value={safeStats.totalUsers.toLocaleString()}
          type="users"
          description="Registered customers"
        />

        <AdminStatCard
          title="Total Products"
          value={safeStats.totalProducts.toLocaleString()}
          type="products"
          description="Products in catalog"
        />

        <AdminStatCard
          title="Total Orders"
          value={safeStats.totalOrders.toLocaleString()}
          type="orders"
          description="All customer orders"
        />

        <AdminStatCard
          title="Total Revenue"
          value={`₹${safeStats.totalRevenue.toLocaleString(
            "en-IN",
            {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            }
          )}`}
          type="revenue"
          description="Paid non-cancelled orders"
        />

        <AdminStatCard
          title="Pending Orders"
          value={safeStats.pendingOrders.toLocaleString()}
          type="pending"
          description="Awaiting processing"
        />

        <AdminStatCard
          title="Delivered Orders"
          value={safeStats.deliveredOrders.toLocaleString()}
          type="delivered"
          description="Successfully delivered"
        />

      </div>


      {/* =====================================================
          ANALYTICS HEADER
      ===================================================== */}

      <div className="shopsphere-admin-section-heading shopsphere-admin-analytics-heading">

        <div>
          <h2>
            Sales Analytics
          </h2>

          <p>
            Track your monthly revenue
            performance.
          </p>
        </div>

        <div className="shopsphere-admin-analytics-icon">
          <FiTrendingUp />
        </div>

      </div>


      {/* =====================================================
          SALES CHART
      ===================================================== */}

      <div className="shopsphere-admin-chart-wrapper">

        <SalesChart
          sales={sales}
        />

      </div>


      {/* =====================================================
          RECENT ORDERS
      ===================================================== */}

      <div className="shopsphere-admin-section-heading shopsphere-admin-orders-heading">

        <div>
          <h2>
            Recent Orders
          </h2>

          <p>
            Latest customer orders from
            your store.
          </p>
        </div>

        <div className="shopsphere-admin-activity-icon">
          <FiActivity />
        </div>

      </div>

      <RecentOrdersTable
        orders={recentOrders}
      />

    </div>
  );
};

export default AdminDashboard;