'use client';

import Footer from '@/components/common/Footer';
import CTABand from '@/components/common/CTABand';
import Reveal from '@/components/motion/Reveal';
import { Stagger, StaggerItem } from '@/components/motion/Stagger';
import ProgramCard from './ProgramCard';
import FeatureGrid from './FeatureGrid';
import BatchAvailability from './BatchAvailability';

interface ProgramsInteractiveProps {
  programs: any[];
  features: any[];
  batches: any[];
  comparisonData?: any[];
  feeStructures?: any[];
  successData?: any[];
}

export default function ProgramsInteractive({ programs, features, batches }: ProgramsInteractiveProps) {
  return (
    <>
      {/* Programs Grid */}
      <section className="section-y bg-surface">
        <div className="container mx-auto px-4 sm:px-6">
          <Reveal>
            <div className="max-w-2xl mb-12 sm:mb-14">
              <p className="eyebrow mb-3">Our Programs</p>
              <h2 className="text-display-md text-navy">
                A program for <span className="text-primary mark-gold">every learner</span>
              </h2>
              <p className="text-body-lg text-text-secondary mt-4">
                Comprehensive learning solutions designed for students aged 6–15, with personalized
                attention and proven success rates.
              </p>
            </div>
          </Reveal>
          <Stagger className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {programs.map((program) => (
              <StaggerItem key={program.id} className="h-full">
                <ProgramCard program={program} />
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* Features */}
      <section className="section-y bg-background">
        <div className="container mx-auto px-4 sm:px-6">
          <Reveal>
            <div className="max-w-2xl mb-12 sm:mb-14">
              <p className="eyebrow mb-3">Why Choose Us</p>
              <h2 className="text-display-md text-navy">
                The Vertex <span className="text-primary mark-gold">advantage</span>
              </h2>
              <p className="text-body-lg text-text-secondary mt-4">
                Experience excellence through our comprehensive approach to education.
              </p>
            </div>
          </Reveal>
          <FeatureGrid features={features} />
        </div>
      </section>

      {/* Batch Availability */}
      <section className="section-y bg-surface">
        <div className="container mx-auto px-4 sm:px-6">
          <BatchAvailability batches={batches} />
        </div>
      </section>

      {/* CTA */}
      <CTABand
        title="Ready to start your academic journey?"
        highlight="academic journey?"
        text="Join hundreds of successful students who have transformed their academic performance with Vertex Academy."
        primary={{ label: 'Enroll Now', href: '/contact', icon: 'ArrowRightIcon' }}
        secondary={{ label: 'Schedule a Visit', href: '/campus-visit', icon: 'CalendarDaysIcon' }}
      />

      <Footer />
    </>
  );
}
