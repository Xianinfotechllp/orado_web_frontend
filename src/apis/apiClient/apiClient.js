import axios from "axios";
import store from "../../store/store"; // path to your Redux store

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const apiClient = axios.create({
  baseURL: BASE_URL,
//   withCredentials: true, // useful for cookie-based sessions
});

// Attach token automatically to every request
apiClient.interceptors.request.use(
  (config) => {
    const token = store.getState().auth.token;
    console.log("Token attached to request:", token);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default apiClient;
