import apiClient from "../apiClient/apiClient";

export const getAdminOrders = async () => {
  try {
    const response = await apiClient.get(`/admin/order-list`);
    return response.data.data;
  } catch (error) {
    console.error("Failed to fetch orders:", error);
    throw error;
  }
};




export const addCity = async (cityData) => {
  try {
    const response = await apiClient.post(`/city/cities`, cityData);
    return response.data;
  } catch (error) {
    console.error("Failed to add city:", error.response?.data || error.message);
    throw error;
  }
};





export const getAllCities = async () => {
  try {
    const response = await apiClient.get('/city/cities');
    return response.data;
  } catch (error) {
    console.error('Error fetching cities:', error);
    throw error;
  }
};

// Create city delivery fee setting
export const createCityDeliveryFeeSetting = async (data) => {
  try {
    const response = await apiClient.post('/city/city-delivery-fee-settings', data);
    return response.data;
  } catch (error) {
    console.error('Error creating city delivery fee:', error);
    throw error;
  }
};

// Get city delivery fee settings
export const getCityDeliveryFeeSettings = async (cityId) => {
  try {
    const response = await apiClient.get(`/city/city-delivery-fee-settings`, {
      params: { city: cityId }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching city delivery fee:', error);
    throw error;
  }
};


// Get city delivery fee settings
export const updateDeliveryFeeSettings = async (cityId) => {
  try {
    const response = await apiClient.get(`/city/city-delivery-fee-settings`, {
      params: { city: cityId }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching city delivery fee:', error);
    throw error;
  }
};








export const getSingleCityDeliveryFeeSetting = async (params) => {
  try {
    const response = await apiClient.get(`/city/city-delivery-fee-settings`, {
      params
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching city delivery fee setting:", error);
    throw error;
  }
}




export const fetchRestaurantsDropdown = async () => {
  try {
    const result = await apiClient.get("/admin/restaurants/dropdown-list");
    return result.data;
  } catch (error) {
    console.error("Error fetching restaurant dropdown:", error);
    return []; // or null / undefined / throw — depending on your preference
  }
};





export const fetchPromos = async (params = {}) => {
  try {
    const response = await apiClient.get("/promo", { params });
    return response.data;
  } catch (error) {
    console.error("Error fetching promos:", error);
    throw error;
  }
};


export const getLoyalitySettings = async (params = {}) => {
  try {
    const response = await apiClient.get("/loyality", { params });
    return response.data;
  } catch (error) {
    console.error("Error fetching promos:", error);
    throw error;
  }
};

export const createLoyaltySettings = async (data) => {
  try {
    const response = await apiClient.post("/loyality", data);
    return response.data;
  } catch (error) {
    console.error("Error saving loyalty settings:", error);
    throw error;
  }
};



export const updatePromo = async (promoId, data) => {
  try {
    const response = await apiClient.put(`/promo/${promoId}`, data);
    return response.data;
  } catch (error) {
    console.error("Error updating promo:", error);
    throw error;
  }
};

// ✅ Delete promo
export const deletePromo = async (promoId) => {
  try {
    const response = await apiClient.delete(`/promo/${promoId}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting promo:", error);
    throw error;
  }
};



export const restaurantTableList = async () => {
  try {
    const response = await apiClient.get("/admin/restaurants/table-list");
    return response.data;
  } catch (error) {
    console.error("error on fecthin restaurant list", error);
    throw error;
  }
};


export const fetchRestauantsLocationForMap = async () => {
  try {
    const response = await apiClient.get("/admin/restaurants/location-map");
    return response.data;
  } catch (error) {
    console.error("error on fecthin restaurant list", error);
    throw error;
  }
};


export const fetchOrdersLocationForMap = async () => {
  try {
    const response = await apiClient.get("/admin/orders/location-map");
    return response.data;
  } catch (error) {
    console.error("error on fecthin order location", error);
    throw error;
  }
};





