import React from 'react';

export const MechanicalIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
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
    <circle cx="12" cy="12" r="3"></circle>
    <path d="M12 9v1.5"></path>
    <path d="M12 13.5V15"></path>
    <path d="M9.4 10.5 7.9 9"></path>
    <path d="M14.6 13.5 16.1 15"></path>
    <path d="M10.5 14.6 9 16.1"></path>
    <path d="M13.5 9.4 15 7.9"></path>
    <path d="M9 12H7.5"></path>
    <path d="M15 12h1.5"></path>
    <path d="m19.4 14.5-.5.9"></path>
    <path d="m4.6 8.6-.5.9"></path>
    <path d="m14.5 4.6.9.5"></path>
    <path d="m8.6 19.4.9.5"></path>
  </svg>
);