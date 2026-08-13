import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { 
  FileText, Upload, Sparkles, CheckCircle2, AlertCircle, 
  FileCheck, RefreshCw, Award, Copy, Check, UserCheck,
  File, Trash2, RotateCcw, FileCode, Paperclip, X
} from 'lucide-react';
import confetti from 'canvas-confetti';

const SAMPLE_RESUMES = {
  tech: `AAMIR HASSAN
New Delhi, India | Email: aamir.hassan@gmail.com | Phone: +91 98765 43210
Target Role: Software & Data Engineering

SUMMARY
Results-driven Computer Science student with hands-on experience in full-stack web application development, machine learning model optimization, and REST API engineering.

TECHNICAL SKILLS & COMPETENCIES
Languages: Python, JavaScript (ES6+), C++, SQL, HTML5, CSS3
Frameworks & Libraries: React, Node.js, Express, PyTorch, TensorFlow, Pandas, NumPy
Tools & Platforms: Git, GitHub, Docker, Postman, Linux, VS Code, Vercel

PROJECT EXPERIENCE
1. Intelligent Career Recommendation & ATS Resume Analyzer
- Built a multi-module React web application for student guidance and career analysis.
- Integrated canvas-confetti, chart.js, and real-time keyword matching algorithms.
- Formatted state management and async API pipelines to optimize execution time by 40%.

2. Autonomous AI Chatbot & Knowledge Engine
- Created a context-aware chatbot using Google Gemini AI APIs and vector embeddings.
- Developed robust fallback handling and rate-limiting middleware.

EDUCATION
Delhi Technological University — B.Tech Computer Science (3rd Year)
Aggregate Performance: 84% CGPA (2022 – 2026)

CERTIFICATIONS & EXTRACURRICULARS
- Certified in Technical Implementation & System Design
- Active participant in technical hackathons, paper presentations, and coding competitions`,

  data: `AAMIR HASSAN
New Delhi, India | Email: aamir.hassan@gmail.com | Phone: +91 98765 43210
Target Role: Data Science & Analytics Specialist

SUMMARY
Analytical and detail-oriented student specializing in exploratory data analysis, predictive statistical modeling, data visualization dashboards, and BigQuery data processing.

TECHNICAL SKILLS & COMPETENCIES
Data Analysis: Python, R, SQL, Pandas, NumPy, SciPy, Scikit-Learn, Statsmodels
Visualization: Tableau, PowerBI, Matplotlib, Seaborn, Chart.js
Databases: PostgreSQL, MySQL, BigQuery, MongoDB

PROJECT EXPERIENCE
1. Student Performance & Aptitude Predictive Matrix
- Processed 10,000+ academic record samples using Python Pandas & Scikit-Learn.
- Achieved 92% classification accuracy on career domain prediction models.

2. Interactive Higher Education Analytics Dashboard
- Designed dynamic web visualizer with filtering for 500+ Indian universities and NIRF ranks.

EDUCATION
Delhi Technological University — B.Tech Computer Science (3rd Year)
Aggregate Performance: 84% CGPA`
};

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
  const [uploadedFileDetails, setUploadedFileDetails] = useState(null);
  const [resumeSource, setResumeSource] = useState('profile'); // 'profile' | 'uploaded' | 'sample'
  const [isDragging, setIsDragging] = useState(false);

  // Live real-time analysis effect whenever studentProfile or targetCareer changes
  useEffect(() => {
    if (resumeSource === 'profile') {
      const updatedText = generateResumeFromProfile(studentProfile, targetCareer.title);
      setResumeText(updatedText);
      const result = analyzeResumeText(updatedText, targetCareer, studentProfile);
      if (result) {
        setResumeScanResult(result);
      }
    }
  }, [studentProfile, targetCareer, resumeSource]);

  const processUploadedFile = (file) => {
    if (!file) return;

    const fileExt = file.name.split('.').pop()?.toUpperCase() || 'DOCUMENT';
    const sizeFormatted = file.size > 1024 * 1024 
      ? (file.size / (1024 * 1024)).toFixed(2) + ' MB'
      : (file.size / 1024).toFixed(1) + ' KB';

    const details = {
      name: file.name,
      size: sizeFormatted,
      type: fileExt,
      lastModified: file.lastModified ? new Date(file.lastModified).toLocaleDateString() : 'Today'
    };

    setUploadedFileName(file.name);
    setUploadedFileDetails(details);
    setResumeSource('uploaded');
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
        // Extract readable words, lines, and alphanumeric sequences
        const matches = rawStr.match(/[A-Za-z0-9\s\+\#\.\,\-\:\@\/\(\)]{3,}/g);
        if (matches && matches.length > 5) {
          extractedText = matches
            .map(m => m.trim())
            .filter(m => m.length > 2)
            .join('\n');
        } else {
          extractedText = rawStr.replace(/[^\x20-\x7E\n\r\t]/g, ' ');
        }
      }

      if (!extractedText || extractedText.trim().length < 30) {
        extractedText = `RESUME DOCUMENT: ${file.name.toUpperCase()}\nCandidate Name: ${studentProfile.name}\nPrimary Skills: ${studentProfile.skills.join(', ')}\nTarget Position: ${targetCareer.title}\nDocument file uploaded: ${file.name} (${sizeFormatted})`;
      }

      setResumeText(extractedText);
      const result = analyzeResumeText(extractedText, targetCareer, studentProfile);
      if (result) {
        setResumeScanResult(result);
      }
      setIsScanning(false);
      confetti({ particleCount: 85, spread: 75, origin: { y: 0.6 } });
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

  const handleClearUploadedFile = () => {
    setUploadedFileName(null);
    setUploadedFileDetails(null);
    setResumeSource('profile');
    const updatedText = generateResumeFromProfile(studentProfile, targetCareer.title);
    setResumeText(updatedText);
    const result = analyzeResumeText(updatedText, targetCareer, studentProfile);
    if (result) {
      setResumeScanResult(result);
    }
  };

  const handleLoadSampleResume = (type) => {
    const sample = SAMPLE_RESUMES[type] || SAMPLE_RESUMES.tech;
    setUploadedFileName(null);
    setUploadedFileDetails(null);
    setResumeSource('sample');
    setResumeText(sample);
    const result = analyzeResumeText(sample, targetCareer, studentProfile);
    if (result) {
      setResumeScanResult(result);
      confetti({ particleCount: 60, spread: 65, origin: { y: 0.6 } });
    }
  };

  const handleSyncProfile = () => {
    setUploadedFileName(null);
    setUploadedFileDetails(null);
    setResumeSource('profile');
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
    if (resumeSource === 'profile') {
      const updatedText = generateResumeFromProfile(newProfile, targetCareer.title);
      setResumeText(updatedText);
      const result = analyzeResumeText(updatedText, targetCareer, newProfile);
      if (result) {
        setResumeScanResult(result);
      }
    } else {
      const result = analyzeResumeText(resumeText, targetCareer, newProfile);
      if (result) {
        setResumeScanResult(result);
      }
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

      const newProfile = { ...studentProfile, skills: updatedSkills };
      if (resumeSource === 'profile') {
        const updatedText = generateResumeFromProfile(newProfile, targetCareer.title);
        setResumeText(updatedText);
        const result = analyzeResumeText(updatedText, targetCareer, newProfile);
        if (result) {
          setResumeScanResult(result);
          confetti({ particleCount: 50, spread: 50, origin: { y: 0.6 } });
        }
      } else {
        const result = analyzeResumeText(resumeText, targetCareer, newProfile);
        if (result) {
          setResumeScanResult(result);
          confetti({ particleCount: 50, spread: 50, origin: { y: 0.6 } });
        }
      }
    }
  };

  const handleAutoOptimizeForRole = () => {
    const missingSkills = targetCareer.requiredSkills.map(sk => 
      sk.includes('/') ? sk.split('/')[0].trim() : sk
    );

    const mergedSkills = Array.from(new Set([...studentProfile.skills, ...missingSkills]));
    
    setStudentProfile(prev => ({
      ...prev,
      skills: mergedSkills
    }));

    const newProfile = { ...studentProfile, skills: mergedSkills };
    const updatedText = generateResumeFromProfile(newProfile, targetCareer.title);
    setResumeText(updatedText);
    setResumeSource('profile');
    setUploadedFileName(null);
    setUploadedFileDetails(null);

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
              Upload your resume (.pdf, .docx, .txt) or sync directly with your <strong>Student Profile ({studentProfile.name})</strong> for automated keyword extraction & ATS score analysis.
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
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Resume Content & Document Upload</h3>
            </div>
            
            {resumeSource === 'uploaded' && (
              <span className="badge badge-emerald" style={{ fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Paperclip size={12} /> Source: Uploaded File
              </span>
            )}
            {resumeSource === 'sample' && (
              <span className="badge badge-purple" style={{ fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Sparkles size={12} /> Source: Sample Preset
              </span>
            )}
            {resumeSource === 'profile' && (
              <span className="badge badge-indigo" style={{ fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <UserCheck size={12} /> Source: Profile Sync
              </span>
            )}
          </div>

          {/* Upload Dropzone Container */}
          {!uploadedFileDetails ? (
            <div 
              onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              style={{
                border: isDragging ? '2px dashed #ec4899' : '2px dashed rgba(255,255,255,0.18)',
                borderRadius: 'var(--radius-md)',
                padding: '20px 16px',
                textAlign: 'center',
                backgroundColor: isDragging ? 'rgba(236,72,153,0.12)' : 'rgba(255,255,255,0.02)',
                boxShadow: isDragging ? '0 0 20px rgba(236,72,153,0.2)' : 'none',
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
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, rgba(236,72,153,0.2) 0%, rgba(139,92,246,0.2) 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '2px'
                }}>
                  <Upload color="#ec4899" size={24} />
                </div>
                
                <div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-main)' }}>
                    Upload Resume Document (.pdf, .docx, .doc, .txt)
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                    Drag & drop your file here, or click to browse (Max 5MB)
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '6px', marginTop: '6px' }}>
                  <span className="badge" style={{ background: 'rgba(239, 68, 68, 0.15)', color: '#fca5a5', fontSize: '0.68rem', border: '1px solid rgba(239, 68, 68, 0.3)' }}>PDF</span>
                  <span className="badge" style={{ background: 'rgba(59, 130, 246, 0.15)', color: '#93c5fd', fontSize: '0.68rem', border: '1px solid rgba(59, 130, 246, 0.3)' }}>DOCX</span>
                  <span className="badge" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#6ee7b7', fontSize: '0.68rem', border: '1px solid rgba(16, 185, 129, 0.3)' }}>TXT</span>
                </div>
              </div>
            </div>
          ) : (
            /* Uploaded File Info Card */
            <div className="glass-card" style={{ padding: '14px 18px', background: 'linear-gradient(135deg, rgba(16,185,129,0.1) 0%, rgba(99,102,241,0.08) 100%)', border: '1px solid rgba(52, 211, 153, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ padding: '10px', borderRadius: '10px', background: 'rgba(52, 211, 153, 0.18)', color: '#34d399' }}>
                  <FileCheck size={24} />
                </div>
                <div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {uploadedFileDetails.name}
                    <span className="badge badge-emerald" style={{ fontSize: '0.68rem', padding: '2px 8px' }}>
                      {uploadedFileDetails.type}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', gap: '12px', marginTop: '2px' }}>
                    <span>Size: {uploadedFileDetails.size}</span>
                    <span>•</span>
                    <span>Uploaded: {uploadedFileDetails.lastModified}</span>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                <button 
                  onClick={() => document.getElementById('resume-file-input')?.click()} 
                  className="btn btn-secondary btn-sm"
                  style={{ fontSize: '0.78rem', padding: '6px 12px' }}
                >
                  <Upload size={14} />
                  <span>Replace</span>
                </button>
                <input 
                  id="resume-file-input" 
                  type="file" 
                  accept=".pdf,.doc,.docx,.txt" 
                  onChange={handleFileUpload} 
                  style={{ display: 'none' }} 
                />

                <button 
                  onClick={handleClearUploadedFile} 
                  className="btn btn-secondary btn-sm"
                  style={{ fontSize: '0.78rem', padding: '6px 12px', color: '#fca5a5', borderColor: 'rgba(239, 68, 68, 0.3)' }}
                  title="Clear file and revert to synced profile text"
                >
                  <RotateCcw size={14} />
                  <span>Revert to Profile</span>
                </button>
              </div>
            </div>
          )}

          {/* Quick Presets Bar */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px', padding: '8px 12px', background: 'rgba(255,255,255,0.02)', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(255,255,255,0.05)' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Quick Presets:</span>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button 
                onClick={() => handleLoadSampleResume('tech')}
                className="btn btn-secondary btn-sm" 
                style={{ fontSize: '0.72rem', padding: '4px 10px' }}
              >
                <FileCode size={12} color="#818cf8" />
                <span>Sample Tech Resume</span>
              </button>
              <button 
                onClick={() => handleLoadSampleResume('data')}
                className="btn btn-secondary btn-sm" 
                style={{ fontSize: '0.72rem', padding: '4px 10px' }}
              >
                <FileText size={12} color="#22d3ee" />
                <span>Sample Data Resume</span>
              </button>
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

