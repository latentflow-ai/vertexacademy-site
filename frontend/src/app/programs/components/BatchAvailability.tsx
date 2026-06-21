'use client';

import { useState } from 'react';
import Link from 'next/link';
import Icon from '@/components/ui/AppIcon';

interface BatchSlot {
  id: string;
  program: string;
  day: string;
  time: string;
  availableSeats: number;
  totalSeats: number;
  instructor: string;
  status: 'available' | 'filling-fast' | 'full';
}

interface BatchAvailabilityProps {
  batches: BatchSlot[];
}

export default function BatchAvailability({ batches }: BatchAvailabilityProps) {
  const [selectedProgram, setSelectedProgram] = useState<string>('All Programs');
  const [selectedDay, setSelectedDay] = useState<string>('All Days');

  const programs = ['All Programs', ...Array.from(new Set(batches.map((b) => b.program)))];
  const days = ['All Days', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const filtered = batches.filter((b) => {
    const p = selectedProgram === 'All Programs' || b.program === selectedProgram;
    const d = selectedDay === 'All Days' || b.day === selectedDay;
    return p && d;
  });

  const statusBadge = (s: string) =>
    s === 'available'
      ? 'bg-green-tint text-green border-green/20'
      : s === 'filling-fast'
      ? 'bg-gold-tint text-gold-strong border-gold/30'
      : 'bg-error/10 text-error border-error/20';

  const barColor = (s: string) =>
    s === 'available' ? 'bg-green' : s === 'filling-fast' ? 'bg-gold' : 'bg-error';

  return (
    <div className="bg-surface-2 rounded-2xl shadow-soft border border-border overflow-hidden">
      {/* Header (solid navy) */}
      <div className="bg-navy text-navy-foreground p-6 sm:p-8">
        <p className="eyebrow !text-gold mb-2">Live Seats</p>
        <h3 className="font-display text-2xl sm:text-3xl">Batch availability</h3>
        <p className="text-navy-foreground/70 text-sm mt-1.5">Real-time seat availability across all programs.</p>
      </div>

      {/* Filters */}
      <div className="p-6 border-b border-border">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-navy mb-2">Filter by Program</label>
            <select
              value={selectedProgram}
              onChange={(e) => setSelectedProgram(e.target.value)}
              className="w-full h-12 px-4 bg-surface border border-border rounded-lg text-navy focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {programs.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-navy mb-2">Filter by Day</label>
            <select
              value={selectedDay}
              onChange={(e) => setSelectedDay(e.target.value)}
              className="w-full h-12 px-4 bg-surface border border-border rounded-lg text-navy focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {days.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* List */}
      <div className="p-6">
        {filtered.length === 0 ? (
          <div className="text-center py-12">
            <Icon name="CalendarDaysIcon" size={48} className="text-text-faint mx-auto mb-4" />
            <p className="text-text-secondary">No batches found matching your filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {filtered.map((batch) => {
              const full = batch.status === 'full';
              return (
                <div key={batch.id} className="bg-surface rounded-xl p-5 border border-border hover-lift">
                  <div className="flex items-start justify-between mb-4 gap-3">
                    <div>
                      <h4 className="font-display text-lg text-navy mb-1">{batch.program}</h4>
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-text-secondary">
                        <span className="flex items-center gap-1"><Icon name="CalendarIcon" size={14} />{batch.day}</span>
                        <span className="flex items-center gap-1"><Icon name="ClockIcon" size={14} />{batch.time}</span>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold border whitespace-nowrap ${statusBadge(batch.status)}`}>
                      {batch.status === 'available' && 'Available'}
                      {batch.status === 'filling-fast' && 'Filling Fast'}
                      {batch.status === 'full' && 'Full'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between mb-3">
                    <span className="flex items-center gap-2 text-sm text-text-secondary">
                      <Icon name="UserIcon" size={16} />{batch.instructor}
                    </span>
                    <span className="text-sm font-semibold text-navy">{batch.availableSeats}/{batch.totalSeats} seats</span>
                  </div>

                  <div className="w-full bg-border rounded-full h-2 overflow-hidden mb-4">
                    <div
                      className={`h-full ${barColor(batch.status)}`}
                      style={{ width: `${((batch.totalSeats - batch.availableSeats) / batch.totalSeats) * 100}%` }}
                    />
                  </div>

                  <Link
                    href={full ? '#' : '/contact?form=enrollment'}
                    aria-disabled={full}
                    className={`w-full h-11 rounded-full font-semibold text-sm flex items-center justify-center gap-2 transition-smooth ${
                      full
                        ? 'bg-surface-2 text-text-faint cursor-not-allowed border border-border'
                        : 'bg-primary text-primary-foreground hover:bg-primary-strong hover:-translate-y-0.5'
                    }`}
                  >
                    <Icon name={full ? 'LockClosedIcon' : 'CheckCircleIcon'} size={16} />
                    <span>{full ? 'Batch Full' : 'Reserve Seat'}</span>
                  </Link>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="px-6 pb-6">
        <div className="bg-surface rounded-xl p-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
          <span className="flex items-center gap-2 text-xs text-text-secondary"><Icon name="CheckCircleIcon" size={16} className="text-green" />Available — plenty of seats</span>
          <span className="flex items-center gap-2 text-xs text-text-secondary"><Icon name="ExclamationTriangleIcon" size={16} className="text-gold-strong" />Filling fast — limited seats</span>
          <span className="flex items-center gap-2 text-xs text-text-secondary"><Icon name="XCircleIcon" size={16} className="text-error" />Full — join waitlist</span>
        </div>
      </div>
    </div>
  );
}
