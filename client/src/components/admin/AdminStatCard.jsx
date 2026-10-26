import {
  FiUsers,
  FiPackage,
  FiShoppingCart,
  FiDollarSign,
  FiClock,
  FiCheckCircle,
} from "react-icons/fi";

const iconMap = {
  users: FiUsers,
  products: FiPackage,
  orders: FiShoppingCart,
  revenue: FiDollarSign,
  pending: FiClock,
  delivered: FiCheckCircle,
};

const AdminStatCard = ({
  title,
  value,
  icon,
  description,
  type = "orders",
}) => {
  const Icon =
    iconMap[type] || FiShoppingCart;

  return (
    <div className="shopsphere-admin-stat-card">

      <div className="shopsphere-admin-stat-top">

        <div>
          <p className="shopsphere-admin-stat-title">
            {title}
          </p>

          <h3 className="shopsphere-admin-stat-value">
            {value}
          </h3>
        </div>

        <div
          className={`shopsphere-admin-stat-icon shopsphere-admin-stat-${type}`}
        >
          <Icon />
        </div>

      </div>

      {description && (
        <div className="shopsphere-admin-stat-description">
          {description}
        </div>
      )}

    </div>
  );
};

export default AdminStatCard;