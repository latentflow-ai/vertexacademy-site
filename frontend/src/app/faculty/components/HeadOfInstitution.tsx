'use client';

import React from 'react';
import AppImage from '@/components/ui/AppImage';
import Icon from '@/components/ui/AppIcon';
import Reveal from '@/components/motion/Reveal';
import { Stagger, StaggerItem } from '@/components/motion/Stagger';

interface Achievement {
  icon: string;
  title: string;
  description: string;
}

interface HeadProfile {
  name: string;
  title: string;
  image: string;
  alt: string;
  qualification: string;
  experience: string;
  specialization: string;
  philosophy: string;
  achievements: Achievement[];
}

const HeadOfInstitution: React.FC<{ profile: HeadProfile; className?: string }> = ({ profile, className = '' }) => {
  const credentials = [
    { icon: 'AcademicCapIcon', label: 'Qualification', value: profile.qualification },
    { icon: 'BriefcaseIcon', label: 'Experience', value: profile.experience },
    { icon: 'StarIcon', label: 'Specialization', value: profile.specialization },
  ];

  return (
    <section className={`section-y bg-surface ${className}`}>
      <div className="container mx-auto px-4 sm:px-6">
        <Reveal>
          <div className="max-w-2xl mb-12 sm:mb-14">
            <p className="eyebrow mb-3">Leadership Excellence</p>
            <h2 className="text-display-md text-navy">Head of Institution</h2>
            <p className="text-body-lg text-text-secondary mt-4">
              Visionary leadership guiding Vertex Academy towards educational excellence.
            </p>
          </div>
        </Reveal>

        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          <Reveal className="lg:col-span-5">
            <div className="relative aspect-[3/4] rounded-xl overflow-hidden border border-border shadow-soft">
              <AppImage src={profile.image} alt={profile.alt} fill className="object-cover" sizes="(max-width: 1024px) 100vw, 40vw" />
              <div className="absolute inset-0 bg-gradient-to-t from-navy/90 via-navy/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <h3 className="font-display text-2xl leading-tight">{profile.name}</h3>
                <p className="text-gold mt-1 font-medium">{profile.title}</p>
              </div>
            </div>
          </Reveal>

          <div className="lg:col-span-7 space-y-6">
            <Stagger className="grid sm:grid-cols-3 gap-4">
              {credentials.map((c) => (
                <StaggerItem key={c.label} className="rounded-xl border border-border bg-surface-2 p-5">
                  <Icon name={c.icon} size={22} className="text-primary mb-3" variant="solid" />
                  <div className="text-xs uppercase tracking-wide text-text-faint mb-1">{c.label}</div>
                  <div className="text-sm font-semibold text-navy">{c.value}</div>
                </StaggerItem>
              ))}
            </Stagger>

            <Reveal>
              <div className="rounded-xl bg-navy text-navy-foreground p-6 sm:p-8 relative overflow-hidden">
                <div className="absolute -right-10 -top-10 w-40 h-40 rounded-full bg-primary/25 blur-2xl pointer-events-none" />
                <div className="flex items-center gap-2 mb-4 relative">
                  <Icon name="LightBulbIcon" size={20} className="text-gold" variant="solid" />
                  <span className="eyebrow !text-gold">Teaching Philosophy</span>
                </div>
                <p className="font-display text-lg sm:text-xl leading-relaxed text-navy-foreground/90 relative">
                  &ldquo;{profile.philosophy}&rdquo;
                </p>
              </div>
            </Reveal>

            <div>
              <Reveal>
                <h4 className="font-display text-xl text-navy flex items-center gap-2 mb-4">
                  <Icon name="TrophyIcon" size={22} className="text-gold-strong" variant="solid" />
                  Key Achievements
                </h4>
              </Reveal>
              <Stagger className="grid sm:grid-cols-2 gap-4">
                {profile.achievements.map((a) => (
                  <StaggerItem key={a.title} className="rounded-xl border border-border bg-surface-2 p-5 hover-lift">
                    <Icon name={a.icon} size={22} className="text-primary mb-3" variant="solid" />
                    <h5 className="text-sm font-semibold text-navy mb-1">{a.title}</h5>
                    <p className="text-sm text-text-secondary leading-relaxed">{a.description}</p>
                  </StaggerItem>
                ))}
              </Stagger>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeadOfInstitution;
