import React, { useEffect } from 'react';
import { Outlet, useLocation, useNavigate, Link } from 'react-router-dom';
import { Compass, Sparkles, Zap, HeartHandshake, ArrowRightLeft } from 'lucide-react';
import Navbar from '../components/common/Navbar.jsx';
import Sidebar from '../components/common/Sidebar.jsx';
import { useTheme } from '../context/ThemeContext.jsx';

export const DashboardLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { demographic, setDemographic } = useTheme();

  const currentZone = location.pathname.split('/')[2] || localStorage.getItem('sparkomind_active_zone') || 'adults';

  // Synchronize route with active zone and demographic state without blocking or looping
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
      name: 'Kids Zone Workspace',
      age: 'Ages 6–12',
      color: '#FF8C42',
      bgLight: '#FFF2EB',
      icon: Sparkles,
      tagline: 'Curiosity & Playful Discovery'
    },
    adults: {
      name: 'Adult Zone Workspace',
      age: 'Ages 13–59',
      color: '#0284C7',
      bgLight: '#E0F2FE',
      icon: Zap,
      tagline: 'Velocity & Analytical Acuity'
    },
    seniors: {
      name: 'Senior Zone Workspace',
      age: 'Ages 60+',
      color: '#10B981',
      bgLight: '#D1FAE5',
      icon: HeartHandshake,
      tagline: 'Vitality & Mindful Rhythm'
    }
  };

  const currentZoneMeta = zoneMeta[demographic] || zoneMeta.adults;
  const ZoneIcon = currentZoneMeta.icon;

  return (
    <div className="app-container" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <div style={{ display: 'flex', flex: 1 }}>
        <Sidebar />
        <main
          style={{
            flex: 1,
            padding: '1.75rem 2.25rem',
            backgroundColor: 'var(--bg-app)',
            overflowY: 'auto',
            minHeight: 'calc(100vh - 72px)',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.5rem'
          }}
        >
          {/* Demographic Workspace Quick Indicator Bar */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '1rem',
              padding: '0.75rem 1.25rem',
              borderRadius: '14px',
              backgroundColor: 'var(--bg-surface)',
              border: '1px solid var(--border-subtle)',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.03)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  backgroundColor: currentZoneMeta.bgLight,
                  color: currentZoneMeta.color,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <ZoneIcon size={20} />
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ fontWeight: 800, fontSize: '0.98rem', color: 'var(--text-primary)' }}>
                    {currentZoneMeta.name}
                  </span>
                  <span
                    style={{
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      color: currentZoneMeta.color,
                      backgroundColor: currentZoneMeta.bgLight,
                      padding: '0.15rem 0.5rem',
                      borderRadius: '9999px'
                    }}
                  >
                    {currentZoneMeta.age}
                  </span>
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                  {currentZoneMeta.tagline}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <Link
                to="/select-zone"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  padding: '0.45rem 0.95rem',
                  borderRadius: '10px',
                  fontSize: '0.84rem',
                  fontWeight: 700,
                  color: 'var(--text-primary)',
                  backgroundColor: 'var(--bg-surface-subtle, #F1F5F9)',
                  border: '1px solid var(--border-subtle)',
                  textDecoration: 'none',
                  transition: 'all var(--transition-fast)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = currentZoneMeta.color;
                  e.currentTarget.style.color = currentZoneMeta.color;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--border-subtle)';
                  e.currentTarget.style.color = 'var(--text-primary)';
                }}
              >
                <ArrowRightLeft size={14} />
                <span>Switch Zone</span>
              </Link>
            </div>
          </div>

          {/* Active Workspace Viewport */}
          <div style={{ flex: 1 }}>
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
