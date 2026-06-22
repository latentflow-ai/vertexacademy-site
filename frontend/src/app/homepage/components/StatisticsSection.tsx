'use client';

import Icon from '@/components/ui/AppIcon';
import { Stagger, StaggerItem } from '@/components/motion/Stagger';
import { useCountUp } from '@/components/motion/useCountUp';
import TiltCard from '@/components/motion/TiltCard';
import Reveal from '@/components/motion/Reveal';

interface Stat {
  id: number;
  value: number;
  suffix: string;
  label: string;
  icon: string;
  tone: 'navy' | 'white' | 'green' | 'gold';
}

const stats: Stat[] = [
  { id: 1, value: 2000, suffix: '+', label: 'Students Enrolled', icon: 'UserGroupIcon', tone: 'navy' },
  { id: 2, value: 95, suffix: '%', label: 'Success Rate', icon: 'TrophyIcon', tone: 'green' },
  { id: 3, value: 9, suffix: '+', label: 'Years of Excellence', icon: 'AcademicCapIcon', tone: 'gold' },
  { id: 4, value: 50, suffix: '+', label: 'Expert Faculty', icon: 'UserIcon', tone: 'white' },
];

const toneClass: Record<Stat['tone'], string> = {
  navy: 'bg-navy text-navy-foreground border-white/10',
  white: 'bg-surface-2 text-navy border-border',
  green: 'bg-green-tint text-navy border-green/15',
  gold: 'bg-gold-tint text-navy border-gold/25',
};
const iconClass: Record<Stat['tone'], string> = {
  navy: 'text-gold',
  white: 'text-primary',
  green: 'text-green',
  gold: 'text-gold-strong',
};
const numClass: Record<Stat['tone'], string> = {
  navy: 'text-white',
  white: 'text-navy',
  green: 'text-green',
  gold: 'text-gold-strong',
};

const StatCard = ({ stat }: { stat: Stat }) => {
  const { ref, value } = useCountUp(stat.value);
  return (
    <StaggerItem>
      <TiltCard className={`rounded-lg border p-6 sm:p-7 h-full ${toneClass[stat.tone]}`}>
        <Icon name={stat.icon} size={24} className={`mb-5 ${iconClass[stat.tone]}`} variant="solid" />
        <div className={`font-display text-4xl sm:text-5xl leading-none ${numClass[stat.tone]}`}>
          <span ref={ref}>{value.toLocaleString('en-IN')}</span>
          <span className={stat.tone === 'navy' ? 'text-gold' : 'text-green'}>{stat.suffix}</span>
        </div>
        <p className={`text-sm mt-3 ${stat.tone === 'navy' ? 'text-navy-foreground/70' : 'text-text-secondary'}`}>
          {stat.label}
        </p>
      </TiltCard>
    </StaggerItem>
  );
};

const StatisticsSection = ({ className = '' }: { className?: string }) => {
  return (
    <section className={`section-y bg-background ${className}`}>
      <div className="container mx-auto px-4 sm:px-6">
        <Reveal>
          <div className="max-w-2xl mb-12 sm:mb-14">
            <p className="eyebrow mb-3">Our Impact</p>
            <h2 className="text-display-md text-navy">
              Numbers that <span className="text-primary mark-green">speak louder</span> than promises
            </h2>
            <p className="text-body-lg text-text-secondary mt-4">
              Nine years of consistent, verifiable outcomes for families across Chennai.
            </p>
          </div>
        </Reveal>

        <Stagger className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
          {stats.map((s) => (
            <StatCard key={s.id} stat={s} />
          ))}
        </Stagger>
      </div>
    </section>
  );
};

export default StatisticsSection;
