'use client';

import React, { useState } from 'react';
import AppImage from '@/components/ui/AppImage';
import Icon from '@/components/ui/AppIcon';
import TiltCard from '@/components/motion/TiltCard';

interface Subject {
  name: string;
  level: string;
}

interface Teacher {
  id: number;
  name: string;
  title: string;
  image: string;
  alt: string;
  qualification: string;
  experience: string;
  specialization: string[];
  subjects: Subject[];
  philosophy: string;
  achievements: string[];
  teachingStyle: string;
}

const TeacherCard: React.FC<{ teacher: Teacher }> = ({ teacher }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <TiltCard className="flex flex-col h-full bg-surface-2 rounded-xl border border-border shadow-subtle overflow-hidden hover-lift">
      {/* Image */}
      <div className="relative aspect-[3/4] overflow-hidden group">
        <AppImage src={teacher.image} alt={teacher.alt} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover transition-transform duration-500 group-hover:scale-105" />
        <div className="absolute inset-0 bg-gradient-to-t from-navy/90 via-navy/25 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5 text-white">
          <h3 className="font-display text-lg sm:text-xl mb-0.5">{teacher.name}</h3>
          <p className="text-sm text-gold font-medium mb-2">{teacher.title}</p>
          <div className="flex items-center gap-2 text-xs text-white/85">
            <Icon name="AcademicCapIcon" size={14} />
            <span>{teacher.qualification}</span>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="p-5 sm:p-6 flex flex-col flex-1">
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-surface rounded-lg p-3 border border-border">
            <Icon name="BriefcaseIcon" size={18} className="text-primary mb-1" />
            <div className="text-xs text-text-secondary">Experience</div>
            <div className="text-sm font-semibold text-navy">{teacher.experience}</div>
          </div>
          <div className="bg-surface rounded-lg p-3 border border-border">
            <Icon name="UserGroupIcon" size={18} className="text-green mb-1" />
            <div className="text-xs text-text-secondary">Students</div>
            <div className="text-sm font-semibold text-navy">150+</div>
          </div>
        </div>

        <div className="mb-4">
          <div className="text-xs font-semibold text-text-secondary mb-2">Specializations</div>
          <div className="flex flex-wrap gap-2">
            {teacher.specialization.slice(0, 3).map((spec, i) => (
              <span key={i} className="px-3 py-1 bg-primary-tint text-primary text-xs rounded-full font-medium">{spec}</span>
            ))}
          </div>
        </div>

        {isExpanded && (
          <div className="space-y-4 border-t border-border pt-4 mb-4">
            <div>
              <h4 className="flex items-center gap-2 text-sm font-semibold text-navy mb-2">
                <Icon name="LightBulbIcon" size={16} className="text-gold-strong" /> Teaching Philosophy
              </h4>
              <p className="text-sm text-text-secondary leading-relaxed">{teacher.philosophy}</p>
            </div>
            <div>
              <h4 className="flex items-center gap-2 text-sm font-semibold text-navy mb-2">
                <Icon name="BookOpenIcon" size={16} className="text-primary" /> Subjects Taught
              </h4>
              <div className="space-y-2">
                {teacher.subjects.map((s, i) => (
                  <div key={i} className="flex items-center justify-between bg-surface rounded-lg p-2.5">
                    <span className="text-sm text-navy">{s.name}</span>
                    <span className="text-xs text-text-secondary">{s.level}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h4 className="flex items-center gap-2 text-sm font-semibold text-navy mb-2">
                <Icon name="SparklesIcon" size={16} className="text-green" /> Teaching Style
              </h4>
              <p className="text-sm text-text-secondary">{teacher.teachingStyle}</p>
            </div>
            <div>
              <h4 className="flex items-center gap-2 text-sm font-semibold text-navy mb-2">
                <Icon name="TrophyIcon" size={16} className="text-gold-strong" /> Key Achievements
              </h4>
              <ul className="space-y-2">
                {teacher.achievements.map((a, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-text-secondary">
                    <Icon name="CheckCircleIcon" size={16} className="text-green flex-shrink-0 mt-0.5" variant="solid" />
                    <span>{a}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="mt-auto w-full h-11 rounded-full bg-primary text-primary-foreground font-semibold text-sm flex items-center justify-center gap-2 transition-smooth hover:bg-primary-strong hover:-translate-y-0.5 active:translate-y-0"
          aria-expanded={isExpanded}
        >
          {isExpanded ? 'Show Less' : 'View Profile'}
          <Icon name={isExpanded ? 'ChevronUpIcon' : 'ChevronDownIcon'} size={16} />
        </button>
      </div>
    </TiltCard>
  );
};

export default TeacherCard;
