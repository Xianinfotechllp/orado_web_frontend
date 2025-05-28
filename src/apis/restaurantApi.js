import axios from "axios";
const BASE_URL = "http://localhost:5000";
export const getRestaurantMenu = (restaurantId) => {
  return axios.get(`${BASE_URL}/resturants/${restaurantId}/menu`);
};