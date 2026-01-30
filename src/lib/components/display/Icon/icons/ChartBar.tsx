import React from 'react';

const ChartBar = (props: React.SVGProps<SVGSVGElement>) => (
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
    <path d="M3 3v18h18" />
    <rect x="7" y="10" width="3" height="8" />
    <rect x="13" y="6" width="3" height="12" />
    <rect x="19" y="13" width="3" height="5" />
  </svg>
);

export default ChartBar;
