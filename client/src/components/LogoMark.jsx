import React from 'react';

// Cutframe Studio mark: viewfinder corners with one diagonal cut (same artwork as public/favicon.svg).
export default function LogoMark({ className = 'cf-logo-mark', title }) {
  return (
    <svg className={className} viewBox="0 0 64 64" fill="none" aria-hidden={title ? undefined : 'true'} role={title ? 'img' : undefined}>
      {title && <title>{title}</title>}
      <rect width="64" height="64" rx="14" fill="#e10600" />
      <g stroke="#fff" strokeWidth="5.5" strokeLinecap="square" strokeLinejoin="miter">
        <path d="M14 24V14H24" />
        <path d="M40 14H50V24" />
        <path d="M50 40V50H40" />
        <path d="M24 50H14V40" />
      </g>
      <path d="M24.5 39.5 39.5 24.5" stroke="#fff" strokeWidth="6" strokeLinecap="round" />
    </svg>
  );
}
