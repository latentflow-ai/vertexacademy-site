'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Icon from '@/components/ui/AppIcon';
import Button from '@/components/ui/Button';
import { login, DASHBOARD_PATHS } from '@/lib/auth';
import AuthScaffold, { Accent, accentChip } from './AuthScaffold';

interface LoginFormProps {
  title: string;
  subtitle: string;
  icon?: string;
  accent?: Accent;
  usernameLabel?: string;
  usernamePlaceholder?: string;
  footer?: React.ReactNode;
}

export default function LoginForm({
  title,
  subtitle,
  icon = 'LockClosedIcon',
  accent = 'primary',
  usernameLabel = 'Email or ID',
  usernamePlaceholder = 'you@vertex or VA-…',
  footer,
}: LoginFormProps) {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      const user = await login(username, password);
      router.push(DASHBOARD_PATHS[user.role]);
    } catch (err: any) {
      setError(err.message || 'An error occurred during login');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthScaffold>
      <div className="bg-white border border-border rounded-2xl shadow-soft p-8">
        <div className="text-center mb-7">
          <div className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-4 ${accentChip[accent]}`}>
            <Icon name={icon} className="w-7 h-7" />
          </div>
          <h1 className="font-display text-2xl font-semibold text-navy">{title}</h1>
          <p className="text-text-secondary text-sm mt-1">{subtitle}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-navy mb-1.5">
              {usernameLabel}
            </label>
            <div className="relative">
              <Icon name="UserIcon" className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-faint" />
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder={usernamePlaceholder}
                autoComplete="username"
                className="w-full pl-10 pr-4 py-3 bg-surface border border-input rounded-xl text-navy placeholder-text-faint focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/30 transition-all"
                disabled={isLoading}
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-navy mb-1.5">
              Password
            </label>
            <div className="relative">
              <Icon name="LockClosedIcon" className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-faint" />
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                autoComplete="current-password"
                className="w-full pl-10 pr-12 py-3 bg-surface border border-input rounded-xl text-navy placeholder-text-faint focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/30 transition-all"
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-text-faint hover:text-navy transition-colors"
                disabled={isLoading}
                data-cursor="hover"
              >
                <Icon name="EyeIcon" className="w-5 h-5" />
              </button>
            </div>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-error/10 border border-error/30 text-error text-sm">{error}</div>
          )}

          <Button
            type="submit"
            variant={accent}
            size="lg"
            className="w-full"
            disabled={isLoading || !username || !password}
          >
            {isLoading ? 'Signing in…' : 'Sign In'}
          </Button>
        </form>

        {footer && <div className="mt-6 text-center text-sm text-text-secondary">{footer}</div>}
      </div>

      <p className="mt-6 text-center text-xs text-text-faint">
        Restricted area · Vertex Academy ·{' '}
        <Link href="/portal" className="underline hover:text-navy" data-cursor="hover">
          choose a different portal
        </Link>
      </p>
    </AuthScaffold>
  );
}
