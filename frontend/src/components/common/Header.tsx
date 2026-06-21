'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import Icon from '@/components/ui/AppIcon';
import BrandLogo from '@/components/common/BrandLogo';
import Button from '@/components/ui/Button';
import Magnetic from '@/components/motion/Magnetic';
import ScrollProgress from '@/components/motion/ScrollProgress';

interface HeaderProps {
  className?: string;
}

const Header = ({ className = '' }: HeaderProps) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const reduce = useReducedMotion();

  const nav = useMemo(
    () => [
      { label: 'Home', path: '/homepage' },
      { label: 'About', path: '/about-us' },
      { label: 'Programs', path: '/programs' },
      { label: 'Teachers', path: '/teachers' },
      { label: 'Gallery', path: '/gallery' },
      { label: 'Contact', path: '/contact' },
    ],
    []
  );

  const onScroll = useCallback(() => setIsScrolled(window.scrollY > 16), []);
  useEffect(() => {
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [onScroll]);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : 'unset';
  }, [open]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 header-blur ${
        isScrolled ? 'bg-[#fffffff5] shadow-subtle border-b border-border' : 'bg-[#ffffffe8] border-b border-border'
      } ${className}`}
    >
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <Link href="/homepage" className="flex items-center gap-3 group flex-shrink-0" aria-label="Vertex Academy — home">
            <BrandLogo className="h-10 w-10 sm:h-12 sm:w-12 transition-transform duration-300 group-hover:rotate-[-4deg]" />
            <span className="flex flex-col leading-none min-w-0">
              <span className="font-display text-lg sm:text-xl font-semibold text-navy tracking-tight uppercase">
                Vertex Academy
              </span>
              <span className="hidden sm:block text-[0.62rem] font-bold tracking-[0.22em] uppercase text-text-faint mt-1">
                The Knowledge Expert
              </span>
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {nav.map((item) => {
              const active = pathname === item.path;
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`relative px-3.5 py-2 text-sm font-medium rounded-full transition-colors duration-300 group ${
                    active ? 'text-primary' : 'text-text-secondary hover:text-navy'
                  }`}
                >
                  {item.label}
                  <span
                    className={`absolute left-3.5 right-3.5 -bottom-0.5 h-[3px] bg-gold rounded-full origin-left transition-transform duration-300 ${
                      active ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                    }`}
                  />
                </Link>
              );
            })}
          </nav>

          {/* Desktop CTAs */}
          <div className="hidden lg:flex items-center gap-2.5 flex-shrink-0">
            <Button href="/campus-visit" variant="ghost" size="sm">
              Visit Campus
            </Button>
            <Magnetic>
              <Button href="/contact" variant="primary" size="sm">
                Enroll Now
              </Button>
            </Magnetic>
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setOpen((v) => !v)}
            className="lg:hidden inline-flex items-center justify-center w-11 h-11 -mr-1 rounded-full text-navy hover:bg-primary-tint transition-colors active:scale-95"
            aria-label="Toggle menu"
            aria-expanded={open}
          >
            <Icon name={open ? 'XMarkIcon' : 'Bars3Icon'} size={24} />
          </button>
        </div>
      </div>

      {/* scroll progress */}
      <ScrollProgress />

      {/* Mobile drawer */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              className="lg:hidden fixed inset-0 top-16 sm:top-20 bg-navy/40 z-30"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setOpen(false)}
            />
            <motion.nav
              className="lg:hidden fixed left-0 right-0 top-16 sm:top-20 bg-background border-b border-border z-40 shadow-elevation"
              initial={reduce ? { opacity: 0 } : { opacity: 0, y: -16 }}
              animate={reduce ? { opacity: 1 } : { opacity: 1, y: 0 }}
              exit={reduce ? { opacity: 0 } : { opacity: 0, y: -16 }}
              transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="container mx-auto px-4 py-5 space-y-1 max-h-[calc(100dvh-64px)] overflow-y-auto">
                {nav.map((item) => {
                  const active = pathname === item.path;
                  return (
                    <Link
                      key={item.path}
                      href={item.path}
                      onClick={() => setOpen(false)}
                      className={`block px-4 py-3.5 text-base font-medium rounded-md transition-colors ${
                        active ? 'text-primary bg-primary-tint' : 'text-text-secondary hover:text-navy hover:bg-surface'
                      }`}
                    >
                      {item.label}
                    </Link>
                  );
                })}
                <div className="pt-4 grid gap-2.5 border-t border-border mt-3">
                  <Button href="/campus-visit" variant="secondary" size="md" className="w-full" onClick={() => setOpen(false)}>
                    Visit Campus
                  </Button>
                  <Button href="/contact" variant="primary" size="md" className="w-full" onClick={() => setOpen(false)}>
                    Enroll Now
                  </Button>
                </div>
              </div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
