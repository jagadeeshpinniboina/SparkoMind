import React, { useState, useEffect } from 'react';
import { useNavigate, Link, Navigate } from 'react-router-dom';
import { ArrowLeft, Mail, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext.jsx';
import styles from './Login.module.css';
import loginShowcaseImg from '../../../assets/images/login-showcase.png';

export const Login = () => {
  const navigate = useNavigate();
  const { login, setUser, isAuthenticated, user } = useAuth();

  // Strict Post-Auth App Portal Routing:
  // Instant synchronous and effect-based redirect locking authenticated users inside the portal
  const token = localStorage.getItem('sparkomind_token');
  const storedUser = localStorage.getItem('sparkomind_user');
  if ((isAuthenticated || token) && (user || storedUser)) {
    return <Navigate to="/select-zone" replace />;
  }

  useEffect(() => {
    if ((isAuthenticated || token) && (user || storedUser)) {
      navigate('/select-zone', { replace: true });
    }
  }, [isAuthenticated, user, token, storedUser, navigate]);

  const [rememberMe, setRememberMe] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    emailOrUsername: '',
    password: '',
    rememberMe: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [notRegistered, setNotRegistered] = useState(false);

  // Check if a remembered email exists on mount
  useEffect(() => {
    const savedEmail = localStorage.getItem('sparkomind_remembered_email');
    if (savedEmail) {
      setFormData((prev) => ({
        ...prev,
        email: savedEmail,
        emailOrUsername: savedEmail,
        rememberMe: true
      }));
      setRememberMe(true);
    }
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      setRememberMe(checked);
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
        ...(name === 'email' ? { emailOrUsername: value } : {}),
        ...(name === 'emailOrUsername' ? { email: value } : {})
      }));
    }
    if (errorMsg) setErrorMsg('');
    if (notRegistered) setNotRegistered(false);
  };

  const handleInputFocus = () => {
    if (errorMsg) setErrorMsg('');
    if (notRegistered) setNotRegistered(false);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const identity = (formData.email || formData.emailOrUsername || '').trim();
    if (!identity || !formData.password) {
      setErrorMsg('Please enter your email/username and password.');
      setNotRegistered(false);
      return;
    }

    setIsLoading(true);
    setErrorMsg('');
    setNotRegistered(false);

    const persistSession = (userObj, authToken) => {
      if (rememberMe) {
        localStorage.setItem('sparkomind_remembered_email', identity);
        localStorage.setItem('sparkomind_remember_session', 'true');
      } else {
        localStorage.removeItem('sparkomind_remembered_email');
        localStorage.removeItem('sparkomind_remember_session');
      }
      sessionStorage.setItem('sparkomind_session_active', 'true');

      if (authToken) {
        localStorage.setItem('sparkomind_token', authToken);
      }
      if (userObj) {
        localStorage.setItem('sparkomind_user', JSON.stringify(userObj));
        if (setUser) setUser(userObj);
      }
      navigate('/select-zone');
    };

    try {
      if (login) {
        const res = await login({
          email: identity,
          password: formData.password
        });
        if (res.success && res.user) {
          const activeToken = localStorage.getItem('sparkomind_token') || `sparko_auth_${Date.now()}`;
          persistSession(res.user, activeToken);
          return;
        } else if (!res.success) {
          const msg = res.message || '';
          const isNotFound = res.statusCode === 404 || /not found|does not exist|no account|unregistered/i.test(msg);
          if (isNotFound) {
            setNotRegistered(true);
            setErrorMsg('');
          } else if (res.statusCode >= 500) {
            setErrorMsg('Auth service is starting. Please try again in a moment.');
          } else {
            setErrorMsg(msg || 'Invalid credentials. Please try again.');
          }
          return;
        }
      }

      // Direct fallback call
      const res = await fetch('/api/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: identity,
          password: formData.password
        })
      });
      const data = await res.json();
      if (!res.ok) {
        const isNotFound = res.status === 404 || /not found|does not exist|no account|unregistered/i.test(data.message || '');
        if (isNotFound) {
          setNotRegistered(true);
          setErrorMsg('');
          return;
        }
        if (res.status >= 500) {
          setErrorMsg('Auth service is starting. Please try again in a moment.');
          return;
        }
        throw new Error(data.message || 'Invalid credentials. Please try again.');
      }

      persistSession(data.user, data.token);
    } catch (err) {
      const errMsg = err.message || '';
      const isNotFound = err.statusCode === 404 || /not found|does not exist|no account|unregistered/i.test(errMsg);
      if (isNotFound) {
        setNotRegistered(true);
        setErrorMsg('');
      } else if (err.statusCode >= 500 || /connect|network|failed/i.test(errMsg)) {
        setErrorMsg('Auth service is starting. Please try again in a moment.');
      } else {
        setErrorMsg(errMsg || 'Unable to log in. Please check your credentials.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.loginCanvas}>
      {/* Top Back to Home Navigation */}
      <Link to="/" className={styles.backHomeBtn}>
        <ArrowLeft size={16} />
        <span>Back to Home</span>
      </Link>

      <div className={styles.splitContainer}>
        {/* Left Artwork Showcase */}
        <div className={styles.leftShowcase}>
          <img
            src={loginShowcaseImg}
            alt="SparkoMind Learning"
            className={styles.showcasePosterImg}
          />
        </div>

        {/* Right Form Panel: Pure Credentials */}
        <div className={styles.rightFormPanel}>
          <h1 className={styles.formTitle}>Welcome Back</h1>
          <p className={styles.formSubtitle}>Log in to continue your journey</p>

          {/* Unregistered User Banner with direct Click to /register */}
          {notRegistered ? (
            <div className={styles.unregisteredAlert} role="alert">
              <AlertCircle size={18} className={styles.alertIcon} />
              <div className={styles.alertContent}>
                <span>No account found with this email. </span>
                <Link to="/register" className={styles.alertSignUpLink}>
                  Please sign up first!
                </Link>
              </div>
            </div>
          ) : errorMsg && (
            <div className={styles.errorAlert} role="alert">
              <AlertCircle size={16} />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleFormSubmit} className={styles.authForm} noValidate>
            {/* Email/Username Field */}
            <div className={styles.inputGroup}>
              <Mail className={styles.inputIcon} size={20} />
              <input
                id="email"
                type="text"
                name="email"
                placeholder="Enter your email or username"
                value={formData.email}
                onChange={handleChange}
                onFocus={handleInputFocus}
                autoComplete="username email"
                className={styles.inputField}
                required
              />
            </div>

            {/* Password Field */}
            <div className={styles.inputGroup}>
              <Lock className={styles.inputIcon} size={20} />
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                onFocus={handleInputFocus}
                autoComplete="current-password"
                className={styles.inputField}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className={styles.eyeToggleBtn}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {/* Options Row */}
            <div className={styles.optionsRow}>
              <label className={styles.rememberMeLabel}>
                <input
                  type="checkbox"
                  name="rememberMe"
                  checked={rememberMe}
                  onChange={handleChange}
                  className={styles.checkbox}
                />
                <span>Remember me</span>
              </label>
              <Link to="/forgot-password" className={styles.forgotPasswordLink}>
                Forgot Password?
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className={styles.primarySubmitBtn}
              disabled={isLoading}
            >
              {isLoading ? 'Logging In...' : 'Login'}
            </button>
          </form>

          {/* Footer Navigation */}
          <p className={styles.footerText}>
            Don't have an account?{' '}
            <Link to="/register" className={styles.signUpLink}>
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
