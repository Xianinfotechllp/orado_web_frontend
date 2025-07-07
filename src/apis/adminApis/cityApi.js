import apiClient from "../apiClient/apiClient";

export const createCity = async (cityData) => {
  try {
    const response = await apiClient.post(`/city/cities`, cityData);
    return response.data;
  } catch (error) {
    console.error("Error creating city:", error);
    throw error.response?.data || { message: "Server error while creating city" };
  }
};

// ✅ Get all Cities
export const getCities = async () => {
  try {
    const response = await apiClient.get(`/city/cities`);
    return response.data;
  } catch (error) {
    console.error("Error fetching cities:", error);
    throw error.response?.data || { message: "Server error while fetching cities" };
  }
};