import apiClient from "./apiClient/apiClient"; 

export const loginUser = async (email, password) => {
  try {
    const res = await apiClient.post("/user/login", {
      email,
      password,
    });
    return res.data;
  } catch (err) {
    // Safer fallback if `err.response` is undefined
    throw err.response?.data || { message: "Login failed" };
  }
};

export const registerUser = async ({ name, email, phone, password }) => {
  try {
    const res = await apiClient.post('/user/register', {
      name,
      email,
      phone,
      password,
    });
    console.log('register',res.data);
    return res.data;
  } catch (err) {
    // fallback if err.response is undefined
    throw err.response?.data || { message: 'Registration failed' };
  }
};

// logout user
export const logoutUser = async () => {
  try {
    const response = await apiClient.post('/user/logout');
    console.log('Logout response:', response.data);
    return response.data; // { message: 'Logged out successfully' }
  } catch (error) {
    console.error('Error logging out:', error.response?.data || error.message);
    throw error;
  }
};

// logout All use
export const logoutAllDevices = async () => {
  try {
    const response = await apiClient.post('/user/logout-all');
    return response.data; // { message: 'Logged out from all sessions' }
  } catch (error) {
    console.error('Error logging out from all devices:', error.response?.data || error.message);
    throw error;
  }
};