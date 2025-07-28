import apiClient from "../apiClient/apiClient";


export const saveGlobalSettings = async (settings) => {
  try {
    const response = await apiClient.post(`/admin/agent-earnings/settings`, {
      mode: 'global',
      baseFee: settings.baseFee,
      baseKm: settings.baseDistance,
      perKmFeeBeyondBase: settings.perKmFeeBeyondBase,
      peakHourBonus: settings.peakHourBonus,
      rainBonus: settings.zoneBonus // Assuming zoneBonus is similar to rainBonus
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const fetchGlobalSettings = async () => {
  try {
    const response = await apiClient.get(`/admin/agent-earnings/settings?mode=global`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};