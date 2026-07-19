import React from 'react';

export const ChatbotAvatarIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => {
  return (
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" {...props}>
      <defs>
        <linearGradient id="bot-head-gradient-new" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#334155" />
          <stop offset="100%" stopColor="#1E293B" />
        </linearGradient>
        <filter id="bot-glow-new" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Main head shape */}
      <rect x="20" y="25" width="60" height="50" rx="15" fill="url(#bot-head-gradient-new)" stroke="#475569" strokeWidth="2.5" />
      
      {/* Neck */}
      <rect x="42.5" y="75" width="15" height="10" fill="#1E293B" />
      
      {/* Shoulders */}
      <path d="M30 85 H70 A10 10 0 0 1 80 95 H20 A10 10 0 0 1 30 85 Z" fill="#334155" stroke="#475569" strokeWidth="2.5" />

      {/* Glowing Eyes */}
      <g filter="url(#bot-glow-new)">
        <rect x="35" y="42" width="12" height="12" rx="6" fill="#A855F7" />
        <rect x="58" y="42" width="12" height="12" rx="6" fill="#A855F7" />
      </g>
      
      {/* Antenna */}
      <line x1="70" y1="25" x2="78" y2="17" stroke="#64748B" strokeWidth="3" strokeLinecap="round" />
      <circle cx="80" cy="15" r="4" fill="#A855F7" />
    </svg>
  );
};
