import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  addUserMessage,
  sendAIMessage,
} from "../redux/slices/aiSlice";

import AIProductCard from "./AIProductCard";

const suggestedQuestions = [
  "I need a laptop for programming under ₹60000",
  "I need headphones for gaming",
  "Show me products for college students",
  "I need a phone with a good camera",
];

const AIChat = () => {
  const dispatch = useDispatch();

  const {
    messages,
    loading,
    error,
  } = useSelector(
    (state) => state.ai
  );

  const [input, setInput] =
    useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const message =
      input.trim();

    if (!message || loading) {
      return;
    }

    dispatch(
      addUserMessage(message)
    );

    setInput("");

    dispatch(
      sendAIMessage(message)
    );
  };

  const handleSuggestedQuestion =
    (question) => {
      if (loading) {
        return;
      }

      dispatch(
        addUserMessage(question)
      );

      dispatch(
        sendAIMessage(question)
      );
    };

  return (
    <div className="container py-4">

      <div className="row justify-content-center">

        <div className="col-lg-9">

          <div className="card shadow-sm">

            {/* Header */}
            <div className="card-header bg-primary text-white">

              <h4 className="mb-0">
                🤖 ShopSphere AI Assistant
              </h4>

              <small>
                Ask me to find products
                from our catalog.
              </small>

            </div>

            {/* Messages */}
            <div
              className="card-body"
              style={{
                minHeight: "500px",
                maxHeight: "650px",
                overflowY: "auto",
              }}
            >

              {/* Empty state */}
              {messages.length === 0 && (
                <div className="text-center py-5">

                  <h5>
                    What are you looking for?
                  </h5>

                  <p className="text-muted">
                    Tell me your requirements
                    and I'll search ShopSphere
                    products.
                  </p>

                  <div className="d-flex flex-wrap gap-2 justify-content-center mt-4">

                    {suggestedQuestions.map(
                      (question) => (
                        <button
                          key={question}
                          type="button"
                          className="btn btn-outline-primary btn-sm"
                          onClick={() =>
                            handleSuggestedQuestion(
                              question
                            )
                          }
                        >
                          {question}
                        </button>
                      )
                    )}

                  </div>

                </div>
              )}

              {/* Messages */}
              {messages.map(
                (message, index) => (
                  <div
                    key={index}
                    className={`mb-4 ${
                      message.type ===
                      "user"
                        ? "text-end"
                        : "text-start"
                    }`}
                  >

                    <div
                      className={`d-inline-block p-3 rounded ${
                        message.type ===
                        "user"
                          ? "bg-primary text-white"
                          : "bg-light"
                      }`}
                      style={{
                        maxWidth: "80%",
                      }}
                    >
                      {message.text}
                    </div>

                    {/* Product recommendations */}
                    {message.type ===
                      "ai" &&
                      message
                        .recommendations
                        ?.length > 0 && (

                        <div className="row g-3 mt-2">

                          {message.recommendations.map(
                            (
                              recommendation
                            ) => (
                              <div
                                className="col-md-6"
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
                      )}

                  </div>
                )
              )}

              {/* Loading */}
              {loading && (
                <div className="text-muted">

                  <div className="spinner-border spinner-border-sm me-2" />

                  ShopSphere AI is
                  searching for products...

                </div>
              )}

              {/* Error */}
              {error && (
                <div className="alert alert-danger mt-3">
                  {error}
                </div>
              )}

            </div>

            {/* Input */}
            <div className="card-footer">

              <form
                onSubmit={handleSubmit}
                className="d-flex gap-2"
              >

                <input
                  type="text"
                  className="form-control"
                  placeholder="Ask for a product..."
                  value={input}
                  onChange={(e) =>
                    setInput(
                      e.target.value
                    )
                  }
                  disabled={loading}
                  maxLength={500}
                />

                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={
                    loading ||
                    !input.trim()
                  }
                >
                  {loading
                    ? "..."
                    : "Send"}
                </button>

              </form>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
};

export default AIChat;