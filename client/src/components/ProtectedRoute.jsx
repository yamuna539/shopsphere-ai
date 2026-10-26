import {
  Navigate,
  useLocation,
} from "react-router-dom";

import { useSelector } from "react-redux";

const ProtectedRoute = ({
  children,
}) => {
  const location = useLocation();

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
          Checking Authentication
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
        state={{
          from: location.pathname,
        }}
      />
    );
  }

  return children;
};

export default ProtectedRoute;