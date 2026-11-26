import { useMemo, useRef, useState } from 'react';
import { checkQuestAnswer } from '../../data/questChecker';
import { SCIENCE_UNITS } from '../../data/schoolContent';
import type { FamilyPersonProfile } from '../../services/familyHubService';
import type {
  AssessmentResultEntry,
  GabeConfigDoc,
  ParentGradeEntry,
  QuestResultEntry,
} from '../../services/questsService';

interface FamilyQuestsTabProps {
  activePerson: FamilyPersonProfile;
  isParentActor: boolean;
  canEdit: boolean;
  viewAs: string;
  readOnly: boolean;
  gabeConfig: GabeConfigDoc;
  gabeResults: QuestResultEntry[];
  gabeAssessment: AssessmentResultEntry[];
  parentGrades: Record<string, ParentGradeEntry>;
  onSaveConfig: (cfg: GabeConfigDoc) => Promise<void>;
  onAppendResult: (entry: Omit<QuestResultEntry, 'id'>) => Promise<void>;
  onAppendAssessment: (entry: Omit<AssessmentResultEntry, 'id'>) => Promise<void>;
  onSaveParentGrades: (grades: Record<string, ParentGradeEntry>) => Promise<void>;
}

interface OpenQuestModal {
  title: string;
  url: string;
  kind: 'science' | 'assessment';
  preview: boolean;
}

const SUBJECT_NAMES: Record<AssessmentResultEntry['subject'], string> = {
  math: '🎲 Math',
  rla: '📜 Reading & Writing',
  sci: '⚗️ Science',
  ss: '🏛️ Social Studies',
};

export function FamilyQuestsTab({
  activePerson,
  isParentActor,
  canEdit,
  viewAs,
  readOnly,
  gabeConfig,
  gabeResults,
  gabeAssessment,
  parentGrades,
  onSaveConfig,
  onAppendResult,
  onAppendAssessment,
  onSaveParentGrades,
}: FamilyQuestsTabProps) {
  const isParentView = isParentActor && activePerson.mode === 'parent' && !viewAs && !readOnly;
  const isGabeActive = activePerson.name === 'Gabe';

  const [openQuest, setOpenQuest] = useState<OpenQuestModal | null>(null);
  const [gradeFilter, setGradeFilter] = useState<string>('all');
  const [gradeDrafts, setGradeDrafts] = useState<Record<string, ParentGradeEntry>>({});
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  // Serialize iframe saves so concurrent Promise.all field checks append cleanly in order
  const writeQueueRef = useRef<Promise<void>>(Promise.resolve());

  function flash(msg: string) {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 2200);
  }

  function enqueueWrite(fn: () => Promise<void>) {
    const next = writeQueueRef.current.then(fn).catch(() => undefined);
    writeQueueRef.current = next;
    return next;
  }

  function attachIframeBridge() {
    const win = iframeRef.current?.contentWindow as (Window & Record<string, unknown>) | null;
    if (!win || !openQuest) return;

    const preview = openQuest.preview || !canEdit || !isGabeActive;
    win.QUEST_PREVIEW = preview;
    win.QUEST_HOST = {
      person: () => activePerson.name,
      leave: () => setOpenQuest(null),
      preview,
    };

    const makeRunner = (
      onOk?: (res: unknown) => void,
      onErr?: (err: Error) => void
    ): Record<string, unknown> => ({
      withSuccessHandler: (cb: (res: unknown) => void) => makeRunner(cb, onErr),
      withFailureHandler: (cb: (err: Error) => void) => makeRunner(onOk, cb),
      saveQuestAnswer: (rec: {
        questId: string;
        problemId: string;
        field: string;
        answer: string;
        date?: string;
        person?: string;
      }) => {
        try {
          const chk = checkQuestAnswer(rec.questId, rec.problemId, rec.field, rec.answer);
          const matchStatus: QuestResultEntry['match'] =
            rec.field === 'question'
              ? 'question'
              : rec.field === 'pinned'
                ? 'set aside'
                : chk.matched === true
                  ? 'yes'
                  : chk.matched === false
                    ? 'not yet'
                    : 'not checked';

          const reply = {
            matched: chk.matched === true,
            checked: chk.matched !== '',
            logged: chk.matched === '',
            step: chk.step,
            msg: chk.msg,
            preview,
            readonly: preview,
          };

          if (!preview) {
            void enqueueWrite(() =>
              onAppendResult({
                questId: rec.questId,
                problemId: rec.problemId,
                field: rec.field,
                answer: String(rec.answer || '').slice(0, 400),
                match: matchStatus,
                date: rec.date || new Date().toISOString().slice(0, 10),
              })
            );
          }
          onOk?.(reply);
        } catch (err: unknown) {
          onErr?.(err instanceof Error ? err : new Error('Could not check answer.'));
        }
      },
      saveAssessmentResult: (rec: {
        date?: string;
        subject: 'math' | 'rla' | 'sci' | 'ss';
        itemId: string;
        code: string;
        area: string;
        dok: string | number;
        calculator: boolean;
        level: number;
        answer: string;
        matches: boolean | null;
        parentScored?: boolean;
      }) => {
        try {
          if (!preview) {
            void enqueueWrite(() =>
              onAppendAssessment({
                ts: new Date().toISOString(),
                date: rec.date || new Date().toISOString().slice(0, 10),
                subject: rec.subject,
                itemId: rec.itemId,
                code: rec.code || '',
                area: rec.area || '',
                dok: rec.dok ?? '',
                calculator: Boolean(rec.calculator),
                level: Number(rec.level) || 1,
                answer: String(rec.answer || '').slice(0, 1200),
                matches: rec.matches ?? null,
                parentScored: Boolean(rec.parentScored),
                preview: false,
              })
            );
          }
          onOk?.({ saved: !preview, preview });
        } catch (err: unknown) {
          onErr?.(err instanceof Error ? err : new Error('Could not save assessment.'));
        }
      },
    });

    win.google = {
      script: {
        run: makeRunner(),
      },
    };

    if (openQuest.kind === 'science' && typeof win.flushPending === 'function') {
      try {
        (win.flushPending as () => void)();
      } catch {
        // ignore
      }
    }
  }

  // Parent assessment breakdown (only computed cleanly from gabeAssessment)
  const assessSummary = useMemo(() => {
    const bySubj: Record<
      AssessmentResultEntry['subject'],
      { total: number; matched: number; areas: Record<string, { n: number; m: number }> }
    > = {
      math: { total: 0, matched: 0, areas: {} },
      rla: { total: 0, matched: 0, areas: {} },
      sci: { total: 0, matched: 0, areas: {} },
      ss: { total: 0, matched: 0, areas: {} },
    };
    let latestRer: AssessmentResultEntry | null = null;
    for (const row of gabeAssessment) {
      if (row.preview) continue;
      if (row.itemId === 'RER') {
        latestRer = row;
        continue;
      }
      const b = bySubj[row.subject];
      if (!b) continue;
      b.total += 1;
      if (row.matches) b.matched += 1;
      const areaName = row.area || 'General';
      if (!b.areas[areaName]) b.areas[areaName] = { n: 0, m: 0 };
      b.areas[areaName].n += 1;
      if (row.matches) b.areas[areaName].m += 1;
    }
    return { bySubj, latestRer };
  }, [gabeAssessment]);

  const activeUnit = SCIENCE_UNITS.find((u) => u.id === gabeConfig.activeScienceUnitId) || null;

  // Filtered quest results for Parent grading
  const visibleResults = useMemo(() => {
    return [...gabeResults]
      .reverse()
      .filter((r) => (gradeFilter === 'all' ? true : r.questId === gradeFilter));
  }, [gabeResults, gradeFilter]);

  function getEffectiveGrade(key: string): ParentGradeEntry {
    return gradeDrafts[key] || parentGrades[key] || { grade: '', notes: '' };
  }

  async function saveSingleGrade(key: string) {
    if (!isParentView) return;
    const entry = getEffectiveGrade(key);
    await onSaveParentGrades({
      ...parentGrades,
      [key]: entry,
    });
    flash('Private grade saved ✔');
  }

  // Fullscreen iframe player
  const questModal = openQuest && (
    <div className="fixed inset-0 z-[85] bg-slate-950 flex flex-col">
      <div className="px-4 py-2 bg-[#1f2937] text-white border-b border-slate-700 flex flex-wrap items-center justify-between gap-2 shrink-0">
        <div className="flex items-center gap-2 min-w-0">
          <span className="font-bold text-sm truncate">{openQuest.title}</span>
          {openQuest.preview && (
            <span className="px-2 py-0.5 rounded-full bg-amber-300 text-amber-950 text-[10px] font-bold shrink-0">
              Preview Mode · Nothing Saved
            </span>
          )}
        </div>
        <button
          onClick={() => setOpenQuest(null)}
          className="px-3 py-1 rounded-lg bg-white text-slate-900 font-bold text-xs cursor-pointer shrink-0"
        >
          ✕ Save &amp; Return to Hub
        </button>
      </div>
      <iframe
        ref={iframeRef}
        src={openQuest.url}
        onLoad={attachIframeBridge}
        title={openQuest.title}
        className="flex-1 w-full border-0 bg-[#1d2326]"
      />
    </div>
  );

  // Guard non-Gabe kids / non-parent viewers
  if (!isGabeActive && !isParentView) {
    return (
      <div className="p-5 rounded-2xl bg-white border border-[#95d5b2] text-center text-xs text-[#40916c]">
        Quests are reserved for Gabe &amp; parents.
      </div>
    );
  }

  // GABE VIEW (Calm, zero clutter — only approved Pre-Assessment and/or the 1 approved Science unit)
  if (!isParentView) {
    const anythingOpen = gabeConfig.assessmentEnabled || Boolean(activeUnit);
    return (
      <div className="space-y-4">
        <div className="p-5 rounded-3xl bg-[#1f2937] text-white border border-slate-600 space-y-2">
          <h2 className="font-atlas text-xl font-bold">📜 Gabe’s Quests</h2>
          <p className="text-xs text-slate-300">
            No timer. Stop whenever you need a break — your place stays right where you left it.
          </p>
        </div>

        {!anythingOpen && (
          <div className="p-6 rounded-2xl bg-white border border-[#95d5b2] text-center space-y-1.5">
            <div className="text-3xl">🐉</div>
            <div className="font-bold text-sm text-[#1b4332]">No quests open right now.</div>
            <p className="text-xs text-[#40916c]">
              Rest up! Amarette or Dad will open your next chamber or science quest when it is ready.
            </p>
          </div>
        )}

        {gabeConfig.assessmentEnabled && (
          <div className="p-5 rounded-2xl bg-white border-2 border-[#64748b] space-y-3">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="font-atlas text-lg font-bold text-[#1e293b]">
                  🗝️ The Vault of Chambers
                </h3>
                <p className="text-xs text-[#475569]">
                  Orrin’s calm survey across Math, Reading &amp; Writing, Science, and Social Studies. Not a test you pass or fail.
                </p>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 text-[10px] font-bold shrink-0">
                Open Now
              </span>
            </div>
            <button
              onClick={() =>
                setOpenQuest({
                  title: '🗝️ The Vault of Chambers',
                  url: '/quests/Assessment.html',
                  kind: 'assessment',
                  preview: viewAs === 'Gabe' || readOnly || !canEdit,
                })
              }
              className="px-5 py-2.5 rounded-xl bg-[#2c6b67] hover:bg-[#1f514e] text-white text-xs font-bold cursor-pointer shadow-sm"
            >
              Open The Vault of Chambers →
            </button>
          </div>
        )}

        {activeUnit && (
          <div className="p-5 rounded-2xl bg-white border-2 border-[#52b788] space-y-3">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="font-atlas text-lg font-bold text-[#1b4332]">
                  {activeUnit.icon} {activeUnit.gabeTitle}
                </h3>
                <p className="text-xs text-[#40916c]">The Science Path · Work at your own pace.</p>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 text-[10px] font-bold shrink-0">
                Open Now
              </span>
            </div>
            <button
              onClick={() =>
                setOpenQuest({
                  title: `${activeUnit.icon} ${activeUnit.gabeTitle}`,
                  url: activeUnit.file,
                  kind: 'science',
                  preview: viewAs === 'Gabe' || readOnly || !canEdit,
                })
              }
              className="px-5 py-2.5 rounded-xl bg-[#2d6a4f] hover:bg-[#1b4332] text-white text-xs font-bold cursor-pointer shadow-sm"
            >
              Open Science Quest →
            </button>
          </div>
        )}

        {questModal}
      </div>
    );
  }

  // PARENT VIEW (Amarette & Ray only — strictly hidden from Gabe)
  return (
    <div className="space-y-4">
      <div className="p-4 rounded-2xl bg-white border border-[#95d5b2] flex flex-wrap items-center justify-between gap-2">
        <div>
          <h2 className="font-atlas text-lg font-bold text-[#1b4332]">
            📜 Gabe’s Quests · Parent Control &amp; Private Grading
          </h2>
          <p className="text-xs text-[#40916c]">
            Preview drafts before Gabe sees them, publish one unit at a time, and keep private grading in Parent Vault.
          </p>
        </div>
        {toastMsg && (
          <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold">
            {toastMsg}
          </span>
        )}
      </div>

      {/* 1. Vault of Chambers (Pre-Assessment) Approve/Hide & Results Summary */}
      <div className="p-4 rounded-2xl bg-white border border-[#95d5b2] space-y-3 text-xs">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <div className="font-bold text-sm text-[#1b4332]">
              🗝️ Pre-Assessment: The Vault of Chambers
            </div>
            <div className="text-[11px] text-[#40916c]">
              Adaptive GED readiness survey (Math, RLA, Science, Social Studies)
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-1.5">
            <span
              className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                gabeConfig.assessmentEnabled
                  ? 'bg-emerald-100 text-emerald-900'
                  : 'bg-slate-100 text-slate-700'
              }`}
            >
              {gabeConfig.assessmentEnabled ? '✅ Live for Gabe' : 'Draft / Hidden'}
            </span>
            <button
              onClick={() =>
                setOpenQuest({
                  title: '🗝️ Preview: The Vault of Chambers',
                  url: '/quests/Assessment.html',
                  kind: 'assessment',
                  preview: true,
                })
              }
              className="px-2.5 py-1 rounded-lg bg-[#edf6f0] border border-[#95d5b2] font-bold cursor-pointer"
            >
              👀 Preview
            </button>
            <button
              onClick={async () => {
                await onSaveConfig({
                  ...gabeConfig,
                  assessmentEnabled: !gabeConfig.assessmentEnabled,
                });
                flash(
                  !gabeConfig.assessmentEnabled
                    ? 'Pre-Assessment approved & live for Gabe ✔'
                    : 'Pre-Assessment hidden (Draft) ✔'
                );
              }}
              className={`px-2.5 py-1 rounded-lg font-bold cursor-pointer ${
                gabeConfig.assessmentEnabled
                  ? 'bg-amber-100 text-amber-900 border border-amber-300'
                  : 'bg-[#2d6a4f] text-white'
              }`}
            >
              {gabeConfig.assessmentEnabled ? 'Hide (Draft)' : 'Approve for Gabe'}
            </button>
          </div>
        </div>

        {/* Live Assessment Summary */}
        {gabeAssessment.length > 0 ? (
          <div className="space-y-2 pt-2 border-t border-[#dcefe2]">
            <div className="flex items-center justify-between">
              <strong className="text-[#1b4332]">Live Survey Summary ({gabeAssessment.length} saved items)</strong>
              <button
                onClick={() => {
                  const lines = (['math', 'rla', 'sci', 'ss'] as const).map((s) => {
                    const b = assessSummary.bySubj[s];
                    const areaTxt = Object.entries(b.areas)
                      .map(([k, v]) => {
                        const pct = v.n ? v.m / v.n : 0;
                        const status = pct >= 0.75 ? 'Secure' : pct >= 0.4 ? 'Developing' : 'Revisit';
                        return `${k}: ${status} (${v.m}/${v.n})`;
                      })
                      .join('; ');
                    return `${SUBJECT_NAMES[s]}: ${b.matched}/${b.total} matched | ${areaTxt || 'No items yet'}`;
                  });
                  void navigator.clipboard?.writeText(lines.join('\n'));
                  flash('Summary copied ✔');
                }}
                className="px-2.5 py-1 rounded bg-[#f4fbf6] border border-[#95d5b2] text-[11px] font-bold cursor-pointer"
              >
                📋 Copy Summary
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {(['math', 'rla', 'sci', 'ss'] as const).map((s) => {
                const b = assessSummary.bySubj[s];
                return (
                  <div key={s} className="p-2.5 rounded-xl bg-[#f4fbf6] border border-[#dcefe2] space-y-1">
                    <div className="font-bold text-[#1b4332]">
                      {SUBJECT_NAMES[s]} · {b.matched}/{b.total} matched
                    </div>
                    {Object.entries(b.areas).map(([areaName, st]) => {
                      const ratio = st.n ? st.m / st.n : 0;
                      const status = ratio >= 0.75 ? 'Secure' : ratio >= 0.4 ? 'Developing' : 'Revisit';
                      const cls =
                        status === 'Secure'
                          ? 'text-emerald-800'
                          : status === 'Developing'
                            ? 'text-amber-800'
                            : 'text-rose-800';
                      return (
                        <div key={areaName} className="flex justify-between gap-2 text-[11px]">
                          <span>{areaName}</span>
                          <span className={`font-bold ${cls}`}>
                            {status} ({st.m}/{st.n})
                          </span>
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
            {assessSummary.latestRer && (
              <div className="p-2.5 rounded-xl bg-[#fef9c3] border border-[#fde047] space-y-1">
                <div className="font-bold text-[#78350f]">
                  ✍️ RLA Extended Response ({assessSummary.latestRer.date})
                </div>
                <p className="whitespace-pre-line text-[#1f2937]">{assessSummary.latestRer.answer}</p>
              </div>
            )}
          </div>
        ) : (
          <div className="text-[11px] text-[#52796f]">No survey responses logged yet.</div>
        )}
      </div>

      {/* 2. Science Lessons (Units 1–5 + Mixed) Draft / Approve Gate */}
      <div className="p-4 rounded-2xl bg-white border border-[#95d5b2] space-y-2.5 text-xs">
        <div>
          <div className="font-bold text-sm text-[#1b4332]">🔬 The Science Path (Units 1–5 + Mixed)</div>
          <p className="text-[11px] text-[#40916c]">
            All 6 units stay in Draft until you approve one. Only the active unit appears for Gabe.
          </p>
        </div>
        <div className="space-y-2">
          {SCIENCE_UNITS.map((u) => {
            const isLive = gabeConfig.activeScienceUnitId === u.id;
            return (
              <div
                key={u.id}
                className={`p-3 rounded-xl border flex flex-wrap items-center justify-between gap-2 ${
                  isLive ? 'bg-[#e9f5ec] border-[#2d6a4f]' : 'bg-[#f4fbf6] border-[#dcefe2]'
                }`}
              >
                <div className="min-w-0">
                  <div className="font-bold text-[#1b4332]">
                    {u.icon} {u.title}
                  </div>
                  <div className="text-[10px] text-[#40916c]">
                    {isLive ? '✅ Approved & Live for Gabe' : 'Draft — hidden from Gabe'}
                  </div>
                </div>
                <div className="flex flex-wrap gap-1.5 shrink-0">
                  <button
                    onClick={() =>
                      setOpenQuest({
                        title: `👀 Preview: ${u.title}`,
                        url: `${u.file}#preview`,
                        kind: 'science',
                        preview: true,
                      })
                    }
                    className="px-2.5 py-1 rounded-lg bg-white border border-[#95d5b2] font-bold cursor-pointer"
                  >
                    👀 Preview
                  </button>
                  <button
                    onClick={async () => {
                      await onSaveConfig({
                        ...gabeConfig,
                        activeScienceUnitId: isLive ? '' : u.id,
                      });
                      flash(isLive ? 'Unit set back to Draft ✔' : `${u.gabeTitle} approved for Gabe ✔`);
                    }}
                    className={`px-2.5 py-1 rounded-lg font-bold cursor-pointer ${
                      isLive
                        ? 'bg-amber-100 text-amber-900 border border-amber-300'
                        : 'bg-[#2d6a4f] text-white'
                    }`}
                  >
                    {isLive ? 'Hide (Draft)' : 'Approve for Gabe'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Private Parent-Only Grading & Answer Review */}
      <div className="p-4 rounded-2xl bg-white border border-[#95d5b2] space-y-3 text-xs">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <div className="font-bold text-sm text-[#1b4332]">
              🔒 Private Parent Grading (Secure / Developing / Revisit)
            </div>
            <div className="text-[11px] text-[#40916c]">
              Stored in <code>home_and_garden_parents/gabe_grades</code> — invisible to Gabe &amp; kids.
            </div>
          </div>
          <select
            value={gradeFilter}
            onChange={(e) => setGradeFilter(e.target.value)}
            className="px-2.5 py-1 rounded-lg border border-[#95d5b2] bg-[#f4fbf6] text-xs"
          >
            <option value="all">All Logged Science Answers ({gabeResults.length})</option>
            {SCIENCE_UNITS.map((u) => (
              <option key={u.id} value={u.id}>
                {u.gabeTitle}
              </option>
            ))}
          </select>
        </div>

        {/* Unit-level grade strip */}
        <div className="space-y-2">
          {SCIENCE_UNITS.filter((u) => gradeFilter === 'all' || gradeFilter === u.id).map((u) => {
            const cur = getEffectiveGrade(u.id);
            return (
              <div key={u.id} className="p-2.5 rounded-xl bg-[#f4fbf6] border border-[#dcefe2] space-y-1.5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="font-bold text-[#1b4332]">
                    {u.icon} {u.gabeTitle}
                  </span>
                  <div className="flex gap-1">
                    {(['Secure', 'Developing', 'Revisit'] as const).map((tier) => (
                      <button
                        key={tier}
                        onClick={() =>
                          setGradeDrafts((prev) => ({
                            ...prev,
                            [u.id]: { ...cur, grade: cur.grade === tier ? '' : tier },
                          }))
                        }
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold cursor-pointer border ${
                          cur.grade === tier
                            ? tier === 'Secure'
                              ? 'bg-emerald-600 text-white border-emerald-700'
                              : tier === 'Developing'
                                ? 'bg-amber-500 text-white border-amber-600'
                                : 'bg-rose-600 text-white border-rose-700'
                            : 'bg-white text-[#1b4332] border-[#b7d8c2]'
                        }`}
                      >
                        {tier}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={cur.notes}
                    onChange={(e) =>
                      setGradeDrafts((prev) => ({
                        ...prev,
                        [u.id]: { ...cur, notes: e.target.value },
                      }))
                    }
                    placeholder="Private parent teaching note (e.g., review variable swaps tomorrow)..."
                    className="flex-1 px-2.5 py-1 rounded border border-[#95d5b2] bg-white"
                  />
                  <button
                    onClick={() => void saveSingleGrade(u.id)}
                    className="px-2.5 py-1 rounded bg-[#2d6a4f] text-white font-bold cursor-pointer"
                  >
                    Save
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Gabe's Logged Answers */}
        <div className="space-y-1.5 max-h-80 overflow-y-auto pt-2 border-t border-[#dcefe2]">
          <div className="font-bold text-[#1b4332]">Logged Answers &amp; Questions</div>
          {!visibleResults.length ? (
            <p className="text-[#52796f]">No Science Path answers logged yet for this filter.</p>
          ) : (
            visibleResults.slice(0, 60).map((r) => (
              <div
                key={r.id}
                className="p-2 rounded-lg bg-[#fbfdfb] border border-[#e5efe8] flex flex-wrap items-center justify-between gap-2"
              >
                <div className="min-w-0">
                  <div className="font-bold text-[#1b4332]">
                    [{r.questId.replace(/^SCI-/, '')}] {r.problemId}.{r.field}{' '}
                    <span className="font-normal text-[#52796f]">({r.date})</span>
                  </div>
                  <div className="text-[#26382c] break-words">{r.answer}</div>
                </div>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold shrink-0 ${
                    r.match === 'yes'
                      ? 'bg-emerald-100 text-emerald-900'
                      : r.match === 'not yet'
                        ? 'bg-amber-100 text-amber-900'
                        : r.match === 'question'
                          ? 'bg-sky-100 text-sky-900'
                          : 'bg-slate-100 text-slate-800'
                  }`}
                >
                  {r.match}
                </span>
              </div>
            ))
          )}
        </div>
      </div>

      {questModal}
    </div>
  );
}
