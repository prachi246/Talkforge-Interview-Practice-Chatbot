import React from 'react';

export const HeroIllustration: React.FC<React.SVGProps<SVGSVGElement>> = (props) => {
  return (
    <svg viewBox="0 0 400 250" xmlns="http://www.w3.org/2000/svg" {...props}>
      <defs>
        <linearGradient id="robot-head-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#475569" />
          <stop offset="100%" stopColor="#1E293B" />
        </linearGradient>
        <linearGradient id="robot-body-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#334155" />
          <stop offset="100%" stopColor="#1E293B" />
        </linearGradient>
        <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="5" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Robot Body */}
      <path d="M120,240 C120,180 280,180 280,240 L260,250 L140,250 Z" fill="url(#robot-body-gradient)" />
      
      {/* Robot Head */}
      <path d="M150,180 C130,100 270,100 250,180 Z" fill="url(#robot-head-gradient)" />

      {/* Robot Faceplate */}
      <rect x="160" y="125" width="80" height="40" rx="10" fill="#0F172A" />
      
      {/* Glowing Eye */}
      <rect x="165" y="130" width="70" height="30" rx="5" fill="#A855F7" filter="url(#glow)" />
      
      {/* Antenna */}
      <line x1="200" y1="105" x2="200" y2="80" stroke="#94A3B8" strokeWidth="4" />
      <circle cx="200" cy="75" r="5" fill="#A855F7" filter="url(#glow)" />

      {/* Floating UI Elements */}
      <g opacity="0.7" transform="translate(300 100)">
        <rect width="80" height="10" rx="5" fill="#60A5FA" />
        <rect y="20" width="60" height="10" rx="5" fill="#3B82F6" />
        <rect y="40" width="70" height="10" rx="5" fill="#60A5FA" />
      </g>
      
      <g opacity="0.7" transform="translate(20 120)">
        <circle cx="10" cy="10" r="10" fill="#F97316" />
        <circle cx="40" cy="40" r="15" fill="#EA580C" opacity="0.8" />
        <circle cx="10" cy="60" r="5" fill="#F97316" />
      </g>
      
      {/* Speech wave */}
      <path d="M280,150 C310,140 330,160 350,155" stroke="#34D399" strokeWidth="3" fill="none" strokeDasharray="5 5" >
        <animate attributeName="stroke-dashoffset" from="20" to="0" dur="1s" repeatCount="indefinite" />
      </path>
    </svg>
  );
};
