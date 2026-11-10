import React from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, Gamepad2, TrendingUp, Trophy, Target, 
  BarChart3, User, Settings, LogOut, Sparkles, Flame, Compass 
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import { useTheme } from '../../context/ThemeContext.jsx';
import { getInitials } from '../../utils/avatar.js';

export const Sidebar = () => {
  const { user, progress, logout } = useAuth();
  const { demographic } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const activeZone = localStorage.getItem('sparkomind_active_zone');
  const d = activeZone || user?.demographic || demographic;

  const getDashboardPath = () => {
    if (d === 'kids') return '/dashboard/kids';
    if (d === 'seniors') return '/dashboard/seniors';
    return '/dashboard/adults';
  };

  const menuItems = [
    { to: getDashboardPath(), label: 'Dashboard', icon: LayoutDashboard, exact: true },
    { to: '/select-zone', label: 'Switch Zone', icon: Compass },
    { to: '/games', label: 'Games', icon: Gamepad2 },
    { to: '/progress', label: 'Progress', icon: TrendingUp },
    { to: '/achievements', label: 'Achievements', icon: Trophy },
    { to: '/missions', label: 'Daily Missions', icon: Target },
    { to: '/leaderboard', label: 'Leaderboard', icon: BarChart3 },
    { to: '/profile', label: 'Profile', icon: User },
    { to: '/settings', label: 'Settings', icon: Settings }
  ];

  return (
    <aside
      style={{
        width: '260px',
        backgroundColor: '#0D1527',
        borderRight: '1px solid #162038',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '1.5rem 1rem',
        minHeight: 'calc(100vh - 72px)',
        color: '#FFFFFF'
      }}
    >
      <div>
        {/* Brand Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', padding: '0.5rem 0.75rem 1.5rem', borderBottom: '1px solid #162038', marginBottom: '1.25rem' }}>
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              background: 'var(--brand-gradient)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF'
            }}
          >
            <Sparkles size={20} />
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: '1.2rem', letterSpacing: '-0.02em', color: '#FFFFFF' }}>
              Sparko<span style={{ color: 'var(--brand-primary)' }}>Mind</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginTop: '3px' }}>
              <span
                style={{
                  fontSize: '0.68rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  fontWeight: 700,
                  padding: '2px 8px',
                  borderRadius: '9999px',
                  backgroundColor: d === 'kids' ? 'rgba(255, 140, 66, 0.2)' : d === 'seniors' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(2, 132, 199, 0.2)',
                  color: d === 'kids' ? '#FF8C42' : d === 'seniors' ? '#10B981' : '#38BDF8'
                }}
              >
                {d} Zone
              </span>
            </div>
          </div>
        </div>

        {/* Navigation Menu (PART-3 SPEC) */}
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isDashboard = item.label === 'Dashboard';
            const isActive = isDashboard
              ? location.pathname.startsWith('/dashboard')
              : location.pathname.startsWith(item.to);

            return (
              <NavLink
                key={item.to}
                to={item.to}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.85rem',
                  padding: '0.75rem 1rem',
                  borderRadius: '12px',
                  fontSize: '0.92rem',
                  fontWeight: 600,
                  textDecoration: 'none',
                  color: isActive ? '#FFFFFF' : '#94A3B8',
                  backgroundColor: isActive ? 'var(--brand-primary)' : 'transparent',
                  transition: 'all var(--transition-fast)'
                }}
              >
                <Icon size={19} />
                <span>{item.label}</span>
              </NavLink>
            );
          })}

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.85rem',
              padding: '0.75rem 1rem',
              borderRadius: '12px',
              fontSize: '0.92rem',
              fontWeight: 600,
              color: '#EF4444',
              backgroundColor: 'transparent',
              border: 'none',
              cursor: 'pointer',
              marginTop: '0.5rem',
              textAlign: 'left'
            }}
          >
            <LogOut size={19} />
            <span>Logout</span>
          </button>
        </nav>
      </div>

      {/* User Progress Footer Card */}
      <div
        style={{
          padding: '1rem',
          backgroundColor: '#162038',
          borderRadius: '14px',
          border: '1px solid #1E2D4E'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              background: 'var(--brand-gradient)',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              fontSize: '0.92rem',
              letterSpacing: '0.5px'
            }}
          >
            {getInitials(user)}
          </div>
          <div style={{ overflow: 'hidden' }}>
            <div style={{ fontWeight: 700, fontSize: '0.92rem', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
              {user?.name || 'Trainee'}
            </div>
            <div style={{ fontSize: '0.75rem', color: '#94A3B8' }}>
              Level {progress?.level || 1} Explorer
            </div>
          </div>
        </div>

        {/* XP Progress Bar */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '0.35rem', color: '#94A3B8' }}>
            <span>Progress</span>
            <span style={{ color: '#FF8C42', fontWeight: 700 }}>{progress?.totalXp || 0} XP</span>
          </div>
          <div style={{ height: '6px', backgroundColor: '#0D1527', borderRadius: '9999px', overflow: 'hidden' }}>
            <div
              style={{
                height: '100%',
                width: `${Math.min(100, ((progress?.totalXp || 0) % 100))}%`,
                background: 'var(--brand-gradient)',
                borderRadius: '9999px'
              }}
            />
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.65rem', fontSize: '0.78rem', color: '#FF8C42' }}>
          <Flame size={15} />
          <span style={{ fontWeight: 600 }}>{progress?.currentStreak || 1} Day Streak</span>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
