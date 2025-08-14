import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../base_api/api"; // Axios instance configured with baseURL & token interceptor
import {
  TextField,
  Button,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material"; // Icons for show/hide password
import axios from "axios";
import ToastMessage from "../toastmessage/ToastMessage"; // ✅ Import custom ToastMessage

function Login() {
  const navigate = useNavigate(); // Used to programmatically navigate user

  // Form input values
  const [form, setForm] = useState({
    identifier: "", // Can be email or username
    password: "", // Password
  });

  // State for toast messages
  const [toastMessage, setToastMessage] = useState(""); // ✅ Toast message
  const [toastType, setToastType] = useState(""); // ✅ Toast type

  // Toggle for password visibility
  const [showPassword, setShowPassword] = useState(false);

  // ✅ Auto-hide toast function
  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => {
        setToastMessage("");
        setToastType("");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  // ✅ Show toast helper function
  const showToast = (message, type) => {
    setToastMessage(message);
    setToastType(type);
  };

  // Update form values when user types
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setToastMessage(""); // ✅ Clear toast on input change
    setToastType("");
  };

  // Handle login submit
  const handleLogin = async (e) => {
    e.preventDefault(); // Prevent default form refresh
    try {
      const res = await axios.post("http://127.0.0.1:8000/api/auth/login/", form);
      
      // Save JWT tokens and username in localStorage
      localStorage.setItem("access", res.data.access);
      localStorage.setItem("refresh", res.data.refresh);
      localStorage.setItem("username", res.data.username);

      // 🛠️ Add a small delay to ensure localStorage is flushed
      await new Promise((resolve) => setTimeout(resolve, 50));

      // ✅ Show success message and redirect
      showToast("Login successful! Redirecting...", "success");
      setTimeout(() => navigate("/"), 1000); // Navigate to homepage after 1 second
    } catch (err) {
      // ✅ Show error if login fails
      const backendError =
        err.response?.data?.error || "Login failed. Please try again.";
      showToast(backendError, "error");
    }
  };

  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-[#F74F22] px-4">
        <form
          onSubmit={handleLogin}
          className="w-full max-w-md bg-white p-6 rounded-lg shadow-md"
        >
          {/* Form Heading */}
          <h2 className="text-2xl font-bold text-center mb-6 text-[#F74F22]">
            Login
          </h2>

          {/* Email or Username Field */}
          <div className="mb-4">
            <TextField
              fullWidth
              label="Email or Username"
              name="identifier"
              value={form.identifier}
              onChange={handleChange}
              required
              InputLabelProps={{
                sx: {
                  color: "gray",
                  "&.Mui-focused": { color: "#F74F22" }, // Label turns red when focused
                },
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  "& fieldset": { borderColor: "gray" },
                  "&:hover fieldset": { borderColor: "#F74F22" },
                  "&.Mui-focused fieldset": { borderColor: "#F74F22" },
                },
              }}
            />
          </div>

          {/* Password Field with Visibility Toggle */}
          <div className="mb-4">
            <TextField
              fullWidth
              label="Password"
              name="password"
              type={showPassword ? "text" : "password"} // Toggle between text/password
              value={form.password}
              onChange={handleChange}
              required
              InputLabelProps={{
                sx: {
                  color: "gray",
                  "&.Mui-focused": { color: "#F74F22" },
                },
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  "& fieldset": { borderColor: "gray" },
                  "&:hover fieldset": { borderColor: "#F74F22" },
                  "&.Mui-focused fieldset": { borderColor: "#F74F22" },
                },
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                      tabIndex={-1}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </div>

          {/* Login Button */}
          <Button
            fullWidth
            type="submit"
            variant="contained"
            sx={{
              backgroundColor: "#F74F22",
              "&:hover": { backgroundColor: "#d84315" },
            }}
          >
            Login
          </Button>

          {/* Register Redirect */}
          <div className="mt-4 text-center">
            <span>Don't have an account? </span>
            <span
              className="text-[#F74F22] cursor-pointer font-medium hover:underline"
              onClick={() => navigate("/register")}
            >
              Register
            </span>
          </div>
        </form>
      </div>

      {/* ✅ Custom Toast Notification */}
      <ToastMessage message={toastMessage} type={toastType} />
    </>
  );
}

export default Login;