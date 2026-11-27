import { useMemo, useState } from 'react';
import {
  BRAMBLEWOOD_AGENTS,
  type AgentTaskStatus,
  type BramblewoodAgentTask,
  type BramblewoodBook,
  type BramblewoodCharacter,
} from '../../data/bramblewoodData';
import type { BramblewoodSpreadItem } from '../../data/bramblewoodSpreads';

interface AgentCompanyTabProps {
  canEdit: boolean;
  constitutionActive: boolean;
  books: BramblewoodBook[];
  spreadsByBook: Record<number, BramblewoodSpreadItem[]>;
  characters: BramblewoodCharacter[];
  tasks: BramblewoodAgentTask[];
  onSaveTasks: (next: BramblewoodAgentTask[]) => Promise<void>;
  onOpenSpread: (bookNum: number) => void;
}

const STATUS_BADGES: Record<AgentTaskStatus, string> = {
  Queued: 'bg-slate-100 text-slate-800 border-slate-300',
  'In Progress': 'bg-sky-100 text-sky-900 border-sky-300',
  'Needs Approval': 'bg-amber-100 text-amber-950 border-amber-400',
  Approved: 'bg-emerald-100 text-emerald-900 border-emerald-400',
};

export function AgentCompanyTab({
  canEdit,
  constitutionActive,
  books,
  spreadsByBook,
  characters,
  tasks,
  onSaveTasks,
  onOpenSpread,
}: AgentCompanyTabProps) {
  const [statusFilter, setStatusFilter] = useState<'all' | AgentTaskStatus>('all');
  const [agentFilter, setAgentFilter] = useState<string>('all');
  const [showNewForm, setShowNewForm] = useState(false);
  const [newAgentId, setNewAgentId] = useState(BRAMBLEWOOD_AGENTS[0].id);
  const [newTitle, setNewTitle] = useState('');
  const [newBookNum, setNewBookNum] = useState<number>(1);
  const [newPriority, setNewPriority] = useState<'High' | 'Normal' | 'Low'>('Normal');
  const [newBrief, setNewBrief] = useState('');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  function flash(msg: string) {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 2200);
  }

  const redoSpreads = useMemo(() => {
    const out: Array<BramblewoodSpreadItem & { bookTitle: string }> = [];
    for (const b of books) {
      const list = spreadsByBook[b.num] || [];
      for (const s of list) {
        if (s.needsComfyRedo) out.push({ ...s, bookTitle: b.title });
      }
    }
    return out;
  }, [books, spreadsByBook]);

  const filteredTasks = useMemo(() => {
    return tasks.filter((t) => {
      if (statusFilter !== 'all' && t.status !== statusFilter) return false;
      if (agentFilter !== 'all' && t.agentId !== agentFilter) return false;
      return true;
    });
  }, [tasks, statusFilter, agentFilter]);

  async function updateTask(id: string, patch: Partial<BramblewoodAgentTask>) {
    if (!canEdit) return;
    const today = new Date().toISOString().slice(0, 10);
    await onSaveTasks(tasks.map((t) => (t.id === id ? { ...t, ...patch, updatedAt: today } : t)));
  }

  async function deleteTask(id: string) {
    if (!canEdit) return;
    await onSaveTasks(tasks.filter((t) => t.id !== id));
    flash('Task removed');
  }

  function buildCopyableBrief(task: BramblewoodAgentTask): string {
    const ag = BRAMBLEWOOD_AGENTS.find((a) => a.id === task.agentId);
    const bk = task.bookNum ? books.find((b) => b.num === task.bookNum) : null;
    const charSpec = task.bookNum ? characters.find((c) => c.bookNum === task.bookNum) : null;
    const targetSpread =
      task.bookNum && task.spreadId
        ? (spreadsByBook[task.bookNum] || []).find((s) => s.id === task.spreadId)
        : null;

    const lines = [
      `ACT AS: ${ag?.name || task.agentId} (${ag?.title || 'Bramblewood Publishing Agent'})`,
      `MANDATE: ${ag?.mandate || 'Strict Article VII child-safe publishing standards.'}`,
      `TASK: ${task.title}`,
      bk ? `BOOK: #${bk.num} — ${bk.title}` : '',
      charSpec
        ? `CHARACTER BIBLE (${charSpec.name}): ${charSpec.role} | Palette: ${charSpec.palette} | Props: ${charSpec.outfitProps} | Consistency: ${charSpec.consistencyRules}`
        : '',
      targetSpread
        ? `SPREAD ${targetSpread.item} (p.${targetSpread.pages}): English="${targetSpread.englishText}" | Spanish="${targetSpread.spanishText}" | Notes="${targetSpread.notes}"`
        : '',
      `BRIEF: ${task.brief}`,
      task.agentId === 'art-director'
        ? 'HARDWARE RULE (Article V): Use local RTX 5090 ComfyUI (comfyui-local) first; check VramFreeGiB before running.'
        : '',
      task.agentId === 'storefront-strategist'
        ? 'GOVERNANCE RULE: Draft assets & listings only; do NOT create external accounts or spend money without Chancellor ! Permit.'
        : '',
    ];
    return lines.filter(Boolean).join('\n');
  }

  return (
    <div className="space-y-4">
      {/* Org Chart Header & 6 Specialized Agents */}
      <div className="parchment-panel p-4 rounded-2xl space-y-3">
        {!constitutionActive && (
          <div className="p-3.5 rounded-2xl bg-slate-900 text-amber-100 border-2 border-amber-400 space-y-1 text-xs">
            <div className="font-atlas font-bold text-sm text-amber-300">
              ⏸️ Agents Offline — Pending Campus Constitution
            </div>
            <p className="leading-relaxed">
              Per Chancellor Amarette’s directive, all 6 Bramblewood publishing agents are{' '}
              <strong>OFFLINE / STANDBY</strong> — zero background jobs, zero ComfyUI runs, and
              zero external actions are active. Agents will remain locked until the full{' '}
              <strong>Campus Constitution</strong> passes <strong>Gate 1 (Antigravity Audit)</strong>{' '}
              and <strong>Gate 2 (Chancellor Ratification)</strong> in <strong>Town Hall</strong>.
            </p>
          </div>
        )}

        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h2 className="font-atlas text-base sm:text-lg font-bold text-[#2e1e0f]">
              🤖 The Bramblewood Publishing Company (6 Specialist Agents)
            </h2>
            <p className="text-xs text-[#6e4d28]">
              {constitutionActive
                ? 'Assign spreads, track deliverables awaiting your approval, or copy any brief straight to run with your bramblewood-publishing-co agent skill or local Agent Zero.'
                : 'Roster & pre-launch planning backlog only — execution, brief dispatch, and live agent runs are paused until Campus Constitution ratification.'}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {toastMsg && (
              <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold">
                {toastMsg}
              </span>
            )}
            {canEdit && constitutionActive && (
              <button
                onClick={() => setShowNewForm((v) => !v)}
                className="px-3 py-1.5 rounded-xl bg-[#831843] text-white text-xs font-bold cursor-pointer"
              >
                ＋ Dispatch Agent Task
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 text-xs">
          {BRAMBLEWOOD_AGENTS.map((ag) => {
            const openCount = tasks.filter((t) => t.agentId === ag.id && t.status !== 'Approved').length;
            const approvalCount = tasks.filter((t) => t.agentId === ag.id && t.status === 'Needs Approval').length;
            return (
              <div
                key={ag.id}
                className="p-3 rounded-2xl bg-white/95 border border-[#cfa96e] space-y-1.5 flex flex-col justify-between"
              >
                <div className="space-y-1">
                  <div className="flex items-start justify-between gap-2">
                    <div className="font-bold text-sm text-[#2e1e0f]">
                      {ag.emoji} {ag.name}
                    </div>
                    <div className="flex gap-1 shrink-0">
                      {!constitutionActive ? (
                        <span className="px-2 py-0.5 rounded-full bg-slate-200 text-slate-800 text-[10px] font-bold">
                          ⏸️ Offline
                        </span>
                      ) : (
                        <>
                          {approvalCount > 0 && (
                            <span className="px-1.5 py-0.5 rounded-full bg-amber-200 text-amber-950 text-[10px] font-bold">
                              {approvalCount} review
                            </span>
                          )}
                          <span className="px-1.5 py-0.5 rounded-full bg-[#fdf2f8] text-[#831843] text-[10px] font-bold">
                            {openCount} open
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="text-[11px] font-bold" style={{ color: ag.accent }}>
                    {ag.title}
                  </div>
                  <p className="text-[11px] text-[#4b5563] leading-snug">{ag.mandate}</p>
                </div>
                <div className="flex gap-1.5 pt-1">
                  <button
                    onClick={() => setAgentFilter(agentFilter === ag.id ? 'all' : ag.id)}
                    className={`px-2 py-1 rounded-lg font-bold text-[10px] border cursor-pointer ${
                      agentFilter === ag.id ? 'bg-[#2e1e0f] text-white border-[#2e1e0f]' : 'bg-[#fdf7ea] border-[#cfa96e]'
                    }`}
                  >
                    {agentFilter === ag.id ? 'Show All Agents' : 'Filter Backlog'}
                  </button>
                  {canEdit && constitutionActive && (
                    <button
                      onClick={() => {
                        setNewAgentId(ag.id);
                        setShowNewForm(true);
                      }}
                      className="px-2 py-1 rounded-lg bg-[#fdf2f8] border border-[#f472b6] text-[#831843] font-bold text-[10px] cursor-pointer"
                    >
                      ＋ Assign
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* New Task Form */}
        {showNewForm && canEdit && constitutionActive && (
          <div className="p-3 rounded-2xl bg-white border-2 border-[#f472b6] space-y-2 text-xs">
            <div className="font-bold text-[#831843]">Assign New Publishing Agent Task</div>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
              <select
                value={newAgentId}
                onChange={(e) => setNewAgentId(e.target.value)}
                className="px-2.5 py-1.5 rounded-lg border border-[#cfa96e]"
              >
                {BRAMBLEWOOD_AGENTS.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.emoji} {a.name}
                  </option>
                ))}
              </select>
              <select
                value={newBookNum}
                onChange={(e) => setNewBookNum(Number(e.target.value))}
                className="px-2.5 py-1.5 rounded-lg border border-[#cfa96e]"
              >
                <option value={0}>Whole Series / Printables</option>
                {books.map((b) => (
                  <option key={b.num} value={b.num}>
                    Book {b.num}: {b.title}
                  </option>
                ))}
              </select>
              <select
                value={newPriority}
                onChange={(e) => setNewPriority(e.target.value as 'High' | 'Normal' | 'Low')}
                className="px-2.5 py-1.5 rounded-lg border border-[#cfa96e]"
              >
                <option value="High">High Priority</option>
                <option value="Normal">Normal</option>
                <option value="Low">Low</option>
              </select>
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="Task title"
                className="px-2.5 py-1.5 rounded-lg border border-[#cfa96e]"
              />
            </div>
            <textarea
              rows={2}
              value={newBrief}
              onChange={(e) => setNewBrief(e.target.value)}
              placeholder="Specific instructions, spreads, or Character Bible focus..."
              className="w-full px-2.5 py-1.5 rounded-lg border border-[#cfa96e]"
            />
            <div className="flex gap-2">
              <button
                onClick={async () => {
                  if (!newTitle.trim()) return;
                  const today = new Date().toISOString().slice(0, 10);
                  const created: BramblewoodAgentTask = {
                    id: `task-${Date.now().toString(36)}`,
                    agentId: newAgentId,
                    title: newTitle.trim(),
                    bookNum: newBookNum || undefined,
                    priority: newPriority,
                    status: 'Queued',
                    brief: newBrief.trim(),
                    deliverable: '',
                    createdAt: today,
                    updatedAt: today,
                  };
                  await onSaveTasks([created, ...tasks]);
                  setNewTitle('');
                  setNewBrief('');
                  setShowNewForm(false);
                  flash('Agent task queued ✔');
                }}
                className="px-3 py-1.5 rounded-lg bg-[#831843] text-white font-bold cursor-pointer"
              >
                Queue Task
              </button>
              <button
                onClick={() => setShowNewForm(false)}
                className="px-3 py-1.5 rounded-lg bg-[#fdf7ea] border border-[#cfa96e] cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Live Approval & Task Queue */}
      <div className="parchment-panel p-4 rounded-2xl space-y-3 text-xs">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="font-atlas font-bold text-sm text-[#2e1e0f]">
            {constitutionActive
              ? `📥 Live Agent Work Queue & Amarette Approval Gate (${filteredTasks.length})`
              : `📝 Pre-Launch Draft Backlog (Paused — Agents Offline · ${filteredTasks.length})`}
          </div>
          <div className="flex flex-wrap gap-1.5">
            {(['all', 'Needs Approval', 'Queued', 'In Progress', 'Approved'] as const).map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-2.5 py-1 rounded-full font-bold border cursor-pointer ${
                  statusFilter === st
                    ? 'bg-[#2e1e0f] text-white border-[#2e1e0f]'
                    : 'bg-white text-[#2e1e0f] border-[#cfa96e]'
                }`}
              >
                {st === 'all' ? 'All' : st}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2.5">
          {filteredTasks.map((t) => {
            const ag = BRAMBLEWOOD_AGENTS.find((a) => a.id === t.agentId);
            return (
              <div key={t.id} className="p-3 rounded-2xl bg-white border border-[#cfa96e] space-y-2">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div className="space-y-0.5 min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="font-bold text-sm text-[#2e1e0f]">{t.title}</span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                          constitutionActive
                            ? STATUS_BADGES[t.status]
                            : 'bg-slate-100 text-slate-700 border-slate-300'
                        }`}
                      >
                        {constitutionActive ? t.status : 'Paused · Offline'}
                      </span>
                      <span className="px-1.5 py-0.5 rounded bg-black/5 text-[10px] font-bold">
                        {t.priority}
                      </span>
                    </div>
                    <div className="text-[11px] font-semibold text-[#6e4d28]">
                      {ag?.emoji} {ag?.name} ({ag?.title}) · Updated {t.updatedAt}
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1 shrink-0">
                    {constitutionActive && (
                      <button
                        onClick={() => {
                          void navigator.clipboard?.writeText(buildCopyableBrief(t));
                          flash('Agent brief + Character Bible copied ✔');
                        }}
                        className="ribbon-btn px-2 py-1 rounded-lg font-bold cursor-pointer"
                        title="Copy full prompt bundle to run in Antigravity or Agent Zero"
                      >
                        📋 Copy Brief
                      </button>
                    )}
                    {t.bookNum && (
                      <button
                        onClick={() => onOpenSpread(t.bookNum!)}
                        className="px-2 py-1 rounded-lg bg-[#fdf2f8] border border-[#f472b6] text-[#831843] font-bold cursor-pointer"
                      >
                        Open Book #{t.bookNum}
                      </button>
                    )}
                    {canEdit && constitutionActive && (
                      <button
                        onClick={() => void deleteTask(t.id)}
                        className="px-2 py-1 rounded-lg bg-red-50 text-red-700 font-bold cursor-pointer"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                </div>

                {t.brief && <p className="text-[#374151] leading-relaxed">{t.brief}</p>}

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-[#6e4d28] block">
                    Agent Output / Deliverable Note:
                  </label>
                  <textarea
                    rows={2}
                    disabled={!canEdit || !constitutionActive}
                    value={t.deliverable}
                    onChange={(e) => void updateTask(t.id, { deliverable: e.target.value })}
                    placeholder={
                      constitutionActive
                        ? 'Paste draft text, Spanish lines, QA findings, or ComfyUI seed info here...'
                        : 'Locked until Campus Constitution is ratified in Town Hall.'
                    }
                    className="w-full px-2.5 py-1.5 rounded-lg border border-[#cfa96e] bg-[#fdfaf2] disabled:opacity-70"
                  />
                </div>

                {canEdit && constitutionActive && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {(['Queued', 'In Progress', 'Needs Approval', 'Approved'] as const).map((st) => (
                      <button
                        key={st}
                        onClick={() => void updateTask(t.id, { status: st })}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border cursor-pointer ${
                          t.status === st
                            ? 'bg-[#2e1e0f] text-white border-[#2e1e0f]'
                            : 'bg-white text-[#2e1e0f] border-[#cfa96e]'
                        }`}
                      >
                        {st === 'Approved' ? '✔ Approve' : st}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Cross-Book ComfyUI Redo Feed */}
      <div className="parchment-panel p-4 rounded-2xl space-y-2 text-xs">
        <div className="font-bold text-sm text-[#2e1e0f]">
          🎨 Global ComfyUI Art Redo Queue ({redoSpreads.length} spreads flagged across series)
        </div>
        <div className="max-h-56 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 gap-2">
          {redoSpreads.slice(0, 20).map((sp) => (
            <div
              key={sp.id}
              className="p-2 rounded-xl bg-white border border-amber-300 flex items-center justify-between gap-2"
            >
              <div className="min-w-0">
                <div className="font-bold text-[#2e1e0f] truncate">
                  Book {sp.bookNum}: {sp.bookTitle} · {sp.item}
                </div>
                <div className="text-[10px] text-[#6e4d28] truncate">
                  {sp.englishText || 'Needs local RTX 5090 ComfyUI illustration'}
                </div>
              </div>
              <button
                onClick={() => onOpenSpread(sp.bookNum)}
                className="px-2 py-1 rounded bg-amber-100 text-amber-950 font-bold text-[10px] shrink-0 cursor-pointer"
              >
                Inspect →
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
