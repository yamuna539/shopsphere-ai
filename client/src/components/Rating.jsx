import { FaStar } from "react-icons/fa";

const Rating = ({
  rating = 0,
  numReviews = 0,
}) => {
  const roundedRating =
    Math.round(rating);

  return (
    <div className="d-flex align-items-center gap-2">

      <span
        className="text-warning"
        style={{ letterSpacing: "2px" }}
      >
        {[1, 2, 3, 4, 5].map(
          (star) => (
            <span key={star}>
              {star <= roundedRating
                ? "★"
                : "☆"}
            </span>
          )
        )}
      </span>

      <span className="text-muted small">
        {rating.toFixed(1)}
        {numReviews !== undefined &&
          ` (${numReviews})`}
      </span>

    </div>
  );
};

export default Rating;