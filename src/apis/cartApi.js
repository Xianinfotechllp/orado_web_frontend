import apiClient from "./apiClient/apiClient"; 

export const updateCart = async (restaurantId, userId, productId, quantity) => {
  try {
    const payload = {
      restaurantId,
      userId,
      products: [
        {
          productId,
          quantity,
        },
      ],
    };

    const res = await apiClient.post("/cart/add", payload);
    console.log(res);
    return res.data;
  } catch (error) {
    console.error("Error updating cart:", error);
    throw error;
  }
};
