'use client';

import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring, useReducedMotion } from 'framer-motion';

/**
 * Desktop-only custom cursor: a precise dot + a springy ring that grows over
 * interactive elements. Disabled on touch/coarse pointers and when
 * prefers-reduced-motion is set.
 */
export default function Cursor() {
  const reduce = useReducedMotion();
  const [enabled, setEnabled] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [down, setDown] = useState(false);

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const ringX = useSpring(x, { stiffness: 350, damping: 28, mass: 0.5 });
  const ringY = useSpring(y, { stiffness: 350, damping: 28, mass: 0.5 });

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
    <>
      {/* ring */}
      <motion.div style={{ x: ringX, y: ringY }} className="pointer-events-none fixed top-0 left-0 z-[9999]">
        <motion.div
          className="-translate-x-1/2 -translate-y-1/2 rounded-full border"
          animate={{
            width: hovering ? 52 : 30,
            height: hovering ? 52 : 30,
            borderColor: hovering ? 'rgba(15,122,67,0.7)' : 'rgba(30,80,200,0.5)',
            backgroundColor: hovering ? 'rgba(31,168,92,0.10)' : 'rgba(30,80,200,0)',
            scale: down ? 0.8 : 1,
          }}
          transition={{ type: 'spring', stiffness: 300, damping: 22 }}
        />
      </motion.div>
      {/* dot */}
      <motion.div style={{ x, y }} className="pointer-events-none fixed top-0 left-0 z-[9999]">
        <div className="-translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-primary" />
      </motion.div>
    </>
  );
}
