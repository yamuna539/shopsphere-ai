import {
  NavLink,
  Link,
  useNavigate,
} from "react-router-dom";

import {
  LayoutDashboard,
  Package,
  Layers3,
  ShoppingCart,
  Users,
  ArrowLeft,
  LogOut,
} from "lucide-react";

const AdminSidebar = () => {

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  };

  const navClass = ({ isActive }) =>
    `shopsphere-admin-sidebar-link ${
      isActive ? "active" : ""
    }`;

  return (
    <aside className="shopsphere-admin-sidebar">

      {/* BRAND */}

      <div className="shopsphere-admin-sidebar-brand">

        <Link to="/admin">

          <div className="shopsphere-admin-sidebar-logo">
            🛍️
          </div>

          <div>
            <strong>
              ShopSphere
            </strong>

            <span>
              ADMIN
            </span>
          </div>

        </Link>

      </div>


      {/* MAIN MENU */}

      <div className="shopsphere-admin-sidebar-section">

        <p className="shopsphere-admin-sidebar-label">
          MAIN MENU
        </p>

        <nav className="shopsphere-admin-sidebar-nav">

          <NavLink
            to="/admin"
            end
            className={navClass}
          >
            <LayoutDashboard />
            <span>Dashboard</span>
          </NavLink>


          <NavLink
            to="/admin/products"
            className={navClass}
          >
            <Package />
            <span>Products</span>
          </NavLink>


          <NavLink
            to="/admin/categories"
            className={navClass}
          >
            <Layers3 />
            <span>Categories</span>
          </NavLink>


          <NavLink
            to="/admin/orders"
            className={navClass}
          >
            <ShoppingCart />
            <span>Orders</span>
          </NavLink>


          <NavLink
            to="/admin/users"
            className={navClass}
          >
            <Users />
            <span>Users</span>
          </NavLink>

        </nav>

      </div>


      {/* BOTTOM */}

      <div className="shopsphere-admin-sidebar-bottom">

        <p className="shopsphere-admin-sidebar-label">
          QUICK ACTIONS
        </p>


        <Link
          to="/"
          className="shopsphere-admin-sidebar-secondary-link"
        >
          <ArrowLeft />
          <span>Back to Store</span>
        </Link>


        <button
          type="button"
          onClick={handleLogout}
          className="shopsphere-admin-sidebar-logout"
        >
          <LogOut />
          <span>Logout</span>
        </button>

      </div>


      {/* STATUS */}

      <div className="shopsphere-admin-sidebar-footer">

        <div className="shopsphere-admin-sidebar-status">

          <span></span>

          <span>
            Admin Panel Active
          </span>

        </div>

        <small>
          ShopSphere AI
        </small>

      </div>

    </aside>
  );
};

export default AdminSidebar;