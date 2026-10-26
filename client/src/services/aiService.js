import api from "./api";

const sendAIMessage = async (message) => {
  const response = await api.post(
    "/ai/chat",
    { message }
  );

  return response.data;
};

const getAIRecommendations = async (productId) => {
  const response = await api.get(
    `/ai/recommendations/${productId}`
  );

  return response.data;
};

const compareProducts = async (productIds) => {
  const response = await api.post(
    "/ai/compare",
    {
      productIds,
    }
  );

  return response.data;
};

const getAIReviewSummary = async (productId) => {
  const response = await api.get(
    `/ai/reviews/${productId}`
  );

  return response.data;
};

export default {
  sendAIMessage,
  getAIRecommendations,
  compareProducts,
  getAIReviewSummary
};