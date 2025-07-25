import apiClient from '../apiClient/apiClient';

// Save commission settings
export const getCommissionSettings = async () => {
  try {
    const response = await apiClient.get('/commission/settings');
    return { data: response.data, status: response.status };
  } catch (error) {
    throw error?.response || error;
  }
};

export const saveCommissionSettings = async (settings) => {
  try {
    const response = await apiClient.post('/commission/settings', settings);
    return { data: response.data, status: response.status };
  } catch (error) {
    throw error?.response || error;
  }
};
