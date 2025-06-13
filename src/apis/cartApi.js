import apiClient from "./apiClient/apiClient"; 

export const addToCart = async (restaurantId, productId, quantity) => {
  try {
    const payload = {
      restaurantId,
      products: [
        {
          productId,
          quantity,
        },
      ],
    };

    const res = await apiClient.post("/cart/add", payload);
  
    return res.data;
  } catch (error) {
    console.error("Error updating cart:", error);
    throw error;
  }
};



export const getCart = async () => {
  try {
    const res = await apiClient.get("/cart");
    console.log("getCart response:", res.data);
    
    console.log("res",res.data)
    return res.data;
  } catch (error) {
    // console.error("Error fetching cart:", error);
    throw error;
  }
};

// clear cart
export const clearCartApi = async () => {
  try {
    const res = await apiClient.delete(`/cart/clear`);
    console.log("Clear cart response:", res.data);
    return {
      success: res.data.success,
      cart: res.data.cart,
      message: res.data.message
    };
  } catch (error) {
    console.error("Clear cart error:", error);
    throw error;
  }
};

export const updateCart = async ({ productId, quantity }) => {
  try {
    const response = await apiClient.put(`/cart/update`, { productId, quantity });
    console.log("Cart item updated:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error updating cart item:", error);
    throw error;
  }
};

export const removeFromCart = async (productId) => {
  try {
    const response = await apiClient.delete(`/cart/remove`, { data: { productId } });
    // Note: For DELETE requests with a body, axios requires `data` key.
    console.log("Item removed from cart:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error removing item from cart:", error);
    throw error;
  }
};
