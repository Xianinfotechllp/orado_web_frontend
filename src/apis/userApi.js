import axios from 'axios';

const BASE_URL = axios.create({ baseURL: 'http://localhost:5000' });


export const getAddress = async (userId) => {
  try {
    const response = await axios.get(`http://localhost:5000/user/adderss/${userId}`);
    console.log(response)
    return response.data;
  } catch (error) {
    console.error("Error fetching address:", error.response?.data || error.message);
    throw error;
  }
};

export const updateAddress = async (userId, addressId, updatedAddress) => {
  try {
    const response = await BASE_URL.put(`/user/${userId}/addresses/${addressId}`, updatedAddress);
    console.log("Address updated:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error updating address:", error.response?.data || error.message);
    throw error;
  }
};