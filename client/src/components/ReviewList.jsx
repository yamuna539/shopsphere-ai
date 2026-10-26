const ReviewList = ({
  reviews,
}) => {
  if (!reviews.length) {
    return (
      <div className="text-muted py-4">
        No reviews yet. Be the first to review
        this product.
      </div>
    );
  }

  return (
    <div>

      {reviews.map((review) => (
        <div
          key={review._id}
          className="border-bottom py-4"
        >

          <div className="d-flex justify-content-between">

            <div>

              <strong>
                {review.user?.name ||
                  "Customer"}
              </strong>

              <div className="text-warning">
                {"★".repeat(
                  review.rating
                )}
                {"☆".repeat(
                  5 - review.rating
                )}
              </div>

            </div>

            <small className="text-muted">
              {new Date(
                review.createdAt
              ).toLocaleDateString()}
            </small>

          </div>

          <p className="mt-3 mb-0">
            {review.comment}
          </p>

        </div>
      ))}

    </div>
  );
};

export default ReviewList;