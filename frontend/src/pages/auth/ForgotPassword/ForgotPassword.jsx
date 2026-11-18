import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, CheckCircle2, AlertCircle, RefreshCw, ArrowLeft, Loader2 } from 'lucide-react';
import sparkoLogo from '../../../assets/images/logo-transparent.png';
import { authApi } from '../../../services/api.js';
import styles from './ForgotPassword.module.css';

export const ForgotPassword = () => {
  const navigate = useNavigate();

  // Multi-step state: 1 = Email input, 2 = OTP + Gated Password
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [maskedEmail, setMaskedEmail] = useState('');

  // Step 2 OTP (6 digits) & Auto-verification states
  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);
  const otpInputsRef = useRef([]);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [verifiedOtpCode, setVerifiedOtpCode] = useState('');

  // Gated Password states (Only shown after OTP is verified)
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const newPasswordRef = useRef(null);

  // Status & Feedback states
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [resendCooldown, setResendCooldown] = useState(0);

  // Auto-focus first OTP digit when Step 2 loads
  useEffect(() => {
    if (step === 2 && !isOtpVerified) {
      setTimeout(() => {
        otpInputsRef.current[0]?.focus();
      }, 150);
    }
  }, [step, isOtpVerified]);

  // Auto-focus New Password input when OTP is verified
  useEffect(() => {
    if (isOtpVerified) {
      setTimeout(() => {
        newPasswordRef.current?.focus();
      }, 150);
    }
  }, [isOtpVerified]);

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
      setIsOtpVerified(false);
      setVerifiedOtpCode('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setErrorMsg(err.message || 'No account found with this email. Please check and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // STEP 2: Automatic 6-Digit OTP Verification upon 6th digit entry
  const autoVerifyOtp = async (codeToVerify) => {
    if (codeToVerify.length !== 6 || isVerifyingOtp || isOtpVerified) return;

    setIsVerifyingOtp(true);
    setErrorMsg('');

    try {
      const cleanEmail = email.trim().toLowerCase();
      await authApi.verifyOtp({ email: cleanEmail, otp: codeToVerify });

      setIsOtpVerified(true);
      setVerifiedOtpCode(codeToVerify);
    } catch (err) {
      setErrorMsg(err.message || 'Invalid or expired verification code. Please try again.');
      setOtpDigits(['', '', '', '', '', '']);
      setTimeout(() => {
        otpInputsRef.current[0]?.focus();
      }, 100);
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  // STEP 2: Resend 6-digit code
  const handleResendCode = async () => {
    if (resendCooldown > 0 || isResending || isLoading || isVerifyingOtp) return;
    setIsResending(true);
    setErrorMsg('');

    try {
      const cleanEmail = email.trim().toLowerCase();
      const res = await authApi.forgotPassword({ email: cleanEmail });
      setMaskedEmail(res.data?.maskedEmail || maskEmailFallback(cleanEmail));
      setResendCooldown(60);
      setOtpDigits(['', '', '', '', '', '']);
      setIsOtpVerified(false);
      setVerifiedOtpCode('');
      setTimeout(() => {
        otpInputsRef.current[0]?.focus();
      }, 100);
    } catch (err) {
      setErrorMsg(err.message || 'Unable to resend verification code. Please try again.');
    } finally {
      setIsResending(false);
    }
  };

  // OTP Input Handlers (Auto-advance and auto-verify on 6th digit)
  const handleOtpDigitChange = (index, value) => {
    if (isOtpVerified || isVerifyingOtp) return;
    const rawVal = value.replace(/\D/g, '');
    const char = rawVal ? rawVal[rawVal.length - 1] : '';

    const nextDigits = [...otpDigits];
    nextDigits[index] = char;
    setOtpDigits(nextDigits);
    if (errorMsg) setErrorMsg('');

    if (char && index < 5) {
      otpInputsRef.current[index + 1]?.focus();
    }

    // Trigger instant verification when all 6 digits are entered
    const completeCode = nextDigits.join('');
    if (completeCode.length === 6) {
      autoVerifyOtp(completeCode);
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (isOtpVerified || isVerifyingOtp) return;
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      otpInputsRef.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e) => {
    if (isOtpVerified || isVerifyingOtp) return;
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

    if (pasted.length === 6) {
      autoVerifyOtp(pasted);
    }
  };

  // STEP 2: Confirm & Update Password (Only available after OTP is verified)
  const handleResetPasswordSubmit = async (e) => {
    if (e) e.preventDefault();
    const cleanEmail = email.trim().toLowerCase();
    const otpCode = verifiedOtpCode || otpDigits.join('').trim();

    if (!isOtpVerified || otpCode.length !== 6) {
      setErrorMsg('Please verify your 6-digit code first.');
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
            {step === 1
              ? 'Reset your password'
              : isOtpVerified
              ? 'Set new password'
              : 'Enter verification code'}
          </h1>
          <p className={styles.subtitle}>
            {step === 1 ? (
              "Enter the email address linked to your account. We'll send you a 6-digit verification code to reset your password."
            ) : isOtpVerified ? (
              'Code verified! Create a new secure password for your SparkoMind account.'
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

        {/* STEP 2 VIEW: 6-Digit OTP + Gated Password */}
        {step === 2 && !isSuccess && (
          <form onSubmit={handleResetPasswordSubmit} className={styles.form} noValidate>
            {/* 6 Individual Single-Digit Input Boxes */}
            <div className={styles.otpSection}>
              <div className={styles.otpHeaderRow}>
                <label className={styles.label}>6-Digit Verification Code</label>
                {isVerifyingOtp && (
                  <span className={styles.verifyingText}>
                    <Loader2 size={13} className={styles.spinning} /> Verifying code...
                  </span>
                )}
              </div>

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
                    className={`${styles.otpBox} ${digit ? styles.otpBoxFilled : ''} ${
                      isOtpVerified ? styles.otpBoxVerified : ''
                    }`}
                    autoComplete="one-time-code"
                    aria-label={`Digit ${index + 1}`}
                    disabled={isVerifyingOtp || isOtpVerified || isLoading}
                  />
                ))}
              </div>

              {/* Verified Pill Badge */}
              {isOtpVerified && (
                <div className={styles.verifiedBadge}>
                  <CheckCircle2 size={15} className={styles.verifiedIcon} />
                  <span>Code verified successfully</span>
                  <button
                    type="button"
                    onClick={() => {
                      setIsOtpVerified(false);
                      setVerifiedOtpCode('');
                      setOtpDigits(['', '', '', '', '', '']);
                      setTimeout(() => otpInputsRef.current[0]?.focus(), 100);
                    }}
                    className={styles.changeCodeBtn}
                  >
                    Change
                  </button>
                </div>
              )}

              {/* Resend Cooldown Row (Visible while unverified) */}
              {!isOtpVerified && (
                <div className={styles.resendRow}>
                  <span className={styles.resendText}>Didn't receive the code?</span>
                  <button
                    type="button"
                    onClick={handleResendCode}
                    disabled={resendCooldown > 0 || isResending || isLoading || isVerifyingOtp}
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
              )}
            </div>

            {/* GATED PASSWORD FIELDS: Only shown once OTP is verified */}
            {isOtpVerified && (
              <div className={styles.passwordSection}>
                {/* New Password */}
                <div className={styles.inputWrapper}>
                  <label htmlFor="new-password" className={styles.label}>
                    New Password
                  </label>
                  <div className={styles.inputGroup}>
                    <Lock className={styles.inputIcon} size={18} />
                    <input
                      ref={newPasswordRef}
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

                {/* Action Button */}
                <button
                  type="submit"
                  className={styles.submitBtn}
                  disabled={isLoading || !newPassword || !confirmPassword}
                >
                  {isLoading ? 'Updating Password...' : 'Confirm & Update Password →'}
                </button>
              </div>
            )}

            {/* Edit / Change Email (Available on Step 2) */}
            <button
              type="button"
              onClick={() => {
                setStep(1);
                setIsOtpVerified(false);
                setVerifiedOtpCode('');
                setErrorMsg('');
              }}
              disabled={isLoading || isVerifyingOtp}
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
