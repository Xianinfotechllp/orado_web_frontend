import apiClient from "./apiClient/apiClient";

// Fetch restaurant menu
export const getRestaurantMenu = async (restaurantId, options = {}) => {
  try {
    const response = await apiClient.get(`/restaurants/${restaurantId}/menu`, {
      params: {
        categoryLimit: options.categoryLimit || 10,
        productPage: options.productPage || 10,
        productLimit: options.productLimit || 30,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching restaurant menu:", error);
    throw error;
  }
};

// Fetch recommended restaurants nearby
export const getRecommendedRestaurants = async (latitude, longitude) => {
  try {
    const response = await apiClient.get("/location/nearby-restaurants/recommended", {
      params: { latitude, longitude },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching recommended restaurants:", error);
    throw error;
  }
};

// Fetch nearby categories
export const getNearbyCategories = async (latitude, longitude) => {
  try {
    const response = await apiClient.get("/location/nearby-categories", {
      params: { latitude, longitude },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching nearby categories:", error);
    throw error;
  }
};

// Fetch restaurant details by ID
export const getRestaurantById = async (restaurantId) => {
  try {
    const response = await apiClient.get(`/restaurants/${restaurantId}`);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch restaurant by ID:", error);
    throw error;
  }
};
