'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Icon from '@/components/ui/AppIcon';
import Button from '@/components/ui/Button';
import Logo from '@/components/common/Logo';

const NotFound = () => {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4 relative overflow-hidden">
      <div className="absolute -top-24 right-0 w-[28rem] h-[28rem] rounded-full bg-primary/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 left-0 w-[24rem] h-[24rem] rounded-full bg-green-bright/10 blur-3xl pointer-events-none" />

      <div className="text-center max-w-md relative z-10">
        <Logo className="w-16 h-16 mx-auto mb-6" />
        <h1 className="font-display text-[clamp(5rem,18vw,9rem)] leading-none text-navy">
          4<span className="text-primary">0</span>4
        </h1>
        <h2 className="font-display text-2xl text-navy mt-2 mb-2">Page not found</h2>
        <p className="text-text-secondary mb-8">
          The page you&apos;re looking for doesn&apos;t exist. Let&apos;s get you back on track.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => (typeof window !== 'undefined' ? window.history?.back() : null)}
            className="group inline-flex items-center justify-center gap-2 h-12 px-6 rounded-full border-2 border-navy/20 text-navy font-semibold hover:bg-surface transition-smooth"
          >
            <Icon name="ArrowLeftIcon" size={18} />
            Go Back
          </button>
          <Button href="/homepage" variant="primary" size="md">
            <Icon name="HomeIcon" size={18} />
            Back to Home
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
