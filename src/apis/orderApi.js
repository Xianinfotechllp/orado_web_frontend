import apiClient from "./apiClient/apiClient";

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

export const reorderOrder = async (orderId) => {
  try {
    const response = await apiClient.post(`/order/reorder/${orderId}`);
    return response.data;
  } catch (error) {
    console.error(`Error reordering order ${orderId}:`, error);
    throw error;
  }
};
