import { Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { getValidAccessToken, isTokenExpired } from "../base_api/api";

const ProtectedAdminRoute = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const accessToken = localStorage.getItem("access");
        const refreshToken = localStorage.getItem("refresh");
        const adminFlag = localStorage.getItem("is_admin") === "true";

        // No tokens at all → not authenticated
        if (!accessToken && !refreshToken) {
          setIsAuthenticated(false);
          setIsLoading(false);
          return;
        }

        // Expired refresh token → logout
        if (isTokenExpired(refreshToken)) {
          localStorage.clear();
          setIsAuthenticated(false);
          setIsLoading(false);
          return;
        }

        // Try to get a valid access token
        await getValidAccessToken();

        setIsAuthenticated(true);
        setIsAdmin(adminFlag);
      } catch (error) {
        console.error("Admin authentication check failed:", error);
        setIsAuthenticated(false);
        setIsAdmin(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Checking admin access...</div>
      </div>
    );
  }

  // Redirect cases
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (!isAdmin) return <Navigate to="/" replace />;

  return children;
};

export default ProtectedAdminRoute;
