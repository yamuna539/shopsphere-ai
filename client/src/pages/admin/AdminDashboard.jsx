import { useEffect } from "react";

import {
  useDispatch,
  useSelector,
} from "react-redux";

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

  useEffect(() => {
    dispatch(fetchDashboardStats());
    dispatch(fetchRecentOrders());
    dispatch(fetchSalesData());
  }, [dispatch]);

  if (loading) {
    return (
      <div className="container py-5">
        <div className="text-center">
          Loading dashboard...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid py-4 px-4">

      {/* Header */}

      <div className="mb-4">

        <h2 className="fw-bold mb-1">
          Admin Dashboard
        </h2>

        <p className="text-muted mb-0">
          Monitor your ShopSphere store performance.
        </p>

      </div>

      {/* Stats */}

      <div className="row g-4 mb-4">

        <div className="col-sm-6 col-xl-4">

          <AdminStatCard
            title="Total Users"
            value={stats.totalUsers.toLocaleString()}
            icon="👥"
            description="Registered customers"
          />

        </div>

        <div className="col-sm-6 col-xl-4">

          <AdminStatCard
            title="Total Products"
            value={stats.totalProducts.toLocaleString()}
            icon="📦"
            description="Products in catalog"
          />

        </div>

        <div className="col-sm-6 col-xl-4">

          <AdminStatCard
            title="Total Orders"
            value={stats.totalOrders.toLocaleString()}
            icon="🛒"
            description="All customer orders"
          />

        </div>

        <div className="col-sm-6 col-xl-4">

          <AdminStatCard
            title="Total Revenue"
            value={`₹${stats.totalRevenue.toLocaleString(
              "en-IN",
              {
                minimumFractionDigits: 2,
              }
            )}`}
            icon="💰"
            description="Paid non-cancelled orders"
          />

        </div>

        <div className="col-sm-6 col-xl-4">

          <AdminStatCard
            title="Pending Orders"
            value={stats.pendingOrders.toLocaleString()}
            icon="⏳"
            description="Orders awaiting processing"
          />

        </div>

        <div className="col-sm-6 col-xl-4">

          <AdminStatCard
            title="Delivered Orders"
            value={stats.deliveredOrders.toLocaleString()}
            icon="✅"
            description="Successfully delivered"
          />

        </div>

      </div>

      {/* Sales */}

      <div className="row g-4 mb-4">

        <div className="col-12">

          <SalesChart
            sales={sales}
          />

        </div>

      </div>

      {/* Recent Orders */}

      <div className="row">

        <div className="col-12">

          <RecentOrdersTable
            orders={recentOrders}
          />

        </div>

      </div>

    </div>
  );
};

export default AdminDashboard;