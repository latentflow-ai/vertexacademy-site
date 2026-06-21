'use client';

import React from 'react';

type MarqueeProps = {
  children: React.ReactNode;
  className?: string;
  /** seconds for one full loop */
  duration?: number;
  /** pause animation on hover */
  pauseOnHover?: boolean;
};

/** Seamless infinite horizontal marquee (duplicates content, translates -50%). */
export default function Marquee({
  children,
  className = '',
  duration = 32,
  pauseOnHover = true,
}: MarqueeProps) {
  return (
    <div className={`overflow-hidden ${pauseOnHover ? 'marquee-paused' : ''} ${className}`}>
      <div
        className="flex w-max animate-marquee"
        style={{ ['--marquee-duration' as string]: `${duration}s` } as React.CSSProperties}
      >
        <div className="flex shrink-0 items-center">{children}</div>
        <div className="flex shrink-0 items-center" aria-hidden="true">
          {children}
        </div>
      </div>
    </div>
  );
}
