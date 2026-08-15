import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const ThemeToggle = () => {
  const { theme, toggleTheme, t } = useApp();

  const isDark = theme === 'dark';

  return (
    <button
      onClick={toggleTheme}
      title={isDark ? t('light_mode', 'Switch to Light Mode') : t('dark_mode', 'Switch to Dark Mode')}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        background: isDark ? 'rgba(30, 41, 59, 0.8)' : 'rgba(241, 245, 249, 0.9)',
        border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.15)' : '#cbd5e1'}`,
        borderRadius: '9999px',
        padding: '4px 12px 4px 6px',
        cursor: 'pointer',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        boxShadow: isDark 
          ? '0 0 12px rgba(99, 102, 241, 0.2)' 
          : '0 2px 8px rgba(0, 0, 0, 0.06)'
      }}
      className="glass-card-interactive"
    >
      <div
        style={{
          width: '26px',
          height: '26px',
          borderRadius: '50%',
          background: isDark 
            ? 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)' 
            : 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: isDark 
            ? '0 0 10px rgba(168, 85, 247, 0.5)' 
            : '0 0 10px rgba(245, 158, 11, 0.5)',
          transition: 'transform 0.3s ease, background 0.3s ease'
        }}
      >
        {isDark ? (
          <Moon size={14} color="#ffffff" />
        ) : (
          <Sun size={14} color="#ffffff" />
        )}
      </div>

      <span style={{ 
        fontSize: '0.78rem', 
        fontWeight: 600, 
        color: 'var(--text-main)',
        whiteSpace: 'nowrap'
      }}>
        {isDark ? t('dark_mode', 'Dark') : t('light_mode', 'Light')}
      </span>
    </button>
  );
};
