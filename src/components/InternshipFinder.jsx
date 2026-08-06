import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { MOCK_INTERNSHIPS } from '../data/mockData';
import { 
  Briefcase, DollarSign, MapPin, Calendar, CheckCircle2, 
  Sparkles, ExternalLink, ShieldCheck, Clock, Search, LandPlot, Flag
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const InternshipFinder = () => {
  const { studentProfile, appliedInternships, toggleApplyInternship } = useApp();
  const [filterCategory, setFilterCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const handleApply = (id) => {
    toggleApplyInternship(id);
    confetti({ particleCount: 60, spread: 60, origin: { y: 0.6 } });
  };

  const filteredInternships = MOCK_INTERNSHIPS.filter(item => {
    const matchesSearch = 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.requiredSkills.some(sk => sk.toLowerCase().includes(searchQuery.toLowerCase())) ||
      item.location.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (filterCategory === 'govt') return item.isGovt;
    if (filterCategory === 'corporate') return !item.isGovt;
    if (filterCategory === 'remote') return item.mode.toLowerCase().includes('remote') || item.mode.toLowerCase().includes('hybrid');
    return true;
  });

  const govtCount = MOCK_INTERNSHIPS.filter(i => i.isGovt).length;

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header Banner */}
      <div className="glass-card" style={{ padding: '28px', background: 'linear-gradient(135deg, rgba(6,182,212,0.15) 0%, rgba(99,102,241,0.15) 100%)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <span className="badge badge-cyan" style={{ marginBottom: '8px' }}>Module 8: Internship & Govt Fellowship Matcher</span>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '6px' }} className="gradient-text-cyan">
              Recommended Internships for {studentProfile.name}
            </h2>
            <p style={{ color: 'var(--text-muted)', maxWidth: '750px' }}>
              Hand-picked opportunities including verified Government of India schemes (PM Internship Scheme, NITI Aayog, MEA, MeitY, RBI, AICTE TULIP) and top tech firms.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <div className="badge badge-indigo" style={{ padding: '8px 16px', fontSize: '0.88rem' }}>
              🇮🇳 {govtCount} Official Govt Schemes
            </div>
            <div className="badge badge-emerald" style={{ padding: '8px 16px', fontSize: '0.88rem' }}>
              {appliedInternships.length} Applications Active
            </div>
          </div>
        </div>
      </div>

      {/* Controls: Search & Category Filter Tabs */}
      <div className="glass-card" style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
          {/* Category Tabs */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <button
              onClick={() => setFilterCategory('all')}
              className={filterCategory === 'all' ? "btn btn-primary btn-sm" : "btn btn-secondary btn-sm"}
            >
              All Opportunities ({MOCK_INTERNSHIPS.length})
            </button>
            <button
              onClick={() => setFilterCategory('govt')}
              className={filterCategory === 'govt' ? "btn btn-primary btn-sm" : "btn btn-secondary btn-sm"}
              style={filterCategory === 'govt' ? { background: 'linear-gradient(135deg, #f59e0b, #d97706)', border: 'none' } : {}}
            >
              🇮🇳 Govt. of India Portals ({govtCount})
            </button>
            <button
              onClick={() => setFilterCategory('corporate')}
              className={filterCategory === 'corporate' ? "btn btn-primary btn-sm" : "btn btn-secondary btn-sm"}
            >
              🏢 Private & Corporate
            </button>
            <button
              onClick={() => setFilterCategory('remote')}
              className={filterCategory === 'remote' ? "btn btn-primary btn-sm" : "btn btn-secondary btn-sm"}
            >
              🌐 Remote / Hybrid
            </button>
          </div>

          {/* Search Bar */}
          <div style={{ position: 'relative', flex: '1', maxWidth: '320px', minWidth: '220px' }}>
            <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              type="text"
              placeholder="Search title, skills, govt schemes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '8px 12px 8px 36px',
                borderRadius: 'var(--radius-sm)',
                background: 'rgba(0, 0, 0, 0.25)',
                border: '1px solid var(--border-color)',
                color: 'var(--text-light)',
                fontSize: '0.85rem'
              }}
            />
          </div>
        </div>
      </div>

      {/* Internships Grid */}
      <div className="grid-2">
        {filteredInternships.map(internship => {
          const isApplied = appliedInternships.includes(internship.id);

          // Calculate skill match percentage
          const userSkillsLower = studentProfile.skills.map(s => s.toLowerCase());
          const matchedSkills = internship.requiredSkills.filter(sk => userSkillsLower.includes(sk.toLowerCase()));
          const matchPercent = Math.round((matchedSkills.length / internship.requiredSkills.length) * 100);

          return (
            <div key={internship.id} className="glass-card glass-card-interactive" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px', borderTop: internship.isGovt ? '3px solid #f59e0b' : '3px solid var(--primary)' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px', flexWrap: 'wrap' }}>
                    <span className="badge badge-indigo">{internship.mode}</span>
                    {internship.isGovt && (
                      <span className="badge" style={{ background: 'rgba(245, 158, 11, 0.2)', color: '#fbbf24', border: '1px solid rgba(245, 158, 11, 0.4)' }}>
                        🇮🇳 Verified Govt Portal
                      </span>
                    )}
                    <span className="badge badge-emerald" style={{ fontSize: '0.72rem' }}>
                      {matchPercent}% Skill Match
                    </span>
                  </div>

                  <h3 style={{ fontSize: '1.15rem', fontWeight: 700, lineHeight: 1.3 }}>{internship.title}</h3>
                  <div style={{ fontSize: '0.88rem', color: internship.isGovt ? '#fbbf24' : '#67e8f9', fontWeight: 600, marginTop: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <ShieldCheck size={16} />
                    {internship.company}
                  </div>
                </div>

                {isApplied && (
                  <span className="badge badge-emerald">✓ Applied</span>
                )}
              </div>

              {internship.description && (
                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
                  {internship.description}
                </p>
              )}

              {/* Stipend & Meta */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', background: 'rgba(0,0,0,0.25)', padding: '12px', borderRadius: 'var(--radius-sm)' }}>
                <div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Stipend / Benefits</div>
                  <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#34d399' }}>{internship.stipend}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Duration & Location</div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>{internship.duration} • {internship.location}</div>
                </div>
              </div>

              {/* Required Skills */}
              <div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '6px' }}>Required Skills & Competencies:</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {internship.requiredSkills.map((sk, idx) => {
                    const hasSkill = userSkillsLower.includes(sk.toLowerCase());
                    return (
                      <span 
                        key={idx} 
                        className={hasSkill ? "badge badge-emerald" : "badge badge-indigo"}
                        style={{ fontSize: '0.72rem' }}
                      >
                        {hasSkill ? '✓ ' : ''}{sk}
                      </span>
                    );
                  })}
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto', paddingTop: '12px', borderTop: '1px solid var(--border-color)', flexWrap: 'wrap', gap: '10px' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Clock size={12} /> {internship.postedDate}
                </span>

                <div style={{ display: 'flex', gap: '8px' }}>
                  {internship.portalUrl && (
                    <a
                      href={internship.portalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-secondary btn-sm"
                      style={{ fontSize: '0.78rem' }}
                      title="Visit Official Government / Organization Portal"
                    >
                      <span>Official Portal</span>
                      <ExternalLink size={13} />
                    </a>
                  )}

                  <button
                    onClick={() => handleApply(internship.id)}
                    className={isApplied ? "btn btn-secondary btn-sm" : "btn btn-primary btn-sm"}
                    style={{ fontSize: '0.78rem' }}
                  >
                    {isApplied ? (
                      <>
                        <CheckCircle2 size={14} color="#34d399" />
                        <span>Submitted</span>
                      </>
                    ) : (
                      <>
                        <Sparkles size={14} />
                        <span>One-Click AI Apply</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredInternships.length === 0 && (
        <div className="glass-card" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
          No internships match your filter or search query "{searchQuery}". Try adjusting your filters.
        </div>
      )}
    </div>
  );
};

