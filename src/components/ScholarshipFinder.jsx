import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { MOCK_SCHOLARSHIPS } from '../data/mockData';
import { 
  Award, Filter, ExternalLink, Bookmark, CheckCircle2, 
  Search, ShieldCheck, DollarSign, Calendar, MapPin
} from 'lucide-react';

export const ScholarshipFinder = () => {
  const { studentProfile, savedScholarships, toggleSaveScholarship } = useApp();

  const [stateFilter, setStateFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredScholarships = MOCK_SCHOLARSHIPS.filter(sch => {
    // State Filter
    if (stateFilter === 'State' && sch.targetState === 'All India') return false;
    if (stateFilter === 'All India' && sch.targetState !== 'All India') return false;

    // Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = sch.title.toLowerCase().includes(q);
      const matchProvider = sch.provider.toLowerCase().includes(q);
      const matchDesc = sch.description.toLowerCase().includes(q);
      if (!matchTitle && !matchProvider && !matchDesc) return false;
    }

    return true;
  });

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Top Banner */}
      <div className="glass-card" style={{ padding: '28px', background: 'linear-gradient(135deg, rgba(245,158,11,0.12) 0%, rgba(99,102,241,0.1) 100%)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <span className="badge badge-amber" style={{ marginBottom: '8px' }}>Module 6: Scholarship Finder</span>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '6px' }} className="gradient-text-gold">
              Personalized Scholarship & Grant Portal
            </h2>
            <p style={{ color: 'var(--text-muted)', maxWidth: '750px' }}>
              Filtered specifically for your eligibility criteria ({studentProfile.annualIncomeBracket}) and national merit programs.
            </p>
          </div>

          <div className="badge badge-emerald" style={{ padding: '8px 16px', fontSize: '0.88rem' }}>
            ✓ Verified Merit & Financial Aid Match
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="glass-card" style={{ padding: '18px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, minWidth: '280px' }}>
          <Search size={18} color="var(--text-muted)" />
          <input 
            type="text"
            className="input-field"
            placeholder="Search scholarships by keyword (e.g. Merit, AICTE, Post-Matric, Tata)..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </div>

        {/* State Filter Buttons */}
        <div style={{ display: 'flex', gap: '8px' }}>
          <button 
            onClick={() => setStateFilter('All')}
            className="btn btn-secondary btn-sm"
            style={{ background: stateFilter === 'All' ? 'var(--primary)' : 'rgba(255,255,255,0.04)' }}
          >
            All Programs
          </button>
          <button 
            onClick={() => setStateFilter('All India')}
            className="btn btn-secondary btn-sm"
            style={{ background: stateFilter === 'All India' ? 'var(--primary)' : 'rgba(255,255,255,0.04)' }}
          >
            🇮🇳 National Programs
          </button>
        </div>
      </div>

      {/* Scholarship Cards Grid */}
      <div className="grid-2">
        {filteredScholarships.map(sch => {
          const isSaved = savedScholarships.includes(sch.id);
          const isState = sch.targetState !== 'All India';

          return (
            <div key={sch.id} className="glass-card glass-card-interactive" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Card Header */}
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px' }}>
                <div>
                  <span className={isState ? "badge badge-indigo" : "badge badge-cyan"} style={{ marginBottom: '6px' }}>
                    {sch.targetState}
                  </span>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 700, lineHeight: '1.3' }}>{sch.title}</h3>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                    Provider: {sch.provider}
                  </div>
                </div>

                <button
                  onClick={() => toggleSaveScholarship(sch.id)}
                  className="btn btn-secondary btn-sm"
                  style={{ padding: '6px 10px', color: isSaved ? '#ec4899' : 'var(--text-muted)' }}
                >
                  <Bookmark size={16} fill={isSaved ? '#ec4899' : 'none'} />
                </button>
              </div>

              {/* Amount Highlight */}
              <div style={{ background: 'rgba(245, 158, 11, 0.12)', border: '1px solid rgba(245, 158, 11, 0.3)', padding: '12px', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <DollarSign color="#fbbf24" size={20} />
                <div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Financial Award</div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#fbbf24' }}>{sch.amount}</div>
                </div>
              </div>

              {/* Eligibility Details */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.83rem', color: 'var(--text-muted)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <ShieldCheck size={14} color="#34d399" />
                  <span>Income Limit: <strong style={{ color: 'var(--text-main)' }}>{sch.eligibilityIncome}</strong></span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CheckCircle2 size={14} color="#818cf8" />
                  <span>Marks Criteria: <strong style={{ color: 'var(--text-main)' }}>{sch.eligibilityMarks}</strong></span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Calendar size={14} color="#f472b6" />
                  <span>Application Deadline: <strong style={{ color: '#f472b6' }}>{sch.deadline}</strong></span>
                </div>
              </div>

              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>
                {sch.description}
              </p>

              {/* Footer CTA */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto', paddingTop: '12px', borderTop: '1px solid var(--border-color)' }}>
                <span className="badge badge-emerald">Eligible Match</span>
                <a 
                  href={sch.link} 
                  target="_blank" 
                  rel="noreferrer"
                  className="btn btn-primary btn-sm" 
                  style={{ padding: '8px 16px' }}
                >
                  <span>Apply on Official Portal</span>
                  <ExternalLink size={14} />
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
