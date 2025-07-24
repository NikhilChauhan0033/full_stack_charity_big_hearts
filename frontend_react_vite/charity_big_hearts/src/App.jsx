import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

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
  return (
    <>
      <BrowserRouter>
        <Routes>
          {/* Public Home Page (Always accessible) */}
          <Route path="/" element={<Home />} />

          {/* Donate - Protected Route (Only if logged in) */}
          <Route
            path="/donate"
            element={
              <ProtectedRoute>
                <Donate />
              </ProtectedRoute>
            }
          />

          <Route path="/donations" element={<Donations />} />
          <Route
            path="/donations/category/:id"
            element={<DonationCategory />}
          />
          <Route path="/donations/detail/:id" element={<DonationDetail />} />

          {/* Register Page - Only if not logged in */}
          <Route
            path="/register"
            element={
              <RedirectIfAuth>
                <Register />
              </RedirectIfAuth>
            }
          />

          {/* Login Page - Only if not logged in */}
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
