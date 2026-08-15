import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { ProfileOnboarding } from './components/ProfileOnboarding';
import { CareerRecommendation } from './components/CareerRecommendation';
import { SkillGapAnalysis } from './components/SkillGapAnalysis';
import { ResumeAnalyzer } from './components/ResumeAnalyzer';
import { ScholarshipFinder } from './components/ScholarshipFinder';
import { CollegeRecommendation } from './components/CollegeRecommendation';
import { InternshipFinder } from './components/InternshipFinder';
import { AiChatbot } from './components/AiChatbot';
import { ProgressDashboard } from './components/ProgressDashboard';
import { AuthModal } from './components/AuthModal';
import { LoginPage } from './components/LoginPage';
import { Logo3D } from './components/Logo3D';

const MainContent = () => {
  const { activeTab } = useApp();

  return (
    <main className="main-content">
      {activeTab === 'onboarding' && <ProfileOnboarding />}
      {activeTab === 'careers' && <CareerRecommendation />}
      {activeTab === 'skillgap' && <SkillGapAnalysis />}
      {activeTab === 'resume' && <ResumeAnalyzer />}
      {activeTab === 'scholarships' && <ScholarshipFinder />}
      {activeTab === 'colleges' && <CollegeRecommendation />}
      {activeTab === 'internships' && <InternshipFinder />}
      {activeTab === 'chatbot' && <AiChatbot />}
      {activeTab === 'dashboard' && <ProgressDashboard />}
    </main>
  );
};

const AuthenticatedApp = () => {
  const { currentUser, t } = useApp();

  // Enforce Login Landing Page Gate
  if (!currentUser || !currentUser.isAuthenticated) {
    return <LoginPage />;
  }

  return (
    <div className="app-container">
      <AuthModal />
      <Navbar />
      <MainContent />

      {/* Footer */}
      <footer className="glass-card" style={{ borderRadius: 0, borderBottom: 0, borderLeft: 0, borderRight: 0, marginTop: '40px' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
          <Logo3D size="small" showText={true} animated={false} />
          <div>
            Ministry of Education • Smart Career & Education Portal (29 Languages Supported)
          </div>
        </div>
      </footer>
    </div>
  );
};

export function App() {
  return (
    <AppProvider>
      <AuthenticatedApp />
    </AppProvider>
  );
}

export default App;
