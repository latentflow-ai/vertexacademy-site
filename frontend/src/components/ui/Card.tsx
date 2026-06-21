import React from 'react';

type CardProps = {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
} & React.HTMLAttributes<HTMLDivElement>;

/** Surface card — raised white-ish tile with hairline border; optional hover lift. */
export default function Card({ children, className = '', hover = false, ...rest }: CardProps) {
  return (
    <div
      className={`bg-surface-2 border border-border rounded-lg ${hover ? 'hover-lift' : ''} ${className}`}
      {...rest}
    >
      {children}
    </div>
  );
}
