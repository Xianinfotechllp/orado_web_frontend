import apiClient from "./apiClient/apiClient";

export const getBillSummary = async (data) => {
  try {
    const response = await apiClient.post(`/order/pricesummary`, data);
    return response.data;
  } catch (error) {
    console.error("Error fetching bill summary:", error.response?.data || error.message);
    throw error;
  }
};



export const placeOrder = async (orderData) => {
  try {
    const response = await apiClient.post(`/order/place-order`, orderData);
    return response.data;
  } catch (error) {
    console.error("Failed to place order:", error);
    throw error;
  }
};

export const getCustomerOrders = async () => {
  try {
    const response = await apiClient.get("/order/customer/orders");
    console.log("Fetched customer orders:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching customer orders:", error);
    throw error;
  }
};

// get single order
export const getOrderById = async (orderId) => {
  try {
    const response = await apiClient.get(`/order/${orderId}`);
    console.log("Fetched order:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching order by ID:", error);
    throw error;
  }
};

export const reorderOrder = async (orderId) => {
  try {
    const response = await apiClient.post(`/order/reorder/${orderId}`);
    return response.data;
  } catch (error) {
    console.error(`Error reordering order ${orderId}:`, error);
    throw error;
  }
};

