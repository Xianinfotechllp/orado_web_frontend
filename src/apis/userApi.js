import apiClient from "./apiClient/apiClient"; // Adjust path as needed

export const getAddress = async (userId) => {
  try {
    const response = await apiClient.get(`/user/adderss`);
    console.log(response);
    return response.data;
  } catch (error) {
    console.error("Error fetching address:", error.response?.data || error.message);
    throw error;
  }
};

export const updateAddress = async ( addressId, updatedAddress) => {
  try {
    const response = await apiClient.put(`/user/addresses/${addressId}`, updatedAddress);
    console.log("Address updated:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error updating address:", error.response?.data || error.message);
    throw error;
  }
};




export const addAddress = async ( addressData) => {
  try {
    const response = await apiClient.post("/user/address", {
      type: addressData.type,
      street: addressData.street,
      city: addressData.city,
      state: addressData.state,
      zip: addressData.zip,
      longitude: addressData.location.longitude,
      latitude: addressData.location.latitude,
    });

    return response.data;
  } catch (error) {
    console.error("Failed to add address:", error);
    throw error;
  }
};

export const deleteAddress = async (addressId) => {
  try {
    const response = await apiClient.delete(`/user/delete/${addressId}`);
    console.log("Address deleted:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error deleting address:", error.response?.data || error.message);
    throw error;
  }
};

// update user profile
export const updateUserProfile = async (updatedFields) => {
  try {
    const response = await apiClient.put('/user/update-profile', updatedFields);
    return response.data;
  } catch (error) {
    console.error('Error updating user profile:', error.response?.data || error.message);
    throw error;
  }
};



