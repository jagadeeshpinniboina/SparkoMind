import React from 'react';
import { NavLink, Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, Gamepad2, TrendingUp, Trophy, Target, 
  BarChart3, User, Settings, LogOut, Flame, Compass 
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import { useTheme } from '../../context/ThemeContext.jsx';
import { getInitials, renderUserAvatar, AvatarRenderer } from '../../utils/avatar.js';
import { useLiveUserStats } from '../../utils/userStats.js';
import styles from './Sidebar.module.css';

export const Sidebar = () => {
  const { user, logout } = useAuth();
  const { demographic } = useTheme();
  const { displayName, avatar, totalXp, level, streak, xpPercent } = useLiveUserStats();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const activeZone = typeof window !== 'undefined' ? localStorage.getItem('sparkomind_active_zone') : null;
  const pathZone = location.pathname.includes('/adults') 
    ? 'adults' 
    : location.pathname.includes('/seniors') 
    ? 'seniors' 
    : location.pathname.includes('/kids') 
    ? 'kids' 
    : null;
  const d = pathZone || activeZone || user?.demographic || demographic || 'kids';

  const getDashboardPath = () => {
    if (d === 'kids') return '/dashboard/kids';
    if (d === 'seniors') return '/dashboard/seniors';
    return '/dashboard/adults';
  };

  const getGamesPath = () => {
    if (d === 'adults') return '/dashboard/adults/games';
    if (d === 'seniors') return '/dashboard/seniors/games';
    return '/dashboard/kids/games';
  };

  const zonePillLabel = d === 'seniors' 
    ? 'SENIOR SANCTUARY' 
    : d === 'adults' 
    ? 'ADULTS ARENA' 
    : 'KIDS UNIVERSE';

  const menuItems = [
    { to: getDashboardPath(), label: 'Dashboard', icon: LayoutDashboard, exact: true },
    { to: '/select-zone', label: 'Switch Zone', icon: Compass },
    { to: getGamesPath(), label: 'Games', icon: Gamepad2 },
    { to: '/progress', label: 'Progress', icon: TrendingUp },
    { to: '/achievements', label: 'Achievements', icon: Trophy },
    { to: '/missions', label: 'Daily Missions', icon: Target },
    { to: '/leaderboard', label: 'Leaderboard', icon: BarChart3 },
    { to: '/profile', label: 'Profile', icon: User },
    { to: '/settings', label: 'Settings', icon: Settings }
  ];

  return (
    <aside className={styles.sidebar}>
      <div className={styles.topSection}>
        {/* Brand Header */}
        <div className={styles.brandContainer}>
          <Link className={styles.sidebarBrand} to="/select-zone">
            <img src="/logo-clean.png" alt="SparkoMind" className={styles.brandLogo} />
            <span className={styles.brandTitle}>
              Sparko<span className={styles.brandAccent}>Mind</span>
            </span>
          </Link>
          <span className={`${styles.zonePill} ${styles['zonePill_' + d] || styles.zonePill_kids}`}>
            {zonePillLabel}
          </span>
        </div>

        {/* Navigation Menu */}
        <nav className={styles.navMenu}>
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isDashboard = item.label === 'Dashboard';
            const isGames = item.label === 'Games';
            const isActive = isDashboard
              ? location.pathname === getDashboardPath()
              : isGames
              ? (location.pathname.includes('/games') || location.pathname.includes('/play/'))
              : location.pathname.startsWith(item.to);

            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={`${styles.navItem} ${isActive ? styles.navItemActive : ''}`}
              >
                <Icon size={19} />
                <span>{item.label}</span>
              </NavLink>
            );
          })}

          {/* Logout Button */}
          <button onClick={handleLogout} className={styles.logoutBtn}>
            <LogOut size={19} />
            <span>Logout</span>
          </button>
        </nav>
      </div>

      {/* User Progress Footer Card */}
      <div className={styles.progressCard}>
        <div className={styles.userInfo}>
          <div className={styles.userAvatarContainer}>
            {renderUserAvatar(avatar, displayName, { size: 'sm' })}
          </div>
          <div className={styles.userDetails}>
            <span className={styles.userName} title={displayName}>
              {displayName}
            </span>
            <span className={styles.userSubtitle}>
              Level {level} Explorer
            </span>
          </div>
        </div>

        {/* XP Progress Bar */}
        <div className={styles.xpSection}>
          <div className={styles.xpHeader}>
            <span>Wonder Stars XP</span>
            <span className={styles.xpValue}>{totalXp} XP</span>
          </div>
          <div className={styles.progressBarBg}>
            <div
              className={styles.progressBarFill}
              style={{
                width: `${xpPercent}%`
              }}
            />
          </div>
        </div>

        <div className={styles.streakPill}>
          <Flame size={16} />
          <span>{streak} Day Streak 🔥</span>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
