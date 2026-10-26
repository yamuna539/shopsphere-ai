const RatingSummary = ({
  rating,
  numReviews,
  distribution,
}) => {
  return (
    <div className="card border-0 shadow-sm mb-4">

      <div className="card-body">

        <div className="row align-items-center">

          <div className="col-md-4 text-center">

            <div
              className="fw-bold"
              style={{
                fontSize: "48px",
              }}
            >
              {rating.toFixed(1)}
            </div>

            <div className="text-warning fs-4">
              {"★".repeat(
                Math.round(rating)
              )}
              {"☆".repeat(
                5 -
                  Math.round(rating)
              )}
            </div>

            <div className="text-muted">
              {numReviews} reviews
            </div>

          </div>

          <div className="col-md-8">

            {[5, 4, 3, 2, 1].map(
              (star) => {

                const count =
                  distribution?.[star] ||
                  0;

                const percentage =
                  numReviews
                    ? (count /
                        numReviews) *
                      100
                    : 0;

                return (
                  <div
                    key={star}
                    className="d-flex align-items-center gap-2 mb-2"
                  >

                    <span>
                      {star} ★
                    </span>

                    <div
                      className="progress flex-grow-1"
                      style={{
                        height: "8px",
                      }}
                    >
                      <div
                        className="progress-bar"
                        style={{
                          width: `${percentage}%`,
                        }}
                      />
                    </div>

                    <small>
                      {count}
                    </small>

                  </div>
                );
              }
            )}

          </div>

        </div>

      </div>

    </div>
  );
};

export default RatingSummary;