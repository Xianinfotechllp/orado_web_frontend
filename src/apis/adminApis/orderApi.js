import apiClient from "../apiClient/apiClient";






export const updateOrderStatus = async (orderId, newStatus) => {
  try {
    const response = await apiClient.patch(`/admin/orders/${orderId}/status`, {
      status: newStatus
    });
    return response.data;
  } catch (error) {
    console.error('Error updating order status:', error);
    throw error;
  }
};