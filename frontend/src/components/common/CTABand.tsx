'use client';

import Icon from '@/components/ui/AppIcon';
import Button from '@/components/ui/Button';
import Magnetic from '@/components/motion/Magnetic';
import Reveal from '@/components/motion/Reveal';

type CTAProps = {
  eyebrow?: string;
  title: string;
  highlight?: string;
  text: string;
  primary: { label: string; href: string; icon?: string };
  secondary?: { label: string; href: string; icon?: string };
  className?: string;
};

/** Reusable navy call-to-action band with magnetic buttons. */
export default function CTABand({
  eyebrow = 'Admissions Open · 2026–27',
  title,
  highlight,
  text,
  primary,
  secondary,
  className = '',
}: CTAProps) {
  const renderTitle = () => {
    if (!highlight || !title.includes(highlight)) return title;
    const [before, after] = title.split(highlight);
    return (
      <>
        {before}
        <span className="text-gold">{highlight}</span>
        {after}
      </>
    );
  };

  return (
    <section className={`section-y bg-background ${className}`}>
      <div className="container mx-auto px-4 sm:px-6">
        <Reveal>
          <div className="relative overflow-hidden bg-navy text-navy-foreground rounded-2xl px-6 py-14 sm:px-12 sm:py-16 lg:py-20 text-center">
            <div className="absolute -top-16 -right-10 w-72 h-72 rounded-full bg-primary/25 blur-3xl pointer-events-none" />
            <div className="absolute -bottom-20 -left-10 w-72 h-72 rounded-full bg-green/20 blur-3xl pointer-events-none" />
            <div
              className="absolute inset-0 opacity-[0.06] pointer-events-none"
              style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '34px 34px' }}
            />
            <div className="relative z-10 max-w-3xl mx-auto">
              <p className="eyebrow !text-gold mb-4">{eyebrow}</p>
              <h2 className="font-display font-semibold text-[clamp(2rem,4.5vw,3.25rem)] leading-[1.06]">
                {renderTitle()}
              </h2>
              <p className="text-navy-foreground/75 text-lg mt-5 max-w-xl mx-auto">{text}</p>
              <div className="flex flex-col sm:flex-row gap-3 mt-8 justify-center">
                <Magnetic>
                  <Button href={primary.href} variant="gold" size="lg">
                    {primary.label}
                    {primary.icon && <Icon name={primary.icon} size={20} />}
                  </Button>
                </Magnetic>
                {secondary && (
                  <Magnetic>
                    <Button href={secondary.href} variant="outlineLight" size="lg">
                      {secondary.label}
                      {secondary.icon && <Icon name={secondary.icon} size={20} />}
                    </Button>
                  </Magnetic>
                )}
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
