import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import axios from "axios";

import Register from "./components/register_login_components/Register";
import Login from "./components/register_login_components/Login";
import Home from "./components/homecomponent/Home";
import Donate from "./components/donationcomponent/Donate";

import ProtectedRoute from "./components/protectprivatecomponent/ProtectedRoute";
import RedirectIfAuth from "./components/protectprivatecomponent/RedirectIfAuth";

import Donations from "./components/donationscomponent/donations";
import DonationCategory from "./components/donationscategorycomponent/DonationCategory";
import DonationDetail from "./components/donationsdetailcomponent/DonationDetail";

function App() {
  // 🔁 Refresh access token every 4 minutes in background
  useEffect(() => {
    const interval = setInterval(async () => {
      const refresh = localStorage.getItem("refresh");
      if (!refresh) return;

      try {
        const res = await axios.post("http://127.0.0.1:8000/api/auth/token/refresh/", {
          refresh: refresh,
        });

        localStorage.setItem("access", res.data.access);
        console.log("✅ Access token refreshed");
      } catch (err) {
        console.warn("❌ Refresh token failed. Logging out.");
        localStorage.clear();
        window.location.href = "/login";
      }
    }, 4 * 60 * 1000); // every 4 minutes

    return () => clearInterval(interval); // Cleanup
  }, []);

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/donate"
            element={
              <ProtectedRoute>
                <Donate />
              </ProtectedRoute>
            }
          />
          <Route path="/donations" element={<Donations />} />
          <Route path="/donations/category/:id" element={<DonationCategory />} />
          <Route path="/donations/detail/:id" element={<DonationDetail />} />

          <Route
            path="/register"
            element={
              <RedirectIfAuth>
                <Register />
              </RedirectIfAuth>
            }
          />
          <Route
            path="/login"
            element={
              <RedirectIfAuth>
                <Login />
              </RedirectIfAuth>
            }
          />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
