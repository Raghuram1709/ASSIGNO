import React from 'react';
import { useLocation } from 'react-router-dom';
import { useAppSelector } from '../app/reduxHooks';
import AppNavBar from './AppNavBar';
import LandingNavBar from './LandingNavBar';

const NavBar = () => {
  const { isAuthenticated, loading } = useAppSelector((state) => state.auth);
  const location = useLocation();

  // Determine if a token is in storage to handle initial page load/resolution
  const hasToken = !!(localStorage.getItem('token') || sessionStorage.getItem('token'));

  // If loading and we have a token but auth isn't confirmed yet, hold render to avoid flashes
  if (loading && hasToken && !isAuthenticated) {
    return null;
  }

  if (isAuthenticated) {
    return <AppNavBar />;
  }

  // Render the marketing navbar only on the landing page route
  if (location.pathname === '/') {
    return <LandingNavBar />;
  }

  return null;
};

export default NavBar;