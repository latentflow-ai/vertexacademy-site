'use client';

import Icon from '@/components/ui/AppIcon';
import Button from '@/components/ui/Button';
import Reveal from '@/components/motion/Reveal';
import { Stagger, StaggerItem } from '@/components/motion/Stagger';
import TiltCard from '@/components/motion/TiltCard';

interface Feature {
  id: number;
  title: string;
  description: string;
  icon: string;
  accent: 'blue' | 'green' | 'gold';
  wide?: boolean;
}

const features: Feature[] = [
  { id: 1, title: 'Personalised attention', description: 'Batches of 8–15 students mean every child is known by name and taught to their actual level — never an average.', icon: 'UserIcon', accent: 'blue', wide: true },
  { id: 2, title: 'Expert faculty', description: 'Subject specialists with 15+ years and a real track record.', icon: 'AcademicCapIcon', accent: 'green' },
  { id: 3, title: 'Proven success', description: 'A consistent 95% board success rate, year after year.', icon: 'TrophyIcon', accent: 'gold' },
  { id: 4, title: 'Comprehensive curriculum', description: 'Board + competitive exam aligned, taught with depth and clarity.', icon: 'BookOpenIcon', accent: 'green' },
  { id: 5, title: 'Modern campus', description: 'Smart classrooms, a quiet library, and well-equipped labs.', icon: 'BuildingLibraryIcon', accent: 'gold' },
  { id: 6, title: 'Holistic development', description: 'Confidence, critical thinking, and study habits that last.', icon: 'SparklesIcon', accent: 'blue' },
];

const accentChip: Record<Feature['accent'], string> = {
  blue: 'bg-primary-tint text-primary',
  green: 'bg-green-tint text-green',
  gold: 'bg-gold-tint text-gold-strong',
};

const WhyChooseSection = ({ className = '' }: { className?: string }) => {
  return (
    <section className={`section-y bg-surface ${className}`}>
      <div className="container mx-auto px-4 sm:px-6">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-12">
          <div className="lg:col-span-4">
            <div className="lg:sticky lg:top-28">
              <Reveal>
                <p className="eyebrow mb-3">Why Vertex</p>
                <h2 className="text-display-md text-navy">
                  Built for <span className="text-primary mark-gold">real progress</span>
                </h2>
                <p className="text-body-lg text-text-secondary mt-5 max-w-md">
                  Every part of the Vertex experience is engineered to help a student do their genuine best —
                  not just cover a syllabus.
                </p>
                <div className="mt-7">
                  <Button href="/about-us" variant="secondary" size="md">
                    Our approach
                    <Icon name="ArrowRightIcon" size={18} />
                  </Button>
                </div>
              </Reveal>
            </div>
          </div>

          <div className="lg:col-span-8">
            <Stagger className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {features.map((f) => (
                <StaggerItem key={f.id} className={f.wide ? 'sm:col-span-2' : ''}>
                  <TiltCard className="group h-full rounded-lg bg-surface-2 border border-border p-6 sm:p-7 hover-lift">
                    <div className="flex items-start justify-between mb-4">
                      <span className={`inline-flex items-center justify-center w-12 h-12 rounded-xl ${accentChip[f.accent]}`}>
                        <Icon name={f.icon} size={24} variant="solid" />
                      </span>
                      <span className="font-display text-2xl text-text-faint/60 leading-none">
                        {String(f.id).padStart(2, '0')}
                      </span>
                    </div>
                    <h3 className="font-display text-xl text-navy mb-2">{f.title}</h3>
                    <p className="text-text-secondary leading-relaxed text-[0.95rem]">{f.description}</p>
                  </TiltCard>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </div>

        {/* trust strip */}
        <Reveal>
          <div className="mt-10 sm:mt-12 bg-navy text-navy-foreground rounded-xl p-6 sm:p-9 flex flex-col sm:flex-row items-start sm:items-center gap-5 overflow-hidden relative">
            <div className="absolute -right-10 -top-10 w-44 h-44 rounded-full bg-primary/20 blur-2xl pointer-events-none" />
            <span className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gold flex-shrink-0 relative">
              <Icon name="ShieldCheckIcon" size={28} className="text-navy" variant="solid" />
            </span>
            <div className="relative">
              <p className="font-display text-xl sm:text-2xl">A unit of Thanga Ramachandran Educational Trust</p>
              <p className="text-navy-foreground/70 mt-1.5 leading-relaxed">
                Institutional credibility and nine years of unwavering commitment to academic excellence.
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
};

export default WhyChooseSection;
