import React from "react";

const ComparisonTable = ({ products = [] }) => {
  if (!products.length) {
    return (
      <div className="alert alert-warning">
        No products available for comparison.
      </div>
    );
  }

  const getSpecificationValue = (product, key) => {
    return product.specifications?.[key] || "Not provided";
  };

  const allSpecificationKeys = [
    ...new Set(
      products.flatMap((product) =>
        Object.keys(product.specifications || {})
      )
    ),
  ];

  return (
    <div className="table-responsive">
      <table className="table table-bordered align-middle">
        <thead className="table-dark">
          <tr>
            <th style={{ minWidth: "180px" }}>
              Product
            </th>

            {products.map((product) => (
              <th
                key={product._id}
                style={{ minWidth: "220px" }}
              >
                <div className="text-center">
                  {product.images?.length > 0 ? (
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="img-fluid rounded mb-2"
                      style={{
                        width: "140px",
                        height: "140px",
                        objectFit: "contain",
                      }}
                    />
                  ) : (
                    <div
                      className="bg-light rounded d-flex align-items-center justify-content-center mx-auto mb-2"
                      style={{
                        width: "140px",
                        height: "140px",
                      }}
                    >
                      <span className="text-muted">
                        No Image
                      </span>
                    </div>
                  )}

                  <div className="fw-bold">
                    {product.name}
                  </div>
                </div>
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {/* Brand */}
          <tr>
            <th>Brand</th>

            {products.map((product) => (
              <td key={product._id}>
                {product.brand || "Not provided"}
              </td>
            ))}
          </tr>

          {/* Category */}
          <tr>
            <th>Category</th>

            {products.map((product) => (
              <td key={product._id}>
                {product.category?.name || "Not provided"}
              </td>
            ))}
          </tr>

          {/* Price */}
          <tr>
            <th>Price</th>

            {products.map((product) => (
              <td key={product._id}>
                <span className="fw-bold">
                  ₹{product.price?.toLocaleString("en-IN")}
                </span>
              </td>
            ))}
          </tr>

          {/* Original Price */}
          <tr>
            <th>Original Price</th>

            {products.map((product) => (
              <td key={product._id}>
                ₹
                {product.originalPrice?.toLocaleString(
                  "en-IN"
                )}
              </td>
            ))}
          </tr>

          {/* Rating */}
          <tr>
            <th>Rating</th>

            {products.map((product) => (
              <td key={product._id}>
                ⭐ {product.rating || 0}
                <span className="text-muted ms-1">
                  ({product.numReviews || 0} reviews)
                </span>
              </td>
            ))}
          </tr>

          {/* Stock */}
          <tr>
            <th>Stock</th>

            {products.map((product) => (
              <td key={product._id}>
                {product.stock > 0 ? (
                  <span className="badge bg-success">
                    In Stock ({product.stock})
                  </span>
                ) : (
                  <span className="badge bg-danger">
                    Out of Stock
                  </span>
                )}
              </td>
            ))}
          </tr>

          {/* Description */}
          <tr>
            <th>Description</th>

            {products.map((product) => (
              <td key={product._id}>
                {product.description ||
                  "Not provided"}
              </td>
            ))}
          </tr>

          {/* Features */}
          <tr>
            <th>Features</th>

            {products.map((product) => (
              <td key={product._id}>
                {product.features?.length > 0 ? (
                  <ul className="mb-0 ps-3">
                    {product.features.map(
                      (feature, index) => (
                        <li key={index}>
                          {feature}
                        </li>
                      )
                    )}
                  </ul>
                ) : (
                  <span className="text-muted">
                    Not provided
                  </span>
                )}
              </td>
            ))}
          </tr>

          {/* Specifications */}
          {allSpecificationKeys.map((key) => (
            <tr key={key}>
              <th>
                {key
                  .replace(/([A-Z])/g, " $1")
                  .replace(/^./, (str) =>
                    str.toUpperCase()
                  )}
              </th>

              {products.map((product) => (
                <td key={product._id}>
                  {getSpecificationValue(
                    product,
                    key
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ComparisonTable;