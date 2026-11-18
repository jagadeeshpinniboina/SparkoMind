import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, ArrowRight, User } from 'lucide-react';
import logoTransparent from '../../assets/images/logo-transparent.png';
import { useAuth } from '../../context/AuthContext.jsx';
import { getInitials } from '../../utils/avatar.js';
import styles from './Navbar.module.css';

const NAV_ITEMS = [
  { name: 'Home', href: '/#hero', id: 'hero' },
  { name: 'Games', href: '/#games', id: 'games' },
  { name: 'Age Zones', href: '/#age-zones', id: 'age-zones' },
  { name: 'How It Works', href: '/#how-it-works', id: 'how-it-works' },
  { name: 'About', href: '/#about', id: 'about' },
  { name: 'Contact', href: '/#contact', id: 'contact' }
];

export const Navbar = ({ activeSection = 'Home', onNavClick }) => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const hasUserSession = isAuthenticated || !!localStorage.getItem('sparkomind_token');
  const currentUser = user || (() => {
    try {
      const raw = localStorage.getItem('sparkomind_user');
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  })();

  const handleItemClick = (item, e) => {
    setMobileMenuOpen(false);
    if (onNavClick) {
      onNavClick(item, e);
      return;
    }

    if (window.location.pathname === '/') {
      e.preventDefault();
      if (item.id === 'hero') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        const el = document.getElementById(item.id);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    } else {
      navigate(item.href);
    }
  };

  return (
    <header className={styles.navbarHeader}>
      <div className={styles.navbarContainer}>
        {/* Brand Lockup: Logo 44px + SparkoMind (font-size 26px, weight 800, gap 10px) */}
        <Link
          to="/"
          className={styles.brandLockup}
          onClick={(e) => {
            if (window.location.pathname === '/') {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }
          }}
        >
          <img
            src={logoTransparent}
            alt="SparkoMind Logo"
            className={`${styles.brandLogo} ${styles.brandLogoImg}`}
            draggable="false"
          />
          <span className={styles.brandTitle}>
            Sparko<span className={styles.brandAccent}>Mind</span>
          </span>
        </Link>

        {/* Center Desktop Navigation Links */}
        <nav className={styles.navLinks} aria-label="Main Navigation">
          {NAV_ITEMS.map((item) => {
            const isActive = activeSection === item.name;
            return (
              <button
                key={item.name}
                type="button"
                className={`${styles.navItem} ${isActive ? styles.navItemActive : ''}`}
                onClick={(e) => handleItemClick(item, e)}
              >
                {item.name}
              </button>
            );
          })}
        </nav>

        {/* Right CTA Actions */}
        <div className={styles.navActions}>
          {hasUserSession ? (
            <div className={styles.loggedInCluster}>
              <Link to="/select-zone" className={styles.avatarPill} title={currentUser?.name || 'Dashboard'}>
                {currentUser?.avatar && currentUser.avatar.startsWith('http') ? (
                  <img src={currentUser.avatar} alt="User Avatar" className={styles.avatarImg} />
                ) : (
                  <div className={styles.avatarFallback}>
                    {getInitials(currentUser)}
                  </div>
                )}
                <span className={styles.avatarName}>{currentUser?.firstName || 'Dashboard'}</span>
              </Link>
              <Link to="/select-zone" className={styles.dashboardBtn}>
                <span>Workspace</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          ) : (
            <div className={styles.guestActions}>
              <Link to="/login" className={styles.loginBtn}>
                Login
              </Link>
              <Link to="/register" className={styles.signUpBtn}>
                Get Started
              </Link>
            </div>
          )}

          {/* Mobile Hamburger Toggle */}
          <button
            type="button"
            className={styles.hamburgerBtn}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className={styles.mobileDrawer}>
          <div className={styles.mobileNavLinks}>
            {NAV_ITEMS.map((item) => (
              <button
                key={item.name}
                type="button"
                className={styles.mobileNavItem}
                onClick={(e) => handleItemClick(item, e)}
              >
                {item.name}
              </button>
            ))}
          </div>

          <div className={styles.mobileDrawerFooter}>
            {hasUserSession ? (
              <Link
                to="/select-zone"
                className={styles.mobileDashboardBtn}
                onClick={() => setMobileMenuOpen(false)}
              >
                Enter Cognitive Workspace →
              </Link>
            ) : (
              <div className={styles.mobileAuthRow}>
                <Link
                  to="/login"
                  className={styles.mobileLoginBtn}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className={styles.mobileSignUpBtn}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
