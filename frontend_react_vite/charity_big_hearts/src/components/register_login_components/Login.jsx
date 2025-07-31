import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../base_api/api"; // Axios instance configured with baseURL & token interceptor
import {
  TextField,
  Button,
  Snackbar,
  Alert,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material"; // Icons for show/hide password
import axios from "axios";

function Login() {
  const navigate = useNavigate(); // Used to programmatically navigate user

  // Form input values
  const [form, setForm] = useState({
    identifier: "", // Can be email or username
    password: "", // Password
  });

  // State for error or success messages
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Toggle for password visibility
  const [showPassword, setShowPassword] = useState(false);

  // Snackbar state to show feedback popup
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarType, setSnackbarType] = useState("success"); // "success" or "error"

  // Update form values when user types
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
    setSuccess("");
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

      // Show success message and redirect
      setSuccess("Login successful! Redirecting...");
      setSnackbarType("success");
      setOpenSnackbar(true);
      setTimeout(() => navigate("/"), 1000); // Navigate to homepage after 1 second
    } catch (err) {
      // Show error if login fails
      const backendError =
        err.response?.data?.error || "Login failed. Please try again.";
      setError(backendError);
      setSnackbarType("error");
      setOpenSnackbar(true);
    }
  };

  return (
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

        {/* Snackbar Alert for Success/Error */}
        <Snackbar
          open={openSnackbar}
          autoHideDuration={5000} // Auto close in 5 seconds
          onClose={() => setOpenSnackbar(false)}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert
            onClose={() => setOpenSnackbar(false)}
            severity={snackbarType} // Dynamic: "success" or "error"
            sx={{ width: "100%" }}
          >
            {snackbarType === "success" ? success : error}
          </Alert>
        </Snackbar>
      </form>
    </div>
  );
}

export default Login;
