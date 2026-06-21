'use client';

import { motion, useReducedMotion, type Variants } from 'framer-motion';
import Icon from '@/components/ui/AppIcon';
import AppImage from '@/components/ui/AppImage';
import Button from '@/components/ui/Button';
import Magnetic from '@/components/motion/Magnetic';
import TiltCard from '@/components/motion/TiltCard';

interface HeroSectionProps {
  className?: string;
}

const floaters = [
  { className: 'top-[18%] left-[6%] w-3 h-3 rounded-full bg-gold', d: 5 },
  { className: 'top-[30%] right-[10%] w-4 h-4 rounded-sm bg-green-bright/70 rotate-12', d: 6.5 },
  { className: 'bottom-[20%] left-[14%] w-5 h-5 rounded-md border-2 border-primary/40', d: 7.5 },
  { className: 'bottom-[28%] right-[18%] w-2.5 h-2.5 rounded-full bg-primary/50', d: 5.8 },
];

const HeroSection = ({ className = '' }: HeroSectionProps) => {
  const reduce = useReducedMotion();

  const container: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: reduce ? 0 : 0.07, delayChildren: 0.05 } },
  };
  const item: Variants = reduce
    ? { hidden: { opacity: 0 }, show: { opacity: 1 } }
    : { hidden: { opacity: 0, y: 22 }, show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } } };

  // word-by-word kinetic headline (built inline to allow a highlighted word)
  const line1 = ['Every', 'student', 'reaches'];
  const line2 = ['their', 'academic'];

  return (
    <section className={`relative overflow-hidden bg-background ${className}`}>
      {/* brand field background */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.5]"
        style={{
          backgroundImage:
            'radial-gradient(circle at 1px 1px, rgba(11,31,77,0.10) 1px, transparent 0)',
          backgroundSize: '26px 26px',
          maskImage: 'radial-gradient(ellipse 80% 70% at 65% 30%, black, transparent)',
          WebkitMaskImage: 'radial-gradient(ellipse 80% 70% at 65% 30%, black, transparent)',
        }}
      />
      <div className="absolute -top-24 -right-24 w-[34rem] h-[34rem] rounded-full bg-primary/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -left-24 w-[30rem] h-[30rem] rounded-full bg-green-bright/10 blur-3xl pointer-events-none" />

      {/* floating shapes */}
      {!reduce &&
        floaters.map((f, i) => (
          <motion.div
            key={i}
            className={`absolute ${f.className} pointer-events-none`}
            animate={{ y: [0, -14, 0], opacity: [0.6, 1, 0.6] }}
            transition={{ duration: f.d, repeat: Infinity, ease: 'easeInOut' }}
          />
        ))}

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-8 items-center pt-14 pb-16 sm:pt-20 sm:pb-24 lg:min-h-[calc(100vh-5rem)]">
          {/* Left — copy */}
          <motion.div className="lg:col-span-6" variants={container} initial="hidden" animate="show">
            <motion.span
              variants={item}
              className="inline-flex items-center gap-2 px-4 py-1.5 bg-surface-2 border border-border rounded-full mb-6 shadow-subtle"
            >
              <span className="relative flex w-2 h-2">
                <span className="absolute inline-flex h-full w-full rounded-full bg-green-bright opacity-60 animate-ping" />
                <span className="relative inline-flex rounded-full w-2 h-2 bg-green-bright" />
              </span>
              <span className="text-xs font-bold tracking-[0.14em] uppercase text-text-secondary">
                Admissions open · 2026–27
              </span>
            </motion.span>

            <h1 className="font-display font-semibold text-navy text-[clamp(2.75rem,6.5vw,5.25rem)] leading-[0.98] tracking-[-0.03em] mb-6">
              <span className="block">
                {line1.map((w, i) => (
                  <span key={i} className="inline-block overflow-hidden align-bottom mr-[0.22em]">
                    <motion.span
                      className="inline-block"
                      initial={reduce ? { opacity: 0 } : { y: '110%' }}
                      animate={reduce ? { opacity: 1 } : { y: 0 }}
                      transition={{ duration: 0.7, delay: 0.1 + i * 0.07, ease: [0.16, 1, 0.3, 1] }}
                    >
                      {w}
                    </motion.span>
                  </span>
                ))}
              </span>
              <span className="block">
                {line2.map((w, i) => (
                  <span key={i} className="inline-block overflow-hidden align-bottom mr-[0.22em]">
                    <motion.span
                      className="inline-block"
                      initial={reduce ? { opacity: 0 } : { y: '110%' }}
                      animate={reduce ? { opacity: 1 } : { y: 0 }}
                      transition={{ duration: 0.7, delay: 0.3 + i * 0.07, ease: [0.16, 1, 0.3, 1] }}
                    >
                      {w}
                    </motion.span>
                  </span>
                ))}
                <span className="inline-block overflow-hidden align-bottom">
                  <motion.span
                    className="inline-block text-primary mark-gold"
                    initial={reduce ? { opacity: 0 } : { y: '110%' }}
                    animate={reduce ? { opacity: 1 } : { y: 0 }}
                    transition={{ duration: 0.7, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  >
                    vertex.
                  </motion.span>
                </span>
              </span>
            </h1>

            <motion.p variants={item} className="text-lg sm:text-xl text-text-secondary max-w-xl leading-relaxed mb-8">
              Chennai&apos;s premium tuition centre — small batches, expert mentors, and a calm,
              focused environment where genuine progress actually happens.
            </motion.p>

            <motion.div variants={item} className="flex flex-col sm:flex-row gap-3 mb-9">
              <Magnetic>
                <Button href="/contact" variant="primary" size="lg">
                  Enroll Now
                  <Icon name="ArrowRightIcon" size={20} />
                </Button>
              </Magnetic>
              <Magnetic>
                <Button href="/campus-visit" variant="green" size="lg">
                  Book a Free Trial
                </Button>
              </Magnetic>
            </motion.div>

            <motion.div variants={item} className="flex flex-wrap items-center gap-x-6 gap-y-3">
              <div className="flex items-center gap-1.5">
                {[...Array(5)].map((_, i) => (
                  <Icon key={i} name="StarIcon" size={18} className="text-gold" variant="solid" />
                ))}
                <span className="ml-1 text-sm font-semibold text-navy">4.9/5</span>
                <span className="text-sm text-text-secondary">from 600+ parents</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Right — bento cluster */}
          <motion.div
            className="lg:col-span-6"
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 28 }}
            animate={reduce ? { opacity: 1 } : { opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              {/* big image tile */}
              <TiltCard className="col-span-2 relative rounded-lg overflow-hidden border border-border shadow-soft aspect-[16/10]">
                <AppImage
                  src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1200&q=80"
                  alt="Students collaborating in a bright modern classroom"
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy/55 via-navy/0 to-transparent" />
                <div className="absolute left-4 bottom-4 right-4 flex items-center justify-between">
                  <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/90 text-navy text-sm font-semibold backdrop-blur">
                    <Icon name="AcademicCapIcon" size={16} className="text-primary" variant="solid" />
                    Classes 1–12 & Competitive
                  </span>
                </div>
                <div className="absolute top-4 right-4">
                  <span className="inline-flex flex-col items-center justify-center w-16 h-16 rounded-full bg-gold text-navy font-display font-semibold shadow-elevation">
                    <span className="text-lg leading-none">95%</span>
                    <span className="text-[0.55rem] uppercase tracking-wide">success</span>
                  </span>
                </div>
              </TiltCard>

              {/* stat tile navy */}
              <TiltCard className="rounded-lg bg-navy text-navy-foreground p-5 border border-white/10 shadow-soft">
                <Icon name="UserGroupIcon" size={22} className="text-gold mb-3" variant="solid" />
                <div className="font-display text-3xl sm:text-4xl">2,000+</div>
                <div className="text-xs uppercase tracking-wide text-navy-foreground/60 mt-1">Students taught</div>
              </TiltCard>

              {/* stat tile green-tint */}
              <TiltCard className="rounded-lg bg-green-tint p-5 border border-green/15 shadow-subtle">
                <Icon name="TrophyIcon" size={22} className="text-green mb-3" variant="solid" />
                <div className="font-display text-3xl sm:text-4xl text-green">9+</div>
                <div className="text-xs uppercase tracking-wide text-text-secondary mt-1">Years of trust</div>
              </TiltCard>

              {/* faculty tile */}
              <TiltCard className="col-span-2 rounded-lg bg-surface-2 border border-border p-5 shadow-subtle flex items-center gap-4">
                <span className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary-tint text-primary flex-shrink-0">
                  <Icon name="UserIcon" size={24} variant="solid" />
                </span>
                <div>
                  <div className="font-display text-xl text-navy">50+ expert faculty</div>
                  <div className="text-sm text-text-secondary">15+ yrs average experience · 1:8 ratio</div>
                </div>
              </TiltCard>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
