import React from 'react';
import Link from 'next/link';

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
  'group inline-flex items-center justify-center gap-2 font-semibold rounded-full leading-none ' +
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
  const cls = `${base} ${variants[variant]} ${sizes[size]} ${className}`;

  if ('href' in props && props.href) {
    const { href, variant: _v, size: _s, className: _c, children: _ch, ...rest } =
      props as AnchorProps;
    const external =
      href.startsWith('http') || href.startsWith('tel:') || href.startsWith('mailto:');
    if (external) {
      return (
        <a href={href} className={cls} {...rest}>
          {children}
        </a>
      );
    }
    return (
      <Link href={href} className={cls} {...rest}>
        {children}
      </Link>
    );
  }

  const { variant: _v, size: _s, className: _c, children: _ch, ...rest } = props as ButtonProps;
  return (
    <button className={cls} {...rest}>
      {children}
    </button>
  );
}
