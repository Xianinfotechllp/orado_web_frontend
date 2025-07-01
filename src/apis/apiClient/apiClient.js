import axios from "axios";
import store from "../../store/store";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/";

// Create axios instance
const apiClient = axios.create({
  baseURL: BASE_URL,
});

// Attach token automatically to every request
apiClient.interceptors.request.use(
  (config) => {
    const adminToken = sessionStorage.getItem("adminToken");
    const customerToken = localStorage.getItem("token");

    const token = adminToken || customerToken;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log(
        `%c🔐 Token attached:`,
        "color: green; font-weight: bold;",
        token
      );
      console.log(
        `%c📡 Request URL:`,
        "color: blue; font-weight: bold;",
        config.baseURL + config.url
      );
    } else {
      console.warn(
        `%c⚠️ No token found for request to:`,
        "color: orange; font-weight: bold;",
        config.baseURL + config.url
      );
    }

    return config;
  },
  (error) => {
    console.error("⛔️ Error in request interceptor:", error);
    return Promise.reject(error);
  }
);

export default apiClient;
