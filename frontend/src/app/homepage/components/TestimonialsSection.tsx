'use client';

import { useState, useEffect } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import Icon from '@/components/ui/AppIcon';
import AppImage from '@/components/ui/AppImage';
import Reveal from '@/components/motion/Reveal';

interface Testimonial {
  id: number;
  name: string;
  role: string;
  image: string;
  alt: string;
  rating: number;
  content: string;
  studentName?: string;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: 'Priya Sharma',
    role: 'Parent',
    image: 'https://img.rocket.new/generatedImages/rocket_gen_img_1e14322e7-1763296357021.png',
    alt: 'Professional Indian woman with long dark hair wearing blue blazer smiling warmly',
    rating: 5,
    content:
      "Vertex Academy transformed my daughter's academic journey. The personalized attention and expert teaching helped her score 95% in board exams. The teachers genuinely care about each student's progress.",
    studentName: 'Ananya Sharma, Class 10',
  },
  {
    id: 2,
    name: 'Rajesh Kumar',
    role: 'Parent',
    image: 'https://img.rocket.new/generatedImages/rocket_gen_img_191d4b638-1763295605065.png',
    alt: 'Professional Indian man with short black hair in navy suit smiling confidently',
    rating: 5,
    content:
      'The small batch sizes and comprehensive curriculum gave my son the competitive edge he needed. He cleared his entrance exams with flying colors. Highly recommend for serious students.',
    studentName: 'Arjun Kumar, Class 12',
  },
  {
    id: 3,
    name: 'Meera Patel',
    role: 'Parent',
    image: 'https://img.rocket.new/generatedImages/rocket_gen_img_103114392-1763294966758.png',
    alt: 'Elegant Indian woman with shoulder-length dark hair wearing white blouse with gentle smile',
    rating: 5,
    content:
      'What sets Vertex Academy apart is their holistic approach. My daughter not only excelled academically but also developed confidence and critical thinking skills. The faculty is exceptional.',
    studentName: 'Diya Patel, Class 8',
  },
  {
    id: 4,
    name: 'Vikram Reddy',
    role: 'Parent',
    image: 'https://img.rocket.new/generatedImages/rocket_gen_img_1d7dd53fb-1763295901739.png',
    alt: 'Professional Indian man with short dark hair wearing grey blazer with warm smile',
    rating: 5,
    content:
      'Nine years of excellence speaks for itself. The infrastructure, teaching quality, and results-oriented approach make Vertex Academy the best choice in Sholinganallur. Worth every rupee.',
    studentName: 'Rohan Reddy, Class 11',
  },
];

const TestimonialsSection = ({ className = '' }: { className?: string }) => {
  const [i, setI] = useState(0);
  const reduce = useReducedMotion();

  useEffect(() => {
    const id = setInterval(() => setI((p) => (p + 1) % testimonials.length), 6000);
    return () => clearInterval(id);
  }, []);

  const prev = () => setI((p) => (p - 1 + testimonials.length) % testimonials.length);
  const next = () => setI((p) => (p + 1) % testimonials.length);
  const t = testimonials[i];

  return (
    <section className={`section-y bg-background ${className}`}>
      <div className="container mx-auto px-4 sm:px-6">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* heading */}
          <div className="lg:col-span-4">
            <Reveal>
              <p className="eyebrow mb-3">Success Stories</p>
              <h2 className="text-display-md text-navy">
                Loved by <span className="text-primary mark-gold">Chennai parents</span>
              </h2>
              <p className="text-body-lg text-text-secondary mt-4">
                Real words from families who trusted us with their children&apos;s future.
              </p>
              <div className="flex items-center gap-3 mt-7">
                <button
                  onClick={prev}
                  className="inline-flex items-center justify-center w-12 h-12 rounded-full border border-border text-navy hover:bg-primary hover:text-white hover:border-primary transition-colors active:scale-95"
                  aria-label="Previous testimonial"
                >
                  <Icon name="ChevronLeftIcon" size={22} />
                </button>
                <button
                  onClick={next}
                  className="inline-flex items-center justify-center w-12 h-12 rounded-full border border-border text-navy hover:bg-primary hover:text-white hover:border-primary transition-colors active:scale-95"
                  aria-label="Next testimonial"
                >
                  <Icon name="ChevronRightIcon" size={22} />
                </button>
                <div className="flex items-center gap-2 ml-2">
                  {testimonials.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setI(idx)}
                      className={`h-2 rounded-full transition-all duration-300 ${idx === i ? 'w-7 bg-primary' : 'w-2 bg-border hover:bg-text-faint'}`}
                      aria-label={`Testimonial ${idx + 1}`}
                    />
                  ))}
                </div>
              </div>
            </Reveal>
          </div>

          {/* card */}
          <div className="lg:col-span-8">
            <Reveal>
              <div className="relative bg-navy text-navy-foreground rounded-xl p-7 sm:p-10 shadow-soft overflow-hidden min-h-[20rem]">
                <div className="absolute -right-12 -top-12 w-48 h-48 rounded-full bg-primary/25 blur-3xl pointer-events-none" />
                <Icon name="ChatBubbleLeftRightIcon" size={44} className="text-gold/30 absolute top-7 right-7" variant="solid" />
                <AnimatePresence mode="wait">
                  <motion.div
                    key={t.id}
                    initial={reduce ? { opacity: 0 } : { opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={reduce ? { opacity: 0 } : { opacity: 0, y: -14 }}
                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    className="relative"
                  >
                    <div className="flex items-center gap-1 mb-5">
                      {[...Array(t.rating)].map((_, s) => (
                        <Icon key={s} name="StarIcon" size={18} className="text-gold" variant="solid" />
                      ))}
                    </div>
                    <blockquote className="font-display text-xl sm:text-[1.75rem] leading-snug mb-8">
                      &ldquo;{t.content}&rdquo;
                    </blockquote>
                    <div className="flex items-center gap-4">
                      <div className="relative w-14 h-14 rounded-full overflow-hidden ring-2 ring-white/20 flex-shrink-0">
                        <AppImage src={t.image} alt={t.alt} fill sizes="56px" className="object-cover" />
                      </div>
                      <div>
                        <p className="font-semibold">{t.name}</p>
                        <p className="text-sm text-navy-foreground/65">
                          {t.role}
                          {t.studentName ? ` · ${t.studentName}` : ''}
                        </p>
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
