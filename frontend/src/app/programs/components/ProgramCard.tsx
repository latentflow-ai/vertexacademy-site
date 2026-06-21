'use client';

import { useState } from 'react';
import Link from 'next/link';
import Icon from '@/components/ui/AppIcon';
import AppImage from '@/components/ui/AppImage';
import TiltCard from '@/components/motion/TiltCard';

interface ProgramFeature {
  icon: string;
  text: string;
}

interface ProgramCardProps {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  alt: string;
  ageGroup: string;
  batchSize: string;
  duration: string;
  features: ProgramFeature[];
  curriculum: string[];
  successRate: string;
  gradient: string;
}

export default function ProgramCard({ program }: { program: ProgramCardProps }) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <TiltCard className="group relative flex h-full flex-col bg-surface-2 rounded-xl border border-border overflow-hidden hover-lift">
      {/* Image */}
      <div className="relative h-44 sm:h-52 overflow-hidden">
        <AppImage
          src={program.image}
          alt={program.alt}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy/50 to-transparent" />
        <span className="absolute top-3 left-3 inline-flex items-center gap-1.5 bg-gold px-3 py-1.5 rounded-full shadow-sm">
          <Icon name="TrophyIcon" size={14} className="text-navy" variant="solid" />
          <span className="text-xs font-bold text-navy">{program.successRate} Success</span>
        </span>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <p className="eyebrow mb-2">{program.subtitle}</p>
        <h3 className="font-display text-xl sm:text-2xl text-navy mb-2">{program.title}</h3>
        <p className="text-sm text-text-secondary leading-relaxed mb-5 line-clamp-2">{program.description}</p>

        <div className="grid grid-cols-3 gap-2 mb-5">
          {[
            { icon: 'UserGroupIcon', val: program.batchSize },
            { icon: 'ClockIcon', val: program.duration },
            { icon: 'AcademicCapIcon', val: program.ageGroup },
          ].map((q, i) => (
            <div key={i} className="flex flex-col items-center text-center p-2.5 bg-surface rounded-lg border border-border">
              <Icon name={q.icon} size={18} className="text-primary mb-1.5" />
              <span className="text-xs font-semibold text-navy">{q.val}</span>
            </div>
          ))}
        </div>

        {isExpanded && (
          <div className="mt-1 pt-5 border-t border-border space-y-6">
            <div>
              <h4 className="flex items-center gap-2 text-sm font-semibold text-navy mb-3">
                <Icon name="SparklesIcon" size={18} className="text-green" />
                Key Features
              </h4>
              <div className="grid grid-cols-1 gap-2.5">
                {program.features.map((feature, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-surface rounded-lg border border-border">
                    <Icon name={feature.icon} size={18} className="text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-text-secondary leading-relaxed">{feature.text}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h4 className="flex items-center gap-2 text-sm font-semibold text-navy mb-3">
                <Icon name="BookOpenIcon" size={18} className="text-green" />
                Curriculum Highlights
              </h4>
              <div className="flex flex-wrap gap-2">
                {program.curriculum.map((item, index) => (
                  <span key={index} className="px-3 py-1.5 bg-primary-tint text-primary text-xs font-semibold rounded-full">
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="flex gap-2.5 mt-auto pt-5">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex-1 inline-flex items-center justify-center gap-2 h-12 px-4 rounded-full bg-primary text-primary-foreground text-sm font-semibold transition-smooth hover:bg-primary-strong hover:-translate-y-0.5 active:translate-y-0"
          >
            <span>{isExpanded ? 'Show Less' : 'View Details'}</span>
            <Icon name={isExpanded ? 'ChevronUpIcon' : 'ChevronDownIcon'} size={16} />
          </button>
          <Link
            href="/contact?form=enrollment"
            className="inline-flex items-center justify-center gap-2 h-12 px-5 rounded-full bg-green text-green-foreground text-sm font-semibold transition-smooth hover:-translate-y-0.5 active:translate-y-0 hover:shadow-elevation"
            aria-label="Call to enroll"
          >
            <Icon name="PhoneIcon" size={18} variant="solid" />
            <span>Call</span>
          </Link>
        </div>
      </div>
    </TiltCard>
  );
}
