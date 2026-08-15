import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Logo3D } from './Logo3D';
import { LanguageSelector } from './LanguageSelector';
import { ThemeToggle } from './ThemeToggle';
import {
  UserCheck, Compass, Map, FileText, Award,
  GraduationCap, Briefcase, Bot, LayoutDashboard, LogIn, LogOut, KeyRound, ShieldCheck, ChevronDown, User
} from 'lucide-react';

export const Navbar = () => {
  const { activeTab, setActiveTab, studentProfile, currentUser, openAuthModal, logoutUser, t } = useApp();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const navItems = [
    { id: 'dashboard', label: t('dashboard', 'Dashboard'), icon: LayoutDashboard },
    { id: 'careers', label: t('ai_careers', 'AI Careers'), icon: Compass },
    { id: 'skillgap', label: t('skill_gap', 'Skill Gap & Roadmap'), icon: Map },
    { id: 'resume', label: t('resume_ats', 'Resume ATS Analyzer'), icon: FileText },
    { id: 'scholarships', label: t('scholarships', 'Scholarships'), icon: Award },
    { id: 'colleges', label: t('colleges', 'Colleges'), icon: GraduationCap },
    { id: 'internships', label: t('internships', 'Internships'), icon: Briefcase },
    { id: 'chatbot', label: t('ai_mentor', 'AI Mentor'), icon: Bot, badge: 'Live' }
  ];

  return (
    <header className="glass-card" style={{ borderRadius: 0, borderTop: 0, borderLeft: 0, borderRight: 0, position: 'sticky', top: 0, zIndex: 100 }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '12px 24px' }}>
        {/* Top Header Row */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px', flexWrap: 'wrap', gap: '12px' }}>
          
          {/* 3D Colorful Artistic Logo & Branding */}
          <Logo3D size="medium" showText={true} />

          {/* Controls: Language Selector + Dark/Light Theme Switcher + Auth Buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', position: 'relative', flexWrap: 'wrap' }}>
            <LanguageSelector />
            <ThemeToggle />

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
                      {currentUser.emailVerified ? t('verified_student', '✓ Verified Student') : studentProfile.educationLevel}
                    </div>
                  </div>
                </div>

                {/* Profile Dropdown Menu */}
                {dropdownOpen && (
                  <div style={{
                    position: 'absolute',
                    top: 'calc(100% + 10px)',
                    right: 0,
                    width: '260px',
                    background: 'var(--bg-card)',
                    backdropFilter: 'blur(20px)',
                    WebkitBackdropFilter: 'blur(20px)',
                    borderRadius: '16px',
                    border: '1px solid var(--border-active)',
                    boxShadow: '0 12px 36px rgba(0, 0, 0, 0.4), 0 0 20px rgba(99, 102, 241, 0.25)',
                    padding: '10px',
                    zIndex: 200,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '6px'
                  }} className="animate-fade-in">
                    {/* Header Info Banner */}
                    <div style={{
                      padding: '10px 12px',
                      background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(236, 72, 153, 0.12) 100%)',
                      borderRadius: '12px',
                      marginBottom: '4px',
                      border: '1px solid var(--border-color)'
                    }}>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 500 }}>{t('signed_in_as', 'Signed in as')}</div>
                      <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {currentUser.email}
                      </div>
                    </div>

                    {/* Menu Item 1: Student Dashboard */}
                    <button
                      onClick={() => { setActiveTab('onboarding'); setDropdownOpen(false); }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        padding: '10px 12px',
                        borderRadius: '10px',
                        fontSize: '0.85rem',
                        fontWeight: 600,
                        color: 'var(--text-main)',
                        background: 'rgba(99, 102, 241, 0.08)',
                        border: '1px solid transparent',
                        cursor: 'pointer',
                        textAlign: 'left',
                        transition: 'all 0.2s ease'
                      }}
                      className="glass-card-interactive"
                    >
                      <div style={{
                        width: '30px',
                        height: '30px',
                        borderRadius: '8px',
                        background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 0 10px rgba(99, 102, 241, 0.4)',
                        flexShrink: 0
                      }}>
                        <User size={16} color="#ffffff" />
                      </div>
                      <span>{t('student_dashboard', 'Student Dashboard')}</span>
                    </button>

                    {/* Menu Item 2: Reset Password */}
                    <button
                      onClick={() => { openAuthModal('forgot_password'); setDropdownOpen(false); }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        padding: '10px 12px',
                        borderRadius: '10px',
                        fontSize: '0.85rem',
                        fontWeight: 600,
                        color: 'var(--text-main)',
                        background: 'rgba(16, 185, 129, 0.08)',
                        border: '1px solid transparent',
                        cursor: 'pointer',
                        textAlign: 'left',
                        transition: 'all 0.2s ease'
                      }}
                      className="glass-card-interactive"
                    >
                      <div style={{
                        width: '30px',
                        height: '30px',
                        borderRadius: '8px',
                        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 0 10px rgba(16, 185, 129, 0.4)',
                        flexShrink: 0
                      }}>
                        <KeyRound size={16} color="#ffffff" />
                      </div>
                      <span>{t('reset_password', 'Reset Password')}</span>
                    </button>

                    <div style={{ height: '1px', background: 'var(--border-color)', margin: '4px 0' }} />

                    {/* Menu Item 3: Sign Out */}
                    <button
                      onClick={() => { logoutUser(); setDropdownOpen(false); }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        padding: '10px 12px',
                        borderRadius: '10px',
                        fontSize: '0.85rem',
                        fontWeight: 700,
                        color: '#ffffff',
                        background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                        border: 'none',
                        boxShadow: '0 4px 14px rgba(239, 68, 68, 0.35)',
                        cursor: 'pointer',
                        textAlign: 'left',
                        transition: 'all 0.2s ease'
                      }}
                      className="glass-card-interactive"
                    >
                      <div style={{
                        width: '30px',
                        height: '30px',
                        borderRadius: '8px',
                        background: 'rgba(255, 255, 255, 0.2)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}>
                        <LogOut size={16} color="#ffffff" />
                      </div>
                      <span>{t('sign_out_view_login', 'Sign Out & View Login Page')}</span>
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
                  <span>{t('tab_sign_in', 'Sign In')}</span>
                </button>

                <button
                  onClick={() => openAuthModal('register')}
                  className="btn btn-primary btn-sm"
                  style={{ fontSize: '0.82rem', padding: '6px 14px' }}
                >
                  <ShieldCheck size={14} />
                  <span>{t('register', 'Register Account')}</span>
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
                  fontWeight: isActive ? 700 : 500,
                  whiteSpace: 'nowrap',
                  border: isActive ? '1px solid var(--border-active)' : '1px solid transparent',
                  background: isActive 
                    ? 'linear-gradient(135deg, rgba(99, 102, 241, 0.25) 0%, rgba(6, 182, 212, 0.15) 100%)' 
                    : 'rgba(255, 255, 255, 0.02)',
                  color: isActive ? 'var(--text-main)' : 'var(--text-muted)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  boxShadow: isActive ? '0 4px 14px rgba(99, 102, 241, 0.2)' : 'none'
                }}
                className="glass-card-interactive"
              >
                <Icon size={16} color={isActive ? 'var(--primary)' : 'var(--text-muted)'} />
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

