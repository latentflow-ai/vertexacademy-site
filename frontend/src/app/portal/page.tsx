'use client';

import Link from 'next/link';
import Icon from '@/components/ui/AppIcon';
import BrandLogo from '@/components/common/BrandLogo';

interface RoleCard {
  label: string;
  icon: string;
  loginHref: string;
  registerHref?: string;
  bar: string; // top accent bar
  chip: string; // circular icon chip
  blurb: string;
}

const ROLES: RoleCard[] = [
  {
    label: 'Student',
    icon: 'UserGroupIcon',
    loginHref: '/studentlogin',
    bar: 'bg-primary',
    chip: 'bg-primary-tint text-primary',
    blurb: 'View your timetable, attendance, marks and shared notes.',
  },
  {
    label: 'Faculty',
    icon: 'AcademicCapIcon',
    loginHref: '/facultylogin',
    bar: 'bg-gold',
    chip: 'bg-gold-tint text-gold-strong',
    blurb: 'Take attendance, update marks, and share notes for your classes.',
  },
  {
    label: 'Parent',
    icon: 'UserCircleIcon',
    loginHref: '/parentlogin',
    bar: 'bg-green',
    chip: 'bg-green-tint text-green',
    blurb: "Sign in with your phone to follow your ward's progress.",
  },
];

export default function PortalPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-surface flex flex-col items-center justify-center px-4 py-16">
      <div
        className="pointer-events-none absolute inset-0 opacity-50"
        style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(11,31,77,0.10) 1px, transparent 0)',
          backgroundSize: '26px 26px',
        }}
      />
      <div className="pointer-events-none absolute -top-24 -right-24 w-[34rem] h-[34rem] rounded-full bg-primary/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -left-24 w-[30rem] h-[30rem] rounded-full bg-green-bright/10 blur-3xl" />

      <div className="relative w-full max-w-5xl">
        {/* header */}
        <div className="text-center mb-12">
          <Link href="/" className="inline-flex items-center gap-2 mb-6" data-cursor="hover">
            <BrandLogo className="h-10 w-10" />
            <span className="font-display text-xl font-semibold text-navy">Vertex Academy</span>
          </Link>
          <p className="eyebrow mb-3">Vertex Portal</p>
          <h1 className="font-display text-display-sm sm:text-display-md text-navy mb-3">
            One platform for <span className="text-primary mark-gold">everyone</span>
          </h1>
          <p className="text-text-secondary max-w-2xl mx-auto">
            A digital initiative by Vertex Academy connecting Faculty, Students and Parents — to access and process
            academics, attendance and progress in one common platform.
          </p>
        </div>

        {/* role cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {ROLES.map((r) => (
            <div
              key={r.label}
              className="group relative bg-white border border-border rounded-2xl shadow-soft overflow-hidden hover-lift flex flex-col"
            >
              <div className={`h-1.5 ${r.bar}`} />
              <div className="p-7 flex flex-col items-center text-center flex-1">
                <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-5 ${r.chip}`}>
                  <Icon name={r.icon} variant="solid" className="w-10 h-10" />
                </div>
                <h2 className="font-display text-heading-md text-navy mb-1">{r.label}</h2>
                <p className="text-sm text-text-secondary mb-6">{r.blurb}</p>

                <div className="mt-auto w-full space-y-2">
                  <Link
                    href={r.loginHref}
                    data-cursor="hover"
                    className="flex items-center justify-center gap-2 w-full py-2.5 rounded-full bg-navy text-white font-semibold text-sm hover:bg-primary-strong transition-colors"
                  >
                    Login
                    <Icon name="ArrowRightIcon" className="w-4 h-4" />
                  </Link>
                  {r.registerHref && (
                    <Link
                      href={r.registerHref}
                      data-cursor="hover"
                      className="block w-full py-2.5 rounded-full border border-border text-navy font-semibold text-sm hover:bg-surface transition-colors"
                    >
                      Create account
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <p className="text-center text-xs text-text-faint mt-10">
          Administrator?{' '}
          <Link href="/admin" className="underline hover:text-navy" data-cursor="hover">Admin sign-in</Link>
        </p>
      </div>
    </div>
  );
}
