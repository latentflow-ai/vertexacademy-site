'use client';

import React, { useRef } from 'react';
import { motion, useMotionValue, useSpring, useMotionTemplate, useReducedMotion } from 'framer-motion';

type SpotlightProps = {
  children: React.ReactNode;
  className?: string;
  /** glow colour (literal rgba — token /opacity does not work) */
  color?: string;
  /** glow radius in px */
  radius?: number;
} & React.HTMLAttributes<HTMLDivElement>;

/**
 * Drop-in replacement for a panel's outer <div>: paints a soft radial glow that
 * follows the cursor inside the element. Keep the caller's bg/rounded classes on
 * `className`. Inert on touch / reduced motion.
 */
export default function Spotlight({
  children,
  className = '',
  color = 'rgba(60,110,230,0.22)',
  radius = 420,
  ...rest
}: SpotlightProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  const mx = useMotionValue(-1000);
  const my = useMotionValue(-1000);
  const glow = useSpring(useMotionValue(0), { stiffness: 180, damping: 26 });
  const bg = useMotionTemplate`radial-gradient(${radius}px circle at ${mx}px ${my}px, ${color}, transparent 72%)`;

  const onMove = (e: React.MouseEvent) => {
    if (reduce || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    mx.set(e.clientX - r.left);
    my.set(e.clientY - r.top);
    glow.set(1);
  };
  const onLeave = () => glow.set(0);

  return (
    <div ref={ref} onMouseMove={onMove} onMouseLeave={onLeave} className={`relative ${className}`} {...rest}>
      {!reduce && (
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-[inherit] z-[1]"
          style={{ background: bg, opacity: glow }}
        />
      )}
      {children}
    </div>
  );
}
