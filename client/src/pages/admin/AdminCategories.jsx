import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  FolderTree,
  Package,
  RefreshCw,
  X,
} from "lucide-react";

import api from "../../services/api";

const AdminCategories = () => {
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [deleteLoading, setDeleteLoading] =
    useState(null);

  const [search, setSearch] = useState("");

  /*
  ==================================================
  FETCH CATEGORIES
  ==================================================
  */

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError("");

      const response =
        await api.get("/categories");

      setCategories(
        response.data.categories || []
      );
    } catch (error) {
      console.error(
        "Failed to fetch categories:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to load categories"
      );
    } finally {
      setLoading(false);
    }
  };

  /*
  ==================================================
  INITIAL LOAD
  ==================================================
  */

  useEffect(() => {
    fetchCategories();
  }, []);

  /*
  ==================================================
  FILTER CATEGORIES
  ==================================================
  */

  const filteredCategories = useMemo(() => {
    const searchValue =
      search.trim().toLowerCase();

    if (!searchValue) {
      return categories;
    }

    return categories.filter((category) => {
      const name =
        category.name
          ?.toLowerCase() || "";

      const slug =
        category.slug
          ?.toLowerCase() || "";

      return (
        name.includes(searchValue) ||
        slug.includes(searchValue)
      );
    });
  }, [categories, search]);

  /*
  ==================================================
  DELETE CATEGORY
  ==================================================
  */

  const handleDelete = async (category) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${category.name}"?`
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeleteLoading(category._id);
      setError("");

      await api.delete(
        `/admin/categories/${category._id}`
      );

      setCategories((previous) =>
        previous.filter(
          (item) =>
            item._id !== category._id
        )
      );
    } catch (error) {
      console.error(
        "Delete category error:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to delete category"
      );
    } finally {
      setDeleteLoading(null);
    }
  };

  /*
  ==================================================
  TOTAL PRODUCTS
  ==================================================
  */

  const totalProducts = categories.reduce(
    (total, category) =>
      total +
      Number(category.productCount || 0),
    0
  );

  /*
  ==================================================
  LOADING
  ==================================================
  */

  if (loading) {
    return (
      <div className="admin-categories-loading">

        <div className="admin-categories-spinner">
          <RefreshCw size={22} />
        </div>

        <h4>
          Loading Categories
        </h4>

        <p>
          Please wait while we load your
          category catalog...
        </p>

      </div>
    );
  }

  /*
  ==================================================
  MAIN UI
  ==================================================
  */

  return (
    <div className="admin-categories-page">

      {/* =========================================
          HEADER
      ========================================= */}

      <div className="admin-categories-header">

        <div className="admin-categories-header-left">

          <div className="admin-categories-header-icon">
            <FolderTree size={22} />
          </div>

          <div>

            <span className="admin-categories-eyebrow">
              CATALOG MANAGEMENT
            </span>

            <h1>
              Categories
            </h1>

            <p>
              Organize and manage your
              ShopSphere product categories.
            </p>

          </div>

        </div>

        <button
          type="button"
          className="admin-category-add-button"
          onClick={() =>
            navigate(
              "/admin/categories/new"
            )
          }
        >
          <Plus size={17} />
          Add Category
        </button>

      </div>

      {/* =========================================
          ERROR
      ========================================= */}

      {error && (
        <div className="admin-category-alert">

          <div className="admin-category-alert-content">

            <div className="admin-category-alert-icon">
              !
            </div>

            <div>
              <strong>
                Something went wrong
              </strong>

              <p>
                {error}
              </p>
            </div>

          </div>

          <button
            type="button"
            onClick={() =>
              setError("")
            }
            aria-label="Close error"
          >
            <X size={17} />
          </button>

        </div>
      )}

      {/* =========================================
          STAT CARDS
      ========================================= */}

      <div className="admin-category-stats">

        <div className="admin-category-stat-card">

          <div className="admin-category-stat-icon purple">
            <FolderTree size={19} />
          </div>

          <div>
            <span>
              Total Categories
            </span>

            <strong>
              {categories.length}
            </strong>
          </div>

        </div>

        <div className="admin-category-stat-card">

          <div className="admin-category-stat-icon blue">
            <Package size={19} />
          </div>

          <div>
            <span>
              Products Assigned
            </span>

            <strong>
              {totalProducts}
            </strong>
          </div>

        </div>

        <div className="admin-category-stat-card">

          <div className="admin-category-stat-icon green">
            <span className="admin-category-status-dot" />
          </div>

          <div>
            <span>
              Active Categories
            </span>

            <strong>
              {categories.length}
            </strong>
          </div>

        </div>

      </div>

      {/* =========================================
          MAIN CARD
      ========================================= */}

      <div className="admin-categories-card">

        {/* CARD HEADER */}

        <div className="admin-categories-card-header">

          <div>

            <h2>
              Category Catalog
            </h2>

            <span>
              {filteredCategories.length}{" "}
              categories shown
            </span>

          </div>

          <button
            type="button"
            className="admin-category-refresh"
            onClick={fetchCategories}
            title="Refresh categories"
          >
            <RefreshCw
              size={16}
            />
          </button>

        </div>

        {/* SEARCH */}

        <div className="admin-category-toolbar">

          <div className="admin-category-search">

            <Search size={17} />

            <input
              type="text"
              value={search}
              onChange={(event) =>
                setSearch(
                  event.target.value
                )
              }
              placeholder="Search categories..."
            />

            {search && (
              <button
                type="button"
                onClick={() =>
                  setSearch("")
                }
                aria-label="Clear search"
              >
                <X size={15} />
              </button>
            )}

          </div>

        </div>

        {/* =====================================
            EMPTY
        ====================================== */}

        {categories.length === 0 ? (
          <div className="admin-category-empty">

            <div className="admin-category-empty-icon">
              <FolderTree size={30} />
            </div>

            <h3>
              No categories yet
            </h3>

            <p>
              Create your first product
              category to organize your
              catalog.
            </p>

            <button
              type="button"
              className="admin-category-add-button"
              onClick={() =>
                navigate(
                  "/admin/categories/new"
                )
              }
            >
              <Plus size={17} />
              Create Category
            </button>

          </div>
        ) : filteredCategories.length ===
          0 ? (
          <div className="admin-category-empty compact">

            <div className="admin-category-empty-icon">
              <Search size={25} />
            </div>

            <h3>
              No matching categories
            </h3>

            <p>
              Try a different search term.
            </p>

            <button
              type="button"
              className="admin-category-clear-button"
              onClick={() =>
                setSearch("")
              }
            >
              Clear Search
            </button>

          </div>
        ) : (

          /* =====================================
             TABLE
          ====================================== */

          <div className="admin-category-table-wrapper">

            <table className="admin-category-table">

              <thead>

                <tr>

                  <th>
                    CATEGORY
                  </th>

                  <th>
                    PRODUCTS
                  </th>

                  <th>
                    STATUS
                  </th>

                  <th>
                    ACTIONS
                  </th>

                </tr>

              </thead>

              <tbody>

                {filteredCategories.map(
                  (category) => {

                    const productCount =
                      Number(
                        category.productCount ||
                          0
                      );

                    return (
                      <tr
                        key={
                          category._id
                        }
                      >

                        {/* CATEGORY */}

                        <td>

                          <div className="admin-category-info">

                            <div className="admin-category-avatar">
                              <FolderTree
                                size={18}
                              />
                            </div>

                            <div>

                              <strong>
                                {
                                  category.name
                                }
                              </strong>

                              {category.slug && (
                                <span>
                                  /{category.slug}
                                </span>
                              )}

                            </div>

                          </div>

                        </td>

                        {/* PRODUCT COUNT */}

                        <td>

                          <div className="admin-category-products">

                            <Package
                              size={15}
                            />

                            <strong>
                              {
                                productCount
                              }
                            </strong>

                            <span>
                              {productCount ===
                              1
                                ? "product"
                                : "products"}
                            </span>

                          </div>

                        </td>

                        {/* STATUS */}

                        <td>

                          <span className="admin-category-status">

                            <span />

                            Active

                          </span>

                        </td>

                        {/* ACTIONS */}

                        <td>

                          <div className="admin-category-actions">

                            <button
                              type="button"
                              className="admin-category-action edit"
                              onClick={() =>
                                navigate(
                                  `/admin/categories/${category._id}/edit`
                                )
                              }
                              title="Edit category"
                            >
                              <Pencil
                                size={15}
                              />
                              <span>
                                Edit
                              </span>
                            </button>

                            <button
                              type="button"
                              className="admin-category-action delete"
                              disabled={
                                deleteLoading ===
                                category._id
                              }
                              onClick={() =>
                                handleDelete(
                                  category
                                )
                              }
                              title="Delete category"
                            >

                              {deleteLoading ===
                              category._id ? (
                                <RefreshCw
                                  size={15}
                                  className="admin-category-delete-spin"
                                />
                              ) : (
                                <Trash2
                                  size={15}
                                />
                              )}

                              <span>
                                {deleteLoading ===
                                category._id
                                  ? "Deleting..."
                                  : "Delete"}
                              </span>

                            </button>

                          </div>

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

export default AdminCategories;