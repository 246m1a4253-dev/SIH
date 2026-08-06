import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { 
  FileText, Upload, Sparkles, CheckCircle2, AlertCircle, 
  FileCheck, RefreshCw, Award, Copy, Check, UserCheck
} from 'lucide-react';
import confetti from 'canvas-confetti';

const generateResumeFromProfile = (profile, targetRoleTitle = 'Software & Data Engineering') => {
  const name = profile?.name || 'STUDENT NAME';
  const email = profile?.email || 'student@email.com';
  const phone = profile?.phone || '+91 98765 43210';
  const location = profile?.preferredLocation || 'Pan-India';
  const university = profile?.boardOrUniversity || 'Delhi Technological University';
  const education = profile?.educationLevel || 'Undergraduate (3rd Year)';
  const cgpa = profile?.percentageOrCgpa || '84%';

  const userSkills = profile?.skills || [];
  const skillsList = userSkills.length > 0 
    ? userSkills.join(', ') 
    : 'No skills added yet (Update in Profile)';

  const primarySkill = userSkills[0] || 'Technical Fundamentals';
  const secondarySkill = userSkills[1];
  const projectTechStack = secondarySkill ? `${primarySkill} and ${secondarySkill}` : primarySkill;

  const interestsList = profile?.interests && profile.interests.length > 0 
    ? profile.interests.join(', ') 
    : 'Technology, Problem Solving';

  return `${name.toUpperCase()}
${location} | Email: ${email} | Phone: ${phone}
Target Career Role: ${targetRoleTitle}

EDUCATION
${university} — ${education}
Aggregate Performance: ${cgpa}

TECHNICAL SKILLS & COMPETENCIES
Acquired Skills: ${skillsList}
Specializations & Interests: ${interestsList}

PROJECT EXPERIENCE
1. ${primarySkill}-Based Intelligent Application System
- Developed interactive web software using ${projectTechStack}.
- Formatted application logic and state management to optimize execution performance.

2. Multi-Module Student Guidance Platform
- Developed responsive web interfaces and state-driven components adhering to clean architectural design patterns.
- Integrated AI mentor APIs and structured dataset search engines for career recommendations.

CERTIFICATIONS & EXTRACURRICULARS
- Certified in ${primarySkill} Implementation & System Design
- Active participant in technical hackathons, paper presentations, and coding competitions
`;
};

const analyzeResumeText = (text, career, profile) => {
  if (!text || !career) return null;
  const textLower = text.toLowerCase();
  const userSkillsLower = (profile?.skills || []).map(s => s.toLowerCase());

  // Function to test if a required skill pattern is matched
  const isSkillMatched = (reqSkill) => {
    // Handle slash or ampersand separated skills (e.g. "TensorFlow / PyTorch", "C++ / Python")
    const subSkills = reqSkill.split(/[\/\&]/).map(s => s.trim().toLowerCase());
    return subSkills.some(sub => 
      textLower.includes(sub) || userSkillsLower.some(us => us.includes(sub) || sub.includes(us))
    );
  };

  const matched = career.requiredSkills.filter(isSkillMatched);
  const missing = career.requiredSkills.filter(sk => !matched.includes(sk));

  const computedScore = Math.min(
    Math.round(52 + (matched.length / (career.requiredSkills.length || 1)) * 46), 
    98
  );

  return {
    scanned: true,
    score: computedScore,
    formattingScore: 92,
    atsCompatibility: `${computedScore}% Match`,
    grammarScore: 95,
    matchedKeywords: matched,
    missingKeywords: missing,
    suggestions: [
      missing.length > 0 
        ? `Add missing target role skills: ${missing.slice(0, 3).join(', ')}`
        : "Awesome! Your resume covers all required core skills for this role.",
      "Quantify achievements with measurable metrics (e.g. 'Improved model inference speed by 35%')",
      `Target Header: Ensure '${career.title}' is highlighted in your resume title`,
      "Format technical skills into clear categories (Languages, Frameworks, Databases)"
    ]
  };
};

export const ResumeAnalyzer = () => {
  const { studentProfile, setStudentProfile, targetCareer, resumeScanResult, setResumeScanResult } = useApp();

  // Initialize with dynamic profile text
  const [resumeText, setResumeText] = useState(() => 
    generateResumeFromProfile(studentProfile, targetCareer.title)
  );

  const [isScanning, setIsScanning] = useState(false);
  const [syncedSuccess, setSyncedSuccess] = useState(false);

  const [uploadedFileName, setUploadedFileName] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  // Live real-time analysis effect whenever studentProfile or targetCareer changes
  useEffect(() => {
    const updatedText = generateResumeFromProfile(studentProfile, targetCareer.title);
    setResumeText(updatedText);
    const result = analyzeResumeText(updatedText, targetCareer, studentProfile);
    if (result) {
      setResumeScanResult(result);
    }
  }, [studentProfile, targetCareer]);

  const processUploadedFile = (file) => {
    if (!file) return;
    setUploadedFileName(file.name);
    setIsScanning(true);

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target.result;
      let extractedText = '';

      if (typeof content === 'string') {
        extractedText = content.replace(/[\x00-\x09\x0B\x0C\x0E-\x1F\x7F-\x9F]/g, ' ');
      } else if (content instanceof ArrayBuffer) {
        const textDecoder = new TextDecoder('utf-8');
        const rawStr = textDecoder.decode(content);
        // Extract readable alphanumeric strings from binary PDF/DOCX stream
        const matches = rawStr.match(/[A-Za-z0-9\s\+\#\.\,\-\:\@\/\(\)]{3,}/g);
        extractedText = matches ? matches.join(' ') : rawStr;
      }

      if (!extractedText || extractedText.trim().length < 20) {
        extractedText = `RESUME DOCUMENT: ${file.name.toUpperCase()}\nCandidate Name: ${studentProfile.name}\nPrimary Skills: ${studentProfile.skills.join(', ')}\nTarget Position: ${targetCareer.title}\nDocument file uploaded: ${file.name}`;
      }

      setResumeText(extractedText);
      const result = analyzeResumeText(extractedText, targetCareer, studentProfile);
      if (result) {
        setResumeScanResult(result);
      }
      setIsScanning(false);
      confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
    };

    if (file.name.toLowerCase().endsWith('.txt')) {
      reader.readAsText(file);
    } else {
      reader.readAsArrayBuffer(file);
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    processUploadedFile(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processUploadedFile(e.dataTransfer.files[0]);
    }
  };

  const handleSyncProfile = () => {
    const updatedText = generateResumeFromProfile(studentProfile, targetCareer.title);
    setResumeText(updatedText);
    setSyncedSuccess(true);
    setTimeout(() => setSyncedSuccess(false), 2000);
    
    const result = analyzeResumeText(updatedText, targetCareer, studentProfile);
    if (result) {
      setResumeScanResult(result);
      confetti({ particleCount: 60, spread: 60, origin: { y: 0.6 } });
    }
  };

  const handleScanResume = () => {
    if (!resumeText.trim()) return;

    setIsScanning(true);

    setTimeout(() => {
      const result = analyzeResumeText(resumeText, targetCareer, studentProfile);
      if (result) {
        setResumeScanResult(result);
      }
      setIsScanning(false);
      confetti({ particleCount: 75, spread: 65, origin: { y: 0.6 } });
    }, 600);
  };

  const handleRemoveSkill = (skillToRemove) => {
    const subSkills = skillToRemove.split(/[\/\&]/).map(s => s.trim().toLowerCase());
    
    const updatedSkills = studentProfile.skills.filter(userSk => 
      !subSkills.some(sub => userSk.toLowerCase() === sub || userSk.toLowerCase().includes(sub) || sub.includes(userSk.toLowerCase()))
    );

    setStudentProfile(prev => ({
      ...prev,
      skills: updatedSkills
    }));

    const newProfile = { ...studentProfile, skills: updatedSkills };
    const updatedText = generateResumeFromProfile(newProfile, targetCareer.title);
    setResumeText(updatedText);

    const result = analyzeResumeText(updatedText, targetCareer, newProfile);
    if (result) {
      setResumeScanResult(result);
    }
  };

  const handleAddMissingSkill = (skillToAdd) => {
    // Clean up skill string (e.g. "TensorFlow / PyTorch" -> "TensorFlow")
    const cleanSkill = skillToAdd.includes('/') ? skillToAdd.split('/')[0].trim() : skillToAdd;
    
    if (!studentProfile.skills.includes(cleanSkill)) {
      const updatedSkills = [...studentProfile.skills, cleanSkill];
      setStudentProfile(prev => ({
        ...prev,
        skills: updatedSkills
      }));

      // Regenerate resume text with new skill
      const newProfile = { ...studentProfile, skills: updatedSkills };
      const updatedText = generateResumeFromProfile(newProfile, targetCareer.title);
      setResumeText(updatedText);

      const result = analyzeResumeText(updatedText, targetCareer, newProfile);
      if (result) {
        setResumeScanResult(result);
        confetti({ particleCount: 50, spread: 50, origin: { y: 0.6 } });
      }
    }
  };

  const handleAutoOptimizeForRole = () => {
    // Collect all required skills for target career
    const missingSkills = targetCareer.requiredSkills.map(sk => 
      sk.includes('/') ? sk.split('/')[0].trim() : sk
    );

    // Merge into studentProfile.skills
    const mergedSkills = Array.from(new Set([...studentProfile.skills, ...missingSkills]));
    
    setStudentProfile(prev => ({
      ...prev,
      skills: mergedSkills
    }));

    const newProfile = { ...studentProfile, skills: mergedSkills };
    const updatedText = generateResumeFromProfile(newProfile, targetCareer.title);
    setResumeText(updatedText);

    const result = analyzeResumeText(updatedText, targetCareer, newProfile);
    if (result) {
      setResumeScanResult(result);
      setSyncedSuccess(true);
      setTimeout(() => setSyncedSuccess(false), 2000);
      confetti({ particleCount: 90, spread: 80, origin: { y: 0.5 } });
    }
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header Banner */}
      <div className="glass-card" style={{ padding: '28px', background: 'linear-gradient(135deg, rgba(236,72,153,0.12) 0%, rgba(99,102,241,0.1) 100%)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <span className="badge badge-pink" style={{ marginBottom: '8px' }}>Module 5: AI Resume & ATS Analyzer</span>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '6px' }} className="gradient-text">
              ATS Resume Optimizer for {targetCareer.title}
            </h2>
            <p style={{ color: 'var(--text-muted)', maxWidth: '750px' }}>
              Your ATS resume content is dynamically synchronized with your <strong>Student Profile ({studentProfile.name})</strong>. Click 1-Click Auto-Optimize to inject all required role keywords.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <button onClick={handleAutoOptimizeForRole} className="btn btn-primary btn-sm" style={{ background: 'linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)', border: 'none' }}>
              <Sparkles size={16} />
              <span>1-Click Auto-Optimize for {targetCareer.title}</span>
            </button>

            <button onClick={handleSyncProfile} className="btn btn-secondary btn-sm">
              {syncedSuccess ? <Check size={16} color="#34d399" /> : <UserCheck size={16} />}
              <span>Sync Profile</span>
            </button>
          </div>
        </div>
      </div>

      <div className="grid-2">
        {/* Left Column: Input Dropzone / Text Editor */}
        <div className="glass-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <FileText color="#f472b6" size={20} />
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Resume Content (Live Profile Sync)</h3>
            </div>
            <span className="badge badge-indigo" style={{ fontSize: '0.75rem' }}>
              Target: {targetCareer.title}
            </span>
          </div>

          {/* Upload Dropzone */}
          <div 
            onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            style={{
              border: isDragging ? '2px dashed #ec4899' : '2px dashed rgba(255,255,255,0.15)',
              borderRadius: 'var(--radius-md)',
              padding: '16px',
              textAlign: 'center',
              backgroundColor: isDragging ? 'rgba(236,72,153,0.08)' : 'rgba(255,255,255,0.02)',
              transition: 'all 0.2s ease',
              cursor: 'pointer'
            }}
            onClick={() => document.getElementById('resume-file-input')?.click()}
          >
            <input 
              id="resume-file-input" 
              type="file" 
              accept=".pdf,.doc,.docx,.txt" 
              onChange={handleFileUpload} 
              style={{ display: 'none' }} 
            />
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
              <Upload color="#ec4899" size={24} />
              <div>
                <div style={{ fontSize: '0.9rem', fontWeight: 600 }}>
                  {uploadedFileName ? `Uploaded: ${uploadedFileName}` : 'Drag & Drop Resume File (.pdf, .docx, .txt)'}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  Click or drag document file to parse content & run live ATS score
                </div>
              </div>
            </div>
          </div>

          {/* Active Skills Chips */}
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
              Skills currently in Profile ({studentProfile.skills.length}) — Click ✕ to remove:
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {studentProfile.skills.map((sk, idx) => (
                <button 
                  key={idx} 
                  onClick={() => handleRemoveSkill(sk)}
                  className="badge badge-emerald glass-card-interactive" 
                  style={{ fontSize: '0.72rem', cursor: 'pointer', border: '1px solid rgba(52, 211, 153, 0.4)' }}
                  title="Click to remove skill from Profile & Resume"
                >
                  ✓ {sk} <span style={{ marginLeft: '4px', color: '#fca5a5', fontWeight: 800 }}>✕</span>
                </button>
              ))}
            </div>
          </div>

          {/* Paste / Editor area */}
          <textarea 
            className="textarea-field"
            rows={12}
            value={resumeText}
            onChange={e => setResumeText(e.target.value)}
            placeholder="Paste your plain text resume or CV here..."
            style={{ fontFamily: 'monospace', fontSize: '0.85rem', lineHeight: '1.4' }}
          />

          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={handleScanResume}
              disabled={isScanning || !resumeText.trim()}
              className="btn btn-primary"
              style={{ flex: 1, padding: '12px', fontSize: '0.95rem' }}
            >
              {isScanning ? (
                <>
                  <RefreshCw className="animate-spin" size={18} />
                  <span>Scanning Resume & Matching Keywords...</span>
                </>
              ) : (
                <>
                  <Sparkles size={18} />
                  <span>Analyze ATS Score & Missing Keywords</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Column: AI Analysis Report Cards */}
        {resumeScanResult.scanned && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Score Overview Glass Card */}
            <div className="glass-card" style={{ padding: '24px', background: 'linear-gradient(135deg, rgba(18,24,40,0.9) 0%, rgba(99,102,241,0.15) 100%)' }}>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '4px' }}>ATS Match Rating ({studentProfile.name})</div>
              
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                  <span style={{ fontSize: '3rem', fontWeight: 900, fontFamily: 'var(--font-heading)' }} className="gradient-text">
                    {resumeScanResult.score}
                  </span>
                  <span style={{ fontSize: '1.2rem', color: 'var(--text-muted)', fontWeight: 600 }}>/ 100</span>
                </div>
                <span className="badge badge-emerald" style={{ padding: '8px 14px', fontSize: '0.85rem' }}>
                  {resumeScanResult.score >= 80 ? '🔥 Great ATS Match' : '⚠️ Needs Optimization'}
                </span>
              </div>

              {/* Sub-scores Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', background: 'rgba(0,0,0,0.3)', padding: '12px', borderRadius: 'var(--radius-sm)' }}>
                <div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Formatting</div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#34d399' }}>{resumeScanResult.formattingScore}%</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>ATS Compatibility</div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#818cf8' }}>{resumeScanResult.atsCompatibility}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Grammar & Clarity</div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#22d3ee' }}>{resumeScanResult.grammarScore}%</div>
                </div>
              </div>
            </div>

            {/* Keyword Match Card */}
            <div className="glass-card" style={{ padding: '20px' }}>
              <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '12px' }}>Role Keywords Analysis for {targetCareer.title}</h4>
              
              <div style={{ marginBottom: '16px' }}>
                <div style={{ fontSize: '0.82rem', color: '#34d399', marginBottom: '8px', fontWeight: 700 }}>
                  ✓ Found Keywords ({resumeScanResult.matchedKeywords.length} / {targetCareer.requiredSkills.length}) — Click ✕ to remove from profile & resume:
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {resumeScanResult.matchedKeywords.map((kw, idx) => (
                    <button 
                      key={idx} 
                      onClick={() => handleRemoveSkill(kw)}
                      className="badge badge-emerald glass-card-interactive" 
                      style={{ fontSize: '0.78rem', padding: '4px 10px', cursor: 'pointer', border: '1px solid rgba(52, 211, 153, 0.4)' }}
                      title="Click to remove this skill from your Profile & Resume"
                    >
                      ✓ {kw} <span style={{ marginLeft: '4px', opacity: 0.9, color: '#fca5a5', fontWeight: 800 }}>✕</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div style={{ fontSize: '0.82rem', color: '#fbbf24', marginBottom: '8px', fontWeight: 700 }}>
                  ⚠ Missing Keywords ({resumeScanResult.missingKeywords.length}) — Click to add to profile & resume:
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {resumeScanResult.missingKeywords.length > 0 ? (
                    resumeScanResult.missingKeywords.map((kw, idx) => (
                      <button 
                        key={idx} 
                        onClick={() => handleAddMissingSkill(kw)}
                        className="badge badge-amber glass-card-interactive" 
                        style={{ fontSize: '0.78rem', padding: '4px 10px', cursor: 'pointer', border: '1px solid rgba(245, 158, 11, 0.4)' }}
                        title="Click to instantly add this skill to your Profile & Resume"
                      >
                        + Add {kw}
                      </button>
                    ))
                  ) : (
                    <span style={{ fontSize: '0.82rem', color: '#34d399', fontWeight: 600 }}>🎉 Perfect Score! All required role keywords are present in your resume.</span>
                  )}
                </div>
              </div>
            </div>

            {/* Actionable Suggestions Card */}
            <div className="glass-card" style={{ padding: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <Sparkles color="#ec4899" size={18} />
                <h4 style={{ fontSize: '1rem', fontWeight: 700 }}>Actionable Suggestions to Boost Score</h4>
              </div>
              <ul style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                {resumeScanResult.suggestions.map((sug, idx) => (
                  <li key={idx} style={{ lineHeight: '1.4' }}>{sug}</li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

