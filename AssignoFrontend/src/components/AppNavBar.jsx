import React, { useState, useEffect } from "react";
import { Sling as Hamburger } from "hamburger-react";
import { MdLightMode, MdDarkMode } from "react-icons/md";
import { useAppDispatch, useAppSelector } from "../app/reduxHooks";
import { logoutSuccess } from "../features/auth/authSlice";
import { toggleTheme } from "../features/theme/themeSlice";
import { Link, useNavigate, useLocation } from "react-router-dom";
import NotificationBell from "./notificationComponents/NotificationBell";
import NotificationDropdown from "./notificationComponents/NotificationDropdown";
import { fetchNotifications } from "../features/notifications/notificationThunk";

import "../styles/navbar.css";

const AppNavBar = () => {
  const [isOpen, setOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { isAuthenticated, token } = useAppSelector(
    (state) => state.auth
  );

  const { mode } = useAppSelector(
    (state) => state.theme
  );

  // Close every popup/menu
  const closeAll = () => {
    setOpen(false);
    setShowNotifications(false);
  };

  // Toggle notification dropdown
  const handleNotificationToggle = () => {
    setOpen(false);
    setShowNotifications((prev) => !prev);
  };


  const handleHamburgerToggle = () => {
    setShowNotifications(false);
    setOpen((prev) => !prev);
  };

  const handleThemeToggle = () => {
    closeAll();
    dispatch(toggleTheme());
  };

  const handleLogout = () => {
    closeAll();
    dispatch(logoutSuccess());
    navigate("/");
  };

  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    if (location.pathname !== "/") {
      setIsScrolled(false);
      return;
    }

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [location.pathname]);

  useEffect(() => {
    if (!token) return;

    dispatch(fetchNotifications(token));

    const interval = setInterval(() => {
      dispatch(fetchNotifications(token));
    }, 30000);

    return () => clearInterval(interval);
  }, [dispatch, token]);

  const navbarClass =
  location.pathname !== "/"
    ? "navbar"
    : `navbar ${isScrolled ? "scrolled" : "transparent-nav"}`;

  return (
    <nav className={navbarClass}>
      <div className="navbar-container">
        <div className="navbar-left">
          <Link
            to="/"
            className="navbar-logo-link"
            onClick={closeAll}
          >
            <h1 className="navbar-logo">
              ASSIGN<span>O</span>
            </h1>
          </Link>
        </div>

        <div className="navbar-right">
          <Link
            to="/projects"
            className={`desktop-link ${location.pathname === "/projects" ? "active" : ""}`}
            onClick={closeAll}
          >
            Projects
          </Link>

          <Link
            to="/profile"
            className={`desktop-link ${location.pathname === "/profile" ? "active" : ""}`}
            onClick={closeAll}
          >
            Profile
          </Link>

          <div className="notification-section">
            <NotificationBell
              onClick={handleNotificationToggle}
            />
          </div>

          {showNotifications && (
            <NotificationDropdown
              closeDropdown={() =>
                setShowNotifications(false)
              }
            />
          )}

          <button
            className="theme-btn"
            onClick={handleThemeToggle}
          >
            {mode === "dark" ? (
              <MdLightMode />
            ) : (
              <MdDarkMode />
            )}
          </button>

          {isAuthenticated && (
            <button
              className="desktop-link logout-btn"
              onClick={handleLogout}
            >
              Logout
            </button>
          )}

          <div className="hamburger-menu">
            <Hamburger
              toggled={isOpen}
              toggle={handleHamburgerToggle}
            />
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="mobile-menu">
          {location.pathname !== "/projects" && (
            <Link
              to="/projects"
              className="navbar-link"
              onClick={closeAll}
            >
              Projects
            </Link>
          )}

          {location.pathname !== "/profile" && (
            <Link
              to="/profile"
              className="navbar-link"
              onClick={closeAll}
            >
              Profile
            </Link>
          )}

          {isAuthenticated ? (
            <button
              className="auth-link"
              onClick={handleLogout}
            >
              Logout
            </button>
          ) : (
            <div className="auth-btns">
              <Link
                to="/login"
                className="auth-link login-link"
                onClick={closeAll}
              >
                Login
              </Link>

              <Link
                to="/signup"
                className="auth-link signup-link"
                onClick={closeAll}
              >
                Signup
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default AppNavBar;