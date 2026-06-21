'use client';

import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

type KineticHeadlineProps = {
  text: string;
  className?: string;
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span';
  delay?: number;
  /** word(s) to emphasise (case-insensitive, punctuation-insensitive) */
  highlight?: string[];
  highlightClass?: string;
};

/** Words rise into place from a clipped baseline (kinetic typography). */
export default function KineticHeadline({
  text,
  className = '',
  as = 'h2',
  delay = 0,
  highlight = [],
  highlightClass = 'text-primary',
}: KineticHeadlineProps) {
  const reduce = useReducedMotion();
  const Tag = motion[as] as typeof motion.h2;
  const words = text.split(' ');
  const hi = highlight.map((h) => h.toLowerCase().replace(/[^\w]/g, ''));

  return (
    <Tag
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '0px 0px -12% 0px' }}
      transition={{ staggerChildren: reduce ? 0 : 0.06, delayChildren: delay }}
    >
      {words.map((w, i) => {
        const isHi = hi.includes(w.toLowerCase().replace(/[^\w]/g, ''));
        return (
          <span key={i} className={`inline-block overflow-hidden align-bottom pb-[0.08em] ${i < words.length - 1 ? 'mr-[0.26em]' : ''}`}>
            <motion.span
              className={`inline-block ${isHi ? highlightClass : ''}`}
              variants={
                reduce
                  ? { hidden: { opacity: 0 }, show: { opacity: 1 } }
                  : {
                      hidden: { y: '110%' },
                      show: { y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
                    }
              }
            >
              {w}
              {i < words.length - 1 ? ' ' : ''}
            </motion.span>
          </span>
        );
      })}
    </Tag>
  );
}
