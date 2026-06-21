'use client';

import Icon from '@/components/ui/AppIcon';
import Button from '@/components/ui/Button';
import Magnetic from '@/components/motion/Magnetic';
import Reveal from '@/components/motion/Reveal';

const CTASection = ({ className = '' }: { className?: string }) => {
  return (
    <section className={`section-y bg-background ${className}`}>
      <div className="container mx-auto px-4 sm:px-6">
        <Reveal>
          <div className="relative overflow-hidden bg-navy text-navy-foreground rounded-2xl px-6 py-14 sm:px-12 sm:py-16 lg:p-20">
            <div className="absolute -top-16 -right-10 w-72 h-72 rounded-full bg-primary/25 blur-3xl pointer-events-none" />
            <div className="absolute -bottom-20 -left-10 w-72 h-72 rounded-full bg-green/20 blur-3xl pointer-events-none" />
            <div
              className="absolute inset-0 opacity-[0.07] pointer-events-none"
              style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '34px 34px' }}
            />
            <div className="relative z-10 grid lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-7">
                <p className="eyebrow !text-gold mb-4">Admissions Open · 2026–27</p>
                <h2 className="font-display font-semibold text-[clamp(2rem,4.5vw,3.5rem)] leading-[1.04]">
                  Help your child reach their <span className="text-gold">academic vertex.</span>
                </h2>
                <p className="text-navy-foreground/75 text-lg mt-5 max-w-xl">
                  Join 2,000+ students who chose Vertex Academy. Limited seats remain for the
                  upcoming session — book a free trial class today.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 mt-8">
                  <Magnetic>
                    <Button href="/campus-visit" variant="gold" size="lg">
                      Schedule a Visit
                      <Icon name="CalendarDaysIcon" size={20} />
                    </Button>
                  </Magnetic>
                  <Magnetic>
                    <Button href="/programs" variant="outlineLight" size="lg">
                      View Programs
                      <Icon name="ArrowRightIcon" size={20} />
                    </Button>
                  </Magnetic>
                </div>
              </div>

              <div className="lg:col-span-5 lg:pl-8 lg:border-l border-white/12">
                <div className="space-y-5">
                  <a href="tel:+919876543210" className="flex items-center gap-4 group">
                    <span className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-white/8 group-hover:bg-gold group-hover:text-navy transition-colors">
                      <Icon name="PhoneIcon" size={22} variant="solid" />
                    </span>
                    <span>
                      <span className="block text-xs uppercase tracking-wide text-navy-foreground/55">Call us</span>
                      <span className="block font-medium">+91 98765 43210</span>
                    </span>
                  </a>
                  <a href="mailto:info@vertexacademy.com" className="flex items-center gap-4 group">
                    <span className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-white/8 group-hover:bg-gold group-hover:text-navy transition-colors">
                      <Icon name="EnvelopeIcon" size={22} variant="solid" />
                    </span>
                    <span>
                      <span className="block text-xs uppercase tracking-wide text-navy-foreground/55">Email us</span>
                      <span className="block font-medium break-all">info@vertexacademy.com</span>
                    </span>
                  </a>
                  <div className="flex items-center gap-3 pt-4 border-t border-white/12">
                    <Icon name="ShieldCheckIcon" size={22} className="text-green-bright" variant="solid" />
                    <span className="text-sm text-navy-foreground/80">Trusted by 2,000+ families across Chennai</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
};

export default CTASection;
