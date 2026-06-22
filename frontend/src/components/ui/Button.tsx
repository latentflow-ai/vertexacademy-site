'use client';

import React, { useState, useCallback } from 'react';
import Link from 'next/link';
import { useReducedMotion } from 'framer-motion';

type Variant =
  | 'primary'
  | 'green'
  | 'gold'
  | 'secondary'
  | 'ghost'
  | 'light'
  | 'outlineLight';
type Size = 'sm' | 'md' | 'lg';

const base =
  'group relative overflow-hidden inline-flex items-center justify-center gap-2 font-semibold rounded-full leading-none ' +
  'transition-smooth select-none focus-visible:outline-none focus-visible:ring-2 ' +
  'focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background ' +
  'hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:pointer-events-none disabled:translate-y-0';

const variants: Record<Variant, string> = {
  primary: 'bg-primary text-primary-foreground hover:bg-primary-strong shadow-blue',
  green: 'bg-green text-green-foreground hover:shadow-elevation',
  gold: 'bg-gold text-gold-foreground hover:shadow-elevation',
  secondary: 'border-2 border-navy/20 text-navy bg-transparent hover:border-navy/40 hover:bg-surface',
  ghost: 'text-primary bg-transparent hover:bg-primary-tint',
  light: 'bg-white text-navy hover:shadow-elevation',
  outlineLight:
    'border-2 border-white/30 text-white bg-transparent hover:bg-white/10 focus-visible:ring-white focus-visible:ring-offset-navy',
};

const sizes: Record<Size, string> = {
  sm: 'h-11 px-5 text-sm',
  md: 'h-12 px-6 text-[0.95rem]',
  lg: 'h-14 px-8 text-base',
};

type Ripple = { id: number; x: number; y: number; size: number };

type CommonProps = {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: React.ReactNode;
};

type ButtonProps = CommonProps &
  React.ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined };
type AnchorProps = CommonProps &
  Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> & { href: string };

export default function Button(props: ButtonProps | AnchorProps) {
  const { variant = 'primary', size = 'md', className = '', children } = props;
  const reduce = useReducedMotion();
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const cls = `${base} ${variants[variant]} ${sizes[size]} ${className}`;

  const addRipple = useCallback(
    (e: React.PointerEvent) => {
      if (reduce) return;
      const el = e.currentTarget as HTMLElement;
      const r = el.getBoundingClientRect();
      const size = Math.max(r.width, r.height) * 1.4;
      const id = Date.now() + Math.random();
      setRipples((prev) => [...prev, { id, x: e.clientX - r.left, y: e.clientY - r.top, size }]);
      window.setTimeout(() => setRipples((prev) => prev.filter((p) => p.id !== id)), 600);
    },
    [reduce]
  );

  const decoration = (
    <>
      {/* sheen sweep */}
      {!reduce && (
        <span className="pointer-events-none absolute inset-0 overflow-hidden rounded-full" aria-hidden="true">
          <span className="absolute top-0 bottom-0 -left-1/3 w-1/4 -skew-x-[20deg] bg-white/25 blur-[2px] -translate-x-[260%] group-hover:translate-x-[560%] transition-transform duration-700 ease-out" />
        </span>
      )}
      {/* click ripples */}
      {ripples.map((r) => (
        <span
          key={r.id}
          className="pointer-events-none absolute rounded-full bg-white/30 animate-[ripple_0.6s_ease-out_forwards]"
          style={{ left: r.x, top: r.y, width: r.size, height: r.size, marginLeft: -r.size / 2, marginTop: -r.size / 2 }}
          aria-hidden="true"
        />
      ))}
      <span className="relative z-[1] inline-flex items-center gap-2">{children}</span>
    </>
  );

  if ('href' in props && props.href) {
    const { href, variant: _v, size: _s, className: _c, children: _ch, ...rest } =
      props as AnchorProps;
    const external =
      href.startsWith('http') || href.startsWith('tel:') || href.startsWith('mailto:');
    if (external) {
      return (
        <a href={href} className={cls} onPointerDown={addRipple} {...rest}>
          {decoration}
        </a>
      );
    }
    return (
      <Link href={href} className={cls} onPointerDown={addRipple} {...rest}>
        {decoration}
      </Link>
    );
  }

  const { variant: _v, size: _s, className: _c, children: _ch, ...rest } = props as ButtonProps;
  return (
    <button className={cls} onPointerDown={addRipple} {...rest}>
      {decoration}
    </button>
  );
}
