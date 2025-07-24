import axios from 'axios';

// Create base instance
const API = axios.create({
  baseURL: 'http://127.0.0.1:8000/api/auth/',
});

// 🔐 Function to check if JWT is expired
const isTokenExpired = (token) => {
  if (!token) return true;
  const [, payload] = token.split('.');
  try {
    const decoded = JSON.parse(atob(payload));
    return Date.now() >= decoded.exp * 1000;
  } catch (e) {
    return true;
  }
};

// ✅ Request Interceptor: Attach fresh access token
API.interceptors.request.use(async (config) => {
  let access = localStorage.getItem('access');
  const refresh = localStorage.getItem('refresh');

  // If access token is expired, but refresh is still valid, refresh it
  if (isTokenExpired(access) && refresh && !isTokenExpired(refresh)) {
    try {
      const res = await axios.post("http://127.0.0.1:8000/api/auth/token/refresh/", { refresh });
      access = res.data.access;
      localStorage.setItem("access", access);
    } catch (err) {
      localStorage.clear();
      window.location.href = "/login";
      return Promise.reject(err);
    }
  }

  // Attach token if valid
  if (access) {
    config.headers.Authorization = `Bearer ${access}`;
  }

  return config;
}, (error) => Promise.reject(error));

// ✅ Response Interceptor: Handle token expiry and retry
API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const refresh = localStorage.getItem("refresh");

    if (error.response?.status === 401 && !originalRequest._retry && refresh) {
      originalRequest._retry = true;
      try {
        const res = await axios.post("http://127.0.0.1:8000/api/auth/token/refresh/", { refresh });
        const newAccess = res.data.access;

        localStorage.setItem("access", newAccess);
        originalRequest.headers.Authorization = `Bearer ${newAccess}`;

        return API(originalRequest); // Retry with new token
      } catch (refreshError) {
        localStorage.clear();
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default API;
