import { useState } from 'react';
import type { CampusRole } from '../../firebase';
import { BUILDINGS } from '../../data/campusData';
import {
  appendConductLog,
  formatTimestamp,
  type ConductCategory,
  type ConductLogRecord,
  type ConductSeverity,
} from '../../services/firestoreService';
import { OfflineRosterPanel } from './OfflineRosterPanel';

interface CourthouseInteriorProps {
  role: CampusRole;
  userEmail: string;
  logs: ConductLogRecord[];
}

const SEV_STYLES: Record<ConductSeverity, string> = {
  info: 'bg-[#efe0bc] text-[#4a2b0f]',
  low: 'bg-sky-100 text-sky-900',
  medium: 'bg-amber-100 text-amber-900',
  high: 'bg-orange-100 text-orange-900',
  critical: 'bg-red-100 text-red-900',
};

export function CourthouseInterior({ role, userEmail, logs }: CourthouseInteriorProps) {
  const [filter, setFilter] = useState<'all' | ConductCategory>('all');
  const [category, setCategory] = useState<ConductCategory>('audit');
  const [severity, setSeverity] = useState<ConductSeverity>('info');
  const [deptId, setDeptId] = useState('courthouse');
  const [summary, setSummary] = useState('');
  const [remediationOrder, setRemediationOrder] = useState('');
  const [busy, setBusy] = useState(false);

  const canWrite = role === 'chancellor' || role === 'university';
  const visibleLogs = filter === 'all' ? logs : logs.filter((l) => l.category === filter);

  async function handleLogSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!summary.trim()) return;
    setBusy(true);
    try {
      await appendConductLog({
        category,
        severity,
        departmentId: deptId,
        actor: userEmail,
        summary,
        remediationOrder,
      });
      setSummary('');
      setRemediationOrder('');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-3">
      <div className="p-3 rounded-xl bg-[#fff8e7] border border-[#b08647] flex items-center justify-between gap-2 flex-wrap">
        <div className="text-xs text-[#54371b]">
          <strong>Article IX — Three-Tier Judicial System &amp; Immutable Cairn Ledger:</strong>{' '}
          Houses the <strong>Civil &amp; Criminal Court</strong> (general agent cases),{' '}
          <strong>Grand Court</strong> (government cases), and <strong>5-Justice Supreme Court</strong>{' '}
          (Bill of Rights &amp; Constitution review). Ledger is <strong>append-only</strong>.
        </div>
        <span className="px-2 py-0.5 rounded-full bg-[#362316] text-[#fbe8b5] text-[10px] font-bold uppercase shrink-0">
          Tamper-Proof · {logs.length} Cairns
        </span>
      </div>

      <OfflineRosterPanel deptId="courthouse" heading="⚖️ Three-Tier Judicial Bench & Officers (Offline · Standby)" />

      {/* Filter pills */}
      <div className="flex flex-wrap gap-1.5">
        {(
          [
            ['all', 'All'],
            ['governance', 'Governance'],
            ['permit_audit', 'Permits'],
            ['audit', 'Audits'],
            ['watchdog_alert', 'Watchdog'],
            ['remediation', 'Remediations'],
          ] as const
        ).map(([val, label]) => (
          <button
            key={val}
            onClick={() => setFilter(val)}
            className={`px-2.5 py-1 rounded-full text-[11px] font-semibold cursor-pointer ${
              filter === val
                ? 'bg-[#6b4423] text-[#fbe8b5]'
                : 'bg-[#f4e4c1] hover:bg-[#ead09c] text-[#4a2b0f]'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Log entries */}
      <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
        {visibleLogs.length === 0 ? (
          <div className="p-4 rounded-xl bg-white/60 border border-[#c9a86a] text-xs text-[#6b4b28] text-center">
            No Cairns recorded in this category yet.
          </div>
        ) : (
          visibleLogs.map((l) => (
            <div
              key={l.id}
              className="p-2.5 rounded-xl bg-white/80 border border-[#c4a167] text-xs space-y-1"
            >
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${SEV_STYLES[l.severity]}`}
                  >
                    {l.severity}
                  </span>
                  <span className="font-bold text-[#3c230f] uppercase text-[10px]">
                    {l.category.replace('_', ' ')}
                  </span>
                  <span className="text-[11px] text-[#7c5021]">· {l.departmentId}</span>
                </div>
                <span className="text-[10px] text-[#7c5021]">{formatTimestamp(l.createdAt)}</span>
              </div>
              <p className="text-[#352110] leading-snug">{l.summary}</p>
              {l.remediationOrder && (
                <div className="p-2 rounded-lg bg-[#fff4e6] border border-[#d69e50] text-[11px] text-[#5c3208]">
                  <strong>Correction Order:</strong> {l.remediationOrder}
                </div>
              )}
              <div className="text-[10px] text-[#8a6235]">Logged by: {l.actor}</div>
            </div>
          ))
        )}
      </div>

      {/* Append New Cairn Form */}
      {canWrite && (
        <form
          onSubmit={(e) => void handleLogSubmit(e)}
          className="p-3 rounded-xl bg-[#f7ead0] border border-[#b08647] space-y-2 text-xs"
        >
          <div className="font-atlas font-bold text-sm text-[#3c230f]">
            Record Conduct Cairn / Correction Order
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as ConductCategory)}
              className="px-2 py-1.5 rounded-lg bg-white border border-[#b89259]"
            >
              <option value="audit">Audit</option>
              <option value="watchdog_alert">Watchdog Alert</option>
              <option value="remediation">Remediation Order</option>
              <option value="policy_violation">Policy Violation</option>
              <option value="governance">Governance Note</option>
              <option value="commendation">Commendation</option>
            </select>
            <select
              value={severity}
              onChange={(e) => setSeverity(e.target.value as ConductSeverity)}
              className="px-2 py-1.5 rounded-lg bg-white border border-[#b89259]"
            >
              <option value="info">Info</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="critical">Critical</option>
            </select>
            <select
              value={deptId}
              onChange={(e) => setDeptId(e.target.value)}
              className="px-2 py-1.5 rounded-lg bg-white border border-[#b89259]"
            >
              {BUILDINGS.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </select>
          </div>
          <textarea
            required
            rows={2}
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            placeholder="Record finding, ruling, or activity summary..."
            className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-[#b89259]"
          />
          <input
            value={remediationOrder}
            onChange={(e) => setRemediationOrder(e.target.value)}
            placeholder="Optional Skill/Prompt correction order..."
            className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-[#b89259]"
          />
          <button
            type="submit"
            disabled={busy}
            className="px-3.5 py-1.5 rounded-lg bg-[#362316] hover:bg-[#4e3320] text-[#fbe8b5] font-semibold cursor-pointer disabled:opacity-50"
          >
            {busy ? 'Recording…' : 'Append Immutable Cairn'}
          </button>
        </form>
      )}
    </div>
  );
}
