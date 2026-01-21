import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import '../styles/Auth.css';

const AdminLogin = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Demo admin credentials
  const ADMIN_EMAIL = 'admin@smartstay.com';
  const ADMIN_PASSWORD = 'admin123';

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Call backend admin login endpoint
      const response = await api.post('/auth/admin/login', {
        email: formData.email,
        password: formData.password
      });

      const { token, user } = response.data;
      
      // Store token and user with isAdmin flag
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify({
        ...user,
        isAdmin: true,
        isSubscribed: true
      }));
      
      navigate('/admin/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid admin credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>SMARTSTAY CHUKA</h1>
        <h2>Admin Login</h2>
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            placeholder="Admin Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? 'Logging in...' : 'Login as Admin'}
          </button>
        </form>
        <p>Demo Credentials: <br />
          Email: admin@smartstay.com <br />
          Password: admin123
        </p>
        <p>Regular user? <a href="/login">Login here</a></p>
      </div>
    </div>
  );
};

export default AdminLogin;
