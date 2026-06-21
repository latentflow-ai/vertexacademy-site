'use client';

import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';

type ParallaxProps = {
  children: React.ReactNode;
  className?: string;
  /** positive = moves up as you scroll down; try 0.1–0.4 */
  speed?: number;
};

/** Scroll-driven vertical parallax. Flat under reduced motion. */
export default function Parallax({ children, className = '', speed = 0.2 }: ParallaxProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });
  const y = useTransform(
    scrollYProgress,
    [0, 1],
    reduce ? ['0%', '0%'] : [`${speed * 60}%`, `${speed * -60}%`]
  );

  return (
    <div ref={ref} className={className}>
      <motion.div style={{ y }}>{children}</motion.div>
    </div>
  );
}
