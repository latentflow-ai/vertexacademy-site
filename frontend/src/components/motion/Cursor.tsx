'use client';

import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring, useReducedMotion } from 'framer-motion';

/**
 * Desktop-only custom cursor. Ring + dot live in ONE spring-followed container,
 * so the dot is always perfectly centered inside the ring (no lag separation).
 * The ring grows over interactive elements. Disabled on touch / coarse pointers
 * and when prefers-reduced-motion is set.
 */
export default function Cursor() {
  const reduce = useReducedMotion();
  const [enabled, setEnabled] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [down, setDown] = useState(false);

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const sx = useSpring(x, { stiffness: 600, damping: 30, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 600, damping: 30, mass: 0.4 });

  useEffect(() => {
    const fine =
      typeof window !== 'undefined' &&
      window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (!fine || reduce) return;

    setEnabled(true);
    document.documentElement.classList.add('cursor-none-desktop');

    const move = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      const t = e.target as HTMLElement | null;
      setHovering(
        !!t?.closest('a,button,[role="button"],input,textarea,select,label,[data-cursor="hover"]')
      );
    };
    const downH = () => setDown(true);
    const upH = () => setDown(false);

    window.addEventListener('mousemove', move);
    window.addEventListener('mousedown', downH);
    window.addEventListener('mouseup', upH);
    return () => {
      window.removeEventListener('mousemove', move);
      window.removeEventListener('mousedown', downH);
      window.removeEventListener('mouseup', upH);
      document.documentElement.classList.remove('cursor-none-desktop');
    };
  }, [reduce, x, y]);

  if (!enabled) return null;

  return (
    <motion.div
      style={{ x: sx, y: sy }}
      className="pointer-events-none fixed top-0 left-0 z-[100000] mix-blend-normal"
      aria-hidden="true"
    >
      {/* ring — centered on the pointer */}
      <motion.div
        className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 rounded-full border"
        animate={{
          width: hovering ? 54 : 32,
          height: hovering ? 54 : 32,
          borderColor: hovering ? 'rgba(15,122,67,0.75)' : 'rgba(30,80,200,0.55)',
          backgroundColor: hovering ? 'rgba(31,168,92,0.10)' : 'rgba(30,80,200,0)',
          scale: down ? 0.82 : 1,
        }}
        transition={{ type: 'spring', stiffness: 320, damping: 22 }}
      />
      {/* dot — same origin, so always centered inside the ring */}
      <motion.div
        className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary"
        animate={{
          width: hovering ? 5 : 7,
          height: hovering ? 5 : 7,
          opacity: hovering ? 0.6 : 1,
          scale: down ? 0.8 : 1,
        }}
        transition={{ type: 'spring', stiffness: 320, damping: 22 }}
      />
    </motion.div>
  );
}
