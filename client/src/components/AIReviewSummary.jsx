import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { fetchAIReviewSummary } from "../redux/slices/aiSlice";

const AIReviewSummary = ({ productId }) => {
  const dispatch = useDispatch();

  const {
    reviewSummary,
    reviewSummaryLoading,
    reviewSummaryError,
  } = useSelector((state) => state.ai);

  useEffect(() => {
    if (productId) {
      dispatch(fetchAIReviewSummary(productId));
    }
  }, [dispatch, productId]);

  if (!productId) {
    return null;
  }

  return (
    <div className="card shadow-sm border-0 mt-4">
      <div className="card-body">

        {/* Header */}
        <h4 className="fw-bold mb-3">
          🤖 AI Review Summary
        </h4>

        {/* Loading */}
        {reviewSummaryLoading && (
          <div className="text-center py-4">
            <div
              className="spinner-border"
              role="status"
            >
              <span className="visually-hidden">
                Loading...
              </span>
            </div>

            <p className="text-muted mt-2 mb-0">
              AI is analyzing customer reviews...
            </p>
          </div>
        )}

        {/* Error */}
        {!reviewSummaryLoading &&
          reviewSummaryError && (
            <div className="alert alert-danger">
              {reviewSummaryError}
            </div>
          )}

        {/* AI Review Summary */}
        {!reviewSummaryLoading &&
          !reviewSummaryError &&
          reviewSummary && (
            <>
              {/* Product Information */}
              <div className="mb-4">
                <h5 className="fw-semibold">
                  {reviewSummary.product?.name}
                </h5>

                <div className="text-muted">
                  ⭐{" "}
                  {reviewSummary.product?.rating || 0}
                  {" "}(
                  {reviewSummary.product?.numReviews || 0}
                  {" "}reviews)
                </div>

                <small className="text-muted">
                  AI analyzed{" "}
                  {reviewSummary.reviewCount || 0}{" "}
                  customer reviews.
                </small>
              </div>

              {/* Positive Aspects */}
              <div className="mb-4">
                <h5 className="fw-bold text-success">
                  👍 Positive Aspects
                </h5>

                {reviewSummary.summary
                  ?.positiveAspects?.length > 0 ? (
                  <ul className="mb-0">
                    {reviewSummary.summary.positiveAspects.map(
                      (aspect, index) => (
                        <li
                          key={index}
                          className="mb-2"
                        >
                          {aspect}
                        </li>
                      )
                    )}
                  </ul>
                ) : (
                  <p className="text-muted mb-0">
                    No positive aspects identified yet.
                  </p>
                )}
              </div>

              {/* Common Concerns */}
              <div className="mb-4">
                <h5 className="fw-bold text-warning">
                  ⚠️ Common Concerns
                </h5>

                {reviewSummary.summary
                  ?.commonConcerns?.length > 0 ? (
                  <ul className="mb-0">
                    {reviewSummary.summary.commonConcerns.map(
                      (concern, index) => (
                        <li
                          key={index}
                          className="mb-2"
                        >
                          {concern}
                        </li>
                      )
                    )}
                  </ul>
                ) : (
                  <p className="text-muted mb-0">
                    No common concerns identified yet.
                  </p>
                )}
              </div>

              {/* Overall Summary */}
              <div>
                <h5 className="fw-bold">
                  📝 Overall Summary
                </h5>

                <p className="text-muted mb-0">
                  {reviewSummary.summary
                    ?.overallSummary ||
                    "No overall summary available."}
                </p>
              </div>
            </>
          )}

      </div>
    </div>
  );
};

export default AIReviewSummary;