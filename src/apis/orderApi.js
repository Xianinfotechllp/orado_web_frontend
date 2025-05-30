import axios from "axios";

const BASE_URL = "http://localhost:5000";

export const getBillSummary = async (data) => {
  try {
    const response = await axios.post(`${BASE_URL}/order/pricesummary`, data);
    return response.data;
  } catch (error) {
    console.error("Error fetching bill summary:", error.response?.data || error.message);
    throw error;
  }
};
