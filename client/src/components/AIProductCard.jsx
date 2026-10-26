import { Link } from "react-router-dom";

const AIProductCard = ({
  recommendation,
}) => {
  const product =
    recommendation?.product;

  if (!product) {
    return null;
  }

  return (
    <div className="card h-100 shadow-sm">

      {/* Product Image */}

      <div
        className="bg-light d-flex align-items-center justify-content-center"
        style={{
          height: "200px",
        }}
      >

        {product.images &&
        product.images.length > 0 ? (
          <img
            src={product.images[0]}
            alt={product.name}
            className="img-fluid"
            style={{
              maxHeight: "200px",
              objectFit: "contain",
            }}
          />
        ) : (
          <div className="text-muted">
            No Image
          </div>
        )}

      </div>


      {/* Product Details */}

      <div className="card-body d-flex flex-column">

        <h5 className="card-title">
          {product.name}
        </h5>


        <p className="text-muted mb-1">
          {product.brand}
        </p>


        <h5 className="fw-bold">
          ₹{product.price?.toLocaleString("en-IN")}
        </h5>


        <p className="mb-2">

          ⭐ {product.rating || 0}

          <small className="text-muted ms-1">
            ({product.numReviews || 0} reviews)
          </small>

        </p>


        <div className="alert alert-light small">
          <strong>Why?</strong>

          <div className="mt-1">
            {recommendation.reason}
          </div>
        </div>


        <Link
          to={`/products/${product._id}`}
          className="btn btn-primary mt-auto"
        >
          View Product
        </Link>

      </div>

    </div>
  );
};

export default AIProductCard;