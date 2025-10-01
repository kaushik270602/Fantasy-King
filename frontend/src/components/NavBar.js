// src/components/Navbar.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './NavBar.css';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <div className="logo-icon">🏏</div>
          <span className="logo-text">IPL Fantasy 2025</span>
        </Link>

        <div className="menu-icon" onClick={toggleMenu}>
          <span className={`hamburger ${menuOpen ? 'active' : ''}`}>
            <span></span>
            <span></span>
            <span></span>
          </span>
        </div>

        <ul className={`nav-menu ${menuOpen ? 'active' : ''}`}>
          <li className="nav-item">
            <Link to="/" className="nav-links" onClick={() => setMenuOpen(false)}>
              <i className="fas fa-home"></i>
              <span>Home</span>
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/schedule" className="nav-links" onClick={() => setMenuOpen(false)}>
              <i className="fas fa-calendar-alt"></i>
              <span>Schedule</span>
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/teams" className="nav-links" onClick={() => setMenuOpen(false)}>
              <i className="fas fa-users"></i>
              <span>Teams</span>
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/leaderboard" className="nav-links" onClick={() => setMenuOpen(false)}>
              <i className="fas fa-trophy"></i>
              <span>Leaderboard</span>
            </Link>
          </li>

          {isAuthenticated ? (
            <>
              <li className="nav-item">
                <Link to="/profile" className="nav-links" onClick={() => setMenuOpen(false)}>
                  <i className="fas fa-user-circle"></i>
                  <span>My Teams</span>
                </Link>
              </li>
              <li className="nav-item user-info">
                <div className="user-avatar">
                  <i className="fas fa-user"></i>
                </div>
                <span className="user-greeting">Hello, {user?.username}</span>
              </li>
              <li className="nav-item">
                <button className="btn btn-outline logout-button" onClick={handleLogout}>
                  <i className="fas fa-sign-out-alt"></i>
                  <span>Logout</span>
                </button>
              </li>
            </>
          ) : (
            <>
              <li className="nav-item">
                <Link to="/login" className="nav-links" onClick={() => setMenuOpen(false)}>
                  <i className="fas fa-sign-in-alt"></i>
                  <span>Login</span>
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/register" className="btn btn-primary register-link" onClick={() => setMenuOpen(false)}>
                  <i className="fas fa-user-plus"></i>
                  <span>Register</span>
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
