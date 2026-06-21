'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';
import Footer from '@/components/common/Footer';

// Dynamic imports for sections - loads as user scrolls
const HeroSection = dynamic(() => import('./HeroSection'), {
  loading: () => <div className="h-96 bg-surface animate-pulse" />,
});

const StorySection = dynamic(() => import('./StorySection'), {
  loading: () => <div className="h-80 bg-background animate-pulse" />,
});

const MissionVisionValues = dynamic(() => import('./MissionVisionValues'), {
  loading: () => <div className="h-96 bg-surface animate-pulse" />,
});

const TimelineSection = dynamic(() => import('./TimelineSection'), {
  loading: () => <div className="h-96 bg-background animate-pulse" />,
});

const LeadershipSection = dynamic(() => import('./LeadershipSection'), {
  loading: () => <div className="h-80 bg-surface animate-pulse" />,
});

const AchievementsSection = dynamic(() => import('./AchievementsSection'), {
  loading: () => <div className="h-64 bg-background animate-pulse" />,
});

const TestimonialsSection = dynamic(() => import('./TestimonialsSection'), {
  loading: () => <div className="h-80 bg-surface animate-pulse" />,
});

const CTASection = dynamic(() => import('./CTASection'), {
  loading: () => <div className="h-64 bg-background animate-pulse" />,
});

interface AboutUsData {
    hero: {
        title: string;
        subtitle: string;
        backgroundImage: string;
        backgroundAlt: string;
    };
    story: {
        title: string;
        description: string;
        image: string;
        imageAlt: string;
        highlights: Array<{
            icon: string;
            title: string;
            description: string;
        }>;
    };
    mvv: Array<{
        icon: string;
        title: string;
        description: string;
        color: string;
    }>;
    timeline: Array<{
        year: string;
        title: string;
        description: string;
        icon: string;
    }>;
    leaders: Array<{
        name: string;
        position: string;
        image: string;
        imageAlt: string;
        bio: string;
        qualifications: string[];
        expertise: string[];
    }>;
    achievements: Array<{
        icon: string;
        value: string;
        label: string;
        description: string;
    }>;
    testimonials: Array<{
        name: string;
        role: string;
        image: string;
        imageAlt: string;
        content: string;
        rating: number;
    }>;
}

interface AboutUsInteractiveProps {
    data: AboutUsData;
}

const AboutUsInteractive = ({ data }: AboutUsInteractiveProps) => {
    return (
        <Suspense fallback={<div />}>
            <HeroSection
                title={data.hero.title}
                subtitle={data.hero.subtitle}
                backgroundImage={data.hero.backgroundImage}
                backgroundAlt={data.hero.backgroundAlt}
            />
            <StorySection story={data.story} />
            <MissionVisionValues items={data.mvv} />
            <TimelineSection events={data.timeline} />
            <LeadershipSection leaders={data.leaders} />
            <AchievementsSection achievements={data.achievements} />
            <TestimonialsSection testimonials={data.testimonials} />
            <CTASection />
            <Footer />
        </Suspense>
    );
};

export default AboutUsInteractive;
