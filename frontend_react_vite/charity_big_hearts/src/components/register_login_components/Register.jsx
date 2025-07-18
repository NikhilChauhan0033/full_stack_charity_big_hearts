import React, { useState } from "react";
import API from "../base_api/api";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirm_password: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
    setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post("register/", form);
      setSuccess("Registration successful! Redirecting to login...");
      setTimeout(() => navigate("/login"), 1000); // Redirect after 1 second
    } catch (err) {
      const backendError =
        err.response?.data?.error ||
        Object.values(err.response?.data || {})[0] ||
        "Registration failed. Please try again.";

      setError(backendError);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{ maxWidth: "400px", margin: "0 auto" }}
    >
      <input
        name="name"
        placeholder="Name"
        onChange={handleChange}
        required
        style={{ width: "100%", padding: "10px", marginBottom: "15px" }}
      />
      <input
        name="email"
        placeholder="Email"
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

      <div style={{ position: "relative", marginBottom: "15px" }}>
        <input
          name="confirm_password"
          type={showConfirm ? "text" : "password"}
          placeholder="Confirm Password"
          onChange={handleChange}
          required
          style={{ width: "100%", padding: "10px", paddingRight: "40px" }}
        />
        <FontAwesomeIcon
          icon={showConfirm ? faEyeSlash : faEye}
          onClick={() => setShowConfirm(!showConfirm)}
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
        Register
      </button>

      {error && <p style={{ color: "red", marginTop: "10px" }}>{error}</p>}
      {success && (
        <p style={{ color: "green", marginTop: "10px" }}>{success}</p>
      )}
    </form>
  );
}

export default Register;
