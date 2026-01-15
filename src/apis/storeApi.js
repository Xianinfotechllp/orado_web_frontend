import apiClient from "./apiClient/apiClient";



export const getNearbyStores = async ({
  latitude,
  longitude,
  storeType,
  maxDistance = 15000,
  minOrderAmount = 0,
}) => {
  try {
    const res = await apiClient.get("/location/nearby-stores", {
      params: {
        latitude,
        longitude,
        storeType,
        maxDistance,
        minOrderAmount,
      },
    });
    return res.data;
  } catch (err) {
    throw err.response?.data || { message: "Failed to fetch grocery stores" };
  }
};

export const searchStore = async ({
  query,
  latitude,
  longitude,
  storeType,
  radius = 10000,
  limit = 10,
  page = 1
}) => {
  try {
    const res = await apiClient.get("/location/search-nearby-stores", {
      params: {
        query,
        latitude,
        longitude,
        storeType,
        radius,
        limit,
        page,
      },
    });
    console.log("searc", res.data)
    return res.data;
  } catch (err) {
    throw err.response?.data || { message: "Failed to search for stores" };
  }
};