'use client';

import { motion, useReducedMotion } from 'framer-motion';
import AppImage from '@/components/ui/AppImage';
import KineticHeadline from '@/components/motion/KineticHeadline';

interface HeroSectionProps {
  title: string;
  subtitle: string;
  backgroundImage: string;
  backgroundAlt: string;
}

const HeroSection = ({ title, subtitle, backgroundImage, backgroundAlt }: HeroSectionProps) => {
  const reduce = useReducedMotion();

  return (
    <section className="relative overflow-hidden bg-navy text-navy-foreground">
      <div className="absolute inset-0">
        <AppImage src={backgroundImage} alt={backgroundAlt} fill priority sizes="100vw" className="object-cover opacity-25" />
        <div className="absolute inset-0 bg-gradient-to-b from-navy/75 via-navy/85 to-navy" />
      </div>
      <div className="absolute -top-20 right-10 w-72 h-72 rounded-full bg-primary/30 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-72 h-72 rounded-full bg-green/20 blur-3xl pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div className="max-w-3xl py-24 sm:py-32">
          <motion.p
            className="eyebrow !text-gold mb-4"
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            About Vertex Academy
          </motion.p>
          <KineticHeadline
            text={title}
            as="h1"
            className="font-display font-semibold text-[clamp(2.5rem,6vw,4.5rem)] leading-[1.02]"
            highlight={['Excellence']}
            highlightClass="text-gold"
          />
          <motion.p
            className="text-lg sm:text-xl text-navy-foreground/75 mt-6 max-w-2xl leading-relaxed"
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            {subtitle}
          </motion.p>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
