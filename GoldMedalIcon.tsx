import React from 'react';

export const FluencyIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
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
    <path d="m12 12-2 5L8 12l-5 2 5-2-2-5 2 5 5-2-5 2Z"></path>
    <path d="m22 12-2 5-2-5-5 2 5-2-2-5 2 5 5-2-5 2Z"></path>
    <path d="m17 7-2 5-2-5-5 2 5-2-2-5 2 5 5-2-5 2Z"></path>
  </svg>
);
