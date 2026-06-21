'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';

const fallback = (h: string) => () => <div className={`${h} bg-surface animate-pulse`} />;

const HeroSection = dynamic(() => import('./HeroSection'), { loading: fallback('min-h-[80vh]') });
const MarqueeStrip = dynamic(() => import('./MarqueeStrip'), { loading: fallback('h-16') });
const StatisticsSection = dynamic(() => import('./StatisticsSection'), { loading: fallback('h-80') });
const WhyChooseSection = dynamic(() => import('./WhyChooseSection'), { loading: fallback('h-96') });
const TestimonialsSection = dynamic(() => import('./TestimonialsSection'), { loading: fallback('h-96') });
const CTASection = dynamic(() => import('./CTASection'), { loading: fallback('h-80') });
const Footer = dynamic(() => import('./Footer'), { loading: fallback('h-80') });

const HomepageInteractive = () => {
  return (
    <Suspense fallback={<div />}>
      <HeroSection />
      <MarqueeStrip />
      <StatisticsSection />
      <WhyChooseSection />
      <TestimonialsSection />
      <CTASection />
      <Footer />
    </Suspense>
  );
};

export default HomepageInteractive;
