// components/protectprivatecomponent/RedirectIfAuth.jsx
import { Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { isTokenExpired } from '../base_api/api';

const RedirectIfAuth = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      const accessToken = localStorage.getItem('access');
      const refreshToken = localStorage.getItem('refresh');

      // If we have a valid refresh token, consider user authenticated
      if (refreshToken && !isTokenExpired(refreshToken)) {
        setIsAuthenticated(true);
      } else {
        // Clear invalid tokens
        if (refreshToken && isTokenExpired(refreshToken)) {
          localStorage.clear();
        }
        setIsAuthenticated(false);
      }
      
      setIsLoading(false);
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

  return isAuthenticated ? <Navigate to="/" replace /> : children;
};

export default RedirectIfAuth;