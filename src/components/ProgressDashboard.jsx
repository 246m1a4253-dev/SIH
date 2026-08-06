import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  LayoutDashboard, Award, CheckCircle2, TrendingUp, 
  FileText, Briefcase, GraduationCap, Map, Sparkles
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
    setActiveTab
  } = useApp();

  const careerMatchScore = calculateCareerMatch(targetCareer);

  // Acquired skills count for target role
  const acquiredCount = targetCareer.requiredSkills.filter(sk => 
    studentProfile.skills.some(userSk => userSk.toLowerCase() === sk.toLowerCase())
  ).length;

  const totalRequired = targetCareer.requiredSkills.length;
  const skillCompletionPercent = Math.round((acquiredCount / totalRequired) * 100);

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header Banner */}
      <div className="glass-card" style={{ padding: '28px', background: 'linear-gradient(135deg, rgba(99,102,241,0.18) 0%, rgba(6,182,212,0.12) 100%)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <span className="badge badge-indigo" style={{ marginBottom: '8px' }}>Module 10: Student Progress & Readiness Dashboard</span>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '6px' }} className="gradient-text">
              Welcome Back, {studentProfile.name}!
            </h2>
            <p style={{ color: 'var(--text-muted)', maxWidth: '750px' }}>
              Track your career readiness index, skill completion progress, resume ATS scores, scholarship bookmarks, and active internship applications in one place.
            </p>
          </div>

          <button onClick={() => setActiveTab('skillgap')} className="btn btn-primary">
            <Sparkles size={18} />
            <span>Continue Learning Roadmap</span>
          </button>
        </div>
      </div>

      {/* 4 Stat Overview Cards */}
      <div className="grid-4">
        {/* Card 1: Career Readiness Index */}
        <div className="glass-card" style={{ padding: '20px', borderTop: '4px solid var(--primary)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Career Match Rating</span>
            <TrendingUp size={18} color="#818cf8" />
          </div>
          <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#818cf8' }}>{careerMatchScore}%</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            Target Role: <strong>{targetCareer.title}</strong>
          </div>
        </div>

        {/* Card 2: Skill Mastery */}
        <div className="glass-card" style={{ padding: '20px', borderTop: '4px solid var(--accent-cyan)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Required Skills Mastered</span>
            <CheckCircle2 size={18} color="#22d3ee" />
          </div>
          <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#22d3ee' }}>
            {acquiredCount} / {totalRequired}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            {skillCompletionPercent}% of key role skills acquired
          </div>
        </div>

        {/* Card 3: ATS Resume Score */}
        <div className="glass-card" style={{ padding: '20px', borderTop: '4px solid var(--secondary)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>ATS Resume Score</span>
            <FileText size={18} color="#f472b6" />
          </div>
          <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#f472b6' }}>
            {resumeScanResult.score} / 100
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            ATS Status: {resumeScanResult.score >= 80 ? 'High Pass Rate' : 'Needs Optimization'}
          </div>
        </div>

        {/* Card 4: Saved & Applications */}
        <div className="glass-card" style={{ padding: '20px', borderTop: '4px solid var(--accent-emerald)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Internship Applications</span>
            <Briefcase size={18} color="#34d399" />
          </div>
          <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#34d399' }}>
            {appliedInternships.length} Active
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            {savedScholarships.length} Scholarships Bookmarked
          </div>
        </div>
      </div>

      {/* Breakdown Details Grid */}
      <div className="grid-2">
        {/* Profile Snapshot & Target Roadmap */}
        <div className="glass-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, borderBottom: '1px solid var(--border-color)', paddingBottom: '10px' }}>
            Student Profile Snapshot
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '0.85rem' }}>
            <div>
              <span style={{ color: 'var(--text-muted)' }}>Education Level:</span>
              <div style={{ fontWeight: 600 }}>{studentProfile.educationLevel}</div>
            </div>
            <div>
              <span style={{ color: 'var(--text-muted)' }}>Board / College:</span>
              <div style={{ fontWeight: 600 }}>{studentProfile.boardOrUniversity}</div>
            </div>
            <div>
              <span style={{ color: 'var(--text-muted)' }}>Aggregate Score:</span>
              <div style={{ fontWeight: 600, color: '#34d399' }}>{studentProfile.percentageOrCgpa}</div>
            </div>
            <div>
              <span style={{ color: 'var(--text-muted)' }}>Income Bracket:</span>
              <div style={{ fontWeight: 600, color: '#fbbf24' }}>{studentProfile.annualIncomeBracket}</div>
            </div>
          </div>

          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '8px' }}>Acquired Profile Skills:</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {studentProfile.skills.map((sk, idx) => (
                <span key={idx} className="badge badge-indigo" style={{ fontSize: '0.78rem' }}>{sk}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Active Applications & Bookmarks */}
        <div className="glass-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, borderBottom: '1px solid var(--border-color)', paddingBottom: '10px' }}>
            Bookmarked Opportunities & Applications
          </h3>

          <div>
            <div style={{ fontSize: '0.82rem', fontWeight: 600, color: '#67e8f9', marginBottom: '6px' }}>
              Bookmarked Scholarships ({savedScholarships.length}):
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {savedScholarships.map(sId => (
                <div key={sId} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px', background: 'rgba(0,0,0,0.2)', borderRadius: '6px', fontSize: '0.82rem' }}>
                  <span>{sId === 'pm-merit-scholarship' || sId === 'central-sector' ? "Central Sector Scheme of Scholarships" : "AICTE Pragati Girl Scholarship"}</span>
                  <span className="badge badge-emerald">Eligible</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div style={{ fontSize: '0.82rem', fontWeight: 600, color: '#34d399', marginBottom: '6px' }}>
              Active Internship Submissions ({appliedInternships.length}):
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {appliedInternships.map(iId => (
                <div key={iId} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px', background: 'rgba(0,0,0,0.2)', borderRadius: '6px', fontSize: '0.82rem' }}>
                  <span>Microsoft Software Engineering Intern</span>
                  <span className="badge badge-indigo">Under Review</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
