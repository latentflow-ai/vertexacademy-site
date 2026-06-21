'use client';

import Icon from '@/components/ui/AppIcon';
import Reveal from '@/components/motion/Reveal';
import { Stagger, StaggerItem } from '@/components/motion/Stagger';
import TiltCard from '@/components/motion/TiltCard';

interface MVVItem {
  icon: string;
  title: string;
  description: string;
  color: string;
}

interface MissionVisionValuesProps {
  items: MVVItem[];
}

const MissionVisionValues = ({ items }: MissionVisionValuesProps) => {
  return (
    <section className="section-y bg-surface">
      <div className="container mx-auto px-4 sm:px-6">
        <Reveal>
          <div className="max-w-2xl mb-12 sm:mb-14">
            <p className="eyebrow mb-3">Our Foundation</p>
            <h2 className="text-display-md text-navy">
              The principles that <span className="text-primary mark-gold">guide us</span>
            </h2>
            <p className="text-body-lg text-text-secondary mt-4">
              What we stand for, where we&apos;re headed, and the values that shape every decision we make.
            </p>
          </div>
        </Reveal>

        <Stagger className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-5">
          {items.map((item, index) => {
            const featured = index === 0;
            const chip = featured
              ? 'bg-gold text-navy'
              : index === 1
              ? 'bg-green-tint text-green'
              : 'bg-primary-tint text-primary';
            return (
              <StaggerItem key={index}>
                <TiltCard
                  className={`group relative flex flex-col h-full rounded-xl border p-7 sm:p-8 hover-lift ${
                    featured ? 'bg-navy text-navy-foreground border-white/10' : 'bg-surface-2 border-border'
                  }`}
                >
                  <div className="flex items-start justify-between mb-6">
                    <span className={`inline-flex items-center justify-center w-12 h-12 rounded-xl ${chip}`}>
                      <Icon name={item.icon} size={24} variant="solid" />
                    </span>
                    <span className={`font-display text-3xl leading-none ${featured ? 'text-white/25' : 'text-text-faint/50'}`}>
                      {String(index + 1).padStart(2, '0')}
                    </span>
                  </div>
                  <h3 className={`font-display text-2xl mb-3 ${featured ? 'text-white' : 'text-navy'}`}>{item.title}</h3>
                  <p className={`text-[0.95rem] leading-relaxed ${featured ? 'text-navy-foreground/75' : 'text-text-secondary'}`}>
                    {item.description}
                  </p>
                </TiltCard>
              </StaggerItem>
            );
          })}
        </Stagger>
      </div>
    </section>
  );
};

export default MissionVisionValues;
