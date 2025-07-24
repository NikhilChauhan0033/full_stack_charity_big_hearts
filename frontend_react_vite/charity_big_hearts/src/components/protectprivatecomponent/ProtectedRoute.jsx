// components/protectprivatecomponent/ProtectedRoute.jsx
import { Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { refreshAccessToken, isTokenExpired, getValidAccessToken } from "../base_api/api"; // ✅ Fixed

const ProtectedRoute = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const accessToken = localStorage.getItem('access');
        const refreshToken = localStorage.getItem('refresh');

        // If no tokens at all, not authenticated
        if (!accessToken && !refreshToken) {
          setIsAuthenticated(false);
          setIsLoading(false);
          return;
        }

        // If refresh token is expired, not authenticated
        if (isTokenExpired(refreshToken)) {
          localStorage.clear();
          setIsAuthenticated(false);
          setIsLoading(false);
          return;
        }

        // Try to get a valid access token
        await getValidAccessToken(); // ✅ Now this will work
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Authentication check failed:', error);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;