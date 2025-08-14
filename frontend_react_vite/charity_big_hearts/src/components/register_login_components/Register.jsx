import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../base_api/api"; // Pre-configured axios instance
import {
  TextField,
  Button,
  IconButton,
} from "@mui/material"; // MUI components
import { Visibility, VisibilityOff } from "@mui/icons-material"; // Eye icons for password toggle
import axios from "axios";
import ToastMessage from "../toastmessage/ToastMessage"; // ✅ Import custom ToastMessage

function Register() {
  const navigate = useNavigate(); // For redirection

  // Form data state
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirm_password: "",
  });

  // State for toast messages
  const [toastMessage, setToastMessage] = useState(""); // ✅ Toast message
  const [toastType, setToastType] = useState(""); // ✅ Toast type

  // Password show/hide toggle
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

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

  // Update form values on input change
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setToastMessage(""); // ✅ Clear toast on input change
    setToastType("");
  };

  // Form submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://127.0.0.1:8000/api/auth/register/", form);
      
      // ✅ Show success message and redirect
      showToast("Registration successful! Redirecting to login...", "success");
      setTimeout(() => navigate("/login"), 1000); // Redirect to login
    } catch (err) {
      // ✅ Extract error from backend or use fallback
      const backendError =
        err.response?.data?.error ||
        Object.values(err.response?.data || {})[0] ||
        "Registration failed. Please try again.";
      showToast(backendError, "error");
    }
  };

  return (
    <>
      {/* Centered form wrapper */}
      <div className="min-h-screen flex items-center justify-center bg-[#F74F22] px-4">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-md bg-white p-6 rounded-lg shadow-md"
        >
          <h2 className="text-2xl font-bold text-center mb-6 text-[#F74F22]">
            Register
          </h2>

          {/* Name input */}
          <div className="mb-4">
            <TextField
              fullWidth
              label="Name"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              InputLabelProps={{
                sx: {
                  color: "gray",
                  "&.Mui-focused": { color: "#F74F22" }, // Label color when focused
                },
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  "& fieldset": { borderColor: "gray" }, // Default border
                  "&:hover fieldset": { borderColor: "#F74F22" },
                  "&.Mui-focused fieldset": { borderColor: "#F74F22" },
                },
              }}
            />
          </div>

          {/* Email input */}
          <div className="mb-4">
            <TextField
              fullWidth
              label="Email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              type="email"
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
            />
          </div>

          {/* Password input with toggle */}
          <div className="mb-4">
            <TextField
              fullWidth
              label="Password"
              name="password"
              type={showPassword ? "text" : "password"}
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
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                    tabIndex={-1}
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                ),
              }}
            />
          </div>

          {/* Confirm Password with toggle */}
          <div className="mb-4">
            <TextField
              fullWidth
              label="Confirm Password"
              name="confirm_password"
              type={showConfirm ? "text" : "password"}
              value={form.confirm_password}
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
                  <IconButton
                    onClick={() => setShowConfirm(!showConfirm)}
                    edge="end"
                    tabIndex={-1}
                  >
                    {showConfirm ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                ),
              }}
            />
          </div>

          {/* Submit Button */}
          <Button
            fullWidth
            type="submit"
            variant="contained"
            sx={{
              backgroundColor: "#F74F22",
              "&:hover": { backgroundColor: "#d84315" }, // Darker red on hover
            }}
          >
            Register
          </Button>

          {/* Login link below form */}
          <div className="mt-4 text-center">
            <span>Already have an account? </span>
            <span
              className="text-[#F74F22] cursor-pointer font-medium hover:underline"
              onClick={() => navigate("/login")}
            >
              Login
            </span>
          </div>
        </form>
      </div>

      {/* ✅ Custom Toast Notification */}
      <ToastMessage message={toastMessage} type={toastType} />
    </>
  );
}

export default Register;