import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const apiClient = axios.create({
  baseURL: BASE_URL,
});

// Fetch restaurant menu


export const getRestaurantMenu = (restaurantId) => {
  return apiClient.get(`/restaurants/${restaurantId}/menu`);
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



export const getRestaurantById = async (restaurantId) => {
  try {
    const response = await apiClient.get(`/restaurants/${restaurantId}`);
    console.log("fetched 💻💻💻💻",response.data)
    return response.data;
  } catch (error) {
    console.error("Failed to fetch restaurant by ID:", error);
    throw error;
  }
};