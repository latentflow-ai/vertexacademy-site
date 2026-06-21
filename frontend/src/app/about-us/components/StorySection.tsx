'use client';

import AppImage from '@/components/ui/AppImage';
import Icon from '@/components/ui/AppIcon';
import Reveal from '@/components/motion/Reveal';
import { Stagger, StaggerItem } from '@/components/motion/Stagger';
import TiltCard from '@/components/motion/TiltCard';

interface StorySectionProps {
  story: {
    title: string;
    description: string;
    image: string;
    imageAlt: string;
    highlights: Array<{ icon: string; title: string; description: string }>;
  };
}

const accents = ['bg-primary-tint text-primary', 'bg-green-tint text-green', 'bg-gold-tint text-gold-strong'];

const StorySection = ({ story }: StorySectionProps) => {
  return (
    <section className="section-y bg-background">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          <div className="lg:col-span-7">
            <Reveal>
              <p className="eyebrow mb-3">Our Journey</p>
              <h2 className="text-display-md text-navy">{story.title}</h2>
              <p className="text-body-lg text-text-secondary mt-5 leading-relaxed">{story.description}</p>
            </Reveal>

            <Stagger className="mt-9 grid sm:grid-cols-1 gap-4">
              {story.highlights.map((h, i) => (
                <StaggerItem key={i}>
                  <TiltCard className="group flex gap-4 rounded-lg border border-border bg-surface-2 p-5 sm:p-6 hover-lift">
                    <span className={`flex-shrink-0 inline-flex items-center justify-center w-12 h-12 rounded-xl ${accents[i % 3]}`}>
                      <Icon name={h.icon} size={24} variant="solid" />
                    </span>
                    <div>
                      <h3 className="font-display text-lg text-navy mb-1.5">{h.title}</h3>
                      <p className="text-[0.95rem] text-text-secondary leading-relaxed">{h.description}</p>
                    </div>
                  </TiltCard>
                </StaggerItem>
              ))}
            </Stagger>
          </div>

          <div className="lg:col-span-5 lg:sticky lg:top-28">
            <Reveal delay={0.1}>
              <TiltCard className="relative h-[320px] sm:h-[420px] lg:h-[540px] rounded-xl overflow-hidden border border-border shadow-soft">
                <AppImage src={story.image} alt={story.imageAlt} fill sizes="(max-width: 1024px) 100vw, 40vw" className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-navy/40 to-transparent" />
                <div className="absolute left-5 bottom-5 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/90 text-navy text-sm font-semibold backdrop-blur">
                  <Icon name="StarIcon" size={16} className="text-gold" variant="solid" />
                  Since 2016 · Sholinganallur
                </div>
              </TiltCard>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StorySection;
