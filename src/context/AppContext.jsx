import React, { createContext, useContext, useState, useEffect } from 'react';
import { MOCK_CAREERS, MOCK_COLLEGES, MOCK_SCHOLARSHIPS, MOCK_INTERNSHIPS } from '../data/mockData';
import { getTranslation } from '../data/translations';

const AppContext = createContext();

const DEMO_USER = {
  name: 'Aamir Hassan',
  email: 'aamir.hassan@gmail.com',
  phone: '+91 98765 43210',
  password: 'password123',
  isAuthenticated: true,
  emailVerified: true,
  avatar: 'A'
};

export const AppProvider = ({ children }) => {
  // Navigation tab
  const [activeTab, setActiveTab] = useState('onboarding');

  // Theme state ('dark' | 'light')
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('sih_theme');
    return savedTheme || 'dark';
  });

  // Language state (29 Indian languages code)
  const [language, setLanguage] = useState(() => {
    const savedLang = localStorage.getItem('sih_lang');
    return savedLang || 'en';
  });

  // Sync theme to localStorage and DOM data-theme attribute
  useEffect(() => {
    localStorage.setItem('sih_theme', theme);
    document.body.setAttribute('data-theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Sync language to localStorage
  useEffect(() => {
    localStorage.setItem('sih_lang', language);
  }, [language]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const t = (key, defaultVal) => {
    return getTranslation(key, language, defaultVal);
  };

  // Auth State
  const [registeredUsers, setRegisteredUsers] = useState(() => {
    const saved = localStorage.getItem('sih_registered_users');
    return saved ? JSON.parse(saved) : [DEMO_USER];
  });

  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('sih_current_user');
    return saved ? JSON.parse(saved) : null; // Guest mode by default
  });

  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login'); // 'login' | 'register' | 'forgot_password' | 'otp_verify' | 'reset_password'

  // Pending OTP state
  const [pendingOtp, setPendingOtp] = useState(null); // { email, code, purpose, tempUser }

  // Sync users to localStorage
  useEffect(() => {
    localStorage.setItem('sih_registered_users', JSON.stringify(registeredUsers));
  }, [registeredUsers]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('sih_current_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('sih_current_user');
    }
  }, [currentUser]);

  // Student Profile State (persisted in localStorage)
  const [studentProfile, setStudentProfile] = useState(() => {
    const saved = localStorage.getItem('sih_student_profile');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (err) {
        console.error('Error loading student profile:', err);
      }
    }
    return {
      name: currentUser ? currentUser.name : 'Guest Student',
      email: currentUser ? currentUser.email : 'guest@sih.gov.in',
      phone: currentUser ? currentUser.phone : '',
      age: '20',
      educationLevel: 'Undergraduate (3rd Year)',
      boardOrUniversity: 'Delhi Technological University',
      percentageOrCgpa: '84%',
      skills: ['Python'],
      interests: ['Artificial Intelligence', 'Coding'],
      hobbies: ['Reading Tech Blogs'],
      preferredLocation: 'Pan-India (Any State)',
      annualIncomeBracket: '< ₹8 Lakhs PA (Eligible for Merit Aid)',
      category: 'General / EWS',
      gender: 'Male',
      targetBudget: '₹1.5 Lakhs / year'
    };
  });

  // Save student profile changes to localStorage automatically
  useEffect(() => {
    localStorage.setItem('sih_student_profile', JSON.stringify(studentProfile));
  }, [studentProfile]);

  // Keep student profile name & email in sync with currentUser
  useEffect(() => {
    if (currentUser) {
      setStudentProfile(prev => ({
        ...prev,
        name: currentUser.name,
        email: currentUser.email,
        phone: currentUser.phone || prev.phone
      }));
    }
  }, [currentUser]);

  // Selected Target Career
  const [targetCareer, setTargetCareer] = useState(MOCK_CAREERS[0]);

  // Saved items & Applications
  const [savedCareers, setSavedCareers] = useState(['ai-engineer', 'software-developer']);
  const [savedScholarships, setSavedScholarships] = useState(['central-sector', 'pragati-aicte']);
  const [savedColleges, setSavedColleges] = useState(['iit-delhi', 'nit-trichy']);
  const [appliedInternships, setAppliedInternships] = useState(['ms-software-intern']);

  // Resume Analyzer state
  const [resumeScanResult, setResumeScanResult] = useState({
    scanned: true,
    score: 82,
    formattingScore: 90,
    atsCompatibility: 'High (85%)',
    grammarScore: 95,
    matchedKeywords: ['Python', 'SQL', 'Git', 'Data Analysis', 'HTML/CSS'],
    missingKeywords: ['Machine Learning', 'TensorFlow', 'Docker', 'REST APIs', 'MLOps'],
    suggestions: [
      "Add quantifiable metric outcomes (e.g., 'Optimized query runtime by 35%')",
      "Include certifications for Machine Learning or Cloud Deployment",
      "Format technical skills into clear categories (Languages, Frameworks, Tools)"
    ]
  });

  // Custom AI API Key (Optional by user)
  const [apiKey, setApiKey] = useState('');

  // Chatbot conversation history
  const [chatMessages, setChatMessages] = useState([
    {
      sender: 'bot',
      text: `Hello ${studentProfile.name}! 👋 I am your MargDarshak AI Career Mentor. Based on your profile in Python and Data Analysis, you are well-positioned for AI Engineering and Full-Stack Roles. How can I guide you today?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  // --- Auth Handlers ---
  const openAuthModal = (mode = 'login') => {
    setAuthMode(mode);
    setAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setAuthModalOpen(false);
    setPendingOtp(null);
  };

  // Register New User (Step 1: Generate OTP)
  const registerUser = ({ name, email, password, phone }) => {
    const existing = registeredUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      throw new Error('Account with this Gmail address already exists. Please log in.');
    }

    // Generate 6-digit OTP code
    const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();

    setPendingOtp({
      email,
      code: generatedOtp,
      purpose: 'register',
      tempUser: {
        name,
        email,
        phone,
        password,
        isAuthenticated: true,
        emailVerified: true,
        avatar: name.charAt(0).toUpperCase()
      }
    });

    setAuthMode('otp_verify');
    return generatedOtp;
  };

  // Resend OTP
  const resendOtp = () => {
    if (!pendingOtp) return null;
    const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
    setPendingOtp(prev => ({ ...prev, code: newOtp }));
    return newOtp;
  };

  // Verify OTP
  const verifyOtp = (enteredCode) => {
    if (!pendingOtp) throw new Error('No pending OTP request found.');
    if (enteredCode.trim() !== pendingOtp.code) {
      throw new Error('Invalid OTP code. Please check your Gmail notification and try again.');
    }

    if (pendingOtp.purpose === 'register') {
      const newUser = pendingOtp.tempUser;
      setRegisteredUsers(prev => [...prev, newUser]);
      setCurrentUser(newUser);
      setPendingOtp(null);
      closeAuthModal();
      return { success: true, message: 'Registration & Gmail Verification Successful!' };
    } else if (pendingOtp.purpose === 'forgot') {
      setAuthMode('reset_password');
      return { success: true, message: 'OTP verified. Please enter your new password.' };
    }
  };

  // Login Existing User
  const loginUser = ({ email, password }) => {
    const user = registeredUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!user) {
      throw new Error('No account registered with this Gmail address.');
    }
    if (user.password !== password) {
      throw new Error('Incorrect password. Please check your credentials or click Forgot Password.');
    }

    const authenticatedUser = { ...user, isAuthenticated: true };
    setCurrentUser(authenticatedUser);
    closeAuthModal();
    return authenticatedUser;
  };

  // Forgot Password Initiator
  const sendForgotPasswordOtp = (email) => {
    const user = registeredUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!user) {
      throw new Error('No registered account found with this Gmail address.');
    }

    const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
    setPendingOtp({
      email,
      code: generatedOtp,
      purpose: 'forgot',
      userRef: user
    });

    setAuthMode('otp_verify');
    return generatedOtp;
  };

  // Reset Password Final Step
  const resetPassword = (newPassword) => {
    if (!pendingOtp || pendingOtp.purpose !== 'forgot') {
      throw new Error('Invalid password reset session.');
    }

    setRegisteredUsers(prev => prev.map(u =>
      u.email.toLowerCase() === pendingOtp.email.toLowerCase() ? { ...u, password: newPassword } : u
    ));

    const updatedUser = { ...pendingOtp.userRef, password: newPassword, isAuthenticated: true };
    setCurrentUser(updatedUser);
    setPendingOtp(null);
    closeAuthModal();
    return { success: true, message: 'Password updated successfully! You are now logged in.' };
  };

  // Logout User
  const logoutUser = () => {
    setCurrentUser(null);
    setStudentProfile(prev => ({
      ...prev,
      name: 'Guest Student',
      email: 'guest@sih.gov.in'
    }));
  };

  // Helper to toggle bookmarking items
  const toggleSaveCareer = (id) => {
    setSavedCareers(prev =>
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    );
  };

  const toggleSaveScholarship = (id) => {
    setSavedScholarships(prev =>
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  const toggleSaveCollege = (id) => {
    setSavedColleges(prev =>
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    );
  };

  const toggleApplyInternship = (id) => {
    setAppliedInternships(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  // Calculate career match score dynamically
  const calculateCareerMatch = (career) => {
    let score = 50; // base score
    // match skills
    const acquiredSkills = studentProfile.skills.map(s => s.toLowerCase());
    const reqSkills = career.requiredSkills.map(s => s.toLowerCase());
    const matchedSkillCount = reqSkills.filter(s => acquiredSkills.includes(s)).length;
    score += (matchedSkillCount / reqSkills.length) * 35;

    // match interests
    const userInterests = studentProfile.interests.map(i => i.toLowerCase());
    const matchingInterests = (career.matchingInterests || []).map(i => i.toLowerCase());
    const matchedInterestCount = matchingInterests.filter(i => userInterests.includes(i)).length;
    score += (matchedInterestCount / (matchingInterests.length || 1)) * 15;

    return Math.min(Math.round(score), 98);
  };

  return (
    <AppContext.Provider value={{
      theme,
      setTheme,
      toggleTheme,
      language,
      setLanguage,
      t,
      activeTab,
      setActiveTab,
      studentProfile,
      setStudentProfile,
      currentUser,
      registeredUsers,
      authModalOpen,
      authMode,
      setAuthMode,
      pendingOtp,
      openAuthModal,
      closeAuthModal,
      registerUser,
      verifyOtp,
      resendOtp,
      loginUser,
      sendForgotPasswordOtp,
      resetPassword,
      logoutUser,
      targetCareer,
      setTargetCareer,
      savedCareers,
      toggleSaveCareer,
      savedScholarships,
      toggleSaveScholarship,
      savedColleges,
      toggleSaveCollege,
      appliedInternships,
      toggleApplyInternship,
      resumeScanResult,
      setResumeScanResult,
      apiKey,
      setApiKey,
      chatMessages,
      setChatMessages,
      calculateCareerMatch
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);

