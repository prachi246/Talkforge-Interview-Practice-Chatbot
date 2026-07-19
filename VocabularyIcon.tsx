import React from 'react';

export const TrophyIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    stroke="none"
    {...props}
  >
    <path d="M22 10h-4V7c0-1.65-1.35-3-3-3H9C7.35 4 6 5.35 6 7v3H2v5h2v2c0 1.66 1.34 3 3 3h10c1.66 0 3-1.34 3-3v-2h2v-5zM9 7c0-.55.45-1 1-1h4c.55 0 1 .45 1 1v3H9V7zm9 11c0 .55-.45 1-1 1H7c-.55 0-1-.45-1-1v-2h12v2zm0-4H6v-3h12v3z" />
  </svg>
);
