'use client';

import { useEffect, useRef, useState } from 'react';
import Logo from './Logo';

/**
 * Renders the official crest from /public/logo.png, gracefully falling back to
 * the SVG monogram if the file is not present (handles the case where the image
 * 404s before React attaches the onError handler).
 */
export default function BrandLogo({ className = 'h-11 w-11' }: { className?: string }) {
  const [ok, setOk] = useState(true);
  const ref = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const img = ref.current;
    if (img && img.complete && img.naturalWidth === 0) setOk(false);
  }, []);

  if (!ok) return <Logo className={className} />;
  // eslint-disable-next-line @next/next/no-img-element
  return (
    <img
      ref={ref}
      src="/logo.png"
      alt="Vertex Academy"
      className={`${className} object-contain`}
      onError={() => setOk(false)}
    />
  );
}
