'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Icon from '@/components/ui/AppIcon';
import Button from '@/components/ui/Button';
import AuthScaffold from '@/components/portal/AuthScaffold';
import { DASHBOARD_PATHS, requestParentOtp, verifyParentOtp } from '@/lib/auth';

const inputCls =
  'w-full px-3 py-3 bg-surface border border-input rounded-xl text-navy placeholder-text-faint focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/30 transition-all';

export default function ParentLoginPage() {
  const router = useRouter();
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [devCode, setDevCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const sendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (phone.replace(/\D/g, '').length < 10) return setError('Enter a valid 10-digit phone number');
    setLoading(true);
    try {
      const res = await requestParentOtp(phone);
      setDevCode(res.devCode || '');
      setStep('otp');
    } catch (err: any) {
      setError(err.message || 'Could not send OTP');
    } finally {
      setLoading(false);
    }
  };

  const verify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!/^\d{6}$/.test(code)) return setError('Enter the 6-digit code');
    setLoading(true);
    try {
      const user = await verifyParentOtp(phone, code);
      router.push(DASHBOARD_PATHS[user.role]);
    } catch (err: any) {
      setError(err.message || 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthScaffold>
      <div className="bg-white border border-border rounded-2xl shadow-soft p-8">
        <div className="text-center mb-7">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-4 bg-green-tint text-green">
            <Icon name="UserCircleIcon" className="w-7 h-7" />
          </div>
          <h1 className="font-display text-2xl font-semibold text-navy">Parent Login</h1>
          <p className="text-text-secondary text-sm mt-1">
            {step === 'phone'
              ? 'Sign in with the phone number registered with the academy.'
              : `Enter the 6-digit code sent to ${phone}.`}
          </p>
        </div>

        {step === 'phone' ? (
          <form onSubmit={sendOtp} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-navy mb-1.5">Phone number</label>
              <div className="relative">
                <Icon name="DevicePhoneMobileIcon" className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-faint" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="10-digit mobile number"
                  autoComplete="tel"
                  className={inputCls + ' pl-10'}
                  disabled={loading}
                />
              </div>
            </div>
            {error && <div className="p-3 rounded-xl bg-error/10 border border-error/30 text-error text-sm">{error}</div>}
            <Button type="submit" variant="green" size="lg" className="w-full" disabled={loading || !phone}>
              {loading ? 'Sending…' : 'Send OTP'}
            </Button>
          </form>
        ) : (
          <form onSubmit={verify} className="space-y-5">
            {devCode && (
              <div className="p-3 rounded-xl bg-gold-tint text-gold-strong text-sm text-center">
                Dev mode — your code is <span className="font-mono font-bold">{devCode}</span>
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-navy mb-1.5">6-digit code</label>
              <input
                inputMode="numeric"
                maxLength={6}
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                placeholder="••••••"
                className={inputCls + ' text-center text-2xl tracking-[0.5em] font-mono'}
                disabled={loading}
              />
            </div>
            {error && <div className="p-3 rounded-xl bg-error/10 border border-error/30 text-error text-sm">{error}</div>}
            <Button type="submit" variant="green" size="lg" className="w-full" disabled={loading || code.length !== 6}>
              {loading ? 'Verifying…' : 'Verify & sign in'}
            </Button>
            <button
              type="button"
              onClick={() => { setStep('phone'); setCode(''); setError(''); }}
              className="w-full text-sm text-text-secondary hover:text-navy"
              data-cursor="hover"
            >
              ← Change number
            </button>
          </form>
        )}
      </div>

      <p className="mt-6 text-center text-xs text-text-faint">
        Your number must be on file with the academy. Contact the office if you can't sign in.
      </p>
    </AuthScaffold>
  );
}
