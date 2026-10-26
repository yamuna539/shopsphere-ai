import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  submitReview,
} from "../redux/slices/reviewSlice";

const ReviewForm = ({
  productId,
}) => {
  const dispatch = useDispatch();

  const {
    submitting,
    error,
  } = useSelector(
    (state) => state.review
  );

  const [rating, setRating] =
    useState(5);

  const [comment, setComment] =
    useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!comment.trim()) {
      return;
    }

    try {
      await dispatch(
        submitReview({
          productId,
          reviewData: {
            rating,
            comment,
          },
        })
      ).unwrap();

      setRating(5);
      setComment("");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="card border-0 shadow-sm mb-4">

      <div className="card-body">

        <h5 className="fw-bold mb-3">
          Write a Review
        </h5>

        {error && (
          <div className="alert alert-danger">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>

          <div className="mb-3">

            <label className="form-label">
              Rating
            </label>

            <div>
              {[1, 2, 3, 4, 5].map(
                (star) => (
                  <button
                    key={star}
                    type="button"
                    className="btn btn-link p-0 me-1"
                    style={{
                      fontSize: "30px",
                      textDecoration: "none",
                    }}
                    onClick={() =>
                      setRating(star)
                    }
                  >
                    {star <= rating
                      ? "★"
                      : "☆"}
                  </button>
                )
              )}
            </div>

          </div>

          <div className="mb-3">

            <label className="form-label">
              Your Review
            </label>

            <textarea
              className="form-control"
              rows="4"
              maxLength="1000"
              value={comment}
              onChange={(e) =>
                setComment(
                  e.target.value
                )
              }
              placeholder="Share your experience..."
              required
            />

            <small className="text-muted">
              {comment.length}/1000
            </small>

          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={submitting}
          >
            {submitting
              ? "Submitting..."
              : "Submit Review"}
          </button>

        </form>

      </div>

    </div>
  );
};

export default ReviewForm;