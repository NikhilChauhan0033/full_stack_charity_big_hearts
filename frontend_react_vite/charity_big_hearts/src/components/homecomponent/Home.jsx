import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
    alert("You are logged out")
  };

  const handleDonate = () => {
  const token = localStorage.getItem('token');
  if (!token) {
    alert("Please login to donate.");
    navigate('/login');
  } else {
    navigate('/donate');
  }
};


  return (
    <>
      <h1>Welcome to Home</h1>
      <button onClick={handleLogout}>Logout</button>
      <button onClick={handleDonate}>Donate</button>
    </>
  );
};

export default Home;
