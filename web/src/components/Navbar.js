import React from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/api';
import '../styles/Navbar.css';

const Navbar = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <h1 className="logo">SMARTSTAY CHUKA</h1>
        <div className="nav-items">
          {user ? (
            <>
              <span>Welcome, {user.firstName}</span>
              {user.isSubscribed && <span className="badge">✓ Subscribed</span>}
              <button onClick={handleLogout} className="btn btn-logout">Logout</button>
            </>
          ) : (
            <>
              <a href="/login">Login</a>
              <a href="/register">Register</a>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
