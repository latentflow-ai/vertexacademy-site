'use client';

import Icon from '@/components/ui/AppIcon';
import { Stagger, StaggerItem } from '@/components/motion/Stagger';
import { useCountUp } from '@/components/motion/useCountUp';
import TiltCard from '@/components/motion/TiltCard';

interface StatItem {
  icon: string;
  value: string;
  label: string;
}

const chips = ['bg-primary-tint text-primary', 'bg-green-tint text-green', 'bg-gold-tint text-gold-strong', 'bg-primary-tint text-primary'];

const parse = (v: string) => {
  const m = v.match(/^([\d,]+)(.*)$/);
  if (!m) return { target: null as number | null, suffix: v };
  const target = parseInt(m[1].replace(/,/g, ''), 10);
  return Number.isNaN(target) ? { target: null, suffix: v } : { target, suffix: m[2] };
};

const StatCard = ({ stat, i }: { stat: StatItem; i: number }) => {
  const { target, suffix } = parse(stat.value);
  const { ref, value } = useCountUp(target ?? 0);
  return (
    <StaggerItem>
      <TiltCard className="h-full bg-surface-2 rounded-xl border border-border p-6 hover-lift">
        <span className={`inline-flex items-center justify-center w-12 h-12 rounded-xl mb-4 ${chips[i % 4]}`}>
          <Icon name={stat.icon} size={24} variant="solid" />
        </span>
        <div className="font-display text-3xl sm:text-4xl text-navy leading-none">
          {target !== null ? (<><span ref={ref}>{value}</span><span className="text-green">{suffix}</span></>) : stat.value}
        </div>
        <div className="text-sm text-text-secondary mt-2">{stat.label}</div>
      </TiltCard>
    </StaggerItem>
  );
};

export default function GalleryStats({ stats }: { stats: StatItem[] }) {
  return (
    <Stagger className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 mb-12 sm:mb-16">
      {stats.map((stat, i) => (
        <StatCard key={i} stat={stat} i={i} />
      ))}
    </Stagger>
  );
}
