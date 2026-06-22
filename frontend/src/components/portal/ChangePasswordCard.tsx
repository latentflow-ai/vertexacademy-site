'use client';

import { useState } from 'react';
import Icon from '@/components/ui/AppIcon';
import Button from '@/components/ui/Button';
import { changePassword } from '@/lib/auth';
import AuthScaffold from './AuthScaffold';

export default function ChangePasswordCard({ onDone }: { onDone: () => void }) {
  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (next.length < 8) return setError('New password must be at least 8 characters');
    if (next !== confirm) return setError('New passwords do not match');
    setLoading(true);
    try {
      await changePassword(current, next);
      onDone();
    } catch (err: any) {
      setError(err.message || 'Could not update password');
    } finally {
      setLoading(false);
    }
  };

  const field = (label: string, value: string, set: (v: string) => void, placeholder: string) => (
    <div>
      <label className="block text-sm font-medium text-navy mb-1.5">{label}</label>
      <div className="relative">
        <Icon name="LockClosedIcon" className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-faint" />
        <input
          type="password"
          value={value}
          onChange={(e) => set(e.target.value)}
          placeholder={placeholder}
          autoComplete="new-password"
          className="w-full pl-10 pr-4 py-3 bg-surface border border-input rounded-xl text-navy placeholder-text-faint focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/30 transition-all"
          disabled={loading}
        />
      </div>
    </div>
  );

  return (
    <AuthScaffold showBack={false}>
      <div className="bg-white border border-border rounded-2xl shadow-soft p-8">
        <div className="text-center mb-7">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-4 bg-gold-tint text-gold-strong">
            <Icon name="ShieldCheckIcon" className="w-7 h-7" />
          </div>
          <h1 className="font-display text-2xl font-semibold text-navy">Set a new password</h1>
          <p className="text-text-secondary text-sm mt-1">
            For your security, please change the temporary password before continuing.
          </p>
        </div>

        <form onSubmit={submit} className="space-y-5">
          {field('Current password', current, setCurrent, 'Temporary password')}
          {field('New password', next, setNext, 'At least 8 characters')}
          {field('Confirm new password', confirm, setConfirm, 'Re-enter new password')}

          {error && (
            <div className="p-3 rounded-xl bg-error/10 border border-error/30 text-error text-sm">{error}</div>
          )}

          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full"
            disabled={loading || !current || !next || !confirm}
          >
            {loading ? 'Updating…' : 'Update password'}
          </Button>
        </form>
      </div>
    </AuthScaffold>
  );
}
