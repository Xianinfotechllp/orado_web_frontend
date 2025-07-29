import apiClient from '../apiClient/apiClient';

export const reviewAgentSelfie = async ({ selfieId, action, rejectionReason }) => {
  try {
    const res = await apiClient.patch(
      `/admin/agent/selfie/${selfieId}/review`,
      {
        action,
        ...(action === 'reject' && { rejectionReason }), 
      }
    );
    return res.data;
  } catch (error) {
    throw error;
  }
};