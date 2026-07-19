import React from 'react';

export const InterviewIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    {...props}
  >
    <path d="M15 14c.2-1 .7-1.7 1.5-2.5C17.3 10.7 18 9.9 18 9c0-2-2-4-4-4S10 7 10 9c0 .9.7 1.7 1.5 2.5.8.8 1.3 1.5 1.5 2.5"></path>
    <path d="M9 12H4.5a2.5 2.5 0 0 0 0 5H9"></path>
    <path d="M15 12h4.5a2.5 2.5 0 0 1 0 5H15"></path>
    <path d="M12 10v10"></path>
    <path d="M6 20a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2"></path>
  </svg>
);
