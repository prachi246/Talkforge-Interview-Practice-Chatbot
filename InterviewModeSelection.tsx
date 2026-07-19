import React from 'react';

export const WebDevIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
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
    <path d="M10 12.5 8 15l-4-4 2.5-2.5"></path>
    <path d="m14 12.5 2-2.5 4 4-2.5 2.5"></path>
    <path d="M12 2 8 6l4 4 4-4Z"></path>
    <path d="m4 20 4-4"></path>
    <path d="m16 16 4 4"></path>
  </svg>
);