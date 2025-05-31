import axios from "axios";

const BASE_URL = "http://localhost:5000";

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

    const res = await axios.post(`${BASE_URL}/cart/add`, payload);
    console.log(res)
    return res.data;
  } catch (error) {
    console.error("Error updating cart:", error);
    throw error;
  }
};
