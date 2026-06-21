'use client';

import { Stagger, StaggerItem } from '@/components/motion/Stagger';
import { useCountUp } from '@/components/motion/useCountUp';
import KineticHeadline from '@/components/motion/KineticHeadline';

interface HeroStat {
  value: number;
  suffix: string;
  prefix?: string;
  label: string;
}

const stats: HeroStat[] = [
  { value: 25, suffix: '+', label: 'Expert Teachers' },
  { value: 15, suffix: '+', label: 'Years Experience' },
  { value: 95, suffix: '%', label: 'Success Rate' },
  { value: 8, suffix: '', prefix: '1:', label: 'Teacher Ratio' },
];

const HeroStatCard = ({ stat }: { stat: HeroStat }) => {
  const { ref, value } = useCountUp(stat.value);
  return (
    <StaggerItem className="rounded-xl border border-white/10 bg-white/[0.05] p-5 sm:p-6">
      <div className="font-display text-4xl sm:text-5xl leading-none text-white">
        {stat.prefix && <span>{stat.prefix}</span>}
        <span ref={ref}>{value}</span>
        <span className="text-gold">{stat.suffix}</span>
      </div>
      <div className="text-xs uppercase tracking-wide text-navy-foreground/60 mt-3">{stat.label}</div>
    </StaggerItem>
  );
};

const HeroSection = ({ className = '' }: { className?: string }) => {
  return (
    <section className={`relative overflow-hidden bg-navy text-navy-foreground ${className}`}>
      <div className="absolute -top-20 right-10 w-72 h-72 rounded-full bg-primary/30 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-72 h-72 rounded-full bg-green/20 blur-3xl pointer-events-none" />
      <div
        className="absolute inset-0 opacity-[0.06] pointer-events-none"
        style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '34px 34px' }}
      />
      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div className="max-w-3xl pt-20 pb-12 sm:pt-28 sm:pb-16">
          <p className="eyebrow !text-gold mb-4">Meet Our Expert Faculty</p>
          <KineticHeadline
            text="Excellence in teaching, dedication to success"
            as="h1"
            className="font-display font-semibold text-[clamp(2.25rem,5.5vw,4.25rem)] leading-[1.02]"
            highlight={['success']}
            highlightClass="text-gold"
          />
          <p className="text-lg sm:text-xl text-navy-foreground/75 leading-relaxed mt-6 max-w-2xl">
            Our distinguished faculty brings together decades of teaching experience, proven
            methodologies, and an unwavering commitment to student success.
          </p>
        </div>
        <Stagger className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-5 max-w-4xl pb-16 sm:pb-20">
          {stats.map((s) => (
            <HeroStatCard key={s.label} stat={s} />
          ))}
        </Stagger>
      </div>
    </section>
  );
};

export default HeroSection;
