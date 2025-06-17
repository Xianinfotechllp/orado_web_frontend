import apiClient from "./apiClient/apiClient";

export const submitItemFeedback = async ({ orderId, reviews }) => {
  const formData = new FormData();
  formData.append('orderId', orderId);

  reviews.forEach((review, index) => {
    formData.append(`reviews[${index}][itemId]`, review.itemId);
    formData.append(`reviews[${index}][rating]`, review.rating);
    formData.append(`reviews[${index}][comment]`, review.comment || '');
    formData.append(`reviews[${index}][targetType]`, 'order');

    review.images?.forEach((image, imgIndex) => {
      formData.append(`reviews[${index}][images]`, image);
    });
  });

  try {
    const response = await apiClient.post('/feedback', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  } catch (error) {
    console.error('Error submitting item feedback:', error);
    throw error;
  }
};

export const submitRestaurantFeedback = async ({
  restaurantId,
  rating,
  comment,
  images = [],
  orderId
}) => {
  const formData = new FormData();

  // Construct a single review object
  const review = {
    targetType: 'restaurant',
    restaurantId,
    rating,
    comment,
    orderId
  };

  // append review as JSON string
  formData.append('reviews', JSON.stringify([review]));

  // add images if any
  images.forEach((image) => {
    formData.append('images', image);
  });

  try {
    const response = await apiClient.post('/feedback/restaurant', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error submitting restaurant feedback:', error);
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

