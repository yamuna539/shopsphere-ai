import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  fetchAIRecommendations,
} from "../redux/slices/aiSlice";

import AIProductCard from "./AIProductCard";

const AIRecommendations = ({
  productId,
}) => {
  const dispatch = useDispatch();

  const {
    recommendations,
    recommendationMessage,
    recommendationsLoading,
    recommendationsError,
  } = useSelector(
    (state) => state.ai
  );


  // ====================================================
  // FETCH RECOMMENDATIONS
  // ====================================================

  useEffect(() => {
    if (!productId) {
      return;
    }

    dispatch(
      fetchAIRecommendations(productId)
    );
  }, [dispatch, productId]);


  // ====================================================
  // LOADING
  // ====================================================

  if (recommendationsLoading) {
    return (
      <section className="container py-5">
        <div className="text-center">

          <div
            className="spinner-border text-primary"
            role="status"
          />

          <p className="text-muted mt-3">
            AI is finding similar products...
          </p>

        </div>
      </section>
    );
  }


  // ====================================================
  // ERROR
  // ====================================================

  if (recommendationsError) {
    return (
      <section className="container py-4">

        <div className="alert alert-warning">
          {recommendationsError}
        </div>

      </section>
    );
  }


  // ====================================================
  // NO RECOMMENDATIONS
  // ====================================================

  if (!recommendations.length) {
    return null;
  }


  // ====================================================
  // DISPLAY RECOMMENDATIONS
  // ====================================================

  return (
    <section className="container py-5">

      <div className="mb-4">

        <h2 className="fw-bold">
          🤖 AI Recommended Products
        </h2>

        <p className="text-muted mb-0">
          {recommendationMessage ||
            "Products you may also like based on this product."}
        </p>

      </div>


      <div className="row g-4">

        {recommendations.map(
          (recommendation) => (
            <div
              className="col-12 col-sm-6 col-lg-3"
              key={
                recommendation.productId
              }
            >

              <AIProductCard
                recommendation={
                  recommendation
                }
              />

            </div>
          )
        )}

      </div>

    </section>
  );
};

export default AIRecommendations;