'use client';

import Link from 'next/link';
import BrandLogo from '@/components/common/BrandLogo';

export type Accent = 'primary' | 'gold' | 'green';

export const accentChip: Record<Accent, string> = {
  primary: 'bg-primary-tint text-primary',
  gold: 'bg-gold-tint text-gold-strong',
  green: 'bg-green-tint text-green',
};

export const accentBar: Record<Accent, string> = {
  primary: 'bg-primary',
  gold: 'bg-gold',
  green: 'bg-green',
};

/**
 * Light, website-matched background for portal auth pages: soft surface,
 * dot-grid texture, and two blurred gradient blobs — mirroring the public site.
 */
export default function AuthScaffold({
  children,
  showBack = true,
}: {
  children: React.ReactNode;
  showBack?: boolean;
}) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-surface flex flex-col items-center justify-center px-4 py-12">
      {/* dot-grid texture */}
      <div
        className="pointer-events-none absolute inset-0 opacity-50"
        style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(11,31,77,0.10) 1px, transparent 0)',
          backgroundSize: '26px 26px',
        }}
      />
      {/* gradient blobs */}
      <div className="pointer-events-none absolute -top-24 -right-24 w-[32rem] h-[32rem] rounded-full bg-primary/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-28 -left-24 w-[28rem] h-[28rem] rounded-full bg-green-bright/10 blur-3xl" />

      <div className="relative w-full max-w-md">
        <div className="mb-6 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group" data-cursor="hover">
            <BrandLogo className="h-9 w-9" />
            <span className="font-display font-semibold text-navy">Vertex Academy</span>
          </Link>
          {showBack && (
            <Link
              href="/portal"
              className="text-sm font-medium text-text-secondary hover:text-navy transition-colors"
              data-cursor="hover"
            >
              ← All portals
            </Link>
          )}
        </div>
        {children}
      </div>
    </div>
  );
}
