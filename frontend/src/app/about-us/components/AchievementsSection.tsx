'use client';

import Icon from '@/components/ui/AppIcon';
import Reveal from '@/components/motion/Reveal';
import { Stagger, StaggerItem } from '@/components/motion/Stagger';
import { useCountUp } from '@/components/motion/useCountUp';

interface Achievement {
  icon: string;
  value: string;
  label: string;
  description: string;
}

interface AchievementsSectionProps {
  achievements: Achievement[];
}

const parseValue = (value: string) => {
  const match = value.match(/^([\d,]+)(.*)$/);
  if (!match) return { target: null as number | null, suffix: value };
  const target = parseInt(match[1].replace(/,/g, ''), 10);
  if (Number.isNaN(target)) return { target: null, suffix: value };
  return { target, suffix: match[2] };
};

const AchievementCard = ({ achievement }: { achievement: Achievement }) => {
  const { target, suffix } = parseValue(achievement.value);
  const { ref, value } = useCountUp(target ?? 0);

  return (
    <StaggerItem className="rounded-xl bg-white/[0.05] border border-white/10 p-6 sm:p-7">
      <span className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-white/8 text-gold mb-5">
        <Icon name={achievement.icon} size={26} variant="solid" />
      </span>
      <div className="font-display text-4xl sm:text-5xl text-white leading-none">
        {target !== null ? (
          <>
            <span ref={ref}>{value.toLocaleString('en-IN')}</span>
            <span className="text-gold">{suffix}</span>
          </>
        ) : (
          achievement.value
        )}
      </div>
      <div className="text-base font-semibold text-navy-foreground mt-3">{achievement.label}</div>
      <p className="text-sm text-navy-foreground/65 mt-1.5 leading-relaxed">{achievement.description}</p>
    </StaggerItem>
  );
};

const AchievementsSection = ({ achievements }: AchievementsSectionProps) => {
  return (
    <section className="section-y bg-background">
      <div className="container mx-auto px-4 sm:px-6">
        <Reveal>
          <div className="relative overflow-hidden bg-navy text-navy-foreground rounded-2xl px-6 py-12 sm:px-12 sm:py-16">
            <div className="absolute -top-16 -right-10 w-72 h-72 rounded-full bg-primary/25 blur-3xl pointer-events-none" />
            <div
              className="absolute inset-0 opacity-[0.06] pointer-events-none"
              style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '34px 34px' }}
            />
            <div className="relative z-10">
              <div className="max-w-2xl mb-10 sm:mb-12">
                <p className="eyebrow !text-gold mb-3">Our Impact</p>
                <h2 className="font-display text-[clamp(1.875rem,4vw,3rem)] leading-[1.08] text-white">
                  Numbers that reflect our commitment
                </h2>
              </div>
              <Stagger className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
                {achievements.map((a, i) => (
                  <AchievementCard key={i} achievement={a} />
                ))}
              </Stagger>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
};

export default AchievementsSection;
