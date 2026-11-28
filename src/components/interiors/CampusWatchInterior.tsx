import { useState } from 'react';
import type { CampusRole } from '../../firebase';
import { BUILDINGS } from '../../data/campusData';
import {
  createPermitRequest,
  decidePermit,
  formatTimestamp,
  type PermitRecord,
  type RiskLevel,
} from '../../services/firestoreService';
import {
  BRANCH_PREP_REPORTS,
} from '../../data/governmentConventionPrep';
import { BranchPrepPanel } from './BranchPrepPanel';
import { OfflineRosterPanel } from './OfflineRosterPanel';

interface CampusWatchInteriorProps {
  role: CampusRole;
  userEmail: string;
  permits: PermitRecord[];
}

const RISK_STYLES: Record<RiskLevel, string> = {
  low: 'bg-sky-100 text-sky-900 border-sky-300',
  medium: 'bg-amber-100 text-amber-900 border-amber-300',
  high: 'bg-orange-100 text-orange-900 border-orange-400',
  critical: 'bg-red-100 text-red-900 border-red-400',
};

export function CampusWatchInterior({
  role,
  userEmail,
  permits,
}: CampusWatchInteriorProps) {
  const [title, setTitle] = useState('');
  const [deptId, setDeptId] = useState('executive');
  const [actionType, setActionType] = useState('external_message');
  const [riskLevel, setRiskLevel] = useState<RiskLevel>('medium');
  const [details, setDetails] = useState('');
  const [notesByPermit, setNotesByPermit] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const canWrite = role === 'chancellor' || role === 'university';
  const isChancellor = role === 'chancellor';

  const pending = permits.filter((p) => p.status === 'pending');
  const decided = permits.filter((p) => p.status !== 'pending');

  async function handleFilePermit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !details.trim()) return;
    setBusy(true);
    setFeedback(null);
    try {
      await createPermitRequest(
        {
          title,
          departmentId: deptId,
          requestedBy: userEmail,
          actionType,
          details,
          riskLevel,
        },
        userEmail
      );
      setTitle('');
      setDetails('');
      setFeedback('! Permit filed and queued for Chancellor sign-off.');
    } catch (err: unknown) {
      setFeedback(err instanceof Error ? err.message : 'Failed to file permit.');
    } finally {
      setBusy(false);
    }
  }

  async function handleDecision(permit: PermitRecord, decision: 'approved' | 'denied') {
    setBusy(true);
    setFeedback(null);
    try {
      await decidePermit(permit, decision, notesByPermit[permit.id] || '', userEmail);
      setFeedback(`Permit "${permit.title}" ${decision} and recorded in Courthouse Audit Log.`);
    } catch (err: unknown) {
      setFeedback(err instanceof Error ? err.message : 'Could not record permit decision.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-3">
      <div className="p-3 rounded-xl bg-[#fff8e7] border border-[#b08647] flex items-center justify-between gap-2 flex-wrap">
        <div className="text-xs text-[#54371b]">
          <strong>Police Station — Executive Enforcement (Article II):</strong> Enforces the Bill of
          Rights and Campus Constitution; high-impact actions require Chancellor <code>! Permit</code>{' '}
          sign-off and write an immutable Cairn to the Courthouse.
        </div>
        <span className="px-2.5 py-1 rounded-full bg-amber-100 border border-amber-400 text-amber-950 text-xs font-bold shrink-0">
          ! {pending.length} Pending
        </span>
      </div>

      <OfflineRosterPanel
        deptId="executive"
        heading="🚔 Police Station 5-Role Force (Online · Convention Prep)"
        isOnline={true}
      />

      <BranchPrepPanel report={BRANCH_PREP_REPORTS.executive} />

      {feedback && (
        <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-300 text-xs text-emerald-900">
          {feedback}
        </div>
      )}

      {/* Pending Queue */}
      <div className="space-y-2">
        <div className="text-xs font-bold uppercase tracking-wide text-[#7c5021]">
          Pending Permits Awaiting Chancellor Approval ({pending.length})
        </div>
        {pending.length === 0 ? (
          <div className="p-3.5 rounded-xl bg-white/60 border border-[#c9a86a] text-xs text-[#6b4b28] text-center">
            All clear — zero pending `!` Permits on the dispatch desk.
          </div>
        ) : (
          pending.map((p) => (
            <div
              key={p.id}
              className="p-3 rounded-xl bg-white/90 border-2 border-[#d49b35] space-y-2 text-xs shadow-sm"
            >
              <div className="flex items-start justify-between gap-2 flex-wrap">
                <div>
                  <div className="font-atlas font-bold text-sm text-[#331d0b]">! {p.title}</div>
                  <div className="text-[11px] text-[#7c5021]">
                    Dept: <strong>{p.departmentId}</strong> · Action: <strong>{p.actionType}</strong>{' '}
                    · {formatTimestamp(p.createdAt)}
                  </div>
                </div>
                <span
                  className={`px-2 py-0.5 rounded-full border text-[10px] font-bold uppercase ${RISK_STYLES[p.riskLevel]}`}
                >
                  {p.riskLevel} risk
                </span>
              </div>
              <p className="text-[#3b2410] whitespace-pre-wrap">{p.details}</p>

              {isChancellor ? (
                <div className="space-y-2 pt-1 border-t border-[#e7d1a4]">
                  <input
                    value={notesByPermit[p.id] || ''}
                    onChange={(e) =>
                      setNotesByPermit((prev) => ({ ...prev, [p.id]: e.target.value }))
                    }
                    placeholder="Optional Chancellor decision note..."
                    className="w-full px-2.5 py-1.5 rounded-lg bg-[#fbf5e6] border border-[#b89259]"
                  />
                  <div className="flex items-center gap-2">
                    <button
                      disabled={busy}
                      onClick={() => void handleDecision(p, 'approved')}
                      className="px-3 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-semibold cursor-pointer disabled:opacity-50"
                    >
                      ✓ Approve Permit
                    </button>
                    <button
                      disabled={busy}
                      onClick={() => void handleDecision(p, 'denied')}
                      className="px-3 py-1.5 rounded-lg bg-red-700 hover:bg-red-800 text-white font-semibold cursor-pointer disabled:opacity-50"
                    >
                      ✕ Deny Permit
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-[11px] italic text-[#7c5021]">
                  Awaiting Chancellor Amarette’s signature.
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* File New Permit Form (Chancellor & Ray) */}
      {canWrite && (
        <form
          onSubmit={(e) => void handleFilePermit(e)}
          className="p-3 rounded-xl bg-[#f7ead0] border border-[#b08647] space-y-2 text-xs"
        >
          <div className="font-atlas font-bold text-sm text-[#3c230f]">
            File a New ! Permit Request
          </div>
          <input
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="What action needs approval?"
            className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-[#b89259]"
          />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
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
            <select
              value={actionType}
              onChange={(e) => setActionType(e.target.value)}
              className="px-2 py-1.5 rounded-lg bg-white border border-[#b89259]"
            >
              <option value="external_message">External Message / Post</option>
              <option value="spending">Spending / Subscription</option>
              <option value="sharing">Sharing / Permissions</option>
              <option value="system_install">Software / Network Change</option>
              <option value="trading_rule">Stocks MCP Trading Rule</option>
              <option value="other">Other High-Impact Action</option>
            </select>
            <select
              value={riskLevel}
              onChange={(e) => setRiskLevel(e.target.value as RiskLevel)}
              className="px-2 py-1.5 rounded-lg bg-white border border-[#b89259]"
            >
              <option value="low">Low Risk</option>
              <option value="medium">Medium Risk</option>
              <option value="high">High Risk</option>
              <option value="critical">Critical Risk</option>
            </select>
          </div>
          <textarea
            required
            rows={2}
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            placeholder="Describe exact scope, impact, and rollback plan..."
            className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-[#b89259]"
          />
          <button
            type="submit"
            disabled={busy}
            className="px-3.5 py-1.5 rounded-lg bg-[#362316] hover:bg-[#4e3320] text-[#fbe8b5] font-semibold cursor-pointer disabled:opacity-50"
          >
            {busy ? 'Filing…' : 'Queue ! Permit for Approval'}
          </button>
        </form>
      )}

      {/* Decided History */}
      {decided.length > 0 && (
        <div className="space-y-1.5">
          <div className="text-xs font-bold uppercase tracking-wide text-[#7c5021]">
            Recent Permit Decisions ({decided.length})
          </div>
          <div className="space-y-1.5">
            {decided.slice(0, 8).map((p) => (
              <div
                key={p.id}
                className="p-2.5 rounded-lg bg-white/65 border border-[#c9a86a] text-xs flex items-start justify-between gap-2"
              >
                <div className="min-w-0">
                  <div className="font-semibold text-[#331d0b]">{p.title}</div>
                  <div className="text-[11px] text-[#6b4b28]">
                    {p.departmentId} · {p.actionType}
                    {p.decisionNote ? ` · Note: ${p.decisionNote}` : ''}
                  </div>
                </div>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase shrink-0 ${
                    p.status === 'approved'
                      ? 'bg-emerald-100 text-emerald-900'
                      : 'bg-red-100 text-red-900'
                  }`}
                >
                  {p.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
