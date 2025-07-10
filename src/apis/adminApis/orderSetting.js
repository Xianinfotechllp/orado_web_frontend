import apiClient from "../apiClient/apiClient";



/**
 * Fetch global order settings
 */
export const getGlobalOrderSettings = async () => {
  try {
    const response = await apiClient.get("/order-settings");
    return response.data;
  } catch (error) {
    console.error("Failed to fetch global order settings:", error);
    throw error.response?.data || { message: "Something went wrong." };
  }
};

/**
 * Create or update global order settings
 * @param {Object} settingsData
 */
export const createOrUpdateGlobalOrderSettings = async (settingsData) => {
  try {
    const response = await apiClient.post("/order-settings", settingsData);
    return response.data;
  } catch (error) {
    console.error("Failed to save global order settings:", error);
    throw error.response?.data || { message: "Something went wrong." };
  }
};
