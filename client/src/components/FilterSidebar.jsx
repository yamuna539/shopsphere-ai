const FilterSidebar = ({
  filters,
  categories,
  onChange,
  onReset,
}) => {
  const update = (key, value) => {
    onChange({
      ...filters,
      [key]: value,
    });
  };

  return (
    <div className="shopsphere-filter-card">

      {/* ============================================
          FILTER HEADER
      ============================================ */}

      <div className="shopsphere-filter-header">

        <div>
          <span className="shopsphere-filter-label">
            REFINE RESULTS
          </span>

          <h3>
            Filters
          </h3>
        </div>

        <button
          type="button"
          className="shopsphere-filter-reset"
          onClick={onReset}
        >
          Reset
        </button>

      </div>

      {/* ============================================
          CATEGORY
      ============================================ */}

      <div className="shopsphere-filter-group">

        <label
          htmlFor="category-filter"
          className="shopsphere-filter-title"
        >
          Category
        </label>

        <select
          id="category-filter"
          className="shopsphere-filter-select"
          value={filters.category}
          onChange={(event) =>
            update(
              "category",
              event.target.value
            )
          }
        >

          <option value="">
            All Categories
          </option>

          {categories.map((category) => (
            <option
              key={category._id}
              value={category._id}
            >
              {category.name}
            </option>
          ))}

        </select>

      </div>

      {/* ============================================
          PRICE RANGE
      ============================================ */}

      <div className="shopsphere-filter-group">

        <label className="shopsphere-filter-title">
          Price Range
        </label>

        <div className="shopsphere-price-inputs">

          <div className="shopsphere-price-input-wrapper">

            <span>
              ₹
            </span>

            <input
              type="number"
              min="0"
              placeholder="Min"
              value={filters.minPrice}
              onChange={(event) =>
                update(
                  "minPrice",
                  event.target.value
                )
              }
            />

          </div>

          <span className="shopsphere-price-divider">
            —
          </span>

          <div className="shopsphere-price-input-wrapper">

            <span>
              ₹
            </span>

            <input
              type="number"
              min="0"
              placeholder="Max"
              value={filters.maxPrice}
              onChange={(event) =>
                update(
                  "maxPrice",
                  event.target.value
                )
              }
            />

          </div>

        </div>

      </div>

      {/* ============================================
          RATING
      ============================================ */}

      <div className="shopsphere-filter-group">

        <label
          htmlFor="rating-filter"
          className="shopsphere-filter-title"
        >
          Minimum Rating
        </label>

        <select
          id="rating-filter"
          className="shopsphere-filter-select"
          value={filters.rating}
          onChange={(event) =>
            update(
              "rating",
              event.target.value
            )
          }
        >

          <option value="">
            Any Rating
          </option>

          <option value="4">
            ★ 4 & above
          </option>

          <option value="3">
            ★ 3 & above
          </option>

          <option value="2">
            ★ 2 & above
          </option>

          <option value="1">
            ★ 1 & above
          </option>

        </select>

      </div>

      {/* ============================================
          STOCK
      ============================================ */}

      <div className="shopsphere-stock-filter">

        <label className="shopsphere-stock-label">

          <input
            type="checkbox"
            checked={filters.inStock}
            onChange={(event) =>
              update(
                "inStock",
                event.target.checked
              )
            }
          />

          <span className="shopsphere-custom-checkbox">
            {filters.inStock && "✓"}
          </span>

          <span>
            In stock only
          </span>

        </label>

      </div>

    </div>
  );
};

export default FilterSidebar;