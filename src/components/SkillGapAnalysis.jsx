import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { MOCK_CAREERS } from '../data/mockData';
import { 
  Map, CheckCircle2, AlertTriangle, Sparkles, BookOpen, 
  ExternalLink, Calendar, CheckSquare, Square, ArrowUpRight
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const SkillGapAnalysis = () => {
  const { studentProfile, setStudentProfile, targetCareer, setTargetCareer } = useApp();

  // Acquired vs Missing Skills
  const acquiredSkills = targetCareer.requiredSkills.filter(sk => 
    studentProfile.skills.some(userSk => userSk.toLowerCase() === sk.toLowerCase())
  );

  const missingSkills = targetCareer.requiredSkills.filter(sk => 
    !studentProfile.skills.some(userSk => userSk.toLowerCase() === sk.toLowerCase())
  );

  const handleAcquireSkill = (skillToAcquire) => {
    const cleanSkill = skillToAcquire.includes('/') ? skillToAcquire.split('/')[0].trim() : skillToAcquire;
    if (!studentProfile.skills.some(s => s.toLowerCase() === cleanSkill.toLowerCase())) {
      setStudentProfile(prev => ({
        ...prev,
        skills: [...prev.skills, cleanSkill]
      }));
      confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
    }
  };

  const getLearningUrl = (skillName) => {
    const query = encodeURIComponent(`${skillName} free tutorial nptel course`);
    return `https://www.youtube.com/results?search_query=${query}`;
  };

  // Local state for month topic completion checkboxes
  const [roadmapState, setRoadmapState] = useState(
    targetCareer.roadmap || MOCK_CAREERS[0].roadmap
  );

  const toggleTopicCompleted = (monthIndex, topicIndex) => {
    setRoadmapState(prev => {
      const updated = [...prev];
      const monthObj = { ...updated[monthIndex] };
      const topics = [...monthObj.topics];
      
      // If clicking individual topic, toggle it
      topics[topicIndex] = topics[topicIndex].startsWith('✅ ')
        ? topics[topicIndex].replace('✅ ', '')
        : '✅ ' + topics[topicIndex];
      
      monthObj.topics = topics;
      
      // Check if all topics in month completed
      const allDone = topics.every(t => t.startsWith('✅ '));
      monthObj.completed = allDone;
      
      if (allDone) {
        confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
      }

      updated[monthIndex] = monthObj;
      return updated;
    });
  };

  const totalTopics = roadmapState.reduce((acc, m) => acc + m.topics.length, 0);
  const completedTopics = roadmapState.reduce(
    (acc, m) => acc + m.topics.filter(t => t.startsWith('✅ ')).length, 0
  );
  const progressPercent = Math.round((completedTopics / totalTopics) * 100);

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Top Banner */}
      <div className="glass-card" style={{ padding: '28px', background: 'linear-gradient(135deg, rgba(6,182,212,0.15) 0%, rgba(99,102,241,0.1) 100%)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <span className="badge badge-cyan" style={{ marginBottom: '8px' }}>Module 3 & 4: Skill Gap & Learning Roadmap</span>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '6px' }} className="gradient-text-cyan">
              Target Career: {targetCareer.title}
            </h2>
            <p style={{ color: 'var(--text-muted)', maxWidth: '750px' }}>
              MargDarshak AI identified your acquired skills vs critical industry skill gaps. Follow your month-by-month learning roadmap below to reach 100% job readiness.
            </p>
          </div>

          {/* Quick Target Selector */}
          <div className="input-group" style={{ minWidth: '240px' }}>
            <label className="input-label" style={{ color: '#67e8f9' }}>Change Target Career Role:</label>
            <select 
              className="select-field"
              value={targetCareer.id}
              onChange={e => {
                const found = MOCK_CAREERS.find(c => c.id === e.target.value);
                if (found) {
                  setTargetCareer(found);
                  setRoadmapState(found.roadmap);
                }
              }}
            >
              {MOCK_CAREERS.map(c => (
                <option key={c.id} value={c.id}>{c.title}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Skill Gap Matrix Card */}
      <div className="grid-2">
        {/* Acquired Skills */}
        <div className="glass-card" style={{ padding: '24px', borderLeft: '4px solid var(--accent-emerald)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <CheckCircle2 color="#34d399" size={22} />
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Acquired Skills ({acquiredSkills.length})</h3>
            </div>
            <span className="badge badge-emerald">Verified</span>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {acquiredSkills.length > 0 ? (
              acquiredSkills.map((sk, idx) => (
                <span key={idx} className="badge badge-emerald" style={{ padding: '8px 14px', fontSize: '0.88rem' }}>
                  ✓ {sk}
                </span>
              ))
            ) : (
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>No matching skills acquired yet for this role.</p>
            )}
          </div>
        </div>

        {/* Missing Skills */}
        <div className="glass-card" style={{ padding: '24px', borderLeft: '4px solid var(--accent-amber)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <AlertTriangle color="#fbbf24" size={22} />
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Skill Gaps to Prioritize ({missingSkills.length})</h3>
            </div>
            <span className="badge badge-amber">Action Required</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {missingSkills.length > 0 ? (
              missingSkills.map((sk, idx) => (
                <div 
                  key={idx} 
                  style={{
                    display: 'flex', 
                    alignItems: 'center', 
                    justify: 'space-between', 
                    padding: '8px 12px', 
                    borderRadius: 'var(--radius-sm)',
                    background: 'rgba(251, 191, 36, 0.08)',
                    border: '1px solid rgba(251, 191, 36, 0.2)',
                    flexWrap: 'wrap',
                    gap: '8px'
                  }}
                >
                  <span style={{ fontSize: '0.88rem', fontWeight: 600, color: '#fcd34d' }}>
                    ⚠ {sk}
                  </span>
                  
                  <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                    <a 
                      href={getLearningUrl(sk)} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="btn btn-secondary btn-sm"
                      style={{ fontSize: '0.72rem', padding: '4px 8px', textDecoration: 'none' }}
                      title="Open free tutorials for this skill"
                    >
                      <BookOpen size={12} />
                      <span>Learn</span>
                    </a>
                    
                    <button 
                      onClick={() => handleAcquireSkill(sk)}
                      className="btn btn-primary btn-sm"
                      style={{ fontSize: '0.72rem', padding: '4px 10px', background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', border: 'none' }}
                      title="Mark as acquired in your Profile & ATS Resume"
                    >
                      + Acquire Skill
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p style={{ color: '#34d399', fontSize: '0.85rem', fontWeight: 600 }}>🎉 Outstanding! You already possess all target skills!</p>
            )}
          </div>
        </div>
      </div>

      {/* Interactive 6-Month Roadmap Section */}
      <div className="glass-card" style={{ padding: '28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Map color="#818cf8" size={24} />
              <h3 style={{ fontSize: '1.4rem', fontWeight: 800 }}>6-Month Personalized Learning Roadmap</h3>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginTop: '4px' }}>
              Click on topics as you complete them to track live milestone progress and earn readiness badges.
            </p>
          </div>

          {/* Progress Bar & Percentage */}
          <div style={{ minWidth: '220px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 700 }}>
              <span>Roadmap Progress</span>
              <span className="gradient-text-cyan">{progressPercent}%</span>
            </div>
            <div style={{ width: '100%', height: '10px', background: 'rgba(255,255,255,0.08)', borderRadius: '99px', overflow: 'hidden' }}>
              <div style={{ 
                height: '100%', 
                width: `${progressPercent}%`, 
                background: 'linear-gradient(90deg, #06b6d4 0%, #6366f1 100%)',
                borderRadius: '99px',
                transition: 'width 0.4s ease'
              }} />
            </div>
          </div>
        </div>

        {/* Timeline Grid */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {roadmapState.map((monthItem, mIdx) => (
            <div 
              key={mIdx}
              className="glass-card"
              style={{
                padding: '20px',
                background: monthItem.completed ? 'rgba(16, 185, 129, 0.08)' : 'rgba(255, 255, 255, 0.02)',
                borderColor: monthItem.completed ? 'rgba(16, 185, 129, 0.3)' : 'var(--border-color)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px', flexWrap: 'wrap', gap: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    background: monthItem.completed ? 'rgba(16, 185, 129, 0.2)' : 'rgba(99, 102, 241, 0.2)',
                    color: monthItem.completed ? '#34d399' : '#818cf8',
                    padding: '6px 14px',
                    borderRadius: 'var(--radius-sm)',
                    fontWeight: 700,
                    fontSize: '0.85rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}>
                    <Calendar size={14} />
                    <span>{monthItem.month}</span>
                  </div>
                  <h4 style={{ fontSize: '1.1rem', fontWeight: 700 }}>{monthItem.title}</h4>
                </div>

                {monthItem.completed && (
                  <span className="badge badge-emerald">✓ Month Milestone Completed</span>
                )}
              </div>

              {/* Topics Checkbox Grid */}
              <div className="grid-2">
                {monthItem.topics.map((topic, tIdx) => {
                  const isChecked = topic.startsWith('✅ ');
                  const topicText = topic.replace('✅ ', '');
                  return (
                    <div 
                      key={tIdx}
                      onClick={() => toggleTopicCompleted(mIdx, tIdx)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        padding: '10px 14px',
                        background: 'rgba(0, 0, 0, 0.25)',
                        borderRadius: 'var(--radius-sm)',
                        cursor: 'pointer',
                        border: isChecked ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid var(--border-color)',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      {isChecked ? (
                        <CheckSquare color="#34d399" size={18} />
                      ) : (
                        <Square color="var(--text-muted)" size={18} />
                      )}
                      <span style={{ 
                        fontSize: '0.88rem', 
                        color: isChecked ? '#34d399' : 'var(--text-main)',
                        textDecoration: isChecked ? 'line-through' : 'none'
                      }}>
                        {topicText}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recommended Learning Courses / Platforms */}
      <div className="glass-card" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
          <BookOpen color="#a855f7" size={22} />
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Recommended Free & Certification Resources</h3>
        </div>

        <div className="grid-3">
          <div className="glass-card" style={{ padding: '16px' }}>
            <div style={{ fontWeight: 700, color: '#c084fc', marginBottom: '4px' }}>SWAYAM / NPTEL (Govt of India)</div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '12px' }}>
              Free online courses by IITs & IISc with Govt certifications.
            </p>
            <a href="https://swayam.gov.in" target="_blank" rel="noreferrer" className="btn btn-secondary btn-sm">
              <span>Explore NPTEL</span>
              <ExternalLink size={14} />
            </a>
          </div>

          <div className="glass-card" style={{ padding: '16px' }}>
            <div style={{ fontWeight: 700, color: '#67e8f9', marginBottom: '4px' }}>Coursera & AICTE Student Gateway</div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '12px' }}>
              Free access for students via AICTE & SWAYAM portal.
            </p>
            <a href="https://freecourses.aicte-india.org" target="_blank" rel="noreferrer" className="btn btn-secondary btn-sm">
              <span>AICTE Free Courses</span>
              <ExternalLink size={14} />
            </a>
          </div>

          <div className="glass-card" style={{ padding: '16px' }}>
            <div style={{ fontWeight: 700, color: '#34d399', marginBottom: '4px' }}>Kaggle & GitHub Learn</div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '12px' }}>
              Hands-on coding labs, datasets, and open source projects.
            </p>
            <a href="https://kaggle.com/learn" target="_blank" rel="noreferrer" className="btn btn-secondary btn-sm">
              <span>Kaggle Micro-Courses</span>
              <ExternalLink size={14} />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
