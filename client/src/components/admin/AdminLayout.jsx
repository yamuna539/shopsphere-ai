import { Outlet } from "react-router-dom";
import AdminSidebar from "../../components/admin/AdminSidebar";

const AdminLayout = () => {
  return (
    <div className="shopsphere-admin-layout">

      <div className="shopsphere-admin-sidebar-wrapper">
        <AdminSidebar />
      </div>

      <main className="shopsphere-admin-main">

        <div className="shopsphere-admin-topbar">
          <div className="shopsphere-admin-topbar-left">
            <div>
              <span>Admin Panel</span>
              <h2>Dashboard</h2>
            </div>
          </div>

          <div className="shopsphere-admin-topbar-right">

            <button
              type="button"
              className="shopsphere-admin-icon-button"
              aria-label="Notifications"
            >
              🔔
            </button>

            <div className="shopsphere-admin-user">

              <div className="shopsphere-admin-user-avatar">
                A
              </div>

              <div>
                <strong>ShopSphere Admin</strong>
                <span>Administrator</span>
              </div>

            </div>

          </div>
        </div>

        <div className="shopsphere-admin-content">
          <Outlet />
        </div>

      </main>

    </div>
  );
};

export default AdminLayout;