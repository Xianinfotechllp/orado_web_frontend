import apiClient from "./apiClient/apiClient"; // adjust path

// 1. Update SMS Notification Preferences
export const updateNotificationPreferences = async (notificationPrefs) => {
  try {
    const response = await apiClient.put(
      "/user/notifications/preferences",
      notificationPrefs
    );
    console.log("Notification preferences updated:", response.data);
    return response.data;
  } catch (error) {
    console.error("Failed to update notification preferences:", error);
    throw error;
  }
};

// 2. Delete User Account
export const deleteAccount = async () => {
  try {
    const response = await apiClient.delete("/user/delete-account");
    return response.data;
  } catch (error) {
    console.error("Failed to delete account:", error);
    throw error;
  }
};
