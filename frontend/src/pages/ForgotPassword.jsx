import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, CheckCircle2, AlertCircle, RefreshCw, ArrowLeft } from 'lucide-react';
import sparkoLogo from '../assets/images/logo-transparent.png';
import { authApi } from '../services/api.js';
import styles from './ForgotPassword.module.css';

export const ForgotPassword = () => {
  const navigate = useNavigate();

  // Multi-step state: 1 = Email input, 2 = OTP + New Password
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [maskedEmail, setMaskedEmail] = useState('');

  // Step 2 OTP (6 digits) & Password states
  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);
  const otpInputsRef = useRef([]);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Status & Feedback states
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [resendCooldown, setResendCooldown] = useState(0);

  // Auto-focus first OTP digit when Step 2 loads
  useEffect(() => {
    if (step === 2) {
      setTimeout(() => {
        otpInputsRef.current[0]?.focus();
      }, 150);
    }
  }, [step]);

  // Resend cooldown timer for Step 2
  useEffect(() => {
    let timer = null;
    if (step === 2 && resendCooldown > 0) {
      timer = setInterval(() => {
        setResendCooldown((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [step, resendCooldown]);

  // Mask helper for UI display
  const maskEmailFallback = (rawEmail) => {
    if (!rawEmail || !rawEmail.includes('@')) return rawEmail;
    const [local, domain] = rawEmail.split('@');
    if (local.length <= 2) return `${local[0]}*@${domain}`;
    return `${local.slice(0, 2)}***${local.slice(-2)}@${domain}`;
  };

  // STEP 1: Send 6-digit reset code
  const handleSendResetCode = async (e) => {
    if (e) e.preventDefault();
    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail || !cleanEmail.includes('@')) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }

    setIsLoading(true);
    setErrorMsg('');

    try {
      const res = await authApi.forgotPassword({ email: cleanEmail });
      setMaskedEmail(res.data?.maskedEmail || maskEmailFallback(cleanEmail));
      setStep(2);
      setResendCooldown(60);
      setOtpDigits(['', '', '', '', '', '']);
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setErrorMsg(err.message || 'No account found with this email. Please check and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // STEP 2: Resend 6-digit code
  const handleResendCode = async () => {
    if (resendCooldown > 0 || isResending || isLoading) return;
    setIsResending(true);
    setErrorMsg('');

    try {
      const cleanEmail = email.trim().toLowerCase();
      const res = await authApi.forgotPassword({ email: cleanEmail });
      setMaskedEmail(res.data?.maskedEmail || maskEmailFallback(cleanEmail));
      setResendCooldown(60);
      setOtpDigits(['', '', '', '', '', '']);
      otpInputsRef.current[0]?.focus();
    } catch (err) {
      setErrorMsg(err.message || 'Unable to resend verification code. Please try again.');
    } finally {
      setIsResending(false);
    }
  };

  // OTP Input Handlers (Matching Signup)
  const handleOtpDigitChange = (index, value) => {
    const rawVal = value.replace(/\D/g, '');
    const char = rawVal ? rawVal[rawVal.length - 1] : '';

    const nextDigits = [...otpDigits];
    nextDigits[index] = char;
    setOtpDigits(nextDigits);
    if (errorMsg) setErrorMsg('');

    if (char && index < 5) {
      otpInputsRef.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      otpInputsRef.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (!pasted) return;

    const nextDigits = ['', '', '', '', '', ''];
    for (let i = 0; i < pasted.length; i++) {
      nextDigits[i] = pasted[i];
    }
    setOtpDigits(nextDigits);
    if (errorMsg) setErrorMsg('');

    const nextFocusIndex = Math.min(pasted.length, 5);
    otpInputsRef.current[nextFocusIndex]?.focus();
  };

  // STEP 2: Confirm & Update Password
  const handleResetPasswordSubmit = async (e) => {
    if (e) e.preventDefault();
    const cleanEmail = email.trim().toLowerCase();
    const otpCode = otpDigits.join('').trim();

    if (otpCode.length !== 6) {
      setErrorMsg('Please enter the complete 6-digit verification code.');
      return;
    }

    if (!newPassword || newPassword.length < 6) {
      setErrorMsg('Password must be at least 6 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMsg('Passwords do not match. Please re-enter.');
      return;
    }

    setIsLoading(true);
    setErrorMsg('');

    try {
      await authApi.resetPassword({
        email: cleanEmail,
        otp: otpCode,
        newPassword
      });

      setIsSuccess(true);
      setTimeout(() => {
        navigate('/login', { replace: true });
      }, 1500);
    } catch (err) {
      setErrorMsg(err.message || 'Invalid or expired verification code.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.canvas}>
      <div className={styles.card}>
        {/* Brand Logo Lockup */}
        <div className={styles.logoContainer}>
          <Link to="/" className={styles.brandLockup}>
            <img
              src={sparkoLogo}
              alt="SparkoMind Logo"
              className={styles.brandLogoImg}
              draggable="false"
            />
            <div className={styles.brandTitle}>
              <span className={styles.brandSparko}>Sparko</span>
              <span className={styles.brandMind}>Mind</span>
            </div>
          </Link>
        </div>

        {/* Dynamic Header */}
        <div className={styles.header}>
          <h1 className={styles.title}>
            {step === 1 ? 'Reset your password' : 'Enter verification code'}
          </h1>
          <p className={styles.subtitle}>
            {step === 1 ? (
              "Enter the email address linked to your account. We'll send you a 6-digit verification code to reset your password."
            ) : (
              <>
                Enter the 6-digit code sent to{' '}
                <strong className={styles.highlightEmail}>
                  {maskedEmail || email}
                </strong>
              </>
            )}
          </p>
        </div>

        {/* Global Error Banner */}
        {errorMsg && (
          <div className={styles.errorAlert} role="alert">
            <AlertCircle size={16} />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Success Alert */}
        {isSuccess && (
          <div className={styles.successAlert} role="alert">
            <CheckCircle2 size={18} />
            <span>Password successfully reset! Redirecting to login...</span>
          </div>
        )}

        {/* STEP 1 VIEW: Email Input */}
        {step === 1 && !isSuccess && (
          <form onSubmit={handleSendResetCode} className={styles.form} noValidate>
            <div className={styles.inputWrapper}>
              <label htmlFor="reset-email" className={styles.label}>
                Email Address
              </label>
              <div className={styles.inputGroup}>
                <Mail className={styles.inputIcon} size={18} />
                <input
                  id="reset-email"
                  type="email"
                  name="email"
                  required
                  placeholder="name@company.com"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errorMsg) setErrorMsg('');
                  }}
                  className={styles.inputField}
                  disabled={isLoading}
                />
              </div>
            </div>

            <button
              type="submit"
              className={styles.submitBtn}
              disabled={isLoading}
            >
              {isLoading ? 'Sending Code...' : 'Send Reset Code →'}
            </button>
          </form>
        )}

        {/* STEP 2 VIEW: 6-Digit OTP + New Password */}
        {step === 2 && !isSuccess && (
          <form onSubmit={handleResetPasswordSubmit} className={styles.form} noValidate>
            {/* 6 Individual Auto-Focusing Single-Digit Input Boxes */}
            <div className={styles.otpSection}>
              <label className={styles.label}>Verification Code</label>
              <div className={styles.otpGrid} onPaste={handleOtpPaste}>
                {otpDigits.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => (otpInputsRef.current[index] = el)}
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpDigitChange(index, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(index, e)}
                    className={`${styles.otpBox} ${digit ? styles.otpBoxFilled : ''}`}
                    autoComplete="one-time-code"
                    aria-label={`Digit ${index + 1}`}
                    disabled={isLoading}
                  />
                ))}
              </div>

              {/* Resend Cooldown Row */}
              <div className={styles.resendRow}>
                <span className={styles.resendText}>Didn't receive the code?</span>
                <button
                  type="button"
                  onClick={handleResendCode}
                  disabled={resendCooldown > 0 || isResending || isLoading}
                  className={styles.resendActionBtn}
                >
                  {isResending ? (
                    'Sending...'
                  ) : resendCooldown > 0 ? (
                    `Resend in ${resendCooldown}s`
                  ) : (
                    'Resend Code'
                  )}
                </button>
              </div>
            </div>

            {/* New Password */}
            <div className={styles.inputWrapper}>
              <label htmlFor="new-password" className={styles.label}>
                New Password
              </label>
              <div className={styles.inputGroup}>
                <Lock className={styles.inputIcon} size={18} />
                <input
                  id="new-password"
                  type={showNewPassword ? 'text' : 'password'}
                  name="newPassword"
                  required
                  placeholder="Enter new password (min. 6 chars)"
                  autoComplete="new-password"
                  value={newPassword}
                  onChange={(e) => {
                    setNewPassword(e.target.value);
                    if (errorMsg) setErrorMsg('');
                  }}
                  className={styles.inputField}
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className={styles.eyeToggleBtn}
                  aria-label={showNewPassword ? 'Hide password' : 'Show password'}
                >
                  {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div className={styles.inputWrapper}>
              <label htmlFor="confirm-password" className={styles.label}>
                Confirm Password
              </label>
              <div className={styles.inputGroup}>
                <Lock className={styles.inputIcon} size={18} />
                <input
                  id="confirm-password"
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  required
                  placeholder="Re-enter new password"
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    if (errorMsg) setErrorMsg('');
                  }}
                  className={styles.inputField}
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className={styles.eyeToggleBtn}
                  aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                >
                  {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <button
              type="submit"
              className={styles.submitBtn}
              disabled={isLoading || otpDigits.join('').length !== 6 || !newPassword || !confirmPassword}
            >
              {isLoading ? 'Updating Password...' : 'Confirm & Update Password →'}
            </button>

            {/* Edit / Change Email */}
            <button
              type="button"
              onClick={() => {
                setStep(1);
                setErrorMsg('');
              }}
              disabled={isLoading}
              className={styles.changeEmailBtn}
            >
              ← Edit email address
            </button>
          </form>
        )}

        {/* Footer Navigation */}
        <Link to="/login" className={styles.backLink}>
          ← Return to login
        </Link>
      </div>
    </div>
  );
};

export default ForgotPassword;
