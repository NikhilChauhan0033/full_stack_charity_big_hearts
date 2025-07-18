import axios from 'axios';

const API = axios.create({
  baseURL: 'http://127.0.0.1:8000/api/auth/',
});

// ✅ Request Interceptor — attaches access token to every request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('access');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ✅ Response Interceptor — auto-refresh token on 401
API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refresh = localStorage.getItem("refresh");

      if (refresh) {
        try {
          const res = await axios.post("http://127.0.0.1:8000/api/auth/token/refresh/", { refresh });

          localStorage.setItem("access", res.data.access);
          originalRequest.headers.Authorization = `Bearer ${res.data.access}`;

          // 🔁 Retry the original request with new token
          return API(originalRequest);
        } catch (refreshError) {
          // ❌ Refresh token invalid/expired — force logout
          localStorage.clear();
          window.location.href = "/login";
        }
      }
    }

    return Promise.reject(error);
  }
);

export default API;
