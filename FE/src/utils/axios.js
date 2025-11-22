import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

// Tạo axios instance
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
});

// Request interceptor - Thêm token vào header
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Xử lý token hết hạn
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Nếu token hết hạn hoặc không hợp lệ (401, 403)
    if (error.response?.status === 401 || error.response?.status === 403) {
      // Clear localStorage
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      localStorage.removeItem("selectedMenu");
      localStorage.removeItem("admin-section");

      // Redirect về trang login
      if (globalThis.location.pathname !== "/login") {
        globalThis.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
