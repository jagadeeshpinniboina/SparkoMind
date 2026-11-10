import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authApi } from '../services/api.js';
import { useTheme } from './ThemeContext.jsx';

const TOKEN_STORAGE_KEY = 'sparkomind_token';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const rememberSession = localStorage.getItem('sparkomind_remember_session') === 'true';
      const sessionActive = sessionStorage.getItem('sparkomind_session_active');
      if (!rememberSession && !sessionActive) {
        return null;
      }
      const stored = localStorage.getItem('sparkomind_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });
  const [token, setToken] = useState(() => {
    try {
      const rememberSession = localStorage.getItem('sparkomind_remember_session') === 'true';
      const sessionActive = sessionStorage.getItem('sparkomind_session_active');
      if (!rememberSession && !sessionActive) {
        return null;
      }
      return localStorage.getItem(TOKEN_STORAGE_KEY);
    } catch {
      return null;
    }
  });
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { setDemographic } = useTheme();

  // Load user session ONCE on mount with resilient persistence
  useEffect(() => {
    let isMounted = true;
    const checkSession = async () => {
      try {
        const rememberSession = localStorage.getItem('sparkomind_remember_session') === 'true';
        const sessionActive = sessionStorage.getItem('sparkomind_session_active');

        // Production Remember-Me Check:
        // If sparkomind_remember_session === 'true', session persists across browser restarts.
        // Otherwise, if sparkomind_session_active flag is missing from sessionStorage (browser closed & reopened),
        // we clean up the session so user must log in again.
        if (!rememberSession && !sessionActive) {
          localStorage.removeItem(TOKEN_STORAGE_KEY);
          localStorage.removeItem('sparkomind_user');
          if (isMounted) {
            setUser(null);
            setToken(null);
            setProgress(null);
            setLoading(false);
          }
          return;
        }

        // Active session confirmed - mark session active in current browser window
        sessionStorage.setItem('sparkomind_session_active', 'true');

        const storedToken = localStorage.getItem(TOKEN_STORAGE_KEY);
        const storedUser = localStorage.getItem('sparkomind_user');

        if (!storedToken || !storedUser) {
          if (isMounted) {
            setUser(null);
            setToken(null);
            setProgress(null);
            setLoading(false);
          }
          return;
        }

        // Immediately restore from localStorage to prevent flash of logged-out state
        let parsedUser = null;
        try {
          parsedUser = JSON.parse(storedUser);
          if (isMounted) {
            setUser(parsedUser);
            setToken(storedToken);
          }
        } catch (err) {
          console.warn('[AuthContext] Invalid stored user JSON:', err);
        }

        // Verify with backend without resetting user's chosen zone
        try {
          const res = await authApi.getMe();
          if (isMounted && res.success && res.data?.user) {
            const merged = { ...parsedUser, ...res.data.user };
            setUser(merged);
            setProgress(res.data.progress);
            if (res.data.token) {
              setToken(res.data.token);
              localStorage.setItem(TOKEN_STORAGE_KEY, res.data.token);
            }
            localStorage.setItem('sparkomind_user', JSON.stringify(merged));

            // Respect user's active zone choice from localStorage
            const activeZone = localStorage.getItem('sparkomind_active_zone');
            if (activeZone) {
              setDemographic(activeZone);
            } else if (merged.demographic) {
              setDemographic(merged.demographic);
            }
          }
        } catch (apiErr) {
          // Only invalidate if the backend specifically rejected the token with 401
          if (apiErr.statusCode === 401 && isMounted) {
            setUser(null);
            setToken(null);
            setProgress(null);
            localStorage.removeItem(TOKEN_STORAGE_KEY);
            localStorage.removeItem('sparkomind_user');
          } else {
            console.info('[AuthContext] Backend check skipped, maintaining active session.');
          }
        }
      } catch {
        // In case of unexpected runtime error, maintain session if tokens exist
        const storedToken = localStorage.getItem(TOKEN_STORAGE_KEY);
        const storedUser = localStorage.getItem('sparkomind_user');
        if (storedToken && storedUser && isMounted) {
          try {
            setUser(JSON.parse(storedUser));
            setToken(storedToken);
          } catch {}
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    checkSession();
    return () => { isMounted = false; };
  }, []); // Run strictly ONCE on mount

  const updateUserDemographic = async (newDemographic) => {
    if (!['kids', 'adults', 'seniors'].includes(newDemographic)) return;
    setDemographic(newDemographic);
    localStorage.setItem('sparkomind_active_zone', newDemographic);
    localStorage.setItem('sparkomind_demographic', newDemographic);

    setUser((prev) => {
      if (!prev) return prev;
      const updated = { ...prev, demographic: newDemographic };
      localStorage.setItem('sparkomind_user', JSON.stringify(updated));
      return updated;
    });

    try {
      if (authApi.updateProfile) {
        await authApi.updateProfile({ demographic: newDemographic });
      }
    } catch {
      // Fire-and-forget without blocking UI
    }
  };

  const login = async (credentials) => {
    setError(null);
    try {
      const res = await authApi.login(credentials);
      if (res.success && res.data?.user) {
        setUser(res.data.user);
        setProgress(res.data.progress);
        const authToken = res.data.token || 'authenticated';
        setToken(authToken);
        localStorage.setItem(TOKEN_STORAGE_KEY, authToken);
        localStorage.setItem('sparkomind_user', JSON.stringify(res.data.user));
        sessionStorage.setItem('sparkomind_session_active', 'true');

        if (res.data.user.demographic) {
          setDemographic(res.data.user.demographic);
        }
        return { success: true, user: res.data.user };
      }
      return { success: false, message: res.message || 'Login failed.', statusCode: res.statusCode || 400 };
    } catch (err) {
      const msg = err.message || 'Login failed. Please check your credentials.';
      setError(msg);
      return { success: false, message: msg, statusCode: err.statusCode || 500 };
    }
  };

  const register = async (userData) => {
    setError(null);
    try {
      const res = await authApi.register(userData);
      if (res.success && res.data?.user) {
        setUser(res.data.user);
        setProgress(res.data.progress);
        const authToken = res.data.token || 'authenticated';
        setToken(authToken);
        localStorage.setItem(TOKEN_STORAGE_KEY, authToken);
        localStorage.setItem('sparkomind_user', JSON.stringify(res.data.user));
        sessionStorage.setItem('sparkomind_session_active', 'true');

        if (res.data.user.demographic) {
          setDemographic(res.data.user.demographic);
        }
        return { success: true, user: res.data.user };
      }
      return { success: false, message: res.message || 'Registration failed.', statusCode: res.statusCode || 400 };
    } catch (err) {
      const msg = err.message || 'Registration failed.';
      setError(msg);
      return { success: false, message: msg, statusCode: err.statusCode || 500 };
    }
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } catch {
      // Ignore network errors during logout
    } finally {
      setUser(null);
      setToken(null);
      setProgress(null);
      localStorage.removeItem(TOKEN_STORAGE_KEY);
      localStorage.removeItem('sparkomind_user');
      localStorage.removeItem('sparkomind_remember_session');
      sessionStorage.removeItem('sparkomind_session_active');
    }
  };

  const updateProfileProgress = (newProgress) => {
    setProgress((prev) => ({ ...prev, ...newProgress }));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        token,
        setToken,
        progress,
        loading,
        error,
        login,
        register,
        logout,
        updateUserDemographic,
        updateProfileProgress,
        isAuthenticated: !!user
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
