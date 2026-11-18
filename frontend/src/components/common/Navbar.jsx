import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sparkles, Sun, Moon, LogOut, LayoutDashboard, Compass, Trophy, User } from 'lucide-react';
import logoTransparent from '../../assets/images/logo-transparent.png';
import { useTheme } from '../../context/ThemeContext.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { getInitials } from '../../utils/avatar.js';
import AvatarRenderer from './AvatarRenderer.jsx';
import Button from './Button.jsx';

export const Navbar = () => {
  const { demographic, setDemographic, theme, toggleTheme, demographicMeta } = useTheme();
  const { user, progress, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const hasUserSession = isAuthenticated || !!localStorage.getItem('sparkomind_token');
  const currentUser = user || (() => {
    try {
      const raw = localStorage.getItem('sparkomind_user');
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  })();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const scrollToAgeZones = (e) => {
    if (window.location.pathname === '/') {
      e?.preventDefault();
      const element = document.getElementById('age-zones');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  const getDashboardRoute = () => {
    const activeZone = localStorage.getItem('sparkomind_active_zone');
    const demo = activeZone || user?.demographic || demographic;
    if (demo === 'kids') return '/dashboard/kids';
    if (demo === 'seniors') return '/dashboard/seniors';
    return '/dashboard/adults';
  };

  return (
    <nav
      style={{
        backgroundColor: '#FFFFFF',
        borderBottom: '1.5px solid var(--border-subtle)',
        position: 'sticky',
        top: 0,
        zIndex: 'var(--z-nav)',
        backdropFilter: 'blur(10px)',
        boxShadow: '0 2px 10px rgba(94, 92, 230, 0.04)'
      }}
    >
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '72px' }}>
        {/* Brand Logo & Title Lockup */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none', cursor: 'pointer' }}>
          <img
            src={logoTransparent}
            alt="SparkoMind Logo"
            style={{ height: '44px', width: 'auto', objectFit: 'contain', display: 'block', margin: 0, padding: 0 }}
          />
          <span style={{ fontSize: '26px', fontWeight: 800, letterSpacing: '-0.5px', color: '#1E293B', display: 'flex', alignItems: 'center', margin: 0, padding: 0, lineHeight: 1 }}>
            Sparko<span style={{ color: '#8B5CF6' }}>Mind</span>
          </span>
        </Link>

        {/* Public Top Navigation Links with Polished Spacing */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }} className="hidden-mobile">
          <Link to="/" style={{ color: '#334155', fontWeight: 600, fontSize: '0.94rem', textDecoration: 'none', transition: 'color 0.2s ease' }} onMouseEnter={(e) => e.target.style.color = '#5E5CE6'} onMouseLeave={(e) => e.target.style.color = '#334155'}>
            Home
          </Link>
          <Link to="/games" style={{ color: '#334155', fontWeight: 600, fontSize: '0.94rem', textDecoration: 'none', transition: 'color 0.2s ease' }} onMouseEnter={(e) => e.target.style.color = '#5E5CE6'} onMouseLeave={(e) => e.target.style.color = '#334155'}>
            Games
          </Link>
          <a
            href="/#age-zones"
            onClick={scrollToAgeZones}
            style={{ color: '#334155', fontWeight: 600, fontSize: '0.94rem', textDecoration: 'none', transition: 'color 0.2s ease' }}
            onMouseEnter={(e) => e.target.style.color = '#5E5CE6'}
            onMouseLeave={(e) => e.target.style.color = '#334155'}
          >
            Age Zones
          </a>
          <a
            href="/#how-it-works"
            style={{ color: '#334155', fontWeight: 600, fontSize: '0.94rem', textDecoration: 'none', transition: 'color 0.2s ease' }}
            onMouseEnter={(e) => e.target.style.color = '#5E5CE6'}
            onMouseLeave={(e) => e.target.style.color = '#334155'}
          >
            How It Works
          </a>
          <Link to="/about" style={{ color: '#334155', fontWeight: 600, fontSize: '0.94rem', textDecoration: 'none', transition: 'color 0.2s ease' }} onMouseEnter={(e) => e.target.style.color = '#5E5CE6'} onMouseLeave={(e) => e.target.style.color = '#334155'}>
            About
          </Link>
          <Link to="/contact" style={{ color: '#334155', fontWeight: 600, fontSize: '0.94rem', textDecoration: 'none', transition: 'color 0.2s ease' }} onMouseEnter={(e) => e.target.style.color = '#5E5CE6'} onMouseLeave={(e) => e.target.style.color = '#334155'}>
            Contact
          </Link>
        </div>

        {/* Action Controls & User Auth */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle light and dark mode"
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'var(--bg-app)',
              border: '1px solid var(--border-subtle)',
              color: 'var(--text-primary)',
              cursor: 'pointer'
            }}
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {hasUserSession ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
              <Link to="/select-zone" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }} title={currentUser?.name || 'Dashboard'}>
                <AvatarRenderer
                  avatar={currentUser?.avatar}
                  name={currentUser?.name}
                  size="sm"
                  fallbackInitials={true}
                />
              </Link>

              <Link to={getDashboardRoute()} style={{ textDecoration: 'none' }}>
                <Button className="btn-brand" size="sm" style={{ minHeight: '38px', borderRadius: '9999px', fontWeight: 700, padding: '0 18px' }}>
                  Dashboard
                </Button>
              </Link>

              <button
                onClick={handleLogout}
                aria-label="Logout"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  fontSize: '0.85rem',
                  color: '#64748B',
                  fontWeight: 600,
                  cursor: 'pointer',
                  background: 'none',
                  border: 'none',
                  padding: '4px 8px'
                }}
              >
                <LogOut size={16} />
                <span>Exit</span>
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Link to="/login" style={{ textDecoration: 'none' }}>
                <button
                  type="button"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: '40px',
                    padding: '0 24px',
                    borderRadius: '9999px',
                    backgroundColor: 'rgba(94, 92, 230, 0.08)',
                    border: '1.5px solid rgba(94, 92, 230, 0.4)',
                    color: '#5E5CE6',
                    fontWeight: 700,
                    fontSize: '14px',
                    cursor: 'pointer',
                    boxShadow: '0 2px 8px rgba(94, 92, 230, 0.1)',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#5E5CE6';
                    e.currentTarget.style.color = '#FFFFFF';
                    e.currentTarget.style.boxShadow = '0 4px 14px rgba(94, 92, 230, 0.28)';
                    e.currentTarget.style.transform = 'translateY(-1.5px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(94, 92, 230, 0.08)';
                    e.currentTarget.style.color = '#5E5CE6';
                    e.currentTarget.style.boxShadow = '0 2px 8px rgba(94, 92, 230, 0.1)';
                    e.currentTarget.style.transform = 'none';
                  }}
                >
                  Login
                </button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
