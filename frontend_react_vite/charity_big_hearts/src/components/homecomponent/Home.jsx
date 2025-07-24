import { useNavigate, Link } from "react-router-dom";
import { logout } from "../base_api/api"; // ✅ Import logout utility
import Donations from "../donationscomponent/donations";
import Team from "../team/Team";

const Home = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("access");
  const username = localStorage.getItem("username");

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

      <Donations />
      <Team />
    </>
  );
};

export default Home;
