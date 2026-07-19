
import React from 'react';

export const GemIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    stroke="none"
    {...props}
  >
    <path d="M12 2l-5.657 5.657-1.414 7.07 7.07 7.071 7.072-7.07 1.414-7.071L12 2zm0 15.556l-4.242-4.243 0.707-3.535L12 6.222l3.535 3.556 0.707 3.535-4.242 4.243z" />
  </svg>
);
