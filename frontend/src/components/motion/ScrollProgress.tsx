'use client';

import { motion, useScroll, useSpring } from 'framer-motion';

/** Slim scroll-progress bar — place inside the sticky header. */
export default function ScrollProgress({ className = '' }: { className?: string }) {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 200, damping: 30, mass: 0.3 });
  return (
    <motion.div
      style={{ scaleX }}
      className={`origin-left h-[3px] bg-green ${className}`}
    />
  );
}
