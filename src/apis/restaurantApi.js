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



// fetch retruants by category and location
export const getRestaurantsByLocationAndCategory = async (latitude, longitude, categoryName, distance = 5000) => {
  try {
    const response = await apiClient.get(`/location/nearby-restaurants/category/${categoryName}`, {
      params: { latitude, longitude, distance },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching restaurants by location and category:", error);
    throw error;
  }
};

// search bar api method

export const getRestaurantsBySearchQuery = async ({
  query,
  latitude,
  longitude,
  radius = 5000,
  page = 1,
  limit = 10
}) => {
  try {
    const response = await apiClient.get("/location/nearby/restaurants/search", {
      params: {
        query,
        latitude,
        longitude,
        radius,
        page,
        limit
      }
    });
    console.log("Search response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error searching restaurants:", error);
    throw error;
  }
};



// creating restaurant 
export const createRestaurant = async (formData) => {
  try {
    const response = await apiClient.post('/restaurants/register', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    console.log("Restaurant created:", response.data);
    return response.data;

  } catch (error) {
    console.error("Error creating restaurant:", error.response?.data || error.message);
    throw error;
  }
};


