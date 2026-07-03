import React from 'react';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../app/reduxHooks';
import { toggleTheme } from '../features/theme/themeSlice';
import { MdLightMode, MdDarkMode } from 'react-icons/md';

import '../styles/navbar.css';

const LandingNavBar = () => {
  const dispatch = useAppDispatch();
  const { mode } = useAppSelector((state) => state.theme);

  const handleThemeToggle = () => {
    dispatch(toggleTheme());
  };

  return (
    <nav className="scrolled">
      <div className="nav-inner">
        <div className="nav-logo">
          <a href="#hero">ASSIGN<span>O</span></a>
        </div>
        <ul className="nav-links">
          <li><a href="#workflow">Workflow</a></li>
          <li><a href="#features">Features</a></li>
          <li><a href="#roles">Roles</a></li>
          <li><a href="#stack">Built With</a></li>
        </ul>
        <div className="nav-actions">
          <button
            className="theme-btn"
            onClick={handleThemeToggle}
            aria-label="Toggle Theme"
            style={{ marginRight: '0.5rem' }}
          >
            {mode === 'dark' ? <MdLightMode /> : <MdDarkMode />}
          </button>
          <Link to="/login" className="nav-cta">Get Started</Link>
        </div>
      </div>
    </nav>
  );
};

export default LandingNavBar;
