'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useScroll } from 'framer-motion';
import Icon from '@/components/ui/AppIcon';
import Magnetic from '@/components/motion/Magnetic';

/** Floating back-to-top button with a scroll-progress ring. Global. */
export default function ScrollToTop() {
  const { scrollYProgress } = useScroll();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 600);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const toTop = () => {
    const lenis = (window as any).lenis;
    if (lenis?.scrollTo) lenis.scrollTo(0, { duration: 1.1 });
    else window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <AnimatePresence>
      {visible && (
        <Magnetic className="fixed bottom-5 right-5 sm:bottom-7 sm:right-7 z-40">
          <motion.button
            type="button"
            onClick={toTop}
            aria-label="Scroll to top"
            initial={{ opacity: 0, scale: 0.6, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.6, y: 10 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="relative grid place-items-center w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-navy text-white shadow-elevation hover:bg-primary transition-colors"
          >
            <svg className="absolute inset-0 -rotate-90" viewBox="0 0 48 48" aria-hidden="true">
              <circle cx="24" cy="24" r="21" fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth="2.5" />
              <motion.circle
                cx="24"
                cy="24"
                r="21"
                fill="none"
                stroke="var(--color-gold)"
                strokeWidth="2.5"
                strokeLinecap="round"
                style={{ pathLength: scrollYProgress }}
              />
            </svg>
            <Icon name="ChevronUpIcon" size={22} />
          </motion.button>
        </Magnetic>
      )}
    </AnimatePresence>
  );
}
