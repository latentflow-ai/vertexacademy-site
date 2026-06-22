'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';

const KEY = 'va:preloaded';
const MIN_MS = 1200;
const MAX_MS = 2400;
const RAMP_MS = 1800;

const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

/**
 * "Apex Reveal" preloader — navy splash where the V-monogram draws itself, a
 * 0–100 counter runs with a progress line, then a clip-path curtain wipes up to
 * reveal the site. Shows once per session (the root layout persists across
 * client-side route changes, so it only runs on full page loads). The session
 * flag is written *on reveal* so React StrictMode's double-mount can't suppress
 * it. Respects prefers-reduced-motion.
 */
export default function Preloader() {
  const reduce = useReducedMotion();
  const [show, setShow] = useState(true);
  const [count, setCount] = useState(0);
  const [revealing, setRevealing] = useState(false);

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let already = false;
    try {
      already = sessionStorage.getItem(KEY) === '1';
    } catch {
      /* unavailable */
    }
    if (already) {
      setShow(false);
      return;
    }

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const release = () => {
      document.body.style.overflow = prevOverflow;
    };

    if (reduced) {
      const t = setTimeout(() => {
        try { sessionStorage.setItem(KEY, '1'); } catch {}
        setShow(false);
        release();
      }, 500);
      return () => {
        clearTimeout(t);
        release();
      };
    }

    const start = performance.now();
    let pageLoaded = document.readyState === 'complete';
    const onLoad = () => { pageLoaded = true; };
    window.addEventListener('load', onLoad);

    let raf = 0;
    const tick = (now: number) => {
      const elapsed = now - start;
      const p = Math.min(elapsed / RAMP_MS, 1);
      setCount(Math.round(easeOutCubic(p) * 100));
      if ((p >= 1 && (pageLoaded || elapsed >= MIN_MS)) || elapsed >= MAX_MS) {
        setCount(100);
        setRevealing(true);
        return;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('load', onLoad);
      release();
    };
  }, []);

  const finish = () => {
    try { sessionStorage.setItem(KEY, '1'); } catch {}
    setShow(false);
    document.body.style.overflow = '';
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-[100000] flex flex-col items-center justify-center bg-navy text-navy-foreground overflow-hidden"
          role="status"
          aria-label="Loading Vertex Academy"
          initial={false}
          animate={revealing && !reduce ? { clipPath: 'inset(0 0 100% 0)' } : { clipPath: 'inset(0 0 0% 0)' }}
          exit={{ opacity: 0 }}
          transition={{ duration: revealing ? 0.8 : 0.3, ease: [0.76, 0, 0.24, 1] }}
          onAnimationComplete={() => {
            if (revealing) finish();
          }}
          style={{ clipPath: 'inset(0 0 0% 0)' }}
        >
          <div className="absolute -top-24 -right-16 w-[26rem] h-[26rem] rounded-full bg-[rgba(30,80,200,0.25)] blur-3xl" />
          <div className="absolute -bottom-24 -left-16 w-[24rem] h-[24rem] rounded-full bg-[rgba(31,168,92,0.18)] blur-3xl" />
          <div
            className="absolute inset-0 opacity-[0.06] pointer-events-none"
            style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '34px 34px' }}
          />

          {/* monogram */}
          <motion.div
            initial={reduce ? { opacity: 1 } : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="relative"
            style={{ width: 'clamp(84px, 16vw, 132px)' }}
          >
            <svg viewBox="0 0 48 48" className="w-full h-auto" fill="none" aria-hidden="true">
              <rect x="1.5" y="1.5" width="45" height="45" rx="13" fill="rgba(255,255,255,0.04)" stroke="rgba(244,179,36,0.35)" strokeWidth="1" />
              <motion.path
                d="M13 17 L24 37 L35 17"
                stroke="#ffffff"
                strokeWidth="4.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={reduce ? { pathLength: 1 } : { pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.9, ease: 'easeInOut' }}
              />
              <motion.path
                d="M20 17 L24 25 L28 17"
                stroke="var(--color-green-bright)"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={reduce ? { pathLength: 1 } : { pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.7, ease: 'easeInOut', delay: 0.25 }}
              />
              <motion.path
                d="M24 7.2 L25.5 10.7 L29.2 11 L26.4 13.4 L27.3 17 L24 15 L20.7 17 L21.6 13.4 L18.8 11 L22.5 10.7 Z"
                fill="var(--color-gold)"
                initial={reduce ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 360, damping: 14, delay: reduce ? 0 : 0.95 }}
                style={{ transformOrigin: '24px 10px' }}
              />
            </svg>
          </motion.div>

          {/* wordmark */}
          <motion.p
            initial={reduce ? { opacity: 1 } : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: reduce ? 0 : 0.5, duration: 0.5 }}
            className="mt-6 font-display text-lg sm:text-xl font-semibold uppercase tracking-[0.18em]"
          >
            Vertex Academy
          </motion.p>
          <p className="mt-1.5 text-[0.6rem] font-bold uppercase tracking-[0.3em] text-gold/90">
            The Knowledge Expert
          </p>

          {/* counter + progress */}
          {!reduce && (
            <div className="mt-10 w-[min(78vw,320px)]">
              <div className="flex items-end justify-between mb-2">
                <span className="text-[0.65rem] uppercase tracking-[0.22em] text-navy-foreground/55">Loading</span>
                <span className="font-display text-3xl leading-none tabular-nums">
                  {count}
                  <span className="text-gold">%</span>
                </span>
              </div>
              <div className="h-[3px] w-full rounded-full bg-white/12 overflow-hidden">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${count}%`,
                    background: 'linear-gradient(90deg, #1fa85c, #f4b324)',
                    transition: 'width 90ms linear',
                  }}
                />
              </div>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
