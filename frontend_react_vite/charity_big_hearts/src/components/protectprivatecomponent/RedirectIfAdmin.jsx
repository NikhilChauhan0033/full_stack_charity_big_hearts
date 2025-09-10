// components/protectprivatecomponent/RedirectIfAdmin.jsx
import { Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { isTokenExpired } from "../base_api/api";

const RedirectIfAdmin = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [redirectPath, setRedirectPath] = useState(null);

  useEffect(() => {
    const checkAuth = () => {
      const refreshToken = localStorage.getItem("refresh");
      const isAdmin = localStorage.getItem("is_admin") === "true";

      if (refreshToken && !isTokenExpired(refreshToken)) {
        if (isAdmin) {
          setRedirectPath("/admin-panel"); // ✅ redirect admins
        } else {
          setRedirectPath("/"); // ✅ redirect normal users
        }
      } else {
        // Clear expired tokens
        if (refreshToken && isTokenExpired(refreshToken)) {
          localStorage.clear();
        }
        setRedirectPath(null); // allow access to login/register
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

  return redirectPath ? <Navigate to={redirectPath} replace /> : children;
};

export default RedirectIfAdmin;
