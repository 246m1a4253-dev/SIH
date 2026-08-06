import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Mail, Lock, User, Phone, ShieldCheck, KeyRound, 
  X, ArrowRight, RefreshCw, CheckCircle2, AlertCircle, Sparkles, LogIn, Eye, EyeOff
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const AuthModal = () => {
  const { 
    authModalOpen, 
    authMode, 
    setAuthMode, 
    closeAuthModal, 
    pendingOtp, 
    loginUser, 
    registerUser, 
    verifyOtp, 
    resendOtp, 
    sendForgotPasswordOtp, 
    resetPassword 
  } = useApp();

  // Local Form States
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [otpCode, setOtpCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [timer, setTimer] = useState(60);

  // Timer countdown effect for OTP verification
  useEffect(() => {
    let interval = null;
    if (authMode === 'otp_verify' && timer > 0) {
      interval = setInterval(() => {
        setTimer(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [authMode, timer]);

  if (!authModalOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrorMsg('');
  };

  // 1. Login Submit
  const handleLogin = (e) => {
    e.preventDefault();
    setErrorMsg('');
    try {
      loginUser({ email: formData.email, password: formData.password });
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
    } catch (err) {
      setErrorMsg(err.message);
    }
  };

  // 2. Demo Quick Login
  const handleDemoLogin = () => {
    try {
      loginUser({ email: 'aamir.hassan@gmail.com', password: 'password123' });
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
    } catch (err) {
      setErrorMsg(err.message);
    }
  };

  // 3. Register Submit (Triggers Gmail OTP)
  const handleRegister = (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!formData.name.trim()) {
      setErrorMsg('Please enter your full name.');
      return;
    }
    if (!formData.email.toLowerCase().endsWith('@gmail.com') && !formData.email.includes('@')) {
      setErrorMsg('Please enter a valid Gmail address (e.g. user@gmail.com).');
      return;
    }
    if (formData.password.length < 6) {
      setErrorMsg('Password must be at least 6 characters long.');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setErrorMsg('Passwords do not match.');
      return;
    }

    try {
      registerUser({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password
      });
      setOtpCode('');
      setTimer(60);
      setSuccessMsg(`Verification code sent to ${formData.email}!`);
    } catch (err) {
      setErrorMsg(err.message);
    }
  };

  // 4. Verify OTP Submit
  const handleOtpSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');
    if (otpCode.length < 6) {
      setErrorMsg('Please enter the full 6-digit OTP code.');
      return;
    }

    try {
      const res = verifyOtp(otpCode);
      if (res && res.success) {
        confetti({ particleCount: 80, spread: 70, origin: { y: 0.5 } });
      }
    } catch (err) {
      setErrorMsg(err.message);
    }
  };

  // 5. Resend OTP Handler
  const handleResendOtp = () => {
    setErrorMsg('');
    const newCode = resendOtp();
    if (newCode) {
      setTimer(60);
      setSuccessMsg(`New OTP sent! (Code: ${newCode})`);
    }
  };

  // 6. Forgot Password Initiator
  const handleForgotPasswordSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');
    if (!formData.email.trim()) {
      setErrorMsg('Please enter your registered Gmail address.');
      return;
    }

    try {
      sendForgotPasswordOtp(formData.email);
      setTimer(60);
      setOtpCode('');
      setSuccessMsg(`Password reset OTP sent to ${formData.email}.`);
    } catch (err) {
      setErrorMsg(err.message);
    }
  };

  // 7. Reset Password Final Submit
  const handleResetPasswordSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');
    if (newPassword.length < 6) {
      setErrorMsg('New password must be at least 6 characters.');
      return;
    }
    if (newPassword !== confirmNewPassword) {
      setErrorMsg('Passwords do not match.');
      return;
    }

    try {
      resetPassword(newPassword);
      confetti({ particleCount: 70, spread: 60, origin: { y: 0.5 } });
    } catch (err) {
      setErrorMsg(err.message);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 1000,
      background: 'rgba(5, 7, 20, 0.82)',
      backdropFilter: 'blur(12px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }} className="animate-fade-in">

      <div className="glass-card" style={{
        width: '100%',
        maxWidth: '480px',
        borderRadius: '24px',
        overflow: 'hidden',
        boxShadow: '0 20px 50px rgba(0, 0, 0, 0.6), 0 0 30px rgba(99, 102, 241, 0.2)',
        border: '1px solid rgba(255, 255, 255, 0.12)',
        position: 'relative'
      }}>
        {/* Close Button */}
        <button 
          onClick={closeAuthModal}
          style={{
            position: 'absolute',
            top: '18px',
            right: '18px',
            background: 'rgba(255, 255, 255, 0.08)',
            border: 'none',
            borderRadius: '50%',
            width: '32px',
            height: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--text-muted)',
            cursor: 'pointer',
            zIndex: 10
          }}
        >
          <X size={18} />
        </button>

        {/* Modal Header */}
        <div style={{
          padding: '28px 28px 20px',
          background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(6, 182, 212, 0.1) 100%)',
          borderBottom: '1px solid var(--border-color)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #6366f1 0%, #06b6d4 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 12px rgba(99, 102, 241, 0.4)'
            }}>
              <ShieldCheck size={20} color="#fff" />
            </div>
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }} className="gradient-text">
                {authMode === 'login' && 'Sign In to MargDarshak AI'}
                {authMode === 'register' && 'Create Student Account'}
                {authMode === 'otp_verify' && 'Gmail OTP Verification'}
                {authMode === 'forgot_password' && 'Reset Password'}
                {authMode === 'reset_password' && 'Enter New Password'}
              </h3>
            </div>
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            {authMode === 'login' && 'Access personalized career roadmaps, college predictors, and active applications.'}
            {authMode === 'register' && 'Register your Gmail address to start tracking your skill gap & scholarships.'}
            {authMode === 'otp_verify' && `We sent a 6-digit verification code to ${pendingOtp?.email || 'your Gmail'}.`}
            {authMode === 'forgot_password' && 'Enter your registered Gmail to receive a password reset OTP.'}
            {authMode === 'reset_password' && 'Set a strong new password for your account.'}
          </p>

          {/* Mode Switcher Tabs (Login / Register) */}
          {(authMode === 'login' || authMode === 'register') && (
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '6px',
              marginTop: '16px',
              background: 'rgba(0,0,0,0.3)',
              padding: '4px',
              borderRadius: 'var(--radius-sm)'
            }}>
              <button
                onClick={() => { setAuthMode('login'); setErrorMsg(''); }}
                style={{
                  padding: '8px',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.82rem',
                  fontWeight: authMode === 'login' ? 700 : 500,
                  background: authMode === 'login' ? 'var(--primary)' : 'transparent',
                  color: authMode === 'login' ? '#fff' : 'var(--text-muted)',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                Sign In
              </button>
              <button
                onClick={() => { setAuthMode('register'); setErrorMsg(''); }}
                style={{
                  padding: '8px',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.82rem',
                  fontWeight: authMode === 'register' ? 700 : 500,
                  background: authMode === 'register' ? 'var(--primary)' : 'transparent',
                  color: authMode === 'register' ? '#fff' : 'var(--text-muted)',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                Create Account
              </button>
            </div>
          )}
        </div>

        {/* Modal Body */}
        <div style={{ padding: '24px 28px 28px' }}>

          {/* Error Message Alert */}
          {errorMsg && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 14px',
              borderRadius: 'var(--radius-sm)',
              background: 'rgba(239, 68, 68, 0.15)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              color: '#fca5a5',
              fontSize: '0.82rem',
              marginBottom: '16px'
            }}>
              <AlertCircle size={16} color="#ef4444" style={{ flexShrink: 0 }} />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* MODE 1: LOGIN FORM */}
          {authMode === 'login' && (
            <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
                  Gmail Address
                </label>
                <div style={{ position: 'relative' }}>
                  <Mail size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input
                    type="email"
                    name="email"
                    required
                    placeholder="student@gmail.com"
                    value={formData.email}
                    onChange={handleChange}
                    style={{
                      width: '100%',
                      padding: '10px 12px 10px 38px',
                      borderRadius: 'var(--radius-sm)',
                      background: 'rgba(0,0,0,0.25)',
                      border: '1px solid var(--border-color)',
                      color: 'var(--text-light)',
                      fontSize: '0.88rem'
                    }}
                  />
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Password</label>
                  <button 
                    type="button" 
                    onClick={() => { setAuthMode('forgot_password'); setErrorMsg(''); }}
                    style={{ background: 'none', border: 'none', color: '#818cf8', fontSize: '0.75rem', cursor: 'pointer', padding: 0 }}
                  >
                    Forgot Password?
                  </button>
                </div>
                <div style={{ position: 'relative' }}>
                  <Lock size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    required
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    style={{
                      width: '100%',
                      padding: '10px 38px 10px 38px',
                      borderRadius: 'var(--radius-sm)',
                      background: 'rgba(0,0,0,0.25)',
                      border: '1px solid var(--border-color)',
                      color: 'var(--text-light)',
                      fontSize: '0.88rem'
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: 'absolute',
                      right: '10px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      color: 'var(--text-muted)',
                      cursor: 'pointer',
                      padding: '4px',
                      display: 'flex',
                      alignItems: 'center'
                    }}
                    title={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '6px' }}>
                <LogIn size={16} />
                <span>Sign In to Account</span>
              </button>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', margin: '8px 0', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                <div style={{ flex: 1, height: '1px', background: 'var(--border-color)' }}></div>
                <span>OR FAST DEMO</span>
                <div style={{ flex: 1, height: '1px', background: 'var(--border-color)' }}></div>
              </div>

              <button 
                type="button" 
                onClick={handleDemoLogin} 
                className="btn btn-secondary" 
                style={{ width: '100%', fontSize: '0.82rem' }}
              >
                <Sparkles size={14} color="#34d399" />
                <span>Log in as Demo Student (Aamir Hassan)</span>
              </button>
            </form>
          )}

          {/* MODE 2: REGISTER FORM */}
          {authMode === 'register' && (
            <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>Full Name</label>
                <div style={{ position: 'relative' }}>
                  <User size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input
                    type="text"
                    name="name"
                    required
                    placeholder="Aamir Hassan"
                    value={formData.name}
                    onChange={handleChange}
                    style={{
                      width: '100%',
                      padding: '10px 12px 10px 38px',
                      borderRadius: 'var(--radius-sm)',
                      background: 'rgba(0,0,0,0.25)',
                      border: '1px solid var(--border-color)',
                      color: 'var(--text-light)',
                      fontSize: '0.88rem'
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>Gmail Address</label>
                <div style={{ position: 'relative' }}>
                  <Mail size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input
                    type="email"
                    name="email"
                    required
                    placeholder="yourname@gmail.com"
                    value={formData.email}
                    onChange={handleChange}
                    style={{
                      width: '100%',
                      padding: '10px 12px 10px 38px',
                      borderRadius: 'var(--radius-sm)',
                      background: 'rgba(0,0,0,0.25)',
                      border: '1px solid var(--border-color)',
                      color: 'var(--text-light)',
                      fontSize: '0.88rem'
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>Mobile Number</label>
                <div style={{ position: 'relative' }}>
                  <Phone size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input
                    type="tel"
                    name="phone"
                    placeholder="+91 98765 43210"
                    value={formData.phone}
                    onChange={handleChange}
                    style={{
                      width: '100%',
                      padding: '10px 12px 10px 38px',
                      borderRadius: 'var(--radius-sm)',
                      background: 'rgba(0,0,0,0.25)',
                      border: '1px solid var(--border-color)',
                      color: 'var(--text-light)',
                      fontSize: '0.88rem'
                    }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>Password</label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      required
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={handleChange}
                      style={{
                        width: '100%',
                        padding: '10px 30px 10px 10px',
                        borderRadius: 'var(--radius-sm)',
                        background: 'rgba(0,0,0,0.25)',
                        border: '1px solid var(--border-color)',
                        color: 'var(--text-light)',
                        fontSize: '0.88rem'
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      style={{
                        position: 'absolute',
                        right: '6px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        background: 'none',
                        border: 'none',
                        color: 'var(--text-muted)',
                        cursor: 'pointer',
                        padding: '2px',
                        display: 'flex',
                        alignItems: 'center'
                      }}
                    >
                      {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  </div>
                </div>
                <div>
                  <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>Confirm</label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      required
                      placeholder="••••••••"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      style={{
                        width: '100%',
                        padding: '10px 30px 10px 10px',
                        borderRadius: 'var(--radius-sm)',
                        background: 'rgba(0,0,0,0.25)',
                        border: '1px solid var(--border-color)',
                        color: 'var(--text-light)',
                        fontSize: '0.88rem'
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      style={{
                        position: 'absolute',
                        right: '6px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        background: 'none',
                        border: 'none',
                        color: 'var(--text-muted)',
                        cursor: 'pointer',
                        padding: '2px',
                        display: 'flex',
                        alignItems: 'center'
                      }}
                    >
                      {showConfirmPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  </div>
                </div>
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '8px' }}>
                <span>Send Gmail OTP & Verify</span>
                <ArrowRight size={16} />
              </button>
            </form>
          )}

          {/* MODE 3: GMAIL OTP VERIFICATION SCREEN */}
          {authMode === 'otp_verify' && (
            <form onSubmit={handleOtpSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{
                background: 'linear-gradient(135deg, rgba(234, 67, 53, 0.22) 0%, rgba(66, 133, 244, 0.22) 100%)',
                border: '1px solid rgba(234, 67, 53, 0.5)',
                padding: '16px',
                borderRadius: '16px',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{
                      background: '#ea4335',
                      color: 'white',
                      fontWeight: 900,
                      fontSize: '0.7rem',
                      padding: '3px 8px',
                      borderRadius: '4px',
                      letterSpacing: '1px'
                    }}>
                      GMAIL NOTIFICATION
                    </div>
                    <span style={{ fontSize: '0.78rem', color: '#34d399', fontWeight: 600 }}>📨 Dispatched to Gmail</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => setOtpCode(pendingOtp?.code || '')}
                    className="btn btn-secondary btn-sm"
                    style={{ fontSize: '0.72rem', padding: '3px 8px', background: 'rgba(52, 211, 153, 0.15)', color: '#34d399', border: '1px solid rgba(52, 211, 153, 0.4)' }}
                  >
                    ⚡ Auto-Fill Code
                  </button>
                </div>

                <div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-light)' }}>
                    Original Gmail Verification Code
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                    Destination: <strong>{pendingOtp?.email}</strong>
                  </div>
                  <div style={{ 
                    fontSize: '1.4rem', 
                    fontWeight: 900, 
                    letterSpacing: '6px', 
                    color: '#38bdf8', 
                    background: 'rgba(0,0,0,0.6)', 
                    padding: '6px 14px', 
                    borderRadius: '8px', 
                    display: 'inline-block',
                    marginTop: '8px',
                    border: '1px solid rgba(56, 189, 248, 0.3)'
                  }}>
                    {pendingOtp?.code}
                  </div>
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block', marginBottom: '8px', textAlign: 'center' }}>
                  Enter 6-Digit OTP Code
                </label>
                <input
                  type="text"
                  maxLength={6}
                  required
                  placeholder="654321"
                  value={otpCode}
                  onChange={(e) => { setOtpCode(e.target.value.replace(/\D/g, '')); setErrorMsg(''); }}
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: 'var(--radius-sm)',
                    background: 'rgba(0,0,0,0.3)',
                    border: '2px solid var(--border-active)',
                    color: '#38bdf8',
                    fontSize: '1.6rem',
                    fontWeight: 800,
                    letterSpacing: '8px',
                    textAlign: 'center'
                  }}
                />
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                <CheckCircle2 size={18} />
                <span>Verify OTP & Sign In</span>
              </button>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                <span>Expires in: <strong style={{ color: timer > 0 ? '#38bdf8' : '#ef4444' }}>{timer}s</strong></span>
                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={timer > 0}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: timer > 0 ? 'var(--text-muted)' : '#818cf8',
                    cursor: timer > 0 ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  <RefreshCw size={12} />
                  <span>Resend OTP</span>
                </button>
              </div>
            </form>
          )}

          {/* MODE 4: FORGOT PASSWORD (EMAIL INPUT) */}
          {authMode === 'forgot_password' && (
            <form onSubmit={handleForgotPasswordSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>Registered Gmail Address</label>
                <div style={{ position: 'relative' }}>
                  <Mail size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input
                    type="email"
                    required
                    placeholder="user@gmail.com"
                    value={formData.email}
                    onChange={handleChange}
                    name="email"
                    style={{
                      width: '100%',
                      padding: '10px 12px 10px 38px',
                      borderRadius: 'var(--radius-sm)',
                      background: 'rgba(0,0,0,0.25)',
                      border: '1px solid var(--border-color)',
                      color: 'var(--text-light)',
                      fontSize: '0.88rem'
                    }}
                  />
                </div>
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                <span>Send Reset OTP to Gmail</span>
                <ArrowRight size={16} />
              </button>

              <button
                type="button"
                onClick={() => setAuthMode('login')}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '0.78rem', cursor: 'pointer', textAlign: 'center' }}
              >
                Back to Sign In
              </button>
            </form>
          )}

          {/* MODE 5: RESET PASSWORD FORM */}
          {authMode === 'reset_password' && (
            <form onSubmit={handleResetPasswordSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>New Password</label>
                <div style={{ position: 'relative' }}>
                  <Lock size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="••••••••"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 38px 10px 38px',
                      borderRadius: 'var(--radius-sm)',
                      background: 'rgba(0,0,0,0.25)',
                      border: '1px solid var(--border-color)',
                      color: 'var(--text-light)',
                      fontSize: '0.88rem'
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: 'absolute',
                      right: '10px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      color: 'var(--text-muted)',
                      cursor: 'pointer',
                      padding: '4px',
                      display: 'flex',
                      alignItems: 'center'
                    }}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>Confirm New Password</label>
                <div style={{ position: 'relative' }}>
                  <Lock size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    required
                    placeholder="••••••••"
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 38px 10px 38px',
                      borderRadius: 'var(--radius-sm)',
                      background: 'rgba(0,0,0,0.25)',
                      border: '1px solid var(--border-color)',
                      color: 'var(--text-light)',
                      fontSize: '0.88rem'
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    style={{
                      position: 'absolute',
                      right: '10px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      color: 'var(--text-muted)',
                      cursor: 'pointer',
                      padding: '4px',
                      display: 'flex',
                      alignItems: 'center'
                    }}
                  >
                    {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                <KeyRound size={16} />
                <span>Save New Password & Sign In</span>
              </button>
            </form>
          )}

        </div>
      </div>
    </div>
  );
};
