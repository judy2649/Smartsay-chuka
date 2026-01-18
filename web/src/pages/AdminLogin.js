import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
      // Check admin credentials
      if (formData.email === ADMIN_EMAIL && formData.password === ADMIN_PASSWORD) {
        const adminUser = {
          id: 'admin-001',
          firstName: 'Admin',
          lastName: 'User',
          email: ADMIN_EMAIL,
          isAdmin: true,
          isSubscribed: true
        };
        
        localStorage.setItem('token', 'admin-token-' + Date.now());
        localStorage.setItem('user', JSON.stringify(adminUser));
        navigate('/admin/dashboard');
      } else {
        setError('Invalid admin credentials');
      }
    } catch (err) {
      setError('Login failed');
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
