import apiClient from "./apiClient/apiClient";



export const getNearbyGroceryStores = async ({
  latitude,
  longitude,
  maxDistance = 15000,
  minOrderAmount = 0,
}) => {
  try {
    const res = await apiClient.get("/location/nearby-grocery", {
      params: {
        latitude,
        longitude,
        maxDistance,
        minOrderAmount,
      },
    });
    return res.data;
  } catch (err) {
    throw err.response?.data || { message: "Failed to fetch grocery stores" };
  }
};
