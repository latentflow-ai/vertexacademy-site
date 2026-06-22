'use client';

import React from 'react';
import Icon from '@/components/ui/AppIcon';
import Button from '@/components/ui/Button';
import Reveal from '@/components/motion/Reveal';
import { Stagger, StaggerItem } from '@/components/motion/Stagger';
import TiltCard from '@/components/motion/TiltCard';

interface Benefit {
  icon: string;
  title: string;
  description: string;
}

const benefits: Benefit[] = [
  { icon: 'AcademicCapIcon', title: 'Highly Qualified', description: 'All faculty hold advanced degrees and specialised certifications, ensuring expert knowledge delivery.' },
  { icon: 'HeartIcon', title: 'Student-Centric', description: 'Faculty adapt their methods to each student’s needs so everyone reaches their full potential.' },
  { icon: 'LightBulbIcon', title: 'Innovative Methods', description: 'Modern techniques, interactive tools, and technology make learning engaging and effective.' },
  { icon: 'ChartBarIcon', title: 'Proven Track Record', description: 'A consistent 95% success rate, with admissions to premier institutions across India.' },
  { icon: 'UserGroupIcon', title: 'Small Batch Focus', description: 'A 1:8 teacher-student ratio ensures personalised attention in every class.' },
  { icon: 'ClockIcon', title: 'Dedicated Support', description: 'Extended doubt-clearing, extra sessions, and mentorship beyond classroom hours.' },
];

const chips = ['bg-primary-tint text-primary', 'bg-green-tint text-green', 'bg-gold-tint text-gold-strong'];

const WhyOurTeachers: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <section className={`section-y bg-background ${className}`}>
      <div className="container mx-auto px-4 sm:px-6">
        <Reveal>
          <div className="max-w-2xl mb-12 sm:mb-14">
            <p className="eyebrow !text-green mb-3">Excellence in Education</p>
            <h2 className="text-display-md text-navy">
              Why our faculty <span className="text-primary mark-gold">stand out</span>
            </h2>
            <p className="text-body-lg text-text-secondary mt-4">
              The difference passionate, qualified, dedicated educators make in shaping academic success.
            </p>
          </div>
        </Reveal>

        <Stagger className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {benefits.map((b, i) => (
            <StaggerItem key={i}>
              <TiltCard className="h-full rounded-xl bg-surface-2 border border-border p-6 sm:p-7 hover-lift">
                <span className={`inline-flex items-center justify-center w-12 h-12 rounded-xl mb-5 ${chips[i % 3]}`}>
                  <Icon name={b.icon} size={24} variant="solid" />
                </span>
                <h3 className="font-display text-xl text-navy mb-2">{b.title}</h3>
                <p className="text-text-secondary leading-relaxed text-[0.95rem]">{b.description}</p>
              </TiltCard>
            </StaggerItem>
          ))}
        </Stagger>

        {/* CTA */}
        <Reveal>
          <div className="mt-12 sm:mt-14 bg-navy text-navy-foreground rounded-2xl p-8 sm:p-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative overflow-hidden">
            <div className="absolute -right-10 -top-10 w-48 h-48 rounded-full bg-green/25 blur-3xl pointer-events-none" />
            <div className="relative">
              <h3 className="font-display text-2xl sm:text-3xl">Ready to experience excellence?</h3>
              <p className="text-navy-foreground/75 mt-2 max-w-xl">
                Join Vertex Academy and learn from Chennai&apos;s finest educators dedicated to your success.
              </p>
            </div>
            <div className="relative flex-shrink-0">
              <Button href="/contact" variant="gold" size="lg">
                Schedule a Meeting
                <Icon name="ArrowRightIcon" size={20} />
              </Button>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
};

export default WhyOurTeachers;
