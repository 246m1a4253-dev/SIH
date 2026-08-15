import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { User, GraduationCap, Award, Heart, Sparkles, CheckCircle2, Plus, X, ArrowRight, ShieldCheck, Mail, KeyRound, LogIn } from 'lucide-react';
import confetti from 'canvas-confetti';

const POPULAR_SKILLS = [
  'Python', 'Machine Learning', 'SQL', 'JavaScript', 'React.js',
  'Data Structures', 'Git', 'Deep Learning', 'Statistics', 'Docker',
  'Networking', 'Public Speaking', 'Biology', 'Clinical Care', 'Indian Polity'
];

const POPULAR_INTERESTS = [
  'Artificial Intelligence', 'Coding', 'Data Science', 'Problem Solving',
  'Healthcare & Medicine', 'Public Policy', 'Cybersecurity', 'Web Development',
  'Robotics', 'Civil Services', 'Law & Ethics'
];

export const ProfileOnboarding = () => {
  const { studentProfile, setStudentProfile, setActiveTab, currentUser, openAuthModal, t } = useApp();

  const [newSkill, setNewSkill] = useState('');
  const [newInterest, setNewInterest] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleInputChange = (field, value) => {
    setStudentProfile(prev => ({ ...prev, [field]: value }));
  };

  const addSkill = (skillToAdd) => {
    const val = skillToAdd || newSkill.trim();
    if (val && !studentProfile.skills.includes(val)) {
      setStudentProfile(prev => ({
        ...prev,
        skills: [...prev.skills, val]
      }));
      setNewSkill('');
    }
  };

  const removeSkill = (skillToRemove) => {
    setStudentProfile(prev => ({
      ...prev,
      skills: prev.skills.filter(s => s !== skillToRemove)
    }));
  };

  const addInterest = (interestToAdd) => {
    const val = interestToAdd || newInterest.trim();
    if (val && !studentProfile.interests.includes(val)) {
      setStudentProfile(prev => ({
        ...prev,
        interests: [...prev.interests, val]
      }));
      setNewInterest('');
    }
  };

  const removeInterest = (interestToRemove) => {
    setStudentProfile(prev => ({
      ...prev,
      interests: prev.interests.filter(i => i !== interestToRemove)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSavedSuccess(true);
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });

    setTimeout(() => {
      setSavedSuccess(false);
      setActiveTab('careers');
    }, 1200);
  };

  // Calculate completeness percentage
  const filledFields = [
    studentProfile.name,
    studentProfile.email,
    studentProfile.age,
    studentProfile.educationLevel,
    studentProfile.boardOrUniversity,
    studentProfile.percentageOrCgpa,
    studentProfile.skills.length > 0,
    studentProfile.interests.length > 0
  ].filter(Boolean).length;
  const completenessScore = Math.round((filledFields / 8) * 100);

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header Banner */}
      <div className="glass-card" style={{ padding: '28px', background: 'linear-gradient(135deg, rgba(37,99,235,0.08) 0%, rgba(16,185,129,0.08) 100%)', border: '1px solid #bfdbfe' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <span className="badge badge-indigo" style={{ marginBottom: '8px' }}>{t('module_student_profile', 'Module 1: Student Profile')}</span>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '6px' }} className="gradient-text">
              {t('profile_title', 'Personalized Career Profile & Aptitude Matrix')}
            </h2>
            <p style={{ color: 'var(--text-muted)', maxWidth: '750px' }}>
              {t('profile_desc', 'Your profile is processed by MargDarshak AI to match you with top careers, pinpoint missing skills, recommend state & national scholarships, and craft a month-by-month learning roadmap.')}
            </p>
          </div>
          <button
            onClick={handleSubmit}
            className="btn btn-primary"
            style={{ padding: '12px 24px', fontSize: '0.95rem' }}
          >
            <Sparkles size={18} />
            <span>{t('btn_generate_ai', 'Generate AI Recommendations')}</span>
            <ArrowRight size={18} />
          </button>
        </div>
      </div>

      {/* Account Verification & Security Card */}
      <div className="glass-card" style={{ padding: '20px 24px', background: '#ffffff', border: '1px solid #bfdbfe' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #2563eb 0%, #10b981 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              fontSize: '1.1rem',
              color: '#fff',
              boxShadow: '0 4px 12px rgba(37, 99, 235, 0.25)'
            }}>
              {studentProfile.name ? studentProfile.name.charAt(0).toUpperCase() : 'S'}
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0f172a' }}>{studentProfile.name}</h4>
                {currentUser && currentUser.isAuthenticated ? (
                  <span className="badge badge-emerald" style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.72rem' }}>
                    <ShieldCheck size={12} /> {t('verified_gmail', 'Verified Gmail')} ({studentProfile.email})
                  </span>
                ) : (
                  <span className="badge badge-indigo" style={{ fontSize: '0.72rem' }}>
                    {t('guest_session', 'Guest Session (Unsaved)')}
                  </span>
                )}
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                {t('profile_completeness', 'Profile Completeness')}: <strong style={{ color: '#2563eb' }}>{completenessScore}%</strong> ({t('key_metrics_configured', '8 Key Career Metrics Configured')})
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            {currentUser && currentUser.isAuthenticated ? (
              <button
                onClick={() => openAuthModal('forgot_password')}
                className="btn btn-secondary btn-sm"
                style={{ fontSize: '0.8rem' }}
              >
                <KeyRound size={14} color="#10b981" />
                <span>{t('reset_password', 'Reset Password')}</span>
              </button>
            ) : (
              <button
                onClick={() => openAuthModal('register')}
                className="btn btn-primary btn-sm"
                style={{ fontSize: '0.8rem' }}
              >
                <LogIn size={14} />
                <span>{t('register', 'Register Account & Save Progress')}</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {savedSuccess && (
        <div className="glass-card" style={{ padding: '16px 24px', background: 'rgba(16, 185, 129, 0.2)', borderColor: 'var(--accent-emerald)', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <CheckCircle2 color="#34d399" size={24} />
          <div>
            <div style={{ fontWeight: 600, color: '#34d399' }}>Profile Saved & AI Analysis Complete!</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Redirecting to AI Career Recommendations...</div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div className="grid-2">
          {/* Basic Details */}
          <div className="glass-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
              <User color="#818cf8" size={20} />
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>{t('sec_basic_details', '1. Basic & Demographic Details')}</h3>
            </div>

            <div className="input-group">
              <label className="input-label">{t('label_full_name', 'Full Name')}</label>
              <input
                type="text"
                className="input-field"
                value={studentProfile.name}
                onChange={e => handleInputChange('name', e.target.value)}
                required
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div className="input-group">
                <label className="input-label">{t('label_age', 'Age')}</label>
                <input
                  type="number"
                  className="input-field"
                  value={studentProfile.age}
                  onChange={e => handleInputChange('age', e.target.value)}
                  required
                />
              </div>
              <div className="input-group">
                <label className="input-label">{t('label_gender', 'Gender')}</label>
                <select
                  className="select-field"
                  value={studentProfile.gender}
                  onChange={e => handleInputChange('gender', e.target.value)}
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div className="input-group">
              <label className="input-label">{t('label_category', 'Category')}</label>
              <select
                className="select-field"
                value={studentProfile.category}
                onChange={e => handleInputChange('category', e.target.value)}
              >
                <option value="General / EWS">General / EWS</option>
                <option value="OBC">OBC</option>
                <option value="SC">SC</option>
                <option value="ST">ST</option>
              </select>
            </div>

            <div className="input-group">
              <label className="input-label">{t('label_annual_income', 'Annual Family Income (For Scholarships)')}</label>
              <select
                className="select-field"
                value={studentProfile.annualIncomeBracket}
                onChange={e => handleInputChange('annualIncomeBracket', e.target.value)}
              >
                <option value="< ₹2.5 Lakhs PA (High Scholarship Priority)">Below ₹2.5 Lakhs PA</option>
                <option value="< ₹8 Lakhs PA (Eligible for Merit Financial Aid)">₹2.5 Lakhs - ₹8 Lakhs PA (Eligible for Merit Aid)</option>
                <option value="> ₹8 Lakhs PA">Above ₹8 Lakhs PA</option>
              </select>
            </div>
          </div>

          {/* Academic Background */}
          <div className="glass-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
              <GraduationCap color="#22d3ee" size={20} />
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>{t('sec_academic_qualifications', '2. Academic Qualifications')}</h3>
            </div>

            <div className="input-group">
              <label className="input-label">{t('label_education_level', 'Current Education Level')}</label>
              <select
                className="select-field"
                value={studentProfile.educationLevel}
                onChange={e => handleInputChange('educationLevel', e.target.value)}
              >
                <option value="10th Standard (High School)">10th Standard (High School)</option>
                <option value="12th Standard (Higher Secondary)">12th Standard (Higher Secondary)</option>
                <option value="Undergraduate (1st/2nd Year)">Undergraduate (1st/2nd Year)</option>
                <option value="Undergraduate (3rd Year)">Undergraduate (3rd Year)</option>
                <option value="Graduate / Final Year">Graduate / Final Year</option>
              </select>
            </div>

            <div className="input-group">
              <label className="input-label">{t('label_board_institution', 'Board / Institution Name')}</label>
              <input
                type="text"
                className="input-field"
                value={studentProfile.boardOrUniversity}
                onChange={e => handleInputChange('boardOrUniversity', e.target.value)}
                placeholder="e.g. CBSE / ICSE / Central University"
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div className="input-group">
                <label className="input-label">{t('label_marks_cgpa', 'Aggregate Marks / CGPA')}</label>
                <input
                  type="text"
                  className="input-field"
                  value={studentProfile.percentageOrCgpa}
                  onChange={e => handleInputChange('percentageOrCgpa', e.target.value)}
                  placeholder="e.g. 84% or 8.5 CGPA"
                />
              </div>
              <div className="input-group">
                <label className="input-label">{t('label_max_budget', 'Max Fee Budget / Year')}</label>
                <input
                  type="text"
                  className="input-field"
                  value={studentProfile.targetBudget}
                  onChange={e => handleInputChange('targetBudget', e.target.value)}
                  placeholder="e.g. ₹1.5 Lakhs"
                />
              </div>
            </div>

            <div className="input-group">
              <label className="input-label">{t('label_preferred_location', 'Preferred Study / Work Location')}</label>
              <select
                className="select-field"
                value={studentProfile.preferredLocation}
                onChange={e => handleInputChange('preferredLocation', e.target.value)}
              >
                <option value="Home State">Home State</option>
                <option value="Pan-India (Any State)">Pan-India (Any State)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Skills Tagging */}
        <div className="glass-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Award color="#fbbf24" size={20} />
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>{t('sec_current_skills', '3. Current Acquired Skills')}</h3>
            </div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              {studentProfile.skills.length} {t('skills_added', 'skills added')}
            </span>
          </div>

          {/* Current Skills List */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {studentProfile.skills.map((skill, idx) => (
              <span key={idx} className="badge badge-indigo" style={{ padding: '6px 12px', fontSize: '0.85rem' }}>
                {skill}
                <X
                  size={14}
                  style={{ cursor: 'pointer', marginLeft: '4px' }}
                  onClick={() => removeSkill(skill)}
                />
              </span>
            ))}
          </div>

          {/* Add custom skill */}
          <div style={{ display: 'flex', gap: '10px' }}>
            <input
              type="text"
              className="input-field"
              placeholder={t('ph_add_skill', 'Add a new skill (e.g. PyTorch, React, Public Speaking)...')}
              value={newSkill}
              onChange={e => setNewSkill(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addSkill(); } }}
            />
            <button type="button" className="btn btn-secondary" onClick={() => addSkill()}>
              <Plus size={16} />
              <span>{t('btn_add', 'Add')}</span>
            </button>
          </div>

          {/* Quick Suggestions */}
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '8px' }}>{t('popular_skills', 'Popular Skills to Tag:')}</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {POPULAR_SKILLS.filter(s => !studentProfile.skills.includes(s)).map((skill, idx) => (
                <button
                  type="button"
                  key={idx}
                  onClick={() => addSkill(skill)}
                  className="btn btn-secondary btn-sm"
                  style={{ fontSize: '0.78rem', padding: '3px 10px' }}
                >
                  + {skill}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Interests & Hobbies Tagging */}
        <div className="glass-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Heart color="#f472b6" size={20} />
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>{t('sec_interests_aspirations', '4. Interests & Aspirations')}</h3>
            </div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              {studentProfile.interests.length} {t('interests_added', 'interests added')}
            </span>
          </div>

          {/* Current Interests List */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {studentProfile.interests.map((interest, idx) => (
              <span key={idx} className="badge badge-pink" style={{ padding: '6px 12px', fontSize: '0.85rem' }}>
                {interest}
                <X
                  size={14}
                  style={{ cursor: 'pointer', marginLeft: '4px' }}
                  onClick={() => removeInterest(interest)}
                />
              </span>
            ))}
          </div>

          {/* Add custom interest */}
          <div style={{ display: 'flex', gap: '10px' }}>
            <input
              type="text"
              className="input-field"
              placeholder={t('ph_add_interest', 'Add an interest (e.g. Artificial Intelligence, Medicine)...')}
              value={newInterest}
              onChange={e => setNewInterest(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addInterest(); } }}
            />
            <button type="button" className="btn btn-secondary" onClick={() => addInterest()}>
              <Plus size={16} />
              <span>{t('btn_add', 'Add')}</span>
            </button>
          </div>

          {/* Quick Suggestions */}
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '8px' }}>{t('popular_interests', 'Popular Interest Areas:')}</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {POPULAR_INTERESTS.filter(i => !studentProfile.interests.includes(i)).map((interest, idx) => (
                <button
                  type="button"
                  key={idx}
                  onClick={() => addInterest(interest)}
                  className="btn btn-secondary btn-sm"
                  style={{ fontSize: '0.78rem', padding: '3px 10px' }}
                >
                  + {interest}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Submit Bar */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '14px', marginTop: '12px' }}>
          <button
            type="submit"
            className="btn btn-primary"
            style={{ padding: '14px 32px', fontSize: '1rem' }}
          >
            <Sparkles size={20} />
            <span>{t('btn_save_analyze', 'Save Profile & Analyze Career Compatibility')}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
