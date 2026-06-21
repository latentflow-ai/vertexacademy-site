'use client';

import { useState, useEffect } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import AppImage from '@/components/ui/AppImage';
import Icon from '@/components/ui/AppIcon';
import Reveal from '@/components/motion/Reveal';

interface Testimonial {
  name: string;
  role: string;
  image: string;
  imageAlt: string;
  content: string;
  rating: number;
}

interface TestimonialsSectionProps {
  testimonials: Testimonial[];
}

const TestimonialsSection = ({ testimonials }: TestimonialsSectionProps) => {
  const [i, setI] = useState(0);
  const reduce = useReducedMotion();

  useEffect(() => {
    const id = setInterval(() => setI((p) => (p + 1) % testimonials.length), 6500);
    return () => clearInterval(id);
  }, [testimonials.length]);

  const prev = () => setI((p) => (p - 1 + testimonials.length) % testimonials.length);
  const next = () => setI((p) => (p + 1) % testimonials.length);
  const t = testimonials[i];

  return (
    <section className="section-y bg-surface">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          <div className="lg:col-span-4">
            <Reveal>
              <p className="eyebrow mb-3">What People Say</p>
              <h2 className="text-display-md text-navy">
                Voices from our <span className="text-primary mark-gold">community</span>
              </h2>
              <p className="text-body-lg text-text-secondary mt-4">
                Hear from parents, students, and partners who know Vertex Academy best.
              </p>
              <div className="flex items-center gap-3 mt-7">
                <button onClick={prev} className="inline-flex items-center justify-center w-12 h-12 rounded-full border border-border text-navy hover:bg-primary hover:text-white hover:border-primary transition-colors active:scale-95" aria-label="Previous testimonial">
                  <Icon name="ChevronLeftIcon" size={22} />
                </button>
                <button onClick={next} className="inline-flex items-center justify-center w-12 h-12 rounded-full border border-border text-navy hover:bg-primary hover:text-white hover:border-primary transition-colors active:scale-95" aria-label="Next testimonial">
                  <Icon name="ChevronRightIcon" size={22} />
                </button>
                <div className="flex items-center gap-2 ml-2">
                  {testimonials.map((_, idx) => (
                    <button key={idx} onClick={() => setI(idx)} className={`h-2 rounded-full transition-all duration-300 ${idx === i ? 'w-7 bg-primary' : 'w-2 bg-border hover:bg-text-faint'}`} aria-label={`Testimonial ${idx + 1}`} />
                  ))}
                </div>
              </div>
            </Reveal>
          </div>

          <div className="lg:col-span-8">
            <Reveal>
              <div className="relative bg-navy text-navy-foreground rounded-xl p-7 sm:p-10 shadow-soft overflow-hidden min-h-[22rem]">
                <div className="absolute -right-12 -top-12 w-48 h-48 rounded-full bg-primary/25 blur-3xl pointer-events-none" />
                <Icon name="ChatBubbleLeftRightIcon" size={44} className="text-gold/30 absolute top-7 right-7" variant="solid" />
                <AnimatePresence mode="wait">
                  <motion.div
                    key={i}
                    initial={reduce ? { opacity: 0 } : { opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={reduce ? { opacity: 0 } : { opacity: 0, y: -14 }}
                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    className="relative"
                  >
                    <div className="flex items-center gap-1 mb-5">
                      {Array.from({ length: 5 }).map((_, s) => (
                        <Icon key={s} name="StarIcon" variant={s < t.rating ? 'solid' : 'outline'} size={18} className={s < t.rating ? 'text-gold' : 'text-white/30'} />
                      ))}
                    </div>
                    <blockquote className="font-display text-xl sm:text-2xl leading-snug mb-8">&ldquo;{t.content}&rdquo;</blockquote>
                    <div className="flex items-center gap-4">
                      <div className="relative w-14 h-14 rounded-full overflow-hidden ring-2 ring-white/20 flex-shrink-0">
                        <AppImage src={t.image} alt={t.imageAlt} fill sizes="56px" className="object-cover" />
                      </div>
                      <div>
                        <p className="font-semibold">{t.name}</p>
                        <p className="text-sm text-navy-foreground/65">{t.role}</p>
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
