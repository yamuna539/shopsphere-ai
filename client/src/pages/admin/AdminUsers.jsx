import { useEffect, useMemo, useState } from "react";
import {
  Search,
  RefreshCw,
  Users,
  ShieldCheck,
  UserRound,
  Trash2,
  UserCog,
  CalendarDays,
  X,
} from "lucide-react";

import api from "../../services/api";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);

  const [loading, setLoading] = useState(true);

  const [refreshing, setRefreshing] =
    useState(false);

  const [error, setError] = useState("");

  const [success, setSuccess] =
    useState("");

  const [search, setSearch] = useState("");

  const [roleFilter, setRoleFilter] =
    useState("ALL");

  const [roleLoading, setRoleLoading] =
    useState(null);

  const [deleteLoading, setDeleteLoading] =
    useState(null);

  /*
  ==================================================
  FETCH USERS
  ==================================================
  */

  const fetchUsers = async (
    showRefresh = false
  ) => {
    try {
      if (showRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      const response =
        await api.get("/admin/users");

      const userData =
        response.data.data ||
        response.data.users ||
        [];

      setUsers(
        Array.isArray(userData)
          ? userData
          : []
      );
    } catch (error) {
      console.error(
        "Failed to fetch users:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to load users"
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  /*
  ==================================================
  INITIAL LOAD
  ==================================================
  */

  useEffect(() => {
    fetchUsers();
  }, []);

  /*
  ==================================================
  FILTER USERS
  ==================================================
  */

  const filteredUsers = useMemo(() => {
    const searchValue =
      search.trim().toLowerCase();

    return users.filter((user) => {
      const name =
        user.name?.toLowerCase() || "";

      const email =
        user.email?.toLowerCase() || "";

      const matchesSearch =
        !searchValue ||
        name.includes(searchValue) ||
        email.includes(searchValue);

      const matchesRole =
        roleFilter === "ALL" ||
        user.role === roleFilter;

      return (
        matchesSearch &&
        matchesRole
      );
    });
  }, [
    users,
    search,
    roleFilter,
  ]);

  /*
  ==================================================
  USER COUNTS
  ==================================================
  */

  const customerCount =
    users.filter(
      (user) =>
        user.role === "CUSTOMER"
    ).length;

  const adminCount =
    users.filter(
      (user) =>
        user.role === "ADMIN"
    ).length;

  /*
  ==================================================
  FORMAT DATE
  ==================================================
  */

  const formatDate = (date) => {
    if (!date) {
      return "—";
    }

    return new Date(date).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  /*
  ==================================================
  CHANGE ROLE
  ==================================================
  */

  const handleRoleChange = async (
    user,
    newRole
  ) => {
    if (!newRole || newRole === user.role) {
      return;
    }

    const confirmed = window.confirm(
      `Change ${user.name || "this user"}'s role from ${user.role} to ${newRole}?`
    );

    if (!confirmed) {
      return;
    }

    try {
      setRoleLoading(user._id);

      setError("");
      setSuccess("");

      const response =
        await api.patch(
          `/admin/users/${user._id}/role`,
          {
            role: newRole,
          }
        );

      const updatedUser =
        response.data.data ||
        response.data.user;

      setUsers((previous) =>
        previous.map((item) =>
          item._id === user._id
            ? {
                ...item,
                role:
                  updatedUser?.role ||
                  newRole,
              }
            : item
        )
      );

      setSuccess(
        `${user.name || "User"}'s role was updated to ${newRole}.`
      );
    } catch (error) {
      console.error(
        "Role update error:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to update user role"
      );
    } finally {
      setRoleLoading(null);
    }
  };

  /*
  ==================================================
  DELETE USER
  ==================================================
  */

  const handleDelete = async (user) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${user.name || user.email}"? This action cannot be undone.`
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeleteLoading(user._id);

      setError("");
      setSuccess("");

      await api.delete(
        `/admin/users/${user._id}`
      );

      setUsers((previous) =>
        previous.filter(
          (item) =>
            item._id !== user._id
        )
      );

      setSuccess(
        "User deleted successfully."
      );
    } catch (error) {
      console.error(
        "Delete user error:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to delete user"
      );
    } finally {
      setDeleteLoading(null);
    }
  };

  /*
  ==================================================
  ROLE CLASS
  ==================================================
  */

  const getRoleClass = (role) => {
    return role === "ADMIN"
      ? "admin"
      : "customer";
  };

  /*
  ==================================================
  LOADING
  ==================================================
  */

  if (loading) {
    return (
      <div className="admin-users-loading">

        <div className="admin-users-loading-icon">
          <RefreshCw size={21} />
        </div>

        <h4>
          Loading Users
        </h4>

        <p>
          Fetching ShopSphere user accounts...
        </p>

      </div>
    );
  }

  /*
  ==================================================
  UI
  ==================================================
  */

  return (
    <div className="admin-users-page">

      {/* =========================================
          HEADER
      ========================================= */}

      <div className="admin-users-header">

        <div className="admin-users-title">

          <div className="admin-users-title-icon">
            <Users size={22} />
          </div>

          <div>

            <span className="admin-users-eyebrow">
              USER MANAGEMENT
            </span>

            <h1>
              Users
            </h1>

            <p>
              Manage ShopSphere customer and
              administrator accounts.
            </p>

          </div>

        </div>

        <button
          type="button"
          className="admin-users-refresh"
          onClick={() =>
            fetchUsers(true)
          }
          disabled={refreshing}
        >
          <RefreshCw
            size={15}
            className={
              refreshing
                ? "admin-users-spin"
                : ""
            }
          />

          Refresh
        </button>

      </div>

      {/* =========================================
          ALERTS
      ========================================= */}

      {error && (
        <div className="admin-users-alert error">

          <div>
            <strong>
              Error
            </strong>

            <span>
              {error}
            </span>
          </div>

          <button
            type="button"
            onClick={() =>
              setError("")
            }
          >
            <X size={16} />
          </button>

        </div>
      )}

      {success && (
        <div className="admin-users-alert success">

          <div>
            <strong>
              Success
            </strong>

            <span>
              {success}
            </span>
          </div>

          <button
            type="button"
            onClick={() =>
              setSuccess("")
            }
          >
            <X size={16} />
          </button>

        </div>
      )}

      {/* =========================================
          STATS
      ========================================= */}

      <div className="admin-users-stats">

        <button
          type="button"
          className={`admin-user-stat ${
            roleFilter === "ALL"
              ? "active"
              : ""
          }`}
          onClick={() =>
            setRoleFilter("ALL")
          }
        >
          <div className="admin-user-stat-icon purple">
            <Users size={18} />
          </div>

          <div>
            <span>
              Total Users
            </span>

            <strong>
              {users.length}
            </strong>
          </div>

        </button>

        <button
          type="button"
          className={`admin-user-stat ${
            roleFilter === "CUSTOMER"
              ? "active"
              : ""
          }`}
          onClick={() =>
            setRoleFilter("CUSTOMER")
          }
        >
          <div className="admin-user-stat-icon blue">
            <UserRound size={18} />
          </div>

          <div>
            <span>
              Customers
            </span>

            <strong>
              {customerCount}
            </strong>
          </div>

        </button>

        <button
          type="button"
          className={`admin-user-stat ${
            roleFilter === "ADMIN"
              ? "active"
              : ""
          }`}
          onClick={() =>
            setRoleFilter("ADMIN")
          }
        >
          <div className="admin-user-stat-icon green">
            <ShieldCheck size={18} />
          </div>

          <div>
            <span>
              Administrators
            </span>

            <strong>
              {adminCount}
            </strong>
          </div>

        </button>

      </div>

      {/* =========================================
          MAIN CARD
      ========================================= */}

      <div className="admin-users-card">

        <div className="admin-users-card-header">

          <div>

            <h2>
              User Accounts
            </h2>

            <span>
              {filteredUsers.length} users shown
            </span>

          </div>

          <div className="admin-users-filter-label">
            {roleFilter === "ALL"
              ? "All users"
              : roleFilter}
          </div>

        </div>

        {/* =====================================
            TOOLBAR
        ====================================== */}

        <div className="admin-users-toolbar">

          <div className="admin-users-search">

            <Search size={16} />

            <input
              type="text"
              placeholder="Search by name or email..."
              value={search}
              onChange={(event) =>
                setSearch(
                  event.target.value
                )
              }
            />

            {search && (
              <button
                type="button"
                onClick={() =>
                  setSearch("")
                }
              >
                <X size={14} />
              </button>
            )}

          </div>

          <select
            className="admin-users-select"
            value={roleFilter}
            onChange={(event) =>
              setRoleFilter(
                event.target.value
              )
            }
          >
            <option value="ALL">
              All Roles
            </option>

            <option value="CUSTOMER">
              Customers
            </option>

            <option value="ADMIN">
              Administrators
            </option>
          </select>

        </div>

        {/* =====================================
            EMPTY
        ====================================== */}

        {filteredUsers.length === 0 ? (

          <div className="admin-users-empty">

            <div className="admin-users-empty-icon">
              <Users size={29} />
            </div>

            <h3>
              No users found
            </h3>

            <p>
              {search ||
              roleFilter !== "ALL"
                ? "Try changing your search or role filter."
                : "There are no registered users yet."}
            </p>

          </div>

        ) : (

          /* =====================================
             TABLE
          ====================================== */

          <div className="admin-users-table-wrapper">

            <table className="admin-users-table">

              <thead>

                <tr>

                  <th>
                    USER
                  </th>

                  <th>
                    EMAIL
                  </th>

                  <th>
                    ROLE
                  </th>

                  <th>
                    JOINED
                  </th>

                  <th>
                    ACTIONS
                  </th>

                </tr>

              </thead>

              <tbody>

                {filteredUsers.map(
                  (user) => {

                    const isRoleLoading =
                      roleLoading ===
                      user._id;

                    const isDeleteLoading =
                      deleteLoading ===
                      user._id;

                    const initials =
                      user.name
                        ?.trim()
                        ?.charAt(0)
                        ?.toUpperCase() ||
                      "U";

                    return (
                      <tr
                        key={user._id}
                      >

                        {/* USER */}

                        <td>

                          <div className="admin-user-info">

                            <div
                              className={`admin-user-avatar ${getRoleClass(
                                user.role
                              )}`}
                            >
                              {initials}
                            </div>

                            <div>

                              <strong>
                                {user.name ||
                                  "Unnamed User"}
                              </strong>

                              <span>
                                ID:{" "}
                                {String(
                                  user._id
                                ).slice(-8)}
                              </span>

                            </div>

                          </div>

                        </td>

                        {/* EMAIL */}

                        <td>

                          <span className="admin-user-email">
                            {user.email}
                          </span>

                        </td>

                        {/* ROLE */}

                        <td>

                          <div className="admin-user-role-control">

                            <span
                              className={`admin-user-role ${getRoleClass(
                                user.role
                              )}`}
                            >
                              {user.role ===
                              "ADMIN" ? (
                                <ShieldCheck
                                  size={12}
                                />
                              ) : (
                                <UserRound
                                  size={12}
                                />
                              )}

                              {user.role}
                            </span>

                            <select
                              value={
                                user.role
                              }
                              onChange={(
                                event
                              ) =>
                                handleRoleChange(
                                  user,
                                  event
                                    .target
                                    .value
                                )
                              }
                              disabled={
                                isRoleLoading ||
                                isDeleteLoading
                              }
                              aria-label={`Change role for ${
                                user.name ||
                                user.email
                              }`}
                            >
                              <option value="CUSTOMER">
                                CUSTOMER
                              </option>

                              <option value="ADMIN">
                                ADMIN
                              </option>
                            </select>

                            {isRoleLoading && (
                              <RefreshCw
                                size={13}
                                className="admin-users-spin"
                              />
                            )}

                          </div>

                        </td>

                        {/* JOINED */}

                        <td>

                          <div className="admin-user-date">

                            <CalendarDays
                              size={13}
                            />

                            {formatDate(
                              user.createdAt
                            )}

                          </div>

                        </td>

                        {/* ACTIONS */}

                        <td>

                          <button
                            type="button"
                            className="admin-user-delete"
                            disabled={
                              isDeleteLoading ||
                              isRoleLoading
                            }
                            onClick={() =>
                              handleDelete(
                                user
                              )
                            }
                          >

                            {isDeleteLoading ? (
                              <RefreshCw
                                size={14}
                                className="admin-users-spin"
                              />
                            ) : (
                              <Trash2
                                size={14}
                              />
                            )}

                            {isDeleteLoading
                              ? "Deleting..."
                              : "Delete"}

                          </button>

                        </td>

                      </tr>
                    );
                  }
                )}

              </tbody>

            </table>

          </div>

        )}

      </div>

    </div>
  );
};

export default AdminUsers;