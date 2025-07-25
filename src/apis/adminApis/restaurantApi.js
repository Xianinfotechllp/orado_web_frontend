import apiClient from "../apiClient/apiClient";

export const fetchProductsByRestaurant = async (restaurantId) => {
  try {
    const response = await apiClient.get(`/admin/products/by-restaurant/${restaurantId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};