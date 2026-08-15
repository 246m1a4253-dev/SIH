import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  ChevronUp, ChevronDown, GraduationCap, Bookmark, TrendingUp, 
  CheckCircle2, FileText, Briefcase, Award, Sparkles, User, Building, ExternalLink
} from 'lucide-react';

export const ProgressDashboard = () => {
  const { 
    studentProfile, 
    targetCareer, 
    resumeScanResult, 
    savedScholarships, 
    savedColleges, 
    appliedInternships,
    calculateCareerMatch,
    setActiveTab,
    t
  } = useApp();

  // Accordion Expand/Collapse States
  const [overviewOpen, setOverviewOpen] = useState(true);
  const [profileOpen, setProfileOpen] = useState(false);
  const [opportunitiesOpen, setOpportunitiesOpen] = useState(false);

  const careerMatchScore = calculateCareerMatch(targetCareer);

  // Acquired skills calculation
  const acquiredCount = targetCareer.requiredSkills.filter(sk => 
    studentProfile.skills.some(userSk => userSk.toLowerCase() === sk.toLowerCase())
  ).length;

  const totalRequired = targetCareer.requiredSkills.length || 8;
  const skillCompletionPercent = Math.round((acquiredCount / totalRequired) * 100);

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '1200px', margin: '0 auto', padding: '10px 0' }}>
      
      {/* 1. Career Progress Overview Card (Accordion) */}
      <div className="glass-card" style={{ borderRadius: '16px', overflow: 'hidden', border: '1px solid var(--border-color)' }}>
        {/* Accordion Header */}
        <div 
          onClick={() => setOverviewOpen(!overviewOpen)}
          style={{
            padding: '18px 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            cursor: 'pointer',
            borderBottom: overviewOpen ? '1px solid var(--border-color)' : 'none',
            background: 'var(--bg-glass)',
            userSelect: 'none'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <TrendingUp size={20} color="var(--primary)" />
            <h2 style={{ fontSize: '1.2rem', fontWeight: 700, margin: 0 }}>
              Career Progress Overview
            </h2>
          </div>
          <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
            {overviewOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>
        </div>

        {/* Accordion Body */}
        {overviewOpen && (
          <div style={{ padding: '24px' }} className="animate-fade-in">
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '20px'
            }}>
              {/* Metric 1: Career Match */}
              <div 
                style={{
                  background: 'var(--bg-card-hover)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '12px',
                  padding: '24px 20px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textAlign: 'center',
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease'
                }}
                className="glass-card-interactive"
              >
                <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '12px' }}>
                  Career Match
                </div>
                <div style={{ fontSize: '2.8rem', fontWeight: 800, color: '#2563eb', lineHeight: 1 }}>
                  {careerMatchScore}%
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '12px' }}>
                  {targetCareer.title}
                </div>
              </div>

              {/* Metric 2: Skills Mastered */}
              <div 
                style={{
                  background: 'var(--bg-card-hover)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '12px',
                  padding: '24px 20px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textAlign: 'center',
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease'
                }}
                className="glass-card-interactive"
              >
                <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '12px' }}>
                  Skills Mastered
                </div>
                <div style={{ fontSize: '2.8rem', fontWeight: 800, color: '#10b981', lineHeight: 1 }}>
                  {acquiredCount}/{totalRequired}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '12px' }}>
                  {skillCompletionPercent}% Complete
                </div>
              </div>

              {/* Metric 3: Resume Score */}
              <div 
                style={{
                  background: 'var(--bg-card-hover)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '12px',
                  padding: '24px 20px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textAlign: 'center',
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease'
                }}
                className="glass-card-interactive"
              >
                <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '12px' }}>
                  Resume Score
                </div>
                <div style={{ fontSize: '2.8rem', fontWeight: 800, color: '#d97706', lineHeight: 1 }}>
                  {resumeScanResult.score}/100
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '12px' }}>
                  Good
                </div>
              </div>

              {/* Metric 4: Applications */}
              <div 
                style={{
                  background: 'var(--bg-card-hover)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '12px',
                  padding: '24px 20px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textAlign: 'center',
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease'
                }}
                className="glass-card-interactive"
              >
                <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '12px' }}>
                  Applications
                </div>
                <div style={{ fontSize: '2.8rem', fontWeight: 800, color: '#ef4444', lineHeight: 1 }}>
                  {appliedInternships.length}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '12px' }}>
                  Active Submissions
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 2. Saved Opportunities Accordion */}
      <div className="glass-card" style={{ borderRadius: '16px', overflow: 'hidden', border: '1px solid var(--border-color)' }}>
        <div 
          onClick={() => setOpportunitiesOpen(!opportunitiesOpen)}
          style={{
            padding: '18px 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            cursor: 'pointer',
            borderBottom: opportunitiesOpen ? '1px solid var(--border-color)' : 'none',
            background: 'var(--bg-glass)',
            userSelect: 'none'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Bookmark size={20} color="var(--primary)" />
            <h2 style={{ fontSize: '1.2rem', fontWeight: 700, margin: 0 }}>
              Saved Opportunities
            </h2>
          </div>
          <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
            {opportunitiesOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>
        </div>

        {opportunitiesOpen && (
          <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }} className="animate-fade-in">
            {/* Scholarships Section */}
            <div>
              <div style={{ fontSize: '0.88rem', fontWeight: 700, marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--accent-cyan)' }}>
                <Award size={16} />
                <span>Bookmarked Scholarships ({savedScholarships.length})</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {savedScholarships.map(sId => (
                  <div key={sId} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', background: 'var(--bg-card-hover)', border: '1px solid var(--border-color)', borderRadius: '10px', fontSize: '0.85rem' }}>
                    <span style={{ fontWeight: 600 }}>
                      {sId === 'pm-merit-scholarship' || sId === 'central-sector' 
                        ? "Central Sector Scheme of Scholarships for University Students" 
                        : "AICTE Pragati Scholarship for Girl Students"}
                    </span>
                    <span className="badge badge-emerald">Eligible for Apply</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Internships Section */}
            <div>
              <div style={{ fontSize: '0.88rem', fontWeight: 700, marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px', color: '#10b981' }}>
                <Briefcase size={16} />
                <span>Active Internship Submissions ({appliedInternships.length})</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {appliedInternships.map(iId => (
                  <div key={iId} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', background: 'var(--bg-card-hover)', border: '1px solid var(--border-color)', borderRadius: '10px', fontSize: '0.85rem' }}>
                    <span style={{ fontWeight: 600 }}>Microsoft Software Engineering Summer Intern 2025</span>
                    <span className="badge badge-indigo">Application Under Review</span>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '10px' }}>
              <button onClick={() => setActiveTab('scholarships')} className="btn btn-secondary btn-sm">
                <span>Explore Scholarships</span>
              </button>
              <button onClick={() => setActiveTab('internships')} className="btn btn-primary btn-sm">
                <span>Find Internships</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
