import apiClient from "./apiClient/apiClient";


export const submitRestaurantFeedback = async (data) => {
  const formData = new FormData();

  if (data.reviews[0]?.images?.length) {
    data.reviews[0].images.forEach((file) => {
      formData.append('files', file);
    });
  }

  formData.append('orderId', data.orderId);
  formData.append('reviews', JSON.stringify(data.reviews));

  try {
    const response = await apiClient.post('/feedback/restaurant', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to submit feedback');
  }
};




export const addProductReview = async (productId, formData) => {
  try {
    const response = await apiClient.post(`/feedback/product/${productId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error submitting product review:", error);
    throw error;
  }
};


export const fetchRestaurantReviews = async (restaurantId) => {
  try {
    const { data } = await apiClient.get(`/feedback/restaurants/${restaurantId}`);
    return data;
  } catch (error) {
    console.error('Failed to fetch restaurant reviews:', error?.response?.data || error.message);
    throw new Error(
      error?.response?.data?.message || 'Something went wrong while fetching reviews.'
    );
  }
};

