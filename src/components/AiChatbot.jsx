import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { MOCK_PROMPTS, MOCK_CAREERS } from '../data/mockData';
import { INDIAN_LANGUAGES } from '../data/languages';
import { 
  Bot, Send, Sparkles, Volume2, User, RefreshCw, Lightbulb, Globe 
} from 'lucide-react';

export const AiChatbot = () => {
  const { 
    studentProfile = {}, 
    targetCareer = MOCK_CAREERS[0], 
    chatMessages = [], 
    setChatMessages,
    language = 'en',
    t
  } = useApp();

  const currentLangObj = INDIAN_LANGUAGES.find(l => l.code === language) || INDIAN_LANGUAGES[0];

  const [inputQuery, setInputQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceMode, setVoiceMode] = useState('pawan_kalyan'); // 'pawan_kalyan' | 'standard'
  const [speakingMsgIdx, setSpeakingMsgIdx] = useState(null);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, isTyping]);

  // Voice loading handler for asynchronous browser speech engines
  const [availableVoices, setAvailableVoices] = useState([]);

  useEffect(() => {
    if (!('speechSynthesis' in window)) return;
    const updateVoices = () => {
      try {
        const vList = window.speechSynthesis.getVoices() || [];
        setAvailableVoices(vList);
      } catch (e) {
        setAvailableVoices([]);
      }
    };
    updateVoices();
    window.speechSynthesis.onvoiceschanged = updateVoices;
  }, []);

  // Voice synthesis helper tailored for Konidala Pawan Kalyan voice persona vs standard
  const speakText = (text, msgIdx) => {
    if (!('speechSynthesis' in window)) return;
    
    if (isSpeaking && speakingMsgIdx === msgIdx) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      setSpeakingMsgIdx(null);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    const voices = availableVoices.length > 0 ? availableVoices : (window.speechSynthesis.getVoices() || []);

    if (voiceMode === 'pawan_kalyan') {
      const indianMaleVoice = voices.find(v => 
        v && v.name && 
        (v.lang.includes('IN') || v.lang.includes('te') || v.name.toLowerCase().includes('india') || v.name.toLowerCase().includes('ravi') || v.name.toLowerCase().includes('hemant') || v.name.toLowerCase().includes('male')) &&
        !v.name.toLowerCase().includes('female') && 
        !v.name.toLowerCase().includes('zira') && 
        !v.name.toLowerCase().includes('heera') && 
        !v.name.toLowerCase().includes('hazel')
      ) || voices.find(v => v && v.name && !v.name.toLowerCase().includes('female') && !v.name.toLowerCase().includes('zira')) || voices[0];

      if (indianMaleVoice) {
        utterance.voice = indianMaleVoice;
      }
      
      // Power Star Konidala Pawan Kalyan Vocal Tuning: Deep, Commanding & Energetic Cadence
      utterance.pitch = 0.82; // Deep resonant masculine tone
      utterance.rate = 0.95;  // Powerful, deliberate, energetic delivery
      utterance.volume = 1.0;
    } else {
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
    }

    utterance.onstart = () => {
      setIsSpeaking(true);
      setSpeakingMsgIdx(msgIdx);
    };
    utterance.onend = () => {
      setIsSpeaking(false);
      setSpeakingMsgIdx(null);
    };
    utterance.onerror = () => {
      setIsSpeaking(false);
      setSpeakingMsgIdx(null);
    };
    
    window.speechSynthesis.speak(utterance);
  };

  const generateBotReply = (userQuery) => {
    const q = (userQuery || '').toLowerCase();
    const userSkills = studentProfile?.skills || [];
    const userInterests = studentProfile?.interests || [];

    const skillsList = userSkills.length > 0 ? userSkills.join(', ') : null;
    const interestsList = userInterests.length > 0 ? userInterests.join(', ') : null;

    const profileClause = skillsList 
      ? `Based on your profile skills in ${skillsList}`
      : `Based on your academic profile`;
    
    const interestClause = interestsList
      ? ` and interest in ${interestsList}`
      : '';

    const car0 = MOCK_CAREERS[0] || { title: 'AI & Machine Learning Engineer', salaryRange: '₹8.5 LPA - ₹32 LPA' };
    const car1 = MOCK_CAREERS[1] || { title: 'Full Stack Software Engineer', salaryRange: '₹6 LPA - ₹24 LPA' };
    const car2 = MOCK_CAREERS[2] || { title: 'Data Scientist & Analytics Lead', salaryRange: '₹7.5 LPA - ₹26 LPA' };

    if (q.includes('interview') || q.includes('mock') || q.includes('question')) {
      return `🎯 MOCK INTERVIEW PREPARATION for ${targetCareer?.title || 'Software & AI Engineer'}:

1. Technical Q: "Explain the difference between supervised, unsupervised, and reinforcement learning."
   • Sample Answer: Supervised uses labeled training data; Unsupervised detects patterns in unlabeled data; Reinforcement optimizes actions via rewards.

2. Coding Challenge: "How do you optimize database query execution time for high-concurrency systems?"
   • Key points: Indexing primary/foreign keys, connection pooling, caching via Redis, avoiding N+1 query patterns.

3. Behavioral Q: "Describe a complex technical project bug and how you resolved it under deadline."

Would you like more technical interview practice questions for your specific target role?`;
    }

    if (q.includes('career') || q.includes('suits me') || q.includes('best role')) {
      return `${profileClause}${interestClause}, your top 3 recommended career paths are:

1. ${car0.title} (95% Match) — Average Salary: ${car0.salaryRange}
2. ${car1.title} (88% Match) — Average Salary: ${car1.salaryRange}
3. ${car2.title} (82% Match) — Average Salary: ${car2.salaryRange}

Would you like me to construct a customized 6-month learning roadmap for any of these?`;
    }

    if (q.includes('scholarship') || q.includes('merit') || q.includes('financial aid') || q.includes('12th')) {
      return `For students in your income category (${studentProfile?.annualIncomeBracket || 'Eligible Bracket'}):

1. Central Sector Scheme of Scholarships: Provides up to ₹20,000/year for college and university students.
2. Post-Matric Scholarship Scheme: Up to ₹40,000/year for SC/ST/OBC/EWS students via Govt Social Welfare Departments.
3. AICTE Pragati Scheme: ₹50,000/year specifically for female technical students.

Check out the Scholarships module tab for direct portal registration links!`;
    }

    if (q.includes('nit') || q.includes('college') || q.includes('admission') || q.includes('iit')) {
      return `For admissions in Premier Institutions:
• IITs: Requires JEE Advanced rank between 1,000 - 12,000. Offers top average packages above ₹20 LPA.
• NITs: Admissions via JEE Main rank (5,000 - 45,000) with All India & Home State quotas!
• Central & State Universities: Admissions via Entrance Tests (CUET-UG / CUET-PG).

Visit the Colleges module to filter institutions by fee budget and NIRF rankings!`;
    }

    if (q.includes('missing skill') || q.includes('roadmap') || q.includes('ai engineer')) {
      return `To transition from your current skills to a full ${targetCareer?.title || 'AI Engineer'}:
Key missing skill gaps identified:
• Machine Learning Algorithms & Scikit-Learn
• Deep Learning (TensorFlow / PyTorch)
• Docker & Model Deployment (MLOps)

You can start Month 3 of your personalized learning roadmap right now in the Skill Gap & Roadmap tab!`;
    }

    if (q.includes('ats') || q.includes('resume') || q.includes('score')) {
      const reqSkills = targetCareer?.requiredSkills || ['Python', 'SQL', 'Git'];
      return `To achieve a 90%+ ATS score for technical roles:
1. Ensure keywords like ${reqSkills.slice(0, 4).join(', ')} appear naturally in your projects section.
2. Quantify project results (e.g., "Optimized algorithm latency by 35%").
3. Use simple single-column formatting without heavy graphics.

Use our AI Resume Analyzer tab to paste or upload your draft for an instant score breakdown!`;
    }

    const focusSkills = userSkills.length > 0 
      ? userSkills.slice(0, 2).join(' & ') 
      : 'Core Technical Skills';

    return `That's a great question regarding "${userQuery}"! MargDarshak AI analyzes student profiles, academic performance, and market statistics to provide actionable mentorship. 

For your current profile as an ${studentProfile?.educationLevel || 'Undergraduate'} candidate, I recommend focusing on building hands-on projects in ${focusSkills} while pursuing relevant certifications on SWAYAM/NPTEL. Is there a specific role, mock interview, or scholarship you would like to explore further?`;
  };

  const handleSendMessage = (textToSend) => {
    const query = textToSend || inputQuery;
    if (!query || !query.trim()) return;

    const userMsg = {
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    if (setChatMessages) {
      setChatMessages(prev => [...(prev || []), userMsg]);
    }
    setInputQuery('');
    setIsTyping(true);

    // Simulate AI thinking delay
    setTimeout(() => {
      const replyText = generateBotReply(query);
      const botMsg = {
        sender: 'bot',
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      if (setChatMessages) {
        setChatMessages(prev => [...(prev || []), botMsg]);
      }
      setIsTyping(false);
    }, 800);
  };

  // Ensure safe messages fallback
  const safeChatMessages = (chatMessages && Array.isArray(chatMessages) && chatMessages.length > 0)
    ? chatMessages
    : [
        {
          sender: 'bot',
          text: `Hello ${studentProfile?.name || 'Student'}! 👋 I am your MargDarshak AI Career Mentor. Based on your academic profile, how can I guide your career, scholarship, or college choices today?`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ];

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header Banner */}
      <div className="glass-card" style={{ padding: '24px', background: 'linear-gradient(135deg, rgba(168,85,247,0.15) 0%, rgba(99,102,241,0.1) 100%)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <span className="badge badge-purple" style={{ marginBottom: '8px' }}>Module 9: AI Conversational Mentor</span>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '6px' }} className="gradient-text">
              24/7 Interactive AI Career Chatbot
            </h2>
            <p style={{ color: 'var(--text-muted)', maxWidth: '750px' }}>
              Ask anything about careers, colleges, entrance exams, scholarships, skill learning paths, or placement preparation.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <span className="badge badge-indigo" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Globe size={14} color="var(--primary)" />
              <span>Language: {currentLangObj.nativeName} ({currentLangObj.name})</span>
            </span>

            <button 
              onClick={() => setVoiceMode(voiceMode === 'pawan_kalyan' ? 'standard' : 'pawan_kalyan')}
              className={`badge ${voiceMode === 'pawan_kalyan' ? 'badge-amber' : 'badge-purple'}`}
              style={{ cursor: 'pointer', padding: '6px 12px', fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: '6px', border: '1px solid rgba(245,158,11,0.5)' }}
              title="Click to switch voice persona"
            >
              <Volume2 size={14} color="#f59e0b" />
              <span>{voiceMode === 'pawan_kalyan' ? '⚡ Voice: Konidala Pawan Kalyan (Power Tone)' : '🎙️ Voice: Standard AI Voice'}</span>
            </button>
            <span className="badge badge-emerald">Online & Active</span>
          </div>
        </div>
      </div>

      {/* Suggested Prompt Pills */}
      <div>
        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Lightbulb size={14} color="#fbbf24" />
          <span>Quick Suggested Questions:</span>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {(MOCK_PROMPTS || []).map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(prompt)}
              className="btn btn-secondary btn-sm"
              style={{ fontSize: '0.78rem', borderRadius: 'var(--radius-full)', background: 'rgba(255,255,255,0.04)' }}
            >
              💬 {prompt}
            </button>
          ))}
        </div>
      </div>

      {/* Chat Conversation Box */}
      <div className="glass-card" style={{ height: '520px', display: 'flex', flexDirection: 'column' }}>
        {/* Messages Scroll Area */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {safeChatMessages.map((msg, idx) => {
            const isBot = msg.sender === 'bot';
            return (
              <div 
                key={idx}
                style={{
                  display: 'flex',
                  gap: '12px',
                  alignSelf: isBot ? 'flex-start' : 'flex-end',
                  maxWidth: '82%',
                  flexDirection: isBot ? 'row' : 'row-reverse'
                }}
              >
                {/* Avatar */}
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  background: isBot ? 'linear-gradient(135deg, #a855f7 0%, #6366f1 100%)' : 'linear-gradient(135deg, #ec4899 0%, #06b6d4 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  {isBot ? <Bot size={20} color="#fff" /> : <User size={20} color="#fff" />}
                </div>

                {/* Message Bubble */}
                <div style={{
                  background: isBot ? 'rgba(30, 41, 59, 0.8)' : 'linear-gradient(135deg, #4f46e5 0%, #4338ca 100%)',
                  border: isBot ? '1px solid var(--border-color)' : 'none',
                  borderRadius: 'var(--radius-md)',
                  padding: '14px 18px',
                  color: 'white',
                  fontSize: '0.9rem',
                  lineHeight: '1.5',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
                }}>
                  <div style={{ whiteSpace: 'pre-wrap' }}>
                    {msg.text}
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '8px', fontSize: '0.7rem', color: isBot ? 'var(--text-muted)' : 'rgba(255,255,255,0.7)', flexWrap: 'wrap', gap: '8px' }}>
                    <span>{msg.timestamp}</span>
                    {isBot && (
                      <button 
                        onClick={() => speakText(msg.text, idx)}
                        style={{ 
                          background: (isSpeaking && speakingMsgIdx === idx) ? 'rgba(245, 158, 11, 0.25)' : 'rgba(255, 255, 255, 0.08)', 
                          border: '1px solid rgba(245, 158, 11, 0.4)', 
                          borderRadius: '20px',
                          padding: '4px 10px',
                          color: (isSpeaking && speakingMsgIdx === idx) ? '#fbbf24' : '#e2e8f0', 
                          cursor: 'pointer', 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: '6px',
                          fontSize: '0.72rem',
                          fontWeight: 600,
                          transition: 'all 0.2s ease'
                        }}
                        title="Listen in Konidala Pawan Kalyan Voice style"
                      >
                        <Volume2 size={13} color={(isSpeaking && speakingMsgIdx === idx) ? '#fbbf24' : '#f59e0b'} className={(isSpeaking && speakingMsgIdx === idx) ? 'animate-bounce' : ''} />
                        <span>{(isSpeaking && speakingMsgIdx === idx) ? 'Speaking in Pawan Kalyan Voice... ⚡' : 'Listen (Pawan Kalyan Voice ⚡)'}</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {/* Typing Indicator */}
          {isTyping && (
            <div style={{ display: 'flex', gap: '12px', alignSelf: 'flex-start' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(168,85,247,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Bot size={20} color="#c084fc" />
              </div>
              <div style={{ background: 'rgba(30, 41, 59, 0.8)', padding: '12px 18px', borderRadius: 'var(--radius-md)', fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <RefreshCw className="animate-spin" size={16} />
                <span>MargDarshak AI is composing response...</span>
              </div>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* Input Bar */}
        <div style={{ padding: '16px 24px', borderTop: '1px solid var(--border-color)', background: 'rgba(15, 23, 42, 0.8)', display: 'flex', gap: '12px', alignItems: 'center' }}>
          <input 
            type="text"
            className="input-field"
            placeholder="Ask your career advisor anything (e.g. Which scholarship fits me?)..."
            value={inputQuery}
            onChange={e => setInputQuery(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleSendMessage(); } }}
          />

          <button 
            onClick={() => handleSendMessage()}
            className="btn btn-primary"
            style={{ padding: '12px 20px' }}
          >
            <Send size={18} />
            <span>Send</span>
          </button>
        </div>
      </div>
    </div>
  );
};
