'use client';

import { useEffect, useState } from 'react';
import PortalShell from '@/components/portal/PortalShell';
import { ADMIN_NAV } from '@/components/portal/adminNav';
import { AuditEntry, listAudit } from '@/lib/admin';
import RefreshButton from '@/components/portal/RefreshButton';

function AuditViewer() {
  const [logs, setLogs] = useState<AuditEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = () => {
    setLoading(true);
    return listAudit(200).then(setLogs).catch((e) => setError(e.message)).finally(() => setLoading(false));
  };
  useEffect(() => { load(); }, []);

  return (
    <div>
      <div className="mb-6 flex items-start justify-between gap-3">
        <div>
          <p className="eyebrow mb-1">Admin</p>
          <h1 className="font-display text-display-sm text-navy">Audit Log</h1>
          <p className="text-text-secondary text-sm">Logins and create/update/delete actions across the portal.</p>
        </div>
        <RefreshButton onClick={load} />
      </div>

      {error && <div className="mb-4 p-3 rounded-xl bg-error/10 border border-error/30 text-error text-sm">{error}</div>}

      <div className="bg-white border border-border rounded-2xl shadow-soft overflow-hidden">
        {loading ? (
          <div className="p-10 text-center text-text-secondary">Loading…</div>
        ) : logs.length === 0 ? (
          <div className="p-10 text-center text-text-secondary">No activity yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-surface text-text-secondary">
                <tr>
                  <th className="text-left font-medium px-4 py-3">When</th>
                  <th className="text-left font-medium px-4 py-3">User</th>
                  <th className="text-left font-medium px-4 py-3">Action</th>
                  <th className="text-left font-medium px-4 py-3">Entity</th>
                  <th className="text-left font-medium px-4 py-3">IP</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {logs.map((l) => (
                  <tr key={l.id} className="hover:bg-surface/60">
                    <td className="px-4 py-3 text-text-secondary whitespace-nowrap">{new Date(l.createdAt).toLocaleString()}</td>
                    <td className="px-4 py-3 text-navy">{l.user ? `${l.user.fullName}` : '—'}<span className="text-text-faint text-xs"> {l.user ? `(${l.user.role.toLowerCase()})` : ''}</span></td>
                    <td className="px-4 py-3"><span className="px-2 py-0.5 rounded-full bg-primary-tint text-primary text-xs font-medium">{l.action}</span></td>
                    <td className="px-4 py-3 text-text-secondary">{l.entity}</td>
                    <td className="px-4 py-3 text-text-faint font-mono text-xs">{l.ip || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default function AdminAuditPage() {
  return (
    <PortalShell requiredRole="ADMIN" brand="Vertex Admin" navItems={ADMIN_NAV} accent="primary">
      <AuditViewer />
    </PortalShell>
  );
}
