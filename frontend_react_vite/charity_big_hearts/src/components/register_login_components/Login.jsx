import React, { useState } from 'react';
import API from '../base_api/api';
import { useNavigate } from 'react-router-dom';

function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    identifier: '',
    password: '',
  });

  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post('login/', form);
      localStorage.setItem('token', res.data.token);
      navigate('/');
    } catch (err) {
      const backendError = err.response?.data?.error || 'Login failed. Please try again.';
      setError(backendError);
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <input name="identifier" placeholder="Email or Username" onChange={handleChange} />
      <input name="password" type="password" placeholder="Password" onChange={handleChange} />
      <button type="submit">Login</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </form>
  );
}

export default Login;
