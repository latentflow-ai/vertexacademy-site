import React from 'react';

type LogoProps = {
  className?: string;
  title?: string;
};

/**
 * Vertex Academy monogram badge — a navy rounded square with an upward "V"
 * apex (white) crowned by a gold star (a nod to the crest). Self-contained
 * colours so it doubles as a favicon and as a fallback when the full crest
 * image (public/logo.png) is unavailable. Crisp from 20px to 200px.
 */
export default function LogoMark({ className, title = 'Vertex Academy' }: LogoProps) {
  return (
    <svg
      viewBox="0 0 48 48"
      className={className}
      role="img"
      aria-label={title}
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect x="1.5" y="1.5" width="45" height="45" rx="13" fill="var(--color-navy)" />
      <rect
        x="1.5"
        y="1.5"
        width="45"
        height="45"
        rx="13"
        fill="none"
        stroke="var(--color-gold)"
        strokeOpacity="0.35"
        strokeWidth="1"
      />
      {/* V apex */}
      <path
        d="M13 17 L24 37 L35 17"
        fill="none"
        stroke="#ffffff"
        strokeWidth="4.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* inner green stroke */}
      <path
        d="M20 17 L24 25 L28 17"
        fill="none"
        stroke="var(--color-green-bright)"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* gold star crown */}
      <path
        d="M24 7.2 L25.5 10.7 L29.2 11 L26.4 13.4 L27.3 17 L24 15 L20.7 17 L21.6 13.4 L18.8 11 L22.5 10.7 Z"
        fill="var(--color-gold)"
      />
    </svg>
  );
}
