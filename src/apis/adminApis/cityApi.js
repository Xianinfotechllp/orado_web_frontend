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

export const toggleCityStatus = async (id) => {
  try {
    const response = await apiClient.patch(`/city/cities/${id}/status`);
    return response.data;
  } catch (error) {
    console.error("Error fetching cities:", error);
    throw error.response?.data || { message: "Server error while fetching cities" };
  }
};




export const deleteCity = async (cityId) => {
  try {
    const response = await apiClient.delete(`/city/cities/${cityId}`);
    return response.data;
  } catch (error) {
    console.error("Failed to delete city:", error);
    throw error.response?.data || { message: "Something went wrong" };
  }
};


export const updateCity = async (cityId, updatedData) => {
  try {
    const response = await apiClient.patch(`/city/cities/${cityId}`, updatedData);
    return response.data;
  } catch (error) {
    console.error("Failed to update city:", error);
    throw error.response?.data || { message: "Something went wrong" };
  }
};