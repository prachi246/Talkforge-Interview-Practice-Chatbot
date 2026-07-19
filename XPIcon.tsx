import React from 'react';

export const WaveIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
    style={{
      animation: 'waveAnimation 2.5s infinite'
    }}
  >
    <style>
      {`
        @keyframes waveAnimation {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(15deg); }
          75% { transform: rotate(-15deg); }
        }
      `}
    </style>
    <path d="M2 12h5l2 -9l2 18l2 -9l2 9l5 -9h5" />
  </svg>
);