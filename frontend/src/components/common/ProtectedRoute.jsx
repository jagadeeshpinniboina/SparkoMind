import React from 'react';
import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';

export const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading, user } = useAuth();
  const location = useLocation();

  const hasToken = !!localStorage.getItem('sparkomind_token');
  const hasUser = !!user || !!localStorage.getItem('sparkomind_user');

  // ONLY show initial full-page loader if auth check is actively pending AND no cached session exists
  if (loading && !hasToken && !hasUser) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#0F172A',
        color: '#FFFFFF'
      }}>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '16px'
        }}>
          <div style={{
            width: '44px',
            height: '44px',
            border: '3px solid rgba(94, 92, 230, 0.2)',
            borderTopColor: '#5E5CE6',
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite'
          }} />
          <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
          <p style={{ color: '#94A3B8', fontSize: '15px', fontWeight: 500 }}>
            Verifying secure session...
          </p>
        </div>
      </div>
    );
  }

  // If no active or cached session exists, redirect to login
  if (!isAuthenticated && !hasToken) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children ? children : <Outlet />;
};

export default ProtectedRoute;
