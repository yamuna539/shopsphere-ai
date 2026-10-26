import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import {
  FaBalanceScale,
  FaRobot,
  FaArrowRight,
  FaTrashAlt,
  FaShoppingBag,
  FaSearch,
  FaCheckCircle,
  FaLightbulb,
  FaExchangeAlt,
  FaInfoCircle,
  FaListUl,
  FaCog,
} from "react-icons/fa";

import {
  compareProducts,
} from "../redux/slices/aiSlice";

import ComparisonTable from "../components/ComparisonTable";

const ProductCompare = () => {
  const dispatch = useDispatch();

  const {
    comparisonProducts,
    comparison,
    comparisonLoading,
    comparisonError,
  } = useSelector((state) => state.ai);

  /* =====================================================
     READ SELECTED PRODUCTS FROM LOCAL STORAGE
  ===================================================== */

  useEffect(() => {
    const storedIds = JSON.parse(
      localStorage.getItem("compareProducts") || "[]"
    );

    if (storedIds.length >= 2) {
      const ids = storedIds.slice(0, 4);

      dispatch(compareProducts(ids));
    }
  }, [dispatch]);

  /* =====================================================
     COMPARE AGAIN
  ===================================================== */

  const handleCompare = () => {
    const storedIds = JSON.parse(
      localStorage.getItem("compareProducts") || "[]"
    );

    if (storedIds.length < 2) {
      alert(
        "Please select at least 2 products to compare."
      );

      return;
    }

    const ids = storedIds.slice(0, 4);

    dispatch(compareProducts(ids));
  };

  /* =====================================================
     CLEAR COMPARISON
  ===================================================== */

  const clearComparison = () => {
    localStorage.removeItem("compareProducts");

    window.dispatchEvent(
      new Event("compareProductsChanged")
    );

    window.location.reload();
  };

  return (
    <div className="shopsphere-compare-page">

      <div className="container">

        {/* =================================================
            PAGE HEADER
        ================================================= */}

        <section className="shopsphere-compare-hero">

          <div className="shopsphere-compare-hero-icon">
            <FaBalanceScale />
          </div>

          <div className="shopsphere-compare-label">
            <FaExchangeAlt />
            SMART PRODUCT COMPARISON
          </div>

          <h1>
            Compare Products
          </h1>

          <p>
            Compare real ShopSphere products side-by-side
            and explore AI-powered insights.
          </p>

          {comparisonProducts.length > 0 && (
            <div className="shopsphere-compare-count">

              <FaCheckCircle />

              <span>
                {comparisonProducts.length} products selected
              </span>

            </div>
          )}

        </section>


        {/* =================================================
            NO PRODUCTS SELECTED
        ================================================= */}

        {comparisonProducts.length === 0 &&
          !comparisonLoading && (

            <section className="shopsphere-compare-empty">

              <div className="shopsphere-empty-icon">
                <FaBalanceScale />
              </div>

              <h2>
                No products selected
              </h2>

              <p>
                Select at least 2 products from the
                Products page to compare them.
              </p>

              <Link
                to="/products"
                className="shopsphere-compare-primary-btn"
              >
                <FaShoppingBag />
                Browse Products
                <FaArrowRight />
              </Link>

            </section>
          )}


        {/* =================================================
            ACTION BAR
        ================================================= */}

        {comparisonProducts.length > 0 && (

          <section className="shopsphere-compare-action-bar">

            <div className="shopsphere-compare-action-info">

              <div className="shopsphere-compare-action-icon">
                <FaBalanceScale />
              </div>

              <div>
                <strong>
                  Ready to compare
                </strong>

                <span>
                  {comparisonProducts.length} products selected
                  {" • "}
                  Maximum 4 products
                </span>
              </div>

            </div>


            <div className="shopsphere-compare-actions">

              <button
                type="button"
                className="shopsphere-ai-compare-btn"
                onClick={handleCompare}
                disabled={comparisonLoading}
              >
                {comparisonLoading ? (
                  <>
                    <span className="shopsphere-button-spinner" />
                    Comparing...
                  </>
                ) : (
                  <>
                    <FaRobot />
                    Compare with AI
                  </>
                )}
              </button>

              <button
                type="button"
                className="shopsphere-clear-compare-btn"
                onClick={clearComparison}
                disabled={comparisonLoading}
              >
                <FaTrashAlt />
                Clear
              </button>

            </div>

          </section>
        )}


        {/* =================================================
            ERROR
        ================================================= */}

        {comparisonError && (

          <div className="shopsphere-compare-error">

            <FaInfoCircle />

            <div>
              <strong>
                Comparison could not be completed
              </strong>

              <span>
                {comparisonError}
              </span>
            </div>

          </div>

        )}


        {/* =================================================
            LOADING
        ================================================= */}

        {comparisonLoading && (

          <section className="shopsphere-compare-loading">

            <div className="shopsphere-loading-orbit">
              <FaRobot />
            </div>

            <h3>
              ShopSphere AI is comparing your products
            </h3>

            <p>
              Analyzing specifications, features,
              prices and suitable use cases...
            </p>

            <div className="shopsphere-loading-bar">
              <span />
            </div>

          </section>

        )}


        {/* =================================================
            PRODUCT COMPARISON TABLE
        ================================================= */}

        {!comparisonLoading &&
          comparisonProducts.length > 0 && (

            <section className="shopsphere-comparison-section">

              <div className="shopsphere-section-heading">

                <div className="shopsphere-section-heading-left">

                  <div className="shopsphere-section-icon">
                    <FaBalanceScale />
                  </div>

                  <div>
                    <span>
                      PRODUCT DETAILS
                    </span>

                    <h2>
                      Side-by-Side Comparison
                    </h2>
                  </div>

                </div>

                <div className="shopsphere-section-badge">
                  {comparisonProducts.length} Products
                </div>

              </div>


              <div className="shopsphere-comparison-table-wrapper">

                <ComparisonTable
                  products={comparisonProducts}
                />

              </div>

            </section>
          )}


        {/* =================================================
            AI COMPARISON ANALYSIS
        ================================================= */}

        {!comparisonLoading &&
          comparison && (

            <section className="shopsphere-ai-analysis">

              {/* AI HEADER */}

              <div className="shopsphere-ai-analysis-header">

                <div className="shopsphere-ai-analysis-title">

                  <div className="shopsphere-ai-analysis-icon">
                    <FaRobot />
                  </div>

                  <div>
                    <span>
                      POWERED BY GEMINI
                    </span>

                    <h2>
                      AI Comparison Analysis
                    </h2>

                    <p>
                      Insights based only on the selected
                      ShopSphere products.
                    </p>
                  </div>

                </div>

                <div className="shopsphere-ai-badge">
                  <span />
                  AI ANALYSIS
                </div>

              </div>


              {/* SUMMARY */}

              {comparison.summary && (

                <div className="shopsphere-ai-summary">

                  <div className="shopsphere-analysis-icon">
                    <FaInfoCircle />
                  </div>

                  <div>

                    <span className="shopsphere-analysis-label">
                      SUMMARY
                    </span>

                    <p>
                      {comparison.summary}
                    </p>

                  </div>

                </div>
              )}


              {/* KEY DIFFERENCES */}

              {comparison.keyDifferences?.length > 0 && (

                <div className="shopsphere-analysis-block">

                  <div className="shopsphere-analysis-block-header">

                    <div className="shopsphere-analysis-small-icon differences">
                      <FaExchangeAlt />
                    </div>

                    <div>
                      <span>
                        WHAT'S DIFFERENT
                      </span>

                      <h3>
                        Key Differences
                      </h3>
                    </div>

                  </div>


                  <div className="shopsphere-analysis-list">

                    {comparison.keyDifferences.map(
                      (difference, index) => (

                        <div
                          className="shopsphere-analysis-list-item"
                          key={index}
                        >

                          <span className="shopsphere-list-number">
                            {index + 1}
                          </span>

                          <p>
                            {difference}
                          </p>

                        </div>
                      )
                    )}

                  </div>

                </div>
              )}


              {/* SIMILARITIES */}

              {comparison.similarities?.length > 0 && (

                <div className="shopsphere-analysis-block">

                  <div className="shopsphere-analysis-block-header">

                    <div className="shopsphere-analysis-small-icon similarities">
                      <FaCheckCircle />
                    </div>

                    <div>
                      <span>
                        WHAT'S SIMILAR
                      </span>

                      <h3>
                        Similarities
                      </h3>
                    </div>

                  </div>


                  <div className="shopsphere-analysis-list">

                    {comparison.similarities.map(
                      (similarity, index) => (

                        <div
                          className="shopsphere-analysis-list-item"
                          key={index}
                        >

                          <span className="shopsphere-list-check">
                            <FaCheckCircle />
                          </span>

                          <p>
                            {similarity}
                          </p>

                        </div>
                      )
                    )}

                  </div>

                </div>
              )}


              {/* IMPORTANT SPECIFICATIONS */}

              {comparison.importantSpecifications?.length > 0 && (

                <div className="shopsphere-analysis-block">

                  <div className="shopsphere-analysis-block-header">

                    <div className="shopsphere-analysis-small-icon specifications">
                      <FaCog />
                    </div>

                    <div>
                      <span>
                        PRODUCT DETAILS
                      </span>

                      <h3>
                        Important Specifications
                      </h3>
                    </div>

                  </div>


                  <div className="shopsphere-specification-grid">

                    {comparison.importantSpecifications.map(
                      (item) => {

                        const product =
                          comparisonProducts.find(
                            (p) =>
                              p._id === item.productId
                          );

                        return (
                          <div
                            className="shopsphere-specification-card"
                            key={item.productId}
                          >

                            <div className="shopsphere-specification-card-header">

                              <div className="shopsphere-product-mini-icon">
                                <FaCog />
                              </div>

                              <h4>
                                {product?.name ||
                                  "Product"}
                              </h4>

                            </div>


                            <ul>

                              {item.points?.map(
                                (point, index) => (

                                  <li key={index}>
                                    <span>
                                      <FaCheckCircle />
                                    </span>

                                    <p>
                                      {point}
                                    </p>
                                  </li>

                                )
                              )}

                            </ul>

                          </div>
                        );
                      }
                    )}

                  </div>

                </div>
              )}


              {/* USE CASES */}

              {comparison.useCases?.length > 0 && (

                <div className="shopsphere-analysis-block">

                  <div className="shopsphere-analysis-block-header">

                    <div className="shopsphere-analysis-small-icon usecases">
                      <FaLightbulb />
                    </div>

                    <div>
                      <span>
                        PRACTICAL GUIDANCE
                      </span>

                      <h3>
                        Suitable Use Cases
                      </h3>
                    </div>

                  </div>


                  <div className="shopsphere-usecase-grid">

                    {comparison.useCases.map(
                      (item, index) => {

                        const product =
                          comparisonProducts.find(
                            (p) =>
                              p._id === item.productId
                          );

                        return (
                          <div
                            className="shopsphere-usecase-card"
                            key={`${item.productId}-${index}`}
                          >

                            <div className="shopsphere-usecase-top">

                              <div className="shopsphere-usecase-icon">
                                <FaLightbulb />
                              </div>

                              <span>
                                USE CASE
                              </span>

                            </div>


                            <h4>
                              {product?.name ||
                                "Product"}
                            </h4>


                            <div className="shopsphere-usecase-name">
                              {item.useCase}
                            </div>


                            <p>
                              {item.explanation}
                            </p>

                          </div>
                        );
                      }
                    )}

                  </div>

                </div>
              )}

            </section>
          )}


        {/* =================================================
            BOTTOM NOTE
        ================================================= */}

        {comparisonProducts.length > 0 &&
          !comparisonLoading && (

            <div className="shopsphere-compare-bottom-note">

              <FaInfoCircle />

              <span>
                ShopSphere AI provides comparison insights
                based on the product information available
                in the store. It does not select a universal
                winner.
              </span>

            </div>
          )}

      </div>
    </div>
  );
};

export default ProductCompare;