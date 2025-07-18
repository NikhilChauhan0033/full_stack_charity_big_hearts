import React, { useState } from "react";
import API from "../base_api/api";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    identifier: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
    setSuccess("");
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("login/", form);
      localStorage.setItem("access", res.data.access);
      localStorage.setItem("refresh", res.data.refresh);
      localStorage.setItem("username", res.data.username);

      setSuccess("Login successful! Redirecting...");
      setTimeout(() => {
        navigate("/");
      }, 1000); // 1 second delay
    } catch (err) {
      const backendError =
        err.response?.data?.error || "Login failed. Please try again.";
      setError(backendError);
    }
  };

  return (
    <form
      onSubmit={handleLogin}
      style={{ maxWidth: "400px", margin: "0 auto" }}
    >
      <input
        name="identifier"
        placeholder="Email or Username"
        onChange={handleChange}
        required
        style={{ width: "100%", padding: "10px", marginBottom: "15px" }}
      />

      <div style={{ position: "relative", marginBottom: "15px" }}>
        <input
          name="password"
          type={showPassword ? "text" : "password"}
          placeholder="Password"
          onChange={handleChange}
          required
          style={{ width: "100%", padding: "10px", paddingRight: "40px" }}
        />
        <FontAwesomeIcon
          icon={showPassword ? faEyeSlash : faEye}
          onClick={() => setShowPassword(!showPassword)}
          style={{
            position: "absolute",
            top: "50%",
            right: "10px",
            transform: "translateY(-50%)",
            cursor: "pointer",
            color: "#888",
          }}
        />
      </div>

      <button type="submit" style={{ width: "100%", padding: "10px" }}>
        Login
      </button>

      {error && <p style={{ color: "red", marginTop: "10px" }}>{error}</p>}
      {success && (
        <p style={{ color: "green", marginTop: "10px" }}>{success}</p>
      )}
    </form>
  );
}

export default Login;
