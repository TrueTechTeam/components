import React from 'react';

const PercentCircle = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <circle cx="12" cy="12" r="10" />
    <line x1="15" y1="9" x2="9" y2="15" />
    <circle cx="9.5" cy="9.5" r="0.5" fill="currentColor" />
    <circle cx="14.5" cy="14.5" r="0.5" fill="currentColor" />
  </svg>
);

export default PercentCircle;
