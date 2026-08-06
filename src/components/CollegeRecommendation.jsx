import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { MOCK_COLLEGES } from '../data/mockData';
import { 
  GraduationCap, MapPin, Award, DollarSign, TrendingUp, 
  ExternalLink, Bookmark, Search, Star, Filter, Building
} from 'lucide-react';

const STATES_LIST = [
  "All States",
  "Andhra Pradesh",
  "Jammu & Kashmir",
  "Delhi",
  "Maharashtra",
  "Karnataka",
  "Tamil Nadu",
  "Telangana",
  "Uttar Pradesh",
  "West Bengal",
  "Punjab",
  "Rajasthan",
  "Gujarat",
  "Kerala",
  "Madhya Pradesh",
  "Bihar",
  "Assam",
  "Odisha",
  "Himachal Pradesh",
  "Haryana",
  "Jharkhand",
  "Uttarakhand",
  "Goa"
];

const COLLEGE_TYPES = [
  "All Types",
  "Autonomous & JNTU / State Univ",
  "IITs & NITs (National Importance)",
  "Deemed & Private Universities",
  "State Government Colleges"
];

export const CollegeRecommendation = () => {
  const { savedColleges, toggleSaveCollege } = useApp();

  const [selectedState, setSelectedState] = useState('All States');
  const [selectedType, setSelectedType] = useState('All Types');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredColleges = MOCK_COLLEGES.filter(col => {
    // State Filter
    if (selectedState !== 'All States' && col.state !== selectedState) return false;

    // Type Filter
    if (selectedType === 'Autonomous & JNTU / State Univ') {
      const isAutoOrJntu = col.type.includes('Autonomous') || col.type.includes('JNTU') || col.type.includes('State');
      if (!isAutoOrJntu) return false;
    } else if (selectedType === 'IITs & NITs (National Importance)') {
      const isIITorNIT = col.type.includes('IIT') || col.type.includes('NIT');
      if (!isIITorNIT) return false;
    } else if (selectedType === 'Deemed & Private Universities') {
      const isDeemed = col.type.includes('Deemed') || col.type.includes('Private') || col.type.includes('Eminence');
      if (!isDeemed) return false;
    } else if (selectedType === 'State Government Colleges') {
      const isGovt = col.type.includes('Govt') || col.type.includes('State');
      if (!isGovt) return false;
    }

    // Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = col.name.toLowerCase().includes(q);
      const matchLocation = col.location.toLowerCase().includes(q);
      const matchState = (col.state || '').toLowerCase().includes(q);
      const matchType = (col.type || '').toLowerCase().includes(q);
      const matchEapcet = (col.eapcetCode || '').toLowerCase().includes(q);
      const matchCourses = col.courses.some(c => c.toLowerCase().includes(q));
      if (!matchName && !matchLocation && !matchState && !matchType && !matchEapcet && !matchCourses) return false;
    }

    return true;
  });

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header Banner */}
      <div className="glass-card" style={{ padding: '28px', background: 'linear-gradient(135deg, rgba(99,102,241,0.15) 0%, rgba(16,185,129,0.1) 100%)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <span className="badge badge-emerald" style={{ marginBottom: '8px' }}>Module 7: Comprehensive B.Tech College Directory</span>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '6px' }} className="gradient-text">
              State-Wise B.Tech & AP EAPCET College Finder
            </h2>
            <p style={{ color: 'var(--text-muted)', maxWidth: '750px' }}>
              Includes official AP EAPCET counselling college codes (VVIT, RVRJ, VRSE, SRKR, GMRV, ADTP, PRAG, GIET, BVCE, etc.), JNTUK, JNTUA, JNTUH, VTU, Anna Univ, and IIT/NIT campuses.
            </p>
          </div>

          <div className="badge badge-indigo" style={{ padding: '8px 16px', fontSize: '0.88rem' }}>
            Showing {filteredColleges.length} Verified Colleges
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="glass-card" style={{ padding: '18px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        {/* Search */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 2, minWidth: '280px' }}>
          <Search size={18} color="var(--text-muted)" />
          <input 
            type="text"
            className="input-field"
            placeholder="Search by college name, AP EAPCET code (e.g. VVIT, RVRJ, ADTP), JNTUK tag, or city..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </div>

        {/* State Select Dropdown */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1, minWidth: '200px' }}>
          <Filter size={18} color="#818cf8" />
          <select 
            className="select-field"
            value={selectedState}
            onChange={e => setSelectedState(e.target.value)}
            style={{ fontWeight: 600 }}
          >
            {STATES_LIST.map(st => (
              <option key={st} value={st}>{st === 'All States' ? '🌐 All States' : `📍 ${st}`}</option>
            ))}
          </select>
        </div>

        {/* Type / Affiliation Select Dropdown */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1, minWidth: '220px' }}>
          <Building size={18} color="#22d3ee" />
          <select 
            className="select-field"
            value={selectedType}
            onChange={e => setSelectedType(e.target.value)}
            style={{ fontWeight: 600 }}
          >
            {COLLEGE_TYPES.map(t => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Quick State Pills Scrollable */}
      <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
        {STATES_LIST.map(st => (
          <button
            key={st}
            onClick={() => setSelectedState(st)}
            className="btn btn-secondary btn-sm"
            style={{
              background: selectedState === st ? 'var(--primary)' : 'rgba(255,255,255,0.04)',
              color: selectedState === st ? 'white' : 'var(--text-muted)',
              border: selectedState === st ? '1px solid var(--primary-hover)' : '1px solid var(--border-color)',
              fontWeight: selectedState === st ? 600 : 400
            }}
          >
            {st === 'All States' ? 'All India' : st}
          </button>
        ))}
      </div>

      {/* Colleges Grid */}
      <div className="grid-2">
        {filteredColleges.map(col => {
          const isSaved = savedColleges.includes(col.id);

          return (
            <div key={col.id} className="glass-card glass-card-interactive" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px', flexWrap: 'wrap' }}>
                    <span className="badge badge-indigo">NIRF Rank #{col.nirfRank}</span>
                    <span className="badge badge-cyan">{col.state}</span>
                    {col.eapcetCode && (
                      <span className="badge badge-amber" style={{ background: 'rgba(245,158,11,0.2)', color: '#fbbf24', borderColor: 'rgba(245,158,11,0.4)' }}>
                        EAPCET Code: {col.eapcetCode}
                      </span>
                    )}
                  </div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>{col.name}</h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                    <MapPin size={14} color="#06b6d4" />
                    <span>{col.location}, {col.state}</span>
                  </div>
                </div>

                <button
                  onClick={() => toggleSaveCollege(col.id)}
                  className="btn btn-secondary btn-sm"
                  style={{ padding: '6px 10px', color: isSaved ? '#ec4899' : 'var(--text-muted)' }}
                  title={isSaved ? "Saved" : "Save College"}
                >
                  <Bookmark size={16} fill={isSaved ? '#ec4899' : 'none'} />
                </button>
              </div>

              {/* Type / Affiliation Badge */}
              <div style={{ fontSize: '0.82rem', color: '#818cf8', fontWeight: 600, background: 'rgba(99,102,241,0.1)', padding: '6px 12px', borderRadius: '6px' }}>
                🏛️ Category / Affiliation: {col.type}
              </div>

              {/* Placement & Fee Stats Box */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', background: 'rgba(0,0,0,0.25)', padding: '12px', borderRadius: 'var(--radius-sm)' }}>
                <div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Highest Package</div>
                  <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#34d399' }}>{col.highestPackage}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Average Package</div>
                  <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#818cf8' }}>{col.avgPackage}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Annual Tuition</div>
                  <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#22d3ee' }}>{col.annualFee}</div>
                </div>
              </div>

              {/* Cutoff Range */}
              <div style={{ fontSize: '0.83rem', color: 'var(--text-muted)' }}>
                <span style={{ fontWeight: 600, color: '#fbbf24' }}>Cutoff / Merit: </span>
                {col.cutoffRange}
              </div>

              {/* Offered Courses */}
              <div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '6px' }}>B.Tech Specializations:</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {col.courses.map((course, cIdx) => (
                    <span key={cIdx} className="badge badge-indigo" style={{ fontSize: '0.72rem' }}>{course}</span>
                  ))}
                </div>
              </div>

              {/* Footer */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto', paddingTop: '12px', borderTop: '1px solid var(--border-color)' }}>
                <span className="badge badge-emerald">✓ Recognized Institution</span>
                <a 
                  href={col.website} 
                  target="_blank" 
                  rel="noreferrer"
                  className="btn btn-secondary btn-sm"
                >
                  <span>Official Portal</span>
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
