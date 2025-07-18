import { useNavigate, Link } from "react-router-dom";
import API from "../base_api/api";

const Home = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("access");
  const username = localStorage.getItem("username");

  const handleLogout = async () => {
    try {
      const refresh = localStorage.getItem("refresh");
      if (refresh) {
        await API.post("logout/", { refresh }); // ✅ Send refresh token to blacklist
      }

      localStorage.removeItem("access");
      localStorage.removeItem("refresh");
      localStorage.removeItem("username");
      alert("Logged out successfully");
      navigate("/");
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
        <button onClick={handleLogout}>Logout</button>
      ) : (
        <Link to="/login">
          <button>Login/Register</button>
        </Link>
      )}

      <button onClick={handleDonate}>Donate</button>
    </>
  );
};

export default Home;
