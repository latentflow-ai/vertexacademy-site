'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import Icon from '@/components/ui/AppIcon';
import BrandLogo from '@/components/common/BrandLogo';
import ChangePasswordCard from './ChangePasswordCard';
import { Accent, accentChip } from './AuthScaffold';
import { CurrentUser, fetchMe, logout, LOGIN_PATHS, Role } from '@/lib/auth';

export interface NavItem {
  label: string;
  href: string;
  icon: string;
}

interface PortalShellProps {
  requiredRole: Role;
  brand: string;
  navItems: NavItem[];
  accent?: Accent;
  children: React.ReactNode;
}

const accentSolid: Record<Accent, string> = {
  primary: 'bg-primary text-white',
  gold: 'bg-gold text-gold-foreground',
  green: 'bg-green text-white',
};

const UserContext = createContext<CurrentUser | null>(null);
export const usePortalUser = () => useContext(UserContext);

export default function PortalShell({
  requiredRole,
  brand,
  navItems,
  accent = 'primary',
  children,
}: PortalShellProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const load = async () => {
    try {
      const me = await fetchMe();
      if (me.role !== requiredRole) {
        router.replace(LOGIN_PATHS[requiredRole]);
        return;
      }
      setUser(me);
    } catch {
      router.replace(LOGIN_PATHS[requiredRole]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
    } finally {
      router.replace(LOGIN_PATHS[requiredRole]);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-border border-t-primary rounded-full animate-spin mx-auto mb-4" />
          <p className="text-text-secondary">Loading…</p>
        </div>
      </div>
    );
  }

  if (!user) return null;
  if (user.mustChangePassword) return <ChangePasswordCard onDone={load} />;

  return (
    <UserContext.Provider value={user}>
      <div className="min-h-screen bg-surface text-navy">
        {/* Sidebar */}
        <aside
          className={`fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-border transform transition-transform lg:translate-x-0 ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="h-16 flex items-center gap-2 px-6 border-b border-border">
            <BrandLogo className="h-9 w-9" />
            <span className="font-display font-semibold text-navy">{brand}</span>
          </div>
          <nav className="p-4 space-y-1">
            {navItems.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  data-cursor="hover"
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                    active ? accentSolid[accent] : 'text-text-secondary hover:text-navy hover:bg-surface'
                  }`}
                >
                  <Icon name={item.icon} className="w-5 h-5" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </aside>

        {sidebarOpen && (
          <div className="fixed inset-0 z-30 bg-navy/40 lg:hidden" onClick={() => setSidebarOpen(false)} />
        )}

        {/* Main */}
        <div className="lg:pl-64">
          <header className="h-16 sticky top-0 z-20 bg-white/80 header-blur border-b border-border flex items-center justify-between px-4 sm:px-6">
            <button
              className="lg:hidden text-navy"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open menu"
              data-cursor="hover"
            >
              <Icon name="Bars3Icon" className="w-6 h-6" />
            </button>
            <div className="flex-1" />
            <div className="flex items-center gap-4">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium text-navy leading-tight">{user.fullName}</p>
                <p className="text-xs text-text-faint capitalize">{user.role.toLowerCase()}</p>
              </div>
              <div className={`w-9 h-9 rounded-full flex items-center justify-center ${accentChip[accent]}`}>
                <Icon name="UserIcon" className="w-5 h-5" />
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-3 py-2 bg-surface hover:bg-muted text-text-secondary hover:text-navy rounded-xl transition-colors text-sm border border-border"
                data-cursor="hover"
              >
                <Icon name="ArrowLeftOnRectangleIcon" className="w-5 h-5" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </header>

          <main className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">{children}</main>
        </div>
      </div>
    </UserContext.Provider>
  );
}
