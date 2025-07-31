// App.jsx - Updated to hide layout on /login and /register
import "./App.css";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

import Register from "./components/register_login_components/Register";
import Login from "./components/register_login_components/Login";
import Home from "./components/homecomponent/Home";
import Donate from "./components/donationcomponent/Donate";

import ProtectedRoute from "./components/protectprivatecomponent/ProtectedRoute";
import RedirectIfAuth from "./components/protectprivatecomponent/RedirectIfAuth";

import Donations from "./components/donationscomponent/donations";
import DonationCategory from "./components/donationscategorycomponent/DonationCategory";
import DonationDetail from "./components/donationsdetailcomponent/DonationDetail";

import Team from "./components/team/Team";
import TeamDetail from "./components/team/TeamDetail";

import Contact from "./components/contactcomponent/Contact";
import CartPage from "./components/cartcomponent/CartPage";
import SmallHeaderComponent from "./components/smallheadercomponent/smallheadercomponent";
import Header from "./components/headercomponent/Header";
import AboutUs from "./components/about_us_component/About_Us";
import MyProfile from "./components/profilecomponent/MyProfile";
import TabletMobileHeader from "./components/TabletMobileHeaderComponent/TabletMobileHeader";
import Footer from "./components/footercomponent/Footer";

import { refreshAccessToken, isTokenExpired } from "./components/base_api/api";
import API from "./components/base_api/api";

// Wrapper component for layout control
function LayoutWrapper({ cartCount, updateCartCount }) {
  const location = useLocation();
  const hideLayout = location.pathname === "/login" || location.pathname === "/register";

  return (
    <>
      {!hideLayout && <SmallHeaderComponent />}
      {!hideLayout && <Header cartCount={cartCount} updateCartCount={updateCartCount} />}
      {!hideLayout && <TabletMobileHeader />}

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
        <Route
          path="/donations/detail/:id"
          element={<DonationDetail updateCartCount={updateCartCount} />}
        />
        <Route path="/team" element={<Team />} />
        <Route path="/team/:id" element={<TeamDetail />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/cart" element={<CartPage updateCartCount={updateCartCount} />} />
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

      {!hideLayout && <Footer />}
    </>
  );
}

function App() {
  const [cartCount, setCartCount] = useState(0);

  // Token auto-refresh every 14 minutes
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
      }, 14 * 60 * 1000);

      return () => clearInterval(interval);
    };

    const cleanup = setupTokenRefresh();
    return cleanup;
  }, []);

  const updateCartCount = async () => {
    const token = localStorage.getItem("access");
    if (token) {
      try {
        const res = await API.get("cart/");
        const items = res.data.results || res.data;
        setCartCount(items?.length || 0);
      } catch (err) {
        console.error("Error fetching cart count:", err);
      }
    }
  };

  useEffect(() => {
    if (localStorage.getItem("access")) {
      updateCartCount();
    }
  }, []);

  return (
    <BrowserRouter>
      <LayoutWrapper cartCount={cartCount} updateCartCount={updateCartCount} />
    </BrowserRouter>
  );
}

export default App;
