// api.js
import axios from 'axios';

// Create base instance
const API = axios.create({
  baseURL: 'http://127.0.0.1:8000/api/auth/',
});

// 🔐 Decode JWT token to check expiration (More robust version)
const decodeToken = (token) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Token decode error:', error);
    return null;
  }
};

// 🔐 Function to check if JWT is expired (Updated version)
const isTokenExpired = (token) => {
  if (!token) return true;
  
  const decoded = decodeToken(token);
  if (!decoded) return true;
  
  const currentTime = Date.now() / 1000;
  // Add 30 second buffer to prevent edge cases
  return decoded.exp < (currentTime + 30);
};

// 🔄 Refresh access token function
const refreshAccessToken = async () => {
  const refresh = localStorage.getItem('refresh');
  if (!refresh) {
    throw new Error('No refresh token available');
  }

  // Check if refresh token is expired
  if (isTokenExpired(refresh)) {
    localStorage.clear();
    throw new Error('Refresh token expired');
  }

  try {
    const response = await axios.post('http://127.0.0.1:8000/api/auth/token/refresh/', {
      refresh: refresh,
    });

    localStorage.setItem('access', response.data.access);
    
    // If new refresh token is provided, update it (for token rotation)
    if (response.data.refresh) {
      localStorage.setItem('refresh', response.data.refresh);
    }

    console.log('✅ Access token refreshed successfully');
    return response.data.access;
  } catch (error) {
    console.error('❌ Token refresh failed:', error);
    localStorage.clear();
    window.location.href = '/login';
    throw error;
  }
};

// 🎯 Get valid access token (refresh if needed)
const getValidAccessToken = async () => {
  const accessToken = localStorage.getItem('access');
  
  // If no access token, try to refresh
  if (!accessToken) {
    return await refreshAccessToken();
  }
  
  // If access token is not expired, return it
  if (!isTokenExpired(accessToken)) {
    return accessToken;
  }
  
  // Access token is expired, try to refresh
  return await refreshAccessToken();
};

// 🚪 Logout function
const logout = async () => {
  const refresh = localStorage.getItem('refresh');
  
  // Try to blacklist the token on the server
  if (refresh) {
    try {
      await axios.post('http://127.0.0.1:8000/api/auth/logout/', {
        refresh: refresh
      });
    } catch (error) {
      console.warn('Logout API call failed, proceeding with local logout');
    }
  }
  
  localStorage.clear();
  window.location.href = '/login';
};

// ✅ Request Interceptor: Attach fresh access token
API.interceptors.request.use(async (config) => {
  try {
    const access = await getValidAccessToken();
    if (access) {
      config.headers.Authorization = `Bearer ${access}`;
    }
  } catch (error) {
    console.error('Failed to get valid access token:', error);
    // Request will proceed without token, server will handle auth
  }
  
  return config;
}, (error) => {
  console.error('Request interceptor error:', error);
  return Promise.reject(error);
});

// ✅ Response Interceptor: Handle token expiry and retry
API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const newAccess = await refreshAccessToken();
        originalRequest.headers.Authorization = `Bearer ${newAccess}`;
        
        // Retry the original request with new token
        return API(originalRequest);
      } catch (refreshError) {
        console.error('Token refresh in response interceptor failed:', refreshError);
        // refreshAccessToken already handles logout, so just reject
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// Export the API instance and utility functions
export default API;

export {
  isTokenExpired,
  refreshAccessToken,
  getValidAccessToken,
  logout,
  decodeToken
};