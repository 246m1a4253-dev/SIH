import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { MOCK_CAREERS } from '../data/mockData';
import { 
  Compass, TrendingUp, DollarSign, Building2, CheckCircle2, 
  XCircle, Bookmark, ArrowRight, Sparkles, Brain, Code, 
  BarChart3, ShieldAlert, Landmark, Stethoscope
} from 'lucide-react';

const ICON_MAP = {
  Brain: Brain,
  Code: Code,
  BarChart3: BarChart3,
  ShieldAlert: ShieldAlert,
  Landmark: Landmark,
  Stethoscope: Stethoscope
};

export const CareerRecommendation = () => {
  const { 
    studentProfile, 
    calculateCareerMatch, 
    setTargetCareer, 
    setActiveTab,
    savedCareers,
    toggleSaveCareer
  } = useApp();

  const [selectedCategory, setSelectedCategory] = useState('All');

  // Compute matches
  const rankedCareers = MOCK_CAREERS.map(c => ({
    ...c,
    matchScore: calculateCareerMatch(c)
  })).sort((a, b) => b.matchScore - a.matchScore);

  const filteredCareers = selectedCategory === 'All' 
    ? rankedCareers 
    : rankedCareers.filter(c => c.category === selectedCategory);

  const categories = ['All', 'Technology', 'Data Science', 'Security', 'Healthcare', 'Public Administration'];

  const handleSelectTarget = (career) => {
    setTargetCareer(career);
    setActiveTab('skillgap');
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header Banner */}
      <div className="glass-card" style={{ padding: '28px', background: 'linear-gradient(135deg, rgba(99,102,241,0.12) 0%, rgba(236,72,153,0.08) 100%)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <span className="badge badge-cyan" style={{ marginBottom: '8px' }}>Module 2: AI Career Engine</span>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '6px' }} className="gradient-text">
              Recommended Career Paths for {studentProfile.name}
            </h2>
            <p style={{ color: 'var(--text-muted)', maxWidth: '750px' }}>
              MargDarshak AI matched your profile skills ({studentProfile.skills.length}) and interests against real-time industry demands and 5-year growth trajectories.
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Top Match:</span>
            <span className="badge badge-emerald" style={{ padding: '8px 16px', fontSize: '0.9rem' }}>
              🎯 {rankedCareers[0]?.title} ({rankedCareers[0]?.matchScore}% Match)
            </span>
          </div>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className="btn btn-secondary btn-sm"
            style={{
              background: selectedCategory === cat ? 'var(--primary)' : 'rgba(255,255,255,0.05)',
              color: selectedCategory === cat ? 'white' : 'var(--text-muted)',
              border: selectedCategory === cat ? '1px solid var(--primary-hover)' : '1px solid var(--border-color)',
              fontWeight: selectedCategory === cat ? 600 : 400
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Careers Grid */}
      <div className="grid-2">
        {filteredCareers.map(career => {
          const IconComponent = ICON_MAP[career.icon] || Compass;
          const isSaved = savedCareers.includes(career.id);
          const acquiredCount = career.requiredSkills.filter(s => 
            studentProfile.skills.some(userSkill => userSkill.toLowerCase() === s.toLowerCase())
          ).length;

          return (
            <div 
              key={career.id} 
              className="glass-card glass-card-interactive" 
              style={{ padding: '24px', display: 'flex', flexDirection: 'column', justifyBetween: 'space-between', gap: '18px', position: 'relative' }}
            >
              {/* Top Row */}
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '14px',
                    background: 'linear-gradient(135deg, rgba(99,102,241,0.2) 0%, rgba(6,182,212,0.2) 100%)',
                    border: '1px solid rgba(99,102,241,0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <IconComponent size={24} color="#818cf8" />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>{career.title}</h3>
                    <span className="badge badge-indigo" style={{ marginTop: '4px' }}>{career.category}</span>
                  </div>
                </div>

                {/* Match Score Badge */}
                <div style={{ textAlign: 'right' }}>
                  <div style={{
                    background: career.matchScore > 85 
                      ? 'rgba(16, 185, 129, 0.15)' 
                      : 'rgba(245, 158, 11, 0.15)',
                    border: `1px solid ${career.matchScore > 85 ? 'rgba(16, 185, 129, 0.4)' : 'rgba(245, 158, 11, 0.4)'}`,
                    color: career.matchScore > 85 ? '#34d399' : '#fbbf24',
                    padding: '6px 12px',
                    borderRadius: 'var(--radius-full)',
                    fontWeight: 800,
                    fontSize: '0.95rem'
                  }}>
                    {career.matchScore}% Match
                  </div>
                </div>
              </div>

              {/* Description */}
              <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
                {career.description}
              </p>

              {/* Market Metrics Grid */}
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: '1fr 1fr', 
                gap: '10px', 
                background: 'rgba(0,0,0,0.2)', 
                padding: '12px', 
                borderRadius: 'var(--radius-sm)' 
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <DollarSign size={16} color="#34d399" />
                  <div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Salary Package</div>
                    <div style={{ fontSize: '0.82rem', fontWeight: 600 }}>{career.salaryRange}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <TrendingUp size={16} color="#22d3ee" />
                  <div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>5-Yr Industry Growth</div>
                    <div style={{ fontSize: '0.82rem', fontWeight: 600 }}>{career.growthRate}</div>
                  </div>
                </div>
              </div>

              {/* Required Skills breakdown */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '8px' }}>
                  <span>Key Role Requirements</span>
                  <span style={{ color: acquiredCount === career.requiredSkills.length ? '#34d399' : '#fbbf24' }}>
                    {acquiredCount} / {career.requiredSkills.length} Acquired
                  </span>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {career.requiredSkills.map((sk, idx) => {
                    const isAcquired = studentProfile.skills.some(
                      userSk => userSk.toLowerCase() === sk.toLowerCase()
                    );
                    return (
                      <span 
                        key={idx}
                        style={{
                          fontSize: '0.75rem',
                          padding: '3px 8px',
                          borderRadius: '4px',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          background: isAcquired ? 'rgba(16, 185, 129, 0.15)' : 'rgba(255, 255, 255, 0.04)',
                          color: isAcquired ? '#34d399' : 'var(--text-muted)',
                          border: isAcquired ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid var(--border-color)'
                        }}
                      >
                        {isAcquired ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
                        {sk}
                      </span>
                    );
                  })}
                </div>
              </div>

              {/* Top Hiring Companies */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                <Building2 size={14} color="#a855f7" />
                <span>Top Recruiters:</span>
                <span style={{ color: 'var(--text-main)', fontWeight: 500 }}>
                  {career.topRecruiters.slice(0, 3).join(', ')}
                </span>
              </div>

              {/* Actions Footer */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: 'auto', paddingTop: '12px', borderTop: '1px solid var(--border-color)' }}>
                <button
                  onClick={() => handleSelectTarget(career)}
                  className="btn btn-primary"
                  style={{ flex: 1, padding: '10px', fontSize: '0.88rem' }}
                >
                  <Sparkles size={16} />
                  <span>Select Target & View Roadmap</span>
                  <ArrowRight size={16} />
                </button>
                <button
                  onClick={() => toggleSaveCareer(career.id)}
                  className="btn btn-secondary"
                  style={{ padding: '10px', color: isSaved ? '#ec4899' : 'var(--text-muted)' }}
                  title={isSaved ? 'Bookmarked' : 'Save Career'}
                >
                  <Bookmark size={18} fill={isSaved ? '#ec4899' : 'none'} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
