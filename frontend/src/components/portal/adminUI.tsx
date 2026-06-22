'use client';

import { useState } from 'react';
import Icon from '@/components/ui/AppIcon';

export const fieldCls =
  'w-full px-3 py-2.5 bg-surface border border-input rounded-xl text-navy placeholder-text-faint focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/30 transition-all';

export function Modal({
  title,
  children,
  onClose,
}: {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy/40" onClick={onClose}>
      <div
        className="w-full max-w-md bg-white border border-border rounded-2xl shadow-soft p-6 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-display text-heading-md text-navy">{title}</h3>
          <button onClick={onClose} className="text-text-faint hover:text-navy" data-cursor="hover">
            <Icon name="XMarkIcon" className="w-6 h-6" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

export function Field({
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-navy mb-1.5">{label}</label>
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className={fieldCls} />
    </div>
  );
}

export function SelectField({
  label,
  value,
  onChange,
  children,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-navy mb-1.5">{label}</label>
      <select value={value} onChange={(e) => onChange(e.target.value)} className={fieldCls}>
        {children}
      </select>
    </div>
  );
}

// One-time credential reveal after creating an account or resetting a password.
export function CredentialModal({
  title,
  email,
  loginId,
  password,
  onClose,
}: {
  title: string;
  email?: string;
  loginId?: string | null;
  password: string;
  onClose: () => void;
}) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    const lines = [
      loginId ? `Login ID: ${loginId}` : null,
      email ? `Email: ${email}` : null,
      `Temporary password: ${password}`,
    ].filter(Boolean);
    await navigator.clipboard.writeText(lines.join('\n'));
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  return (
    <Modal onClose={onClose} title={title}>
      <p className="text-text-secondary text-sm mb-4">
        Share these credentials with the user. The temporary password is shown{' '}
        <span className="text-navy font-semibold">only once</span> — they'll set a new one at first login. Login works
        with the ID or the email.
      </p>
      <div className="bg-surface border border-border rounded-xl p-4 space-y-2 font-mono text-sm">
        {loginId && (
          <Row label="Login ID" value={loginId} />
        )}
        {email && <Row label="Email" value={email} />}
        <Row label="Password" value={password} />
      </div>
      <div className="flex justify-end gap-3 mt-5">
        <button onClick={copy} className="px-4 py-2 bg-surface border border-border hover:bg-muted text-navy rounded-full text-sm" data-cursor="hover">
          {copied ? 'Copied!' : 'Copy'}
        </button>
        <button onClick={onClose} className="px-4 py-2 bg-navy hover:bg-primary-strong text-white rounded-full text-sm" data-cursor="hover">
          Done
        </button>
      </div>
    </Modal>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4">
      <span className="text-text-faint">{label}</span>
      <span className="text-navy">{value}</span>
    </div>
  );
}

export function ActionBtn({
  label,
  icon,
  onClick,
  danger,
}: {
  label: string;
  icon: string;
  onClick: () => void;
  danger?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      title={label}
      data-cursor="hover"
      className={`p-2 rounded-lg transition-colors ${
        danger ? 'text-error hover:bg-error/10' : 'text-text-faint hover:text-navy hover:bg-surface'
      }`}
    >
      <Icon name={icon} className="w-5 h-5" />
    </button>
  );
}

export function StatusBadge({ active }: { active: boolean }) {
  return (
    <span
      className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${
        active ? 'bg-green-tint text-green' : 'bg-muted text-text-faint'
      }`}
    >
      {active ? 'Active' : 'Inactive'}
    </span>
  );
}
