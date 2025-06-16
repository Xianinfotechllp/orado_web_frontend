import apiClient from "./apiClient/apiClient";

export const getBillSummary = async (data) => {
  try {
    const response = await apiClient.post(`/order/pricesummary`, data);
    console.log("Fetched bill summary:", response.data);
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

// order section for merchant
// Get orders by merchant/restaurant
export const getOrdersByMerchant = async (restaurantId) => {
  try {
    if (!restaurantId) {
      throw new Error("restaurantId is required");
    }

    const response = await apiClient.get(`/order/restaurant/${restaurantId}`);
    return response.data;
  } catch (error) {
    console.error("getOrdersByMerchant error:", error.response?.data || error.message);
    throw error;
  }
};

// Update order status
export const updateOrderStatus = async (orderId, newStatus) => {
  try {
    const response = await apiClient.put(`/order/${orderId}/status`, {
      newStatus
    });
    return response.data;
  } catch (error) {
    console.error(
      "updateOrderStatus error:",
      error.response?.data || error.message
    );
    throw error;
  }
};


export const sendOrderDelayReason = async (orderId, delayReason, preparationTime = null) => {
  try {
    const requestBody = { delayReason };
    
    // Only include preparationTime if it's provided and valid
    if (preparationTime !== null && typeof preparationTime === 'number' && preparationTime > 0) {
      requestBody.preparationTime = preparationTime;
    }

    const response = await apiClient.patch(`/order/${orderId}/delay-reason`, requestBody);
    return response.data;
  } catch (error) {
    console.error(
      "sendOrderDelayReason error:",
      error.response?.data || error.message
    );
    throw error;
  }
};