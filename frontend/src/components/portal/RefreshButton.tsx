'use client';

import { useState } from 'react';
import Icon from '@/components/ui/AppIcon';

// Small reusable reload control. Spins while the (optionally async) handler runs.
export default function RefreshButton({
  onClick,
  label = 'Refresh',
}: {
  onClick: () => void | Promise<void>;
  label?: string;
}) {
  const [spinning, setSpinning] = useState(false);
  const handle = async () => {
    if (spinning) return;
    setSpinning(true);
    try {
      await onClick();
    } finally {
      setTimeout(() => setSpinning(false), 400);
    }
  };
  return (
    <button
      onClick={handle}
      title={label}
      data-cursor="hover"
      className="inline-flex items-center gap-2 px-3 py-2 rounded-full border border-border bg-white text-text-secondary hover:text-navy hover:bg-surface text-sm font-medium transition-colors"
    >
      <Icon name="ArrowPathIcon" className={`w-4 h-4 ${spinning ? 'animate-spin' : ''}`} />
      <span className="hidden sm:inline">{label}</span>
    </button>
  );
}
