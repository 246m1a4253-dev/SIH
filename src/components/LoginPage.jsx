import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Logo3D } from './Logo3D';
import { LanguageSelector } from './LanguageSelector';
import { ThemeToggle } from './ThemeToggle';
import { 
  Mail, Lock, User, Phone, ShieldCheck, KeyRound, 
  ArrowRight, RefreshCw, CheckCircle2, AlertCircle, Sparkles, LogIn, Compass, Map, FileText, Award, GraduationCap, Briefcase, Eye, EyeOff
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const LoginPage = () => {
  const { 
    loginUser, 
    registerUser, 
    verifyOtp, 
    resendOtp, 
    sendForgotPasswordOtp, 
    resetPassword,
    pendingOtp,
    t
  } = useApp();

  const [mode, setMode] = useState('login'); // 'login' | 'register' | 'otp_verify' | 'forgot_password' | 'reset_password'

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

  useEffect(() => {
    let interval = null;
    if (mode === 'otp_verify' && timer > 0) {
      interval = setInterval(() => {
        setTimer(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [mode, timer]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrorMsg('');
  };

  // 1. Handle Login
  const handleLogin = (e) => {
    e.preventDefault();
    setErrorMsg('');
    try {
      loginUser({ email: formData.email, password: formData.password });
      confetti({ particleCount: 60, spread: 70, origin: { y: 0.5 } });
    } catch (err) {
      setErrorMsg(err.message);
    }
  };

  // 2. Fast Demo Access
  const handleDemoLogin = () => {
    try {
      loginUser({ email: 'aamir.hassan@gmail.com', password: 'password123' });
      confetti({ particleCount: 70, spread: 70, origin: { y: 0.5 } });
    } catch (err) {
      setErrorMsg(err.message);
    }
  };

  // 3. Handle Registration
  const handleRegister = (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!formData.name.trim()) {
      setErrorMsg('Please enter your full name.');
      return;
    }
    if (!formData.email.includes('@')) {
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
      setMode('otp_verify');
      setOtpCode('');
      setTimer(60);
      setSuccessMsg(`Verification code sent to ${formData.email}!`);
    } catch (err) {
      setErrorMsg(err.message);
    }
  };

  // 4. Handle OTP Verification
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
        confetti({ particleCount: 90, spread: 80, origin: { y: 0.5 } });
      }
    } catch (err) {
      setErrorMsg(err.message);
    }
  };

  // 5. Handle Resend OTP
  const handleResendOtp = () => {
    setErrorMsg('');
    const newCode = resendOtp();
    if (newCode) {
      setTimer(60);
      setSuccessMsg(`New OTP code sent! (${newCode})`);
    }
  };

  // 6. Handle Forgot Password Trigger
  const handleForgotPasswordSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');
    if (!formData.email.trim()) {
      setErrorMsg('Please enter your registered Gmail address.');
      return;
    }

    try {
      sendForgotPasswordOtp(formData.email);
      setMode('otp_verify');
      setTimer(60);
      setOtpCode('');
      setSuccessMsg(`Reset OTP sent to ${formData.email}.`);
    } catch (err) {
      setErrorMsg(err.message);
    }
  };

  // 7. Handle Password Reset Final Submit
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
      confetti({ particleCount: 80, spread: 70, origin: { y: 0.5 } });
    } catch (err) {
      setErrorMsg(err.message);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      width: '100%',
      background: 'var(--bg-dark)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px 16px',
      position: 'relative',
      overflow: 'hidden'
    }}>

      {/* Top Header Control Bar for Language & Dark/Light Theme */}
      <div style={{
        position: 'absolute',
        top: '20px',
        right: '24px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        zIndex: 50
      }}>
        <LanguageSelector />
        <ThemeToggle />
      </div>

      {/* Decorative Glow Elements */}
      <div style={{
        position: 'absolute',
        top: '-150px',
        left: '20%',
        width: '400px',
        height: '400px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(99, 102, 241, 0.25) 0%, rgba(0,0,0,0) 70%)',
        filter: 'blur(40px)',
        pointerEvents: 'none'
      }} />

      <div style={{
        position: 'absolute',
        bottom: '-150px',
        right: '20%',
        width: '400px',
        height: '400px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(6, 182, 212, 0.2) 0%, rgba(0,0,0,0) 70%)',
        filter: 'blur(40px)',
        pointerEvents: 'none'
      }} />

      {/* Main Container */}
      <div style={{
        maxWidth: '1100px',
        width: '100%',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '32px',
        alignItems: 'center',
        zIndex: 10
      }} className="animate-fade-in responsive-grid">

        {/* Left Side: Branding & Features Showcase */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <Logo3D size="large" showText={true} />

          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, lineHeight: 1.3, color: '#f8fafc' }}>
            One-Stop AI Career, Scholarship & College Recommendation Platform
          </h2>

          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.5 }}>
            Sign in with your verified Gmail account to access personalized career roadmaps, college predictors, ATS resume scoring, and official Government of India internships.
          </p>

          {/* Feature Badges Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '10px' }}>
            <div className="glass-card" style={{ padding: '14px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Compass color="#818cf8" size={20} />
              <div style={{ fontSize: '0.82rem', fontWeight: 600 }}>AI Career Matcher</div>
            </div>
            <div className="glass-card" style={{ padding: '14px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Map color="#22d3ee" size={20} />
              <div style={{ fontSize: '0.82rem', fontWeight: 600 }}>Skill Gap Roadmap</div>
            </div>
            <div className="glass-card" style={{ padding: '14px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Award color="#f472b6" size={20} />
              <div style={{ fontSize: '0.82rem', fontWeight: 600 }}>Govt Scholarships</div>
            </div>
            <div className="glass-card" style={{ padding: '14px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Briefcase color="#34d399" size={20} />
              <div style={{ fontSize: '0.82rem', fontWeight: 600 }}>🇮🇳 PM & Govt Internships</div>
            </div>
          </div>
        </div>

        {/* Right Side: Interactive Login / Register Card */}
        <div className="glass-card" style={{
          padding: '32px',
          borderRadius: '24px',
          boxShadow: 'var(--shadow-card)',
          border: '1px solid var(--border-color)',
          background: 'var(--bg-card)',
          backdropFilter: 'blur(20px)'
        }}>

          {/* Mode Switcher Tabs */}
          {(mode === 'login' || mode === 'register') && (
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '6px',
              marginBottom: '20px',
              background: 'var(--bg-card-hover)',
              padding: '6px',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border-color)'
            }}>
              <button
                onClick={() => { setMode('login'); setErrorMsg(''); }}
                style={{
                  padding: '10px',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.88rem',
                  fontWeight: mode === 'login' ? 700 : 600,
                  background: mode === 'login' ? 'var(--primary)' : 'transparent',
                  color: mode === 'login' ? '#ffffff' : 'var(--text-muted)',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                Sign In
              </button>
              <button
                onClick={() => { setMode('register'); setErrorMsg(''); }}
                style={{
                  padding: '10px',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.88rem',
                  fontWeight: mode === 'register' ? 700 : 600,
                  background: mode === 'register' ? 'var(--primary)' : 'transparent',
                  color: mode === 'register' ? '#ffffff' : 'var(--text-muted)',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                Create Account
              </button>
            </div>
          )}

          {/* Error Message Banner */}
          {errorMsg && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 14px',
              borderRadius: 'var(--radius-sm)',
              background: 'rgba(239, 68, 68, 0.15)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              color: '#ef4444',
              fontWeight: 600,
              fontSize: '0.82rem',
              marginBottom: '16px'
            }}>
              <AlertCircle size={16} color="#ef4444" style={{ flexShrink: 0 }} />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* MODE 1: LOGIN FORM */}
          {mode === 'login' && (
            <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-main)', display: 'block', marginBottom: '6px' }}>
                  Gmail Address
                </label>
                <div style={{ position: 'relative' }}>
                  <Mail size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--primary)' }} />
                  <input
                    type="email"
                    name="email"
                    required
                    placeholder="student@gmail.com"
                    value={formData.email}
                    onChange={handleChange}
                    className="input-field"
                    style={{
                      paddingLeft: '38px',
                      fontSize: '0.9rem'
                    }}
                  />
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-main)' }}>Password</label>
                  <button 
                    type="button" 
                    onClick={() => { setMode('forgot_password'); setErrorMsg(''); }}
                    style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: 600, fontSize: '0.78rem', cursor: 'pointer', padding: 0 }}
                  >
                    Forgot Password?
                  </button>
                </div>
                <div style={{ position: 'relative' }}>
                  <Lock size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--primary)' }} />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    required
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    className="input-field"
                    style={{
                      paddingLeft: '38px',
                      paddingRight: '38px',
                      fontSize: '0.9rem'
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

              <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '12px', marginTop: '6px', fontSize: '0.92rem', fontWeight: 700 }}>
                <LogIn size={18} />
                <span>Sign In to Platform</span>
              </button>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', margin: '12px 0', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>
                <div style={{ flex: 1, height: '1px', background: 'var(--border-color)' }}></div>
                <span>EVALUATION DEMO ACCESS</span>
                <div style={{ flex: 1, height: '1px', background: 'var(--border-color)' }}></div>
              </div>

              <button 
                type="button" 
                onClick={handleDemoLogin} 
                className="btn btn-secondary glass-card-interactive" 
                style={{
                  width: '100%',
                  padding: '12px',
                  fontSize: '0.88rem',
                  fontWeight: 700,
                  background: 'var(--bg-card-hover)',
                  border: '1px solid var(--border-active)',
                  color: 'var(--text-main)'
                }}
              >
                <Sparkles size={16} color="var(--primary)" />
                <span>1-Click Demo Access (Aamir Hassan)</span>
              </button>
            </form>
          )}

          {/* MODE 2: REGISTER FORM */}
          {mode === 'register' && (
            <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-main)', display: 'block', marginBottom: '6px' }}>Full Name</label>
                <div style={{ position: 'relative' }}>
                  <User size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--primary)' }} />
                  <input
                    type="text"
                    name="name"
                    required
                    placeholder="Aamir Hassan"
                    value={formData.name}
                    onChange={handleChange}
                    className="input-field"
                    style={{
                      paddingLeft: '38px',
                      fontSize: '0.9rem'
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-main)', display: 'block', marginBottom: '6px' }}>Gmail Address</label>
                <div style={{ position: 'relative' }}>
                  <Mail size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--primary)' }} />
                  <input
                    type="email"
                    name="email"
                    required
                    placeholder="yourname@gmail.com"
                    value={formData.email}
                    onChange={handleChange}
                    className="input-field"
                    style={{
                      paddingLeft: '38px',
                      fontSize: '0.9rem'
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-main)', display: 'block', marginBottom: '6px' }}>Mobile Number</label>
                <div style={{ position: 'relative' }}>
                  <Phone size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--primary)' }} />
                  <input
                    type="tel"
                    name="phone"
                    placeholder="+91 98765 43210"
                    value={formData.phone}
                    onChange={handleChange}
                    className="input-field"
                    style={{
                      paddingLeft: '38px',
                      fontSize: '0.9rem'
                    }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-main)', display: 'block', marginBottom: '6px' }}>Password</label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      required
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={handleChange}
                      className="input-field"
                      style={{
                        paddingRight: '32px',
                        fontSize: '0.9rem'
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      style={{
                        position: 'absolute',
                        right: '8px',
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
                  <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-main)', display: 'block', marginBottom: '6px' }}>Confirm</label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      required
                      placeholder="••••••••"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className="input-field"
                      style={{
                        paddingRight: '32px',
                        fontSize: '0.9rem'
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      style={{
                        position: 'absolute',
                        right: '8px',
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

              <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '12px', marginTop: '6px', fontWeight: 700 }}>
                <span>Send Gmail OTP Code</span>
                <ArrowRight size={16} />
              </button>
            </form>
          )}

          {/* MODE 3: GMAIL OTP VERIFICATION SCREEN */}
          {mode === 'otp_verify' && (
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
                    fontSize: '1.5rem', 
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
                  Enter 6-Digit OTP Code Below
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

              <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '12px' }}>
                <CheckCircle2 size={18} />
                <span>Verify OTP & Unlock App</span>
              </button>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                <span>OTP Timeout: <strong style={{ color: timer > 0 ? '#38bdf8' : '#ef4444' }}>{timer}s</strong></span>
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
                  <span>Resend OTP Code</span>
                </button>
              </div>
            </form>
          )}

          {/* MODE 4: FORGOT PASSWORD */}
          {mode === 'forgot_password' && (
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

              <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '12px' }}>
                <span>Send Reset OTP to Gmail</span>
                <ArrowRight size={16} />
              </button>

              <button
                type="button"
                onClick={() => setMode('login')}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '0.78rem', cursor: 'pointer', textAlign: 'center' }}
              >
                Back to Sign In
              </button>
            </form>
          )}

        </div>
      </div>
    </div>
  );
};
