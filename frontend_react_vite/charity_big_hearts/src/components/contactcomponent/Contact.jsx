import React, { useState } from 'react';
import API from '../base_api/api';

const Contact = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    message: ''
  });

  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await API.post('contact/', form);
      setSuccess('Your message has been sent!');
      setForm({ name: '', email: '', message: '' });
    } catch (err) {
      const msg =
        err.response?.data?.detail ||
        err.response?.data?.error ||
        'Something went wrong. Please try again.';
      setError(msg);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: '500px', margin: '0 auto' }}>
      <title>Contact Us - BigHearts</title>
      <h2>Contact Us</h2>

      <input
        type="text"
        name="name"
        placeholder="Your Name"
        value={form.name}
        onChange={handleChange}
        required
        style={{ width: '100%', padding: '10px', marginBottom: '10px' }}
      />

      <input
        type="email"
        name="email"
        placeholder="Your Email"
        value={form.email}
        onChange={handleChange}
        required
        style={{ width: '100%', padding: '10px', marginBottom: '10px' }}
      />

      <textarea
        name="message"
        placeholder="Your Message"
        value={form.message}
        onChange={handleChange}
        required
        rows={5}
        style={{ width: '100%', padding: '10px', marginBottom: '10px' }}
      ></textarea>

      <button type="submit" style={{ width: '100%', padding: '10px' }}>
        Send Message
      </button>

      {success && <p style={{ color: 'green', marginTop: '10px' }}>{success}</p>}
      {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}
    </form>
  );
};

export default Contact;
