import {
  useEffect,
  useMemo,
} from "react";

import {
  useDispatch,
  useSelector,
} from "react-redux";

import {
  useSearchParams,
} from "react-router-dom";

import {
  fetchCategories,
} from "../redux/slices/categorySlice";

import {
  fetchProducts,
  resetFilters,
  setFilters,
  setPage,
} from "../redux/slices/productSlice";

import SearchBar from "../components/SearchBar";
import FilterSidebar from "../components/FilterSidebar";
import ProductGrid from "../components/ProductGrid";
import Pagination from "../components/Pagination";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorMessage from "../components/ErrorMessage";

const Products = () => {
  const dispatch = useDispatch();

  /*
  ==================================================
  URL SEARCH PARAMETERS
  ==================================================
  */

const [searchParams, setSearchParams] =
  useSearchParams();

  const categoryFromUrl =
    searchParams.get("category") || "";

  /*
  ==================================================
  PRODUCTS STATE
  ==================================================
  */

  const {
    products,
    pagination,
    filters,
    loading,
    error,
  } = useSelector(
    (state) => state.products
  );

  /*
  ==================================================
  CATEGORIES STATE
  ==================================================
  */

  const categories = useSelector(
    (state) =>
      state.categories?.categories || []
  );

  /*
  ==================================================
  LOAD CATEGORIES
  ==================================================
  */

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  /*
  ==================================================
  IMPORTANT:
  SYNC URL CATEGORY WITH REDUX
  ==================================================

  Example:

  /products?category=LAPTOP_ID

  Redux should become:

  filters.category = LAPTOP_ID
  */

  useEffect(() => {
  dispatch(
    setFilters({
      category: categoryFromUrl,
    })
  );

  dispatch(setPage(1));

  window.scrollTo({
    top: 0,
    behavior: "auto",
  });
}, [
  dispatch,
  categoryFromUrl,
]);
  /*
  ==================================================
  API REQUEST PARAMETERS
  ==================================================
  */

  const requestParams = useMemo(
  () => ({
    search:
      filters.search?.trim() || undefined,

    category:
  categoryFromUrl || undefined,

    brand:
      filters.brand || undefined,

    minPrice:
      filters.minPrice || undefined,

    maxPrice:
      filters.maxPrice || undefined,

    rating:
      filters.rating || undefined,

    inStock:
      filters.inStock
        ? "true"
        : undefined,

    sort:
      filters.sort || "newest",

    page:
      pagination.currentPage,

    limit:
      pagination.limit,
  }),
  [
    filters,
    categoryFromUrl,
    pagination.currentPage,
    pagination.limit,
  ]
);

  /*
  ==================================================
  FETCH PRODUCTS
  ==================================================
  */

  useEffect(() => {
    dispatch(
      fetchProducts(requestParams)
    );
  }, [
    dispatch,
    requestParams,
  ]);

  /*
  ==================================================
  SEARCH
  ==================================================
  */

  const handleSearch = (search) => {
    dispatch(
      setFilters({
        search: search.trim(),
      })
    );

    dispatch(setPage(1));
  };

  /*
  ==================================================
  FILTERS
  ==================================================
  */

 const handleFilters = (newFilters) => {
  dispatch(
    setFilters(newFilters)
  );

  dispatch(setPage(1));

  // Update category in URL when
  // category is changed from sidebar
  if (
    Object.prototype.hasOwnProperty.call(
      newFilters,
      "category"
    )
  ) {
    const newParams = new URLSearchParams(
      searchParams
    );

    if (newFilters.category) {
      newParams.set(
        "category",
        newFilters.category
      );
    } else {
      newParams.delete("category");
    }

    setSearchParams(newParams);
  }
};

  /*
  ==================================================
  RESET
  ==================================================
  */

 const handleReset = () => {
  dispatch(resetFilters());

  dispatch(setPage(1));

  // Remove category from URL
  const newParams = new URLSearchParams(
    searchParams
  );

  newParams.delete("category");

  setSearchParams(newParams);
};

  /*
  ==================================================
  PAGINATION
  ==================================================
  */

  const handlePageChange = (
    page
  ) => {
    dispatch(setPage(page));

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  /*
  ==================================================
  SORT
  ==================================================
  */

  const handleSortChange = (
    event
  ) => {
    dispatch(
      setFilters({
        sort: event.target.value,
      })
    );

    dispatch(setPage(1));
  };

  /*
  ==================================================
  FIND SELECTED CATEGORY
  ==================================================
  */

  const selectedCategory =
  categories.find(
    (category) =>
      category._id === categoryFromUrl
  );

  /*
  ==================================================
  UI
  ==================================================
  */

  return (
    <div className="container py-4">

      {/* =========================================
          PAGE HEADER
      ========================================= */}

      <div className="mb-4">

        <h1 className="fw-bold">
          Shop All Products
        </h1>

        <p className="text-muted">
          Find the right products for
          your needs.
        </p>

      </div>


      {/* =========================================
          SELECTED CATEGORY MESSAGE
      ========================================= */}

      {selectedCategory && (
        <div className="mb-3">

          <span className="text-muted">
            Showing products from{" "}
          </span>

          <strong>
            {selectedCategory.name}
          </strong>

        </div>
      )}


      {/* =========================================
          SEARCH
      ========================================= */}

      <div className="mb-4">

        <SearchBar
          value={filters.search}
          onSearch={handleSearch}
        />

      </div>


      {/* =========================================
          MAIN CONTENT
      ========================================= */}

      <div className="row g-4">

        {/* =======================================
            FILTER SIDEBAR
        ======================================== */}

        <div className="col-12 col-lg-3">

          <FilterSidebar
  filters={{
    ...filters,
    category: categoryFromUrl,
  }}
  categories={categories}
  onChange={handleFilters}
  onReset={handleReset}
/>

        </div>


        {/* =======================================
            PRODUCTS
        ======================================== */}

        <div className="col-12 col-lg-9">

          {/* =====================================
              PRODUCT COUNT + SORT
          ====================================== */}

          <div className="d-flex justify-content-between align-items-center mb-4">

            <div>

              <span className="text-muted">

                {pagination.totalProducts || 0}

                {" "}

                {pagination.totalProducts === 1
                  ? "product"
                  : "products"}

              </span>

            </div>


            <div>

              <select
                className="form-select"
                value={filters.sort}
                onChange={
                  handleSortChange
                }
              >

                <option value="newest">
                  Newest
                </option>

                <option value="priceLow">
                  Price: Low to High
                </option>

                <option value="priceHigh">
                  Price: High to Low
                </option>

                <option value="ratingHigh">
                  Highest Rated
                </option>

                <option value="nameAZ">
                  Name: A-Z
                </option>

                <option value="nameZA">
                  Name: Z-A
                </option>

              </select>

            </div>

          </div>


          {/* =====================================
              LOADING
          ====================================== */}

          {loading && (
            <LoadingSpinner
              message="Loading products..."
            />
          )}


          {/* =====================================
              ERROR
          ====================================== */}

          {!loading && error && (
            <ErrorMessage
              message={error}
              onRetry={() =>
                dispatch(
                  fetchProducts(
                    requestParams
                  )
                )
              }
            />
          )}


          {/* =====================================
              PRODUCTS
          ====================================== */}

          {!loading && !error && (
            <>

              <ProductGrid
                products={products}
              />


              {/* =================================
                  PAGINATION
              ================================= */}

              {pagination.totalPages > 1 && (
                <Pagination
                  currentPage={
                    pagination.currentPage
                  }

                  totalPages={
                    pagination.totalPages
                  }

                  onPageChange={
                    handlePageChange
                  }
                />
              )}

            </>
          )}

        </div>

      </div>

    </div>
  );
};

export default Products;