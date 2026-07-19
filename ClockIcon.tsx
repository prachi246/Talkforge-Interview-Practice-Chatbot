import React from 'react';

export const CivilIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="1.5" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    {...props}
  >
    <path d="M12 22V8"></path>
    <path d="M5 12H2a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h3"></path>
    <path d="M19 12h3a1 1 0 0 1 1 1v6a1 1 0 0 1-1 1h-3"></path>
    <path d="M12 8l-6-6"></path>
    <path d="M12 8l6-6"></path>
  </svg>
);