// App.jsx - Add team routes
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";

import Register from "./components/register_login_components/Register";
import Login from "./components/register_login_components/Login";
import Home from "./components/homecomponent/Home";
import Donate from "./components/donationcomponent/Donate";

import ProtectedRoute from "./components/protectprivatecomponent/ProtectedRoute";
import RedirectIfAuth from "./components/protectprivatecomponent/RedirectIfAuth";

import Donations from "./components/donationscomponent/donations";
import DonationCategory from "./components/donationscategorycomponent/DonationCategory";
import DonationDetail from "./components/donationsdetailcomponent/DonationDetail";

// 👥 Import Team components
import Team from "./components/team/Team";
import TeamDetail from "./components/team/TeamDetail";

import Contact from "./components/contactcomponent/Contact";

import SearchBar from "./components/searchbar/SearchBar";

import CartPage from "./components/cartcomponent/CartPage";

import SmallHeaderComponent from "./components/smallheadercomponent/smallheadercomponent";
import Header from "./components/headercomponent/Header";
import AboutUs from "./components/about_us_component/About_Us";
import MyProfile from "./components/profilecomponent/MyProfile";


import { refreshAccessToken, isTokenExpired } from "./components/base_api/api";

function App() {
  // Token monitoring (commented for production)
  /*
  useEffect(() => {
    const monitorTokens = () => {
      const accessToken = localStorage.getItem('access');
      
      if (accessToken) {
        try {
          const payload = JSON.parse(atob(accessToken.split('.')[1]));
          const expiryTime = new Date(payload.exp * 1000);
          const currentTime = new Date();
          const timeLeft = Math.round((expiryTime - currentTime) / 1000);
          
          console.log(`🔑 Access Token expires in: ${timeLeft} seconds`);
          
          if (timeLeft <= 0) {
            console.log('⚠️ Token expired! Should refresh soon...');
          }
        } catch (e) {
          console.log('❌ Could not decode token');
        }
      }
    };

    const monitor = setInterval(monitorTokens, 2000);
    
    return () => clearInterval(monitor);
  }, []);
  */

  // Token refresh every 14 minutes
  useEffect(() => {
    const setupTokenRefresh = () => {
      const refreshToken = localStorage.getItem("refresh");
      if (!refreshToken) return;

      if (isTokenExpired(refreshToken)) {
        localStorage.clear();
        return;
      }

      const interval = setInterval(async () => {
        try {
          await refreshAccessToken();
          console.log("✅ Access token refreshed automatically");
        } catch (error) {
          console.warn("❌ Background token refresh failed");
          clearInterval(interval);
        }
      }, 14 * 60 * 1000); // 14 minutes

      return () => clearInterval(interval);
    };

    const cleanup = setupTokenRefresh();
    return cleanup;
  }, []);

  return (
    <>
      <BrowserRouter>
      <SmallHeaderComponent />
      <Header/>
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

          {/* 👥 Team routes */}
          <Route path="/team" element={<Team />} />
          <Route path="/team/:id" element={<TeamDetail />} />

          <Route path="/contact" element={<Contact />} />

          <Route path="/donations/search/:query" element={<SearchBar />} />

          <Route path="/cart" element={<CartPage />} />

          <Route path="/about" element={<AboutUs />} />
           <Route path="/profile" element={<MyProfile />} />

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