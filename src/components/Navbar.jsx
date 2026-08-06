import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  UserCheck, Compass, Map, FileText, Award, 
  GraduationCap, Briefcase, Bot, LayoutDashboard, Sparkles, LogIn, LogOut, KeyRound, ShieldCheck, ChevronDown, User
} from 'lucide-react';

export const Navbar = () => {
  const { activeTab, setActiveTab, studentProfile, currentUser, openAuthModal, logoutUser } = useApp();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const navItems = [
    { id: 'onboarding', label: 'Student Profile', icon: UserCheck },
    { id: 'careers', label: 'AI Careers', icon: Compass },
    { id: 'skillgap', label: 'Skill Gap & Roadmap', icon: Map },
    { id: 'resume', label: 'Resume ATS Analyzer', icon: FileText },
    { id: 'scholarships', label: 'Scholarships', icon: Award },
    { id: 'colleges', label: 'Colleges', icon: GraduationCap },
    { id: 'internships', label: 'Internships', icon: Briefcase },
    { id: 'chatbot', label: 'AI Mentor', icon: Bot, badge: 'Live' },
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard }
  ];

  return (
    <header className="glass-card" style={{ borderRadius: 0, borderTop: 0, borderLeft: 0, borderRight: 0, position: 'sticky', top: 0, zIndex: 100 }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '12px 24px' }}>
        {/* Top Header Row */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px', flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ 
              width: '42px', 
              height: '42px', 
              borderRadius: '12px', 
              background: 'linear-gradient(135deg, #6366f1 0%, #06b6d4 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 15px rgba(99, 102, 241, 0.5)'
            }}>
              <Sparkles size={24} color="#fff" />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h1 style={{ fontSize: '1.35rem', fontWeight: 800 }} className="gradient-text">
                  MargDarshak AI
                </h1>
                <span className="badge badge-indigo">SIH25094</span>
                <span className="badge badge-cyan" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  Smart Education Portal
                </span>
              </div>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                One-Stop Personalized Career & Education Advisor
              </p>
            </div>
          </div>

          {/* Student Profile Quick Badge / Auth Buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', position: 'relative' }}>
            {currentUser && currentUser.isAuthenticated ? (
              <div style={{ position: 'relative' }}>
                <div 
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    background: 'rgba(255, 255, 255, 0.06)',
                    padding: '6px 14px',
                    borderRadius: 'var(--radius-full)',
                    border: '1px solid var(--border-color)',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                  className="glass-card-interactive"
                >
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 'bold',
                    fontSize: '0.85rem',
                    color: '#fff',
                    position: 'relative'
                  }}>
                    {currentUser.avatar || currentUser.name.charAt(0)}
                    <span style={{
                      position: 'absolute',
                      bottom: 0,
                      right: 0,
                      width: '9px',
                      height: '9px',
                      borderRadius: '50%',
                      background: '#34d399',
                      border: '2px solid #0f172a'
                    }} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.82rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <span>{currentUser.name}</span>
                      <ChevronDown size={14} color="var(--text-muted)" />
                    </div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--accent-cyan)' }}>
                      {currentUser.emailVerified ? '✓ Verified Student' : studentProfile.educationLevel}
                    </div>
                  </div>
                </div>

                {/* Profile Dropdown Menu */}
                {dropdownOpen && (
                  <div style={{
                    position: 'absolute',
                    top: 'calc(100% + 8px)',
                    right: 0,
                    width: '220px',
                    background: 'rgba(15, 23, 42, 0.95)',
                    backdropFilter: 'blur(16px)',
                    borderRadius: '16px',
                    border: '1px solid var(--border-color)',
                    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)',
                    padding: '8px',
                    zIndex: 200,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px'
                  }} className="animate-fade-in">
                    <div style={{ padding: '8px 12px', borderBottom: '1px solid var(--border-color)', marginBottom: '4px' }}>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Signed in as</div>
                      <div style={{ fontSize: '0.82rem', fontWeight: 700, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {currentUser.email}
                      </div>
                    </div>

                    <button
                      onClick={() => { setActiveTab('onboarding'); setDropdownOpen(false); }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '8px 12px',
                        borderRadius: 'var(--radius-sm)',
                        fontSize: '0.82rem',
                        color: 'var(--text-light)',
                        background: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        textAlign: 'left'
                      }}
                      className="btn-hover-highlight"
                    >
                      <User size={15} color="#818cf8" />
                      <span>Student Dashboard</span>
                    </button>

                    <button
                      onClick={() => { openAuthModal('forgot_password'); setDropdownOpen(false); }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '8px 12px',
                        borderRadius: 'var(--radius-sm)',
                        fontSize: '0.82rem',
                        color: 'var(--text-light)',
                        background: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        textAlign: 'left'
                      }}
                    >
                      <KeyRound size={15} color="#34d399" />
                      <span>Reset Password</span>
                    </button>

                    <div style={{ height: '1px', background: 'var(--border-color)', margin: '4px 0' }} />

                    <button
                      onClick={() => { logoutUser(); setDropdownOpen(false); }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '8px 12px',
                        borderRadius: 'var(--radius-sm)',
                        fontSize: '0.82rem',
                        color: '#fca5a5',
                        background: 'rgba(239, 68, 68, 0.15)',
                        border: '1px solid rgba(239, 68, 68, 0.3)',
                        cursor: 'pointer',
                        textAlign: 'left',
                        fontWeight: 600
                      }}
                    >
                      <LogOut size={15} color="#ef4444" />
                      <span>Sign Out & View Login Page</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={() => openAuthModal('login')}
                  className="btn btn-secondary btn-sm"
                  style={{ fontSize: '0.82rem', padding: '6px 14px' }}
                >
                  <LogIn size={14} />
                  <span>Sign In</span>
                </button>

                <button
                  onClick={() => openAuthModal('register')}
                  className="btn btn-primary btn-sm"
                  style={{ fontSize: '0.82rem', padding: '6px 14px' }}
                >
                  <ShieldCheck size={14} />
                  <span>Register Account</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Horizontal Scroll Navigation Bar */}
        <nav style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 16px',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.85rem',
                  fontWeight: isActive ? 600 : 500,
                  whiteSpace: 'nowrap',
                  border: isActive ? '1px solid var(--border-active)' : '1px solid transparent',
                  background: isActive ? 'rgba(99, 102, 241, 0.15)' : 'rgba(255, 255, 255, 0.02)',
                  color: isActive ? '#a5b4fc' : 'var(--text-muted)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                <Icon size={16} color={isActive ? '#818cf8' : 'var(--text-muted)'} />
                <span>{item.label}</span>
                {item.badge && (
                  <span style={{ 
                    fontSize: '0.65rem', 
                    background: 'var(--secondary)', 
                    color: 'white', 
                    padding: '1px 6px', 
                    borderRadius: '99px',
                    fontWeight: 700
                  }}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};

