import React from 'react';

export const TalkForgeLogoIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    viewBox="0 0 100 100"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <defs>
      <linearGradient id="micGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FB923C" /> {/* orange-400 for highlight */}
        <stop offset="100%" stopColor="#EA580C" /> {/* orange-600 for shadow */}
      </linearGradient>
      <linearGradient id="anvilGradient" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#475569" /> {/* slate-600 */}
        <stop offset="100%" stopColor="#1E293B" /> {/* slate-800 */}
      </linearGradient>
      <filter id="logoGlow" x="-50%" y="-50%" width="200%" height="200%">
        <feDropShadow dx="0" dy="1" stdDeviation="1.5" floodColor="#000" floodOpacity="0.4" />
      </filter>
    </defs>
    
    <g filter="url(#logoGlow)">
      {/* Anvil: top surface, horn, and body */}
      <path 
        d="M 85,65 H 15 C 15,65 10,65 5,60 C 0,55 0,50 5,45 C 10,40 15,45 15,45 V 55 H 85 V 65 Z"
        fill="#334155" // slate-700
      />
      <path 
        d="M 20,65 L 25,85 H 75 L 80,65 H 20 Z"
        fill="url(#anvilGradient)"
      />

      {/* Microphone */}
      <g transform="translate(0, -5)">
        <rect 
          x="38" 
          y="15" 
          width="24" 
          height="45" 
          rx="12" 
          fill="url(#micGradient)"
        />
        {/* Microphone Grille Lines with a subtle sheen */}
        <path 
          d="M 42,25 C 45,23 55,23 58,25 M 42,35 C 45,33 55,33 58,35 M 42,45 C 45,43 55,43 58,45"
          stroke="white" 
          strokeWidth="2" 
          strokeOpacity="0.25"
          fill="none" 
          strokeLinecap="round"
        />
      </g>
    </g>
  </svg>
);