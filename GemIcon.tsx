
import React from 'react';

// FIX: Implement the FillerWordIcon component.
export const FillerWordIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    stroke="none"
    {...props}
  >
    <path d="M4 9h16v2H4zm0 4h10v2H4z" />
  </svg>
);
