'use client';

import React, { useRef } from 'react';
import { motion, useMotionValue, useSpring, useMotionTemplate, useReducedMotion } from 'framer-motion';

type TiltCardProps = {
  children: React.ReactNode;
  className?: string;
  /** max tilt in degrees */
  max?: number;
};

/**
 * 3D tilt-on-hover wrapper with a moving light glare that tracks the pointer.
 * No-ops under reduced motion. The glare is a pointer-events-none overlay.
 */
export default function TiltCard({ children, className = '', max = 7 }: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const srx = useSpring(rx, { stiffness: 200, damping: 18 });
  const sry = useSpring(ry, { stiffness: 200, damping: 18 });

  const mx = useMotionValue(50);
  const my = useMotionValue(50);
  const glow = useSpring(useMotionValue(0), { stiffness: 200, damping: 25 });
  const glare = useMotionTemplate`radial-gradient(circle at ${mx}% ${my}%, rgba(255,255,255,0.22), transparent 55%)`;

  const onMove = (e: React.MouseEvent) => {
    if (reduce || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    ry.set(px * max * 2);
    rx.set(-py * max * 2);
    mx.set((px + 0.5) * 100);
    my.set((py + 0.5) * 100);
    glow.set(1);
  };
  const onLeave = () => {
    rx.set(0);
    ry.set(0);
    glow.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ rotateX: srx, rotateY: sry, transformPerspective: 1000 }}
      className={`relative ${className}`}
    >
      {children}
      {!reduce && (
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-[inherit] z-[2] mix-blend-soft-light"
          style={{ background: glare, opacity: glow }}
        />
      )}
    </motion.div>
  );
}
