import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const AdminRoute = ({
  children,
}) => {
  const {
    user,
    loading,
  } = useSelector(
    (state) => state.auth
  );

  if (loading) {
    return (
      <div className="shopsphere-admin-route-loading">

        <div className="shopsphere-admin-loading-spinner" />

        <h3>
          Checking Admin Access
        </h3>

        <p>
          Please wait...
        </p>

      </div>
    );
  }

  if (!user) {
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  if (user.role !== "ADMIN") {
    return (
      <Navigate
        to="/"
        replace
      />
    );
  }

  return children;
};

export default AdminRoute;