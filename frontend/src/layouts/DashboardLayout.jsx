import React, { useState, useEffect, useRef } from 'react';
import { Outlet, useLocation, useNavigate, Link } from 'react-router-dom';
import { Rocket, Zap, HeartHandshake, User, Settings, LogOut, Sun, Moon } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import { useTheme } from '../context/ThemeContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { getInitials, renderUserAvatar } from '../utils/avatar.js';
import { useLiveUserStats } from '../utils/userStats.js';
import styles from './DashboardLayout.module.css';

export const DashboardLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { demographic, setDemographic, theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const { displayName, avatar, level } = useLiveUserStats();

  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setProfileDropdownOpen(false);
      }
    };
    if (profileDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [profileDropdownOpen]);

  const handleLogout = async () => {
    setProfileDropdownOpen(false);
    await logout();
    navigate('/');
  };

  const isPlayRoute = location.pathname.includes('/play');
  const currentZone = location.pathname.split('/')[2] || localStorage.getItem('sparkomind_active_zone') || 'kids';

  // Synchronize route with active zone and demographic state
  useEffect(() => {
    if (['kids', 'adults', 'seniors'].includes(currentZone)) {
      localStorage.setItem('sparkomind_active_zone', currentZone);
      if (demographic !== currentZone) {
        setDemographic(currentZone);
      }
    }
  }, [currentZone, demographic, setDemographic]);

  const zoneMeta = {
    kids: {
      badgeText: '🚀 Kids Universe Workspace (Ages 6–12)',
      color: '#F59E0B',
      bgColor: 'rgba(245, 158, 11, 0.12)',
      borderColor: 'rgba(245, 158, 11, 0.3)',
      icon: Rocket
    },
    adults: {
      badgeText: '⚡ Adults Neuro-Lab (Ages 18–55)',
      color: '#06B6D4',
      bgColor: 'rgba(6, 182, 212, 0.12)',
      borderColor: 'rgba(6, 182, 212, 0.35)',
      icon: Zap
    },
    seniors: {
      badgeText: '🌿 Senior Sanctuary Workspace (Ages 60+)',
      color: '#34D399',
      bgColor: 'rgba(52, 211, 153, 0.12)',
      borderColor: 'rgba(52, 211, 153, 0.3)',
      icon: HeartHandshake
    }
  };

  const currentZoneMeta = zoneMeta[demographic] || zoneMeta.kids;
  const userInitials = getInitials(user) || 'JP';

  return (
    <div className={`${styles.dashboardShell} ${isPlayRoute ? styles.dashboardShellPlay : ''}`}>
      {/* 1. Left Sidebar: Fixed 260px Obsidian Dark Surface (Hidden during gameplay for true 100dvh single-screen arena) */}
      {!isPlayRoute && (
        <aside className={styles.sidebarWrapper}>
          <Sidebar />
        </aside>
      )}

      {/* 2. Main Viewport Canvas: Fluid, Obsidian Dark (#070A11) with Radial Ambient Glow */}
      <main className={`${styles.mainCanvas} ${isPlayRoute ? styles.mainCanvasPlay : ''}`}>
        {/* Top Workspace Bar (Hidden during gameplay for true 100dvh single-screen arena) */}
        {!isPlayRoute && (
          <header className={styles.topWorkspaceBar}>
            <div
              className={styles.workspacePill}
              style={{
                color: currentZoneMeta.color,
                background: currentZoneMeta.bgColor,
                borderColor: currentZoneMeta.borderColor
              }}
            >
              <span>{currentZoneMeta.badgeText}</span>
            </div>

            <div className={styles.workspaceActions}>
              {/* Sleek Real-Time Light / Dark Theme Toggle with Smooth Rotation */}
              <button
                type="button"
                onClick={toggleTheme}
                className={`${styles.themeToggleBtn} ${theme === 'dark' ? styles.themeDark : styles.themeLight}`}
                title={theme === 'dark' ? 'Switch to Light Mode ☀️' : 'Switch to Dark Mode 🌙'}
                aria-label="Toggle Light/Dark Theme"
              >
                <span className={styles.themeIconWrapper}>
                  {theme === 'dark' ? (
                    <Moon size={15} className={styles.themeIcon} />
                  ) : (
                    <Sun size={15} className={styles.themeIcon} />
                  )}
                </span>
                <span className={styles.themeText}>{theme === 'dark' ? '🌙 Dark' : '☀️ Light'}</span>
              </button>

              {/* Interactive Profile Circle (JP) with Glow Effect & Dropdown Popover */}
              <div className={styles.profilePopoverWrapper} ref={dropdownRef}>
                <button
                  type="button"
                  onClick={() => setProfileDropdownOpen((prev) => !prev)}
                  className={`${styles.userAvatarBtn} ${profileDropdownOpen ? styles.userAvatarBtnActive : ''}`}
                  title={`Account Menu: ${displayName || user?.name || 'Pinniboina Jagadeesh'}`}
                  aria-expanded={profileDropdownOpen}
                >
                  <span className={styles.userInitialsText}>{userInitials}</span>
                  <span className={styles.avatarGlowRing} />
                </button>

                {/* Glassmorphic Profile Dropdown Popover Card */}
                {profileDropdownOpen && (
                  <div className={styles.profileDropdownCard}>
                    <div className={styles.dropdownHeader}>
                      <div className={styles.dropdownAvatarLarge}>
                        {renderUserAvatar(avatar, displayName, { size: 'md' })}
                      </div>
                      <div className={styles.dropdownUserDetails}>
                        <div className={styles.dropdownFullName}>
                          {displayName || user?.name || 'Pinniboina Jagadeesh'}
                        </div>
                        <div className={styles.dropdownEmail}>
                          {user?.email || 'pinniboinajagadeesh76@gmail.com'}
                        </div>
                        <div className={styles.dropdownZoneBadge}>
                          {demographic === 'kids'
                            ? `Kids Universe • Space Cadet Level ${level}`
                            : demographic === 'seniors'
                            ? `Senior Sanctuary • Vitality Level ${level}`
                            : `Adults Arena • Neuro-Lab Level ${level}`}
                        </div>
                      </div>
                    </div>

                    <div className={styles.dropdownDivider} />

                    <div className={styles.dropdownLinks}>
                      <Link
                        to="/profile"
                        className={styles.dropdownItem}
                        onClick={() => setProfileDropdownOpen(false)}
                      >
                        <User size={16} />
                        <span>My Profile</span>
                      </Link>

                      <Link
                        to="/settings"
                        className={styles.dropdownItem}
                        onClick={() => setProfileDropdownOpen(false)}
                      >
                        <Settings size={16} />
                        <span>Settings</span>
                      </Link>

                      <button
                        type="button"
                        className={`${styles.dropdownItem} ${styles.dropdownLogoutBtn}`}
                        onClick={handleLogout}
                      >
                        <LogOut size={16} />
                        <span>Logout</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </header>
        )}

        {/* Dynamic Content Viewport */}
        <div className={`${styles.contentViewport} ${isPlayRoute ? styles.contentViewportPlay : ''}`}>
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
