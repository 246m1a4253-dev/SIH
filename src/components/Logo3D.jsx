import React, { useState } from 'react';
import logoImg from '../assets/logo.jpg';

export const Logo3D = ({ size = 'medium', showText = true, animated = true }) => {
  const [imgFailed, setImgFailed] = useState(false);

  const dimensions = {
    small: { iconSize: 42, fontSize: '1.15rem', badgeSize: '0.65rem' },
    medium: { iconSize: 52, fontSize: '1.45rem', badgeSize: '0.75rem' },
    large: { iconSize: 84, fontSize: '2.2rem', badgeSize: '0.85rem' }
  }[size] || { iconSize: 52, fontSize: '1.45rem', badgeSize: '0.75rem' };

  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '14px', position: 'relative' }}>
      {/* 3D Glowing Multi-Layer Container */}
      <div 
        className={animated ? 'logo-3d-wrapper animate-pulse-glow' : 'logo-3d-wrapper'}
        style={{
          width: `${dimensions.iconSize}px`,
          height: `${dimensions.iconSize}px`,
          borderRadius: '18px',
          padding: '3px',
          background: 'linear-gradient(135deg, #6366f1 0%, #ec4899 30%, #06b6d4 70%, #10b981 100%)',
          boxShadow: '0 10px 28px -4px rgba(99, 102, 241, 0.5), 0 0 18px rgba(236, 72, 153, 0.35)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          flexShrink: 0,
          cursor: 'pointer',
          transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)'
        }}
      >
        {!imgFailed ? (
          <img
            src={logoImg}
            alt="MargDarshak AI 3D Logo"
            onError={() => setImgFailed(true)}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              borderRadius: '15px',
              display: 'block'
            }}
          />
        ) : (
          /* Ultra-Sharp 3D Artavive Vector SVG Emblem Fallback */
          <div style={{
            width: '100%',
            height: '100%',
            borderRadius: '15px',
            background: 'radial-gradient(circle at 30% 30%, #1e1b4b 0%, #0f172a 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <svg viewBox="0 0 100 100" style={{ width: '80%', height: '80%' }}>
              <defs>
                <linearGradient id="svgGrad1" x1="0%" y1="100%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#ec4899" />
                  <stop offset="50%" stopColor="#8b5cf6" />
                  <stop offset="100%" stopColor="#06b6d4" />
                </linearGradient>
                <linearGradient id="svgGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#fbbf24" />
                  <stop offset="100%" stopColor="#10b981" />
                </linearGradient>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                  <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
              </defs>

              {/* Glowing 3D Compass Circle */}
              <circle cx="50" cy="50" r="38" stroke="url(#svgGrad1)" strokeWidth="4" fill="none" opacity="0.8" />
              <circle cx="50" cy="50" r="28" stroke="url(#svgGrad2)" strokeWidth="2" strokeDasharray="4 3" fill="none" />

              {/* 3D Compass Star Points */}
              <polygon points="50,12 55,42 85,50 55,58 50,88 45,58 15,50 45,42" fill="url(#svgGrad1)" filter="url(#glow)" />
              <polygon points="50,12 52,44 50,50 48,44" fill="#ffffff" opacity="0.9" />

              {/* Ascending 3D Arrow */}
              <path d="M 30 70 Q 50 35 75 22 L 62 20 L 78 20 L 78 36 Z" fill="url(#svgGrad2)" filter="url(#glow)" />

              {/* Open Book Foundation */}
              <path d="M 22 76 Q 50 68 78 76 L 78 84 Q 50 76 22 84 Z" fill="url(#svgGrad1)" opacity="0.9" />
            </svg>
          </div>
        )}

        {/* Glossy highlight layer */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          borderRadius: '15px',
          background: 'linear-gradient(135deg, rgba(255,255,255,0.35) 0%, rgba(255,255,255,0) 50%)',
          pointerEvents: 'none'
        }} />
      </div>

      {showText && (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h1 
              style={{ 
                fontSize: dimensions.fontSize, 
                fontWeight: 800, 
                letterSpacing: '-0.02em',
                lineHeight: 1.1,
                margin: 0
              }} 
              className="gradient-text"
            >
              MargDarshak <span style={{ color: 'var(--accent-cyan)' }}>AI</span>
            </h1>
            <span className="badge badge-indigo" style={{ fontSize: dimensions.badgeSize }}>
              SIH25094
            </span>
          </div>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: '3px 0 0 0', fontWeight: 500 }}>
            Smart Education & Career Portal • 29 Languages
          </p>
        </div>
      )}
    </div>
  );
};
