import React from 'react';

const MailOpen = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M21.5 12.5l-9 5.5-9-5.5" />
    <path d="M3 12V7.5a2 2 0 0 1 1-1.73l7-4a2 2 0 0 1 2 0l7 4a2 2 0 0 1 1 1.73V12" />
    <path d="M3 12v7.5c0 1.1.9 2 2 2h14a2 2 0 0 0 2-2V12" />
  </svg>
);

export default MailOpen;
