import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import Navbar from '../components/common/Navbar.jsx';

export const MainLayout = () => {
  return (
    <div className="app-container">
      <Navbar />
      <main className="main-content">
        <Outlet />
      </main>
      <footer
        style={{
          backgroundColor: 'var(--bg-surface)',
          borderTop: '1px solid var(--border-subtle)',
          padding: '2.5rem 0',
          marginTop: 'auto'
        }}
      >
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem' }}>
          <div>
            <div style={{ fontWeight: 800, fontSize: '1.15rem' }}>
              Sparko<span style={{ color: 'var(--color-primary)' }}>Mind</span>
            </div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Spark Your Mind. Shape Your Future.
            </div>
          </div>
          <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            <Link to="/explore">Explore Games</Link>
            <Link to="/login">Sign In</Link>
            <Link to="/register">Register</Link>
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            © {new Date().getFullYear()} SparkoMind Platform. Age-Adaptive Cognitive Architecture.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;
