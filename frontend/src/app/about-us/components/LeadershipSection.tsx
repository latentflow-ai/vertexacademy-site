'use client';

import { useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import AppImage from '@/components/ui/AppImage';
import Icon from '@/components/ui/AppIcon';
import Reveal from '@/components/motion/Reveal';
import { Stagger, StaggerItem } from '@/components/motion/Stagger';

interface Leader {
  name: string;
  position: string;
  image: string;
  imageAlt: string;
  bio: string;
  qualifications: string[];
  expertise: string[];
}

interface LeadershipSectionProps {
  leaders: Leader[];
}

const LeadershipSection = ({ leaders }: LeadershipSectionProps) => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const reduce = useReducedMotion();
  const toggle = (i: number) => setExpandedIndex(expandedIndex === i ? null : i);

  return (
    <section className="section-y bg-surface">
      <div className="container mx-auto px-4 sm:px-6">
        <Reveal>
          <div className="max-w-2xl mb-12 sm:mb-14">
            <p className="eyebrow mb-3">Leadership</p>
            <h2 className="text-display-md text-navy">
              The people behind <span className="text-primary mark-gold">the academy</span>
            </h2>
            <p className="text-body-lg text-text-secondary mt-4">
              Experienced educators dedicated to shaping the future of learning.
            </p>
          </div>
        </Reveal>

        <Stagger className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {leaders.map((leader, index) => {
            const isExpanded = expandedIndex === index;
            return (
              <StaggerItem key={index} className="flex flex-col rounded-xl border border-border bg-surface-2 overflow-hidden hover-lift">
                <div className="relative h-64 overflow-hidden bg-primary-tint">
                  <AppImage src={leader.image} alt={leader.imageAlt} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy/85 via-navy/20 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="font-display text-xl text-white mb-0.5">{leader.name}</h3>
                    <p className="text-gold text-sm font-medium">{leader.position}</p>
                  </div>
                </div>

                <div className="flex flex-col flex-1 p-6">
                  <p className={`text-text-secondary leading-relaxed ${isExpanded ? '' : 'line-clamp-3'}`}>{leader.bio}</p>

                  <AnimatePresence initial={false}>
                    {isExpanded && (
                      <motion.div
                        initial={reduce ? { opacity: 0 } : { opacity: 0, height: 0 }}
                        animate={reduce ? { opacity: 1 } : { opacity: 1, height: 'auto' }}
                        exit={reduce ? { opacity: 0 } : { opacity: 0, height: 0 }}
                        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                        className="overflow-hidden"
                      >
                        <div className="space-y-5 pt-5 mt-5 border-t border-border">
                          <div>
                            <h4 className="text-sm font-semibold text-navy mb-2.5 flex items-center gap-2">
                              <Icon name="AcademicCapIcon" size={16} className="text-primary" variant="solid" />
                              Qualifications
                            </h4>
                            <ul className="space-y-1.5">
                              {leader.qualifications.map((q, qi) => (
                                <li key={qi} className="text-sm text-text-secondary flex items-start gap-2">
                                  <Icon name="CheckCircleIcon" size={16} className="text-green mt-0.5 flex-shrink-0" variant="solid" />
                                  <span>{q}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <h4 className="text-sm font-semibold text-navy mb-2.5 flex items-center gap-2">
                              <Icon name="SparklesIcon" size={16} className="text-primary" variant="solid" />
                              Expertise
                            </h4>
                            <div className="flex flex-wrap gap-2">
                              {leader.expertise.map((e, ei) => (
                                <span key={ei} className="px-3 py-1 bg-primary-tint rounded-full text-xs font-medium text-primary">
                                  {e}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <button
                    onClick={() => toggle(index)}
                    className="mt-5 min-h-[44px] w-full inline-flex items-center justify-center gap-2 rounded-full border border-border px-4 py-2.5 font-medium text-navy hover:bg-primary hover:text-white hover:border-primary transition-colors active:scale-[0.99]"
                    aria-expanded={isExpanded}
                  >
                    <span>{isExpanded ? 'Show Less' : 'View Profile'}</span>
                    <Icon name={isExpanded ? 'ChevronUpIcon' : 'ChevronDownIcon'} size={16} />
                  </button>
                </div>
              </StaggerItem>
            );
          })}
        </Stagger>
      </div>
    </section>
  );
};

export default LeadershipSection;
