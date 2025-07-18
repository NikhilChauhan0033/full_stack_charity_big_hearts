import { Navigate } from 'react-router-dom';

const RedirectIfAuth = ({ children }) => {
  const token = localStorage.getItem('access');
  return token ? <Navigate to="/" replace /> : children;
};

export default RedirectIfAuth;
