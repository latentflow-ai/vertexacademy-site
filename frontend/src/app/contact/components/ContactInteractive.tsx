'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';
import Footer from '@/components/common/Footer';
import Button from '@/components/ui/Button';
import Magnetic from '@/components/motion/Magnetic';
import Reveal from '@/components/motion/Reveal';

const fallback = (h: string) => () => <div className={`${h} bg-surface animate-pulse rounded-xl`} />;

const ContactInfo = dynamic(() => import('./ContactInfo'), { loading: fallback('h-48') });
const ContactForm = dynamic(() => import('./ContactForm'), { loading: fallback('h-96') });
const LocationMap = dynamic(() => import('./LocationMap'), { loading: fallback('h-96') });
const QuickLinks = dynamic(() => import('./QuickLinks'), { loading: fallback('h-40') });
const FAQSection = dynamic(() => import('./FAQSection'), { loading: fallback('h-96') });

const ContactInteractive = () => {
  return (
    <main className="min-h-screen bg-background">
      {/* Hero */}
      <section className="relative overflow-hidden bg-background pt-20">
        <div
          className="absolute inset-0 opacity-[0.5] pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(11,31,77,0.10) 1px, transparent 0)',
            backgroundSize: '26px 26px',
            maskImage: 'radial-gradient(ellipse 80% 70% at 30% 30%, black, transparent)',
            WebkitMaskImage: 'radial-gradient(ellipse 80% 70% at 30% 30%, black, transparent)',
          }}
        />
        <div className="absolute -top-24 -right-20 w-[34rem] h-[34rem] rounded-full bg-primary/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-28 -left-24 w-[28rem] h-[28rem] rounded-full bg-green-bright/10 blur-3xl pointer-events-none" />
        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <div className="max-w-3xl py-20 sm:py-28">
            <p className="eyebrow mb-4">Contact Us</p>
            <h1 className="font-display font-semibold text-[clamp(2.75rem,6.5vw,5rem)] leading-[1.0] text-navy">
              Get in <span className="text-primary mark-gold">touch</span>
            </h1>
            <p className="text-lg sm:text-xl text-text-secondary max-w-2xl mt-6 leading-relaxed">
              Start your journey to academic excellence. Our admissions team is here to answer your
              questions and guide you through enrollment.
            </p>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 sm:px-6 section-y">
        <Suspense fallback={<div />}>
          <Reveal><div className="mb-12"><ContactInfo isDark={false} /></div></Reveal>
          <Reveal><div className="mb-12"><QuickLinks isDark={false} /></div></Reveal>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            <Reveal><ContactForm isDark={false} /></Reveal>
            <div className="space-y-8">
              <Reveal delay={0.1}><LocationMap isDark={false} /></Reveal>
              <Reveal delay={0.15}><FAQSection isDark={false} /></Reveal>
            </div>
          </div>

          {/* Ready band */}
          <Reveal>
            <div className="relative overflow-hidden bg-navy text-navy-foreground rounded-2xl p-8 sm:p-12 text-center">
              <div className="absolute -top-16 -right-10 w-64 h-64 rounded-full bg-primary/25 blur-3xl pointer-events-none" />
              <div className="relative">
                <h3 className="font-display text-2xl sm:text-3xl mb-3">Ready to experience excellence?</h3>
                <p className="text-navy-foreground/75 mb-7 max-w-2xl mx-auto">
                  Join 2,000+ students who have transformed their academic journey with Vertex Academy.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                  <Magnetic>
                    <Button href="tel:+919876543210" variant="gold" size="lg">Call: +91 98765 43210</Button>
                  </Magnetic>
                  <Magnetic>
                    <Button href="mailto:admissions@vertexacademy.edu.in" variant="outlineLight" size="lg">Email Admissions</Button>
                  </Magnetic>
                </div>
              </div>
            </div>
          </Reveal>
        </Suspense>
      </div>

      <Footer />
    </main>
  );
};

export default ContactInteractive;
