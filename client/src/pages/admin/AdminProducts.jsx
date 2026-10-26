import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  Package,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
} from "lucide-react";

import {
  fetchAdminProducts,
  deleteProduct,
  clearAdminProductError,
  clearAdminProductMessage,
} from "../../redux/slices/adminProductSlice";

const AdminProducts = () => {
  const dispatch = useDispatch();

  const {
    products,
    loading,
    error,
    totalProducts,
    totalPages,
    currentPage,
    limit,
    deleteLoading,
    successMessage,
  } = useSelector((state) => state.adminProducts);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [stock, setStock] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    dispatch(
      fetchAdminProducts({
        search,
        category,
        stock,
        page,
        limit: 10,
      })
    );
  }, [dispatch, search, category, stock, page]);

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        dispatch(clearAdminProductMessage());
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [successMessage, dispatch]);

  const handleSearch = (event) => {
    setSearch(event.target.value);
    setPage(1);
  };

  const handleCategoryChange = (event) => {
    setCategory(event.target.value);
    setPage(1);
  };

  const handleStockChange = (event) => {
    setStock(event.target.value);
    setPage(1);
  };

  const handleDelete = async (productId, productName) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${productName}"?`
    );

    if (!confirmed) {
      return;
    }

    await dispatch(deleteProduct(productId));

    dispatch(
      fetchAdminProducts({
        search,
        category,
        stock,
        page,
        limit: 10,
      })
    );
  };

  const handleRefresh = () => {
    dispatch(
      fetchAdminProducts({
        search,
        category,
        stock,
        page,
        limit: 10,
      })
    );
  };

  const formatPrice = (price) => {
    return `₹${Number(price || 0).toLocaleString("en-IN")}`;
  };

  const getStockStatus = (product) => {
    const stockValue = Number(product.stock || 0);

    if (stockValue === 0) {
      return {
        label: "Out of Stock",
        className: "admin-stock-danger",
      };
    }

    if (stockValue <= 5) {
      return {
        label: "Low Stock",
        className: "admin-stock-warning",
      };
    }

    return {
      label: "In Stock",
      className: "admin-stock-success",
    };
  };

  return (
    <div className="admin-products-page">

      {/* =========================================
          PAGE HEADER
      ========================================== */}

      <div className="admin-page-header">

        <div>
          <span className="admin-page-eyebrow">
            CATALOG MANAGEMENT
          </span>

          <h1>Products</h1>

          <p>
            Manage your ShopSphere product catalog.
          </p>
        </div>

        <Link
          to="/admin/products/new"
          className="admin-primary-button"
        >
          <Plus size={18} />
          Add Product
        </Link>

      </div>

      {/* =========================================
          ALERTS
      ========================================== */}

      {successMessage && (
        <div className="admin-alert admin-alert-success">
          <span>✓</span>
          {successMessage}
        </div>
      )}

      {error && (
        <div className="admin-alert admin-alert-error">

          <div>
            <strong>Something went wrong</strong>
            <p>{error}</p>
          </div>

          <button
            type="button"
            onClick={() => dispatch(clearAdminProductError())}
          >
            ×
          </button>

        </div>
      )}

      {/* =========================================
          FILTER BAR
      ========================================== */}

      <div className="admin-products-toolbar">

        <div className="admin-search-box">

          <Search size={18} />

          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={handleSearch}
          />

        </div>

        <select
          value={category}
          onChange={handleCategoryChange}
          className="admin-filter-select"
        >
          <option value="">All Categories</option>
          <option value="laptops">Laptops</option>
          <option value="mobiles">Mobiles</option>
          <option value="headphones">Headphones</option>
          <option value="gaming">Gaming</option>
        </select>

        <select
          value={stock}
          onChange={handleStockChange}
          className="admin-filter-select"
        >
          <option value="">All Stock</option>
          <option value="in">In Stock</option>
          <option value="low">Low Stock</option>
          <option value="out">Out of Stock</option>
        </select>

        <button
          type="button"
          className="admin-refresh-button"
          onClick={handleRefresh}
          title="Refresh products"
        >
          <RefreshCw
            size={17}
            className={
              loading
                ? "admin-spin"
                : ""
            }
          />
        </button>

      </div>

      {/* =========================================
          PRODUCTS CARD
      ========================================== */}

      <div className="admin-products-card">

        <div className="admin-products-card-header">

          <div>
            <h2>Product Catalog</h2>

            <span>
              {totalProducts} products
            </span>
          </div>

          <div className="admin-products-count">
            {products.length} shown
          </div>

        </div>

        {/* =======================================
            LOADING
        ======================================== */}

        {loading ? (
          <div className="admin-products-loading">

            <div className="admin-loading-spinner"></div>

            <p>Loading products...</p>

          </div>
        ) : products.length === 0 ? (

          /* =====================================
             EMPTY
          ====================================== */

          <div className="admin-products-empty">

            <div className="admin-empty-icon">
              <Package size={30} />
            </div>

            <h3>No products found</h3>

            <p>
              Try changing your search or filter
              options.
            </p>

            <Link
              to="/admin/products/new"
              className="admin-primary-button"
            >
              <Plus size={17} />
              Add Product
            </Link>

          </div>
        ) : (

          /* =====================================
             TABLE
          ====================================== */

          <div className="admin-products-table-wrapper">

            <table className="admin-products-table">

              <thead>
                <tr>
                  <th>PRODUCT</th>
                  <th>CATEGORY</th>
                  <th>PRICE</th>
                  <th>STOCK</th>
                  <th>STATUS</th>
                  <th>ACTIONS</th>
                </tr>
              </thead>

              <tbody>

                {products.map((product) => {

                  const stockStatus =
                    getStockStatus(product);

                  return (
                    <tr key={product._id}>

                      {/* PRODUCT */}

                      <td>

                        <div className="admin-product-info">

                          <div className="admin-product-image">

                            {product.image ? (
                              <img
                                src={product.image}
                                alt={product.name}
                              />
                            ) : (
                              <Package size={22} />
                            )}

                          </div>

                          <div>

                            <strong>
                              {product.name}
                            </strong>

                            <span>
                              ID:{" "}
                              {product._id.slice(-8)}
                            </span>

                          </div>

                        </div>

                      </td>

                      {/* CATEGORY */}

                      <td>
                        <span className="admin-category-badge">
                          {product.category?.name ||
                            product.category ||
                            "Uncategorized"}
                        </span>
                      </td>

                      {/* PRICE */}

                      <td>
                        <strong className="admin-product-price">
                          {formatPrice(
                            product.price
                          )}
                        </strong>
                      </td>

                      {/* STOCK */}

                      <td>
                        <span className="admin-stock-number">
                          {product.stock || 0}
                        </span>
                      </td>

                      {/* STATUS */}

                      <td>
                        <span
                          className={`admin-stock-badge ${stockStatus.className}`}
                        >
                          <span></span>
                          {stockStatus.label}
                        </span>
                      </td>

                      {/* ACTIONS */}

                      <td>

                        <div className="admin-product-actions">

                          <Link
                            to={`/admin/products/${product._id}/edit`}
                            className="admin-action-button admin-action-edit"
                            title="Edit product"
                          >
                            <Pencil size={16} />
                          </Link>

                          <button
                            type="button"
                            className="admin-action-button admin-action-delete"
                            title="Delete product"
                            disabled={deleteLoading}
                            onClick={() =>
                              handleDelete(
                                product._id,
                                product.name
                              )
                            }
                          >
                            <Trash2 size={16} />
                          </button>

                        </div>

                      </td>

                    </tr>
                  );
                })}

              </tbody>

            </table>

          </div>
        )}

        {/* =======================================
            PAGINATION
        ======================================== */}

        {!loading &&
          products.length > 0 &&
          totalPages > 1 && (
            <div className="admin-pagination">

              <span>
                Page {currentPage} of{" "}
                {totalPages}
              </span>

              <div>

                <button
                  type="button"
                  disabled={page <= 1}
                  onClick={() =>
                    setPage(
                      (previous) =>
                        previous - 1
                    )
                  }
                >
                  <ChevronLeft size={17} />
                  Previous
                </button>

                <button
                  type="button"
                  disabled={
                    page >= totalPages
                  }
                  onClick={() =>
                    setPage(
                      (previous) =>
                        previous + 1
                    )
                  }
                >
                  Next
                  <ChevronRight size={17} />
                </button>

              </div>

            </div>
          )}

      </div>

    </div>
  );
};

export default AdminProducts;