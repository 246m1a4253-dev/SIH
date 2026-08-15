import React, { useState, useRef, useEffect } from 'react';
import { Globe, Search, Check, ChevronDown } from 'lucide-react';
import { INDIAN_LANGUAGES } from '../data/languages';
import { useApp } from '../context/AppContext';

export const LanguageSelector = () => {
  const { language, setLanguage, t } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef(null);

  const currentLangObj = INDIAN_LANGUAGES.find(l => l.code === language) || INDIAN_LANGUAGES[0];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredLanguages = INDIAN_LANGUAGES.filter(lang => 
    lang.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    lang.nativeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    lang.region.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div style={{ position: 'relative' }} ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '6px 12px',
          borderRadius: '9999px',
          background: 'rgba(37, 99, 235, 0.08)',
          border: '1px solid var(--border-color)',
          color: 'var(--text-main)',
          fontSize: '0.82rem',
          fontWeight: 600,
          cursor: 'pointer',
          transition: 'all 0.2s ease'
        }}
        className="glass-card-interactive"
        title="Change Language (29 Indian Languages)"
      >
        <Globe size={16} color="var(--primary)" />
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <span>{currentLangObj.nativeName}</span>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>({currentLangObj.code.toUpperCase()})</span>
        </div>
        <ChevronDown size={14} color="var(--text-muted)" />
      </button>

      {isOpen && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 8px)',
            right: 0,
            width: '320px',
            maxHeight: '440px',
            background: 'var(--bg-card)',
            backdropFilter: 'blur(20px)',
            borderRadius: '16px',
            border: '1px solid var(--border-color)',
            boxShadow: '0 12px 36px rgba(0, 0, 0, 0.25)',
            zIndex: 300,
            padding: '12px',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px'
          }}
          className="animate-fade-in"
        >
          {/* Header & Search */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
            <div style={{ fontSize: '0.85rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Globe size={16} color="var(--primary)" />
              <span>{t('select_language', '29 Indian Languages')}</span>
            </div>
            <span className="badge badge-indigo" style={{ fontSize: '0.65rem' }}>29 Languages</span>
          </div>

          <div style={{ position: 'relative' }}>
            <Search size={14} color="var(--text-muted)" style={{ position: 'absolute', left: '10px', top: '10px' }} />
            <input
              type="text"
              placeholder={t('search_languages', 'Search language or script...')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-field"
              style={{
                paddingLeft: '32px',
                paddingTop: '6px',
                paddingBottom: '6px',
                fontSize: '0.82rem'
              }}
              autoFocus
            />
          </div>

          {/* Languages List */}
          <div style={{ overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '2px', paddingRight: '4px' }}>
            {filteredLanguages.length === 0 ? (
              <div style={{ padding: '16px', textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                No language found matching "{searchQuery}"
              </div>
            ) : (
              filteredLanguages.map(lang => {
                const isSelected = language === lang.code;
                return (
                  <button
                    key={lang.code}
                    onClick={() => {
                      setLanguage(lang.code);
                      setIsOpen(false);
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '8px 10px',
                      borderRadius: '8px',
                      background: isSelected ? 'rgba(37, 99, 235, 0.12)' : 'transparent',
                      border: isSelected ? '1px solid var(--primary)' : '1px solid transparent',
                      color: 'var(--text-main)',
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'all 0.15s ease'
                    }}
                    className="btn-hover-highlight"
                  >
                    <div>
                      <div style={{ fontSize: '0.85rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span>{lang.nativeName}</span>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 400 }}>
                          ({lang.name})
                        </span>
                      </div>
                      <div style={{ fontSize: '0.68rem', color: 'var(--text-dim)' }}>
                        {lang.region}
                      </div>
                    </div>

                    {isSelected && <Check size={16} color="var(--primary)" />}
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};
