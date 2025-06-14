import apiClient from "./apiClient/apiClient";

export const initiateWalletTopUp = async (amount) => {
  try {
    const response = await apiClient.post(`/user/wallet/initiate`, { amount });
    return response.data;
  } catch (error) {
    console.error("Failed to initiate wallet top-up:", error);
    throw error;
  }
};

export const verifyAndCreditWallet = async (paymentData) => {
  try {
    const response = await apiClient.post(`/user/wallet/verify`, paymentData);
    return response.data;
  } catch (error) {
    console.error("Failed to verify and credit wallet:", error);
    throw error;
  }
};

export const getWalletBalance = async () => {
  try {
    const response = await apiClient.get(`/user/wallet/balance`);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch wallet balance:", error);
    throw error;
  }
};
