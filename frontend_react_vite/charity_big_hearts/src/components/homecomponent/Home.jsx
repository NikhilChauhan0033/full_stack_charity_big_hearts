import { useNavigate, Link } from "react-router-dom";
import { logout } from "../base_api/api"; // ✅ Import logout utility
import Donations from "../donationscomponent/donations";
import Team from "../team/Team";
import SearchBar from "../searchbar/SearchBar";
import { useState } from "react";
import { useEffect } from "react";
import API from "../base_api/api";

const Home = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("access");
  const username = localStorage.getItem("username");

  const [cartCount, setCartCount] = useState(0);

  const handleLogout = async () => {
    try {
      await logout(); // ✅ This handles token clearing and backend logout
      alert("Logged out successfully");
      navigate("/"); // Redirect after logout
    } catch (error) {
      alert("Something went wrong during logout");
    }
  };

  const handleDonate = () => {
    if (!token) {
      alert("Please login to donate.");
      navigate("/login");
    } else {
      navigate("/donate");
    }
  };

  useEffect(() => {
    if (token) {
      API.get("cart/").then((res) => {
        const items = res.data.results || res.data;
        setCartCount(items?.length || 0);
      });
    }
  }, [token]);

  return (
    <>
      {token && username && <h1>Welcome, {username}!</h1>}
      <h2>Welcome to Home</h2>

      {token ? (
        <button onClick={handleLogout}>Logout</button> // ✅ Uses utility now
      ) : (
        <Link to="/login">
          <button>Login/Register</button>
        </Link>
      )}

      <button onClick={handleDonate}>Donate</button>
      <button className="ml-4">Cart count = {cartCount}</button>
      <br />
      <br />
      <Link to="/team">
        <button>Team</button>
      </Link>

      <br />
      <br />
      <Link to="/contact">
        <button>Contact</button>
      </Link>

      <SearchBar />
      <Donations />
      <Team />
    </>
  );
};

export default Home;
