'use client';

import { useState } from 'react';
import Icon from '@/components/ui/AppIcon';
import Reveal from '@/components/motion/Reveal';

interface TimelineEvent {
  year: string;
  title: string;
  description: string;
  icon: string;
}

interface TimelineSectionProps {
  events: TimelineEvent[];
}

const TimelineSection = ({ events }: TimelineSectionProps) => {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <section className="section-y bg-background">
      <div className="container mx-auto px-4 sm:px-6">
        <Reveal>
          <div className="max-w-2xl mb-12 sm:mb-16">
            <p className="eyebrow mb-3">Milestones</p>
            <h2 className="text-display-md text-navy">
              Our journey <span className="text-primary mark-gold">so far</span>
            </h2>
            <p className="text-body-lg text-text-secondary mt-4">
              Milestones that mark our commitment to educational excellence.
            </p>
          </div>
        </Reveal>

        <div className="max-w-4xl mx-auto">
          <div className="relative">
            <div className="absolute left-5 lg:left-1/2 lg:-translate-x-1/2 top-2 bottom-2 w-px bg-border" />
            <div className="space-y-8 lg:space-y-12">
              {events.map((event, index) => {
                const isActive = activeIndex === index;
                const flip = index % 2 !== 0;
                return (
                  <Reveal key={index}>
                    <div
                      className={`relative flex items-center ${flip ? 'lg:flex-row-reverse' : 'lg:flex-row'}`}
                      onMouseEnter={() => setActiveIndex(index)}
                    >
                      <div className={`w-full pl-14 lg:pl-0 lg:w-5/12 ${flip ? 'lg:pl-12' : 'lg:pr-12'}`}>
                        <div
                          className={`rounded-xl border bg-surface-2 p-6 transition-all duration-300 ${
                            isActive ? 'border-primary/30 shadow-soft -translate-y-1' : 'border-border'
                          }`}
                        >
                          <div className="flex items-center justify-between gap-3 mb-3">
                            <span className="font-display text-4xl text-primary leading-none">{event.year}</span>
                            <span className="inline-flex items-center justify-center w-11 h-11 rounded-xl bg-gold-tint text-gold-strong">
                              <Icon name={event.icon} size={22} variant="solid" />
                            </span>
                          </div>
                          <h3 className="font-display text-xl text-navy mb-2">{event.title}</h3>
                          <p className="text-[0.95rem] text-text-secondary leading-relaxed">{event.description}</p>
                        </div>
                      </div>

                      <div
                        className={`absolute left-5 lg:left-1/2 lg:-translate-x-1/2 w-4 h-4 rounded-full border-4 border-background transition-colors duration-300 ${
                          isActive ? 'bg-gold' : 'bg-primary'
                        }`}
                      />
                      <div className="hidden lg:block lg:w-5/12" />
                    </div>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TimelineSection;
