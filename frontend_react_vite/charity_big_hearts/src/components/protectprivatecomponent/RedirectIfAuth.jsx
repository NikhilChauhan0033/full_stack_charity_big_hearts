import { Navigate } from 'react-router-dom';

const RedirectIfAuth = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? <Navigate to="/" replace /> : children;
};

export default RedirectIfAuth;
