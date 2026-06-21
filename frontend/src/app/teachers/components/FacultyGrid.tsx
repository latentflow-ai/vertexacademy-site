'use client';

import React, { useState } from 'react';
import TeacherCard from './TeacherCard';
import Icon from '@/components/ui/AppIcon';
import Reveal from '@/components/motion/Reveal';
import { Stagger, StaggerItem } from '@/components/motion/Stagger';
import { useCountUp } from '@/components/motion/useCountUp';

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
    department: string;
}

interface FacultyGridProps {
    teachers: Teacher[];
    className?: string;
}

interface BandStat {
    value: number;
    suffix: string;
    label: string;
    icon: string;
}

const bandStats: BandStat[] = [
    { icon: 'UserGroupIcon', value: 25, suffix: '+', label: 'Expert Faculty Members' },
    { icon: 'AcademicCapIcon', value: 100, suffix: '%', label: 'Qualified Educators' },
    { icon: 'StarIcon', value: 15, suffix: '+', label: 'Years Avg Experience' },
    { icon: 'TrophyIcon', value: 95, suffix: '%', label: 'Student Success Rate' },
];

const BandStatCard = ({ stat }: { stat: BandStat }) => {
    const { ref, value } = useCountUp(stat.value);
    return (
        <StaggerItem className="rounded-xl border border-white/10 bg-white/[0.05] p-6 text-navy-foreground">
            <Icon name={stat.icon} size={24} className="text-gold mb-4" variant="solid" />
            <div className="font-display text-4xl leading-none text-white">
                <span ref={ref}>{value}</span>
                <span className="text-gold">{stat.suffix}</span>
            </div>
            <div className="text-sm text-navy-foreground/70 mt-2">{stat.label}</div>
        </StaggerItem>
    );
};

const FacultyGrid: React.FC<FacultyGridProps> = ({ teachers, className = '' }) => {
    const [selectedDepartment, setSelectedDepartment] = useState<string>('All');

    const departments = ['All', ...Array.from(new Set(teachers.map((t) => t.department)))];

    const filteredTeachers =
        selectedDepartment !== 'All'
            ? teachers.filter((t) => t.department === selectedDepartment)
            : teachers;

    return (
        <section className={`section-y bg-background ${className}`}>
            <div className="container mx-auto px-4 sm:px-6">
                {/* Section Header */}
                <Reveal>
                    <div className="max-w-2xl mb-10 sm:mb-12">
                        <p className="eyebrow mb-3">Our Teaching Excellence</p>
                        <h2 className="text-display-md text-text-primary">Meet our expert faculty</h2>
                        <p className="text-body-lg text-text-secondary mt-4">
                            Dedicated educators committed to nurturing academic excellence and personal growth in
                            every student.
                        </p>
                    </div>
                </Reveal>

                {/* Department Filter */}
                <Reveal>
                    <div className="flex flex-wrap gap-2.5 mb-10 sm:mb-12">
                        {departments.map((dept) => (
                            <button
                                key={dept}
                                onClick={() => setSelectedDepartment(dept)}
                                className={`min-h-[44px] px-5 rounded-lg font-semibold text-sm transition-smooth border ${
                                    selectedDepartment === dept
                                        ? 'bg-primary text-primary-foreground border-primary shadow-sm'
                                        : 'bg-surface-2 text-text-primary border-border hover:bg-primary-tint hover:border-primary/20'
                                }`}
                            >
                                {dept}
                            </button>
                        ))}
                    </div>
                </Reveal>

                {/* Teachers Grid */}
                <Stagger
                    key={selectedDepartment}
                    className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6"
                >
                    {filteredTeachers.map((teacher) => (
                        <StaggerItem key={teacher.id} className="h-full">
                            <TeacherCard teacher={teacher} />
                        </StaggerItem>
                    ))}
                </Stagger>

                {/* Stats Band */}
                <Reveal>
                    <div className="mt-14 sm:mt-16 rounded-2xl bg-navy p-6 sm:p-10 relative overflow-hidden">
                        <Stagger className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
                            {bandStats.map((stat) => (
                                <BandStatCard key={stat.label} stat={stat} />
                            ))}
                        </Stagger>
                    </div>
                </Reveal>
            </div>
        </section>
    );
};

export default FacultyGrid;
