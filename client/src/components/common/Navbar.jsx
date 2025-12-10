// components/common/Navbar.jsx - Fixed Version
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FaCalculator, FaUser, FaSignOutAlt } from 'react-icons/fa';
import './Navbar.css';

const Navbar = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Check if we're on auth pages
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  useEffect(() => {
    // Function to load user from localStorage
    const loadUser = () => {
      const userData = localStorage.getItem('user');
      if (userData) {
        try {
          setUser(JSON.parse(userData));
        } catch (error) {
          console.error('Error parsing user data:', error);
          localStorage.removeItem('user');
          localStorage.removeItem('userId');
          setUser(null);
        }
      } else {
        setUser(null);
      }
    };

    // Load user on mount
    loadUser();

    // Listen for storage changes (when user logs in/out in another tab or component)
    const handleStorageChange = (e) => {
      if (e.key === 'user') {
        loadUser();
      }
    };

    window.addEventListener('storage', handleStorageChange);

    // Custom event for same-tab updates (triggered after login/logout)
    const handleUserChange = () => {
      loadUser();
    };

    window.addEventListener('userChanged', handleUserChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('userChanged', handleUserChange);
    };
  }, []);

  const handleLogout = () => {
    // Show confirmation
    if (window.confirm('Are you sure you want to logout?')) {
      // Clear localStorage
      localStorage.removeItem('user');
      localStorage.removeItem('userId');
      
      // Update state
      setUser(null);
      
      // Dispatch custom event to notify other components
      window.dispatchEvent(new Event('userChanged'));
      
      // Redirect to login
      navigate('/login');
    }
  };

  // Don't render navbar on auth pages
  if (isAuthPage) {
    return null;
  }

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <FaCalculator className="logo-icon" />
          Calculator App
        </Link>

        <ul className="navbar-menu">
          <li>
            <Link to="/" className="navbar-link">Home</Link>
          </li>
          <li>
            <Link to="/tools" className="navbar-link">Tools</Link>
          </li>
        </ul>

        <div className="navbar-user">
          {user ? (
            <>
              <div className="user-info">
                <FaUser className="user-icon" />
                <span className="username">{user.username}</span>
              </div>
              <button onClick={handleLogout} className="logout-btn">
                <FaSignOutAlt /> Logout
              </button>
            </>
          ) : (
            <Link to="/login" className="login-link">
              <FaUser /> Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;