import { useEffect, useState } from 'react';
import { BUILDINGS } from '../../data/campusData';
import type { CampusRole } from '../../firebase';
import {
  INITIAL_RD_DOC,
  saveRdWorkspace,
  subscribeRdWorkspace,
  type RdBenchmarkItem,
  type RdPrototypeItem,
  type RdSkillIdeaItem,
  type RdWorkspaceDoc,
} from '../../services/departmentWorkspacesService';

interface RdWorkshopInteriorProps {
  role: CampusRole;
  userEmail: string;
}

export function RdWorkshopInterior({ role, userEmail }: RdWorkshopInteriorProps) {
  const canEdit = role === 'chancellor' || role === 'university';
  const [tab, setTab] = useState<'prototypes' | 'benchmarks' | 'skills'>('prototypes');
  const [data, setData] = useState<RdWorkspaceDoc>(INITIAL_RD_DOC);
  const [syncErr, setSyncErr] = useState<string | null>(null);

  const [pName, setPName] = useState('');
  const [pDept, setPDept] = useState('rd');
  const [pNotes, setPNotes] = useState('');

  const [mName, setMName] = useState('');
  const [mHw, setMHw] = useState('RTX 5090 (32 GB VRAM)');
  const [mNotes, setMNotes] = useState('');

  const [skName, setSkName] = useState('');
  const [skPurp, setSkPurp] = useState('');

  useEffect(() => {
    return subscribeRdWorkspace(setData, (e) => setSyncErr(e.message));
  }, []);

  async function saveNext(next: RdWorkspaceDoc) {
    if (!canEdit) return;
    setData(next);
    await saveRdWorkspace(next, userEmail);
  }

  return (
    <div className="space-y-3 text-xs">
      <div className="p-3 rounded-xl bg-[#fff8e7] border border-[#b08647] flex flex-wrap items-center justify-between gap-2">
        <div className="text-[#54371b]">
          <strong>R&amp;D Workshop &amp; Skill Incubator:</strong> Sandbox for prototypes, local RTX
          5090 model benchmarks, and incubating Skills before Town Hall review.
        </div>
        <span className="px-2 py-0.5 rounded-full bg-slate-900 border border-amber-400 text-amber-200 text-[10px] font-bold">
          ⏸️ Roster Pending Your Definitions
        </span>
      </div>

      {syncErr && <div className="p-2 rounded bg-red-100 text-red-900">{syncErr}</div>}

      <div className="flex flex-wrap gap-1.5 border-b border-[#cfa96e] pb-2">
        <button
          onClick={() => setTab('prototypes')}
          className={`px-3 py-1.5 rounded-lg font-semibold cursor-pointer ${
            tab === 'prototypes' ? 'bg-[#362316] text-[#fbe8b5]' : 'bg-[#f4e4c1] text-[#4a2b0f]'
          }`}
        >
          🧪 Prototypes ({data.prototypes.length})
        </button>
        <button
          onClick={() => setTab('benchmarks')}
          className={`px-3 py-1.5 rounded-lg font-semibold cursor-pointer ${
            tab === 'benchmarks' ? 'bg-[#362316] text-[#fbe8b5]' : 'bg-[#f4e4c1] text-[#4a2b0f]'
          }`}
        >
          ⚡ Local GPU Benchmarks ({data.benchmarks.length})
        </button>
        <button
          onClick={() => setTab('skills')}
          className={`px-3 py-1.5 rounded-lg font-semibold cursor-pointer ${
            tab === 'skills' ? 'bg-[#362316] text-[#fbe8b5]' : 'bg-[#f4e4c1] text-[#4a2b0f]'
          }`}
        >
          📚 Skill Incubator ({data.skillIdeas.length})
        </button>
      </div>

      {tab === 'prototypes' && (
        <div className="space-y-2.5">
          {canEdit && (
            <div className="p-3 rounded-xl bg-[#f7ead0] border border-[#b08647] grid grid-cols-1 sm:grid-cols-3 gap-2">
              <input
                value={pName}
                onChange={(e) => setPName(e.target.value)}
                placeholder="Prototype name"
                className="px-2 py-1.5 rounded bg-white border border-[#b89259]"
              />
              <select
                value={pDept}
                onChange={(e) => setPDept(e.target.value)}
                className="px-2 py-1.5 rounded bg-white border border-[#b89259]"
              >
                {BUILDINGS.map((b) => (
                  <option key={b.id} value={b.id}>
                    Target: {b.name}
                  </option>
                ))}
              </select>
              <div className="flex gap-1.5">
                <input
                  value={pNotes}
                  onChange={(e) => setPNotes(e.target.value)}
                  placeholder="Scope / goal"
                  className="flex-1 px-2 py-1.5 rounded bg-white border border-[#b89259]"
                />
                <button
                  onClick={async () => {
                    if (!pName.trim()) return;
                    const row: RdPrototypeItem = {
                      id: `pr_${Date.now().toString(36)}`,
                      name: pName.trim(),
                      targetDept: pDept,
                      status: 'Sandbox Idea',
                      notes: pNotes.trim(),
                    };
                    await saveNext({ ...data, prototypes: [row, ...data.prototypes] });
                    setPName('');
                    setPNotes('');
                  }}
                  className="px-3 py-1.5 rounded bg-[#362316] text-[#fbe8b5] font-bold cursor-pointer"
                >
                  ＋
                </button>
              </div>
            </div>
          )}
          {data.prototypes.map((p) => (
            <div
              key={p.id}
              className="p-2.5 rounded-xl bg-white/85 border border-[#b89259] flex items-center justify-between gap-2"
            >
              <div>
                <span className="font-bold text-[#331d0b]">{p.name}</span>{' '}
                <span className="px-1.5 py-0.5 rounded bg-[#efe0bc] text-[10px]">{p.status}</span>
                {p.notes && <div className="text-[#54371b]">{p.notes}</div>}
              </div>
              {canEdit && (
                <button
                  onClick={() =>
                    void saveNext({
                      ...data,
                      prototypes: data.prototypes.filter((x) => x.id !== p.id),
                    })
                  }
                  className="text-red-700 font-bold cursor-pointer"
                >
                  ✕
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {tab === 'benchmarks' && (
        <div className="space-y-2.5">
          {canEdit && (
            <div className="p-3 rounded-xl bg-[#f7ead0] border border-[#b08647] grid grid-cols-1 sm:grid-cols-3 gap-2">
              <input
                value={mName}
                onChange={(e) => setMName(e.target.value)}
                placeholder="Model / ComfyUI workflow"
                className="px-2 py-1.5 rounded bg-white border border-[#b89259]"
              />
              <input
                value={mHw}
                onChange={(e) => setMHw(e.target.value)}
                placeholder="Hardware"
                className="px-2 py-1.5 rounded bg-white border border-[#b89259]"
              />
              <div className="flex gap-1.5">
                <input
                  value={mNotes}
                  onChange={(e) => setMNotes(e.target.value)}
                  placeholder="VRAM / quality notes"
                  className="flex-1 px-2 py-1.5 rounded bg-white border border-[#b89259]"
                />
                <button
                  onClick={async () => {
                    if (!mName.trim()) return;
                    const row: RdBenchmarkItem = {
                      id: `bm_${Date.now().toString(36)}`,
                      modelName: mName.trim(),
                      hardware: mHw.trim(),
                      notes: mNotes.trim(),
                    };
                    await saveNext({ ...data, benchmarks: [row, ...data.benchmarks] });
                    setMName('');
                    setMNotes('');
                  }}
                  className="px-3 py-1.5 rounded bg-[#362316] text-[#fbe8b5] font-bold cursor-pointer"
                >
                  ＋
                </button>
              </div>
            </div>
          )}
          {data.benchmarks.map((b) => (
            <div key={b.id} className="p-2.5 rounded-xl bg-white/85 border border-[#b89259]">
              <div className="font-bold text-[#331d0b]">
                {b.modelName} · <span className="text-[#7c5021]">{b.hardware}</span>
              </div>
              {b.notes && <div className="text-[#54371b]">{b.notes}</div>}
            </div>
          ))}
        </div>
      )}

      {tab === 'skills' && (
        <div className="space-y-2.5">
          {canEdit && (
            <div className="p-3 rounded-xl bg-[#f7ead0] border border-[#b08647] grid grid-cols-1 sm:grid-cols-3 gap-2">
              <input
                value={skName}
                onChange={(e) => setSkName(e.target.value)}
                placeholder="Proposed Skill slug"
                className="px-2 py-1.5 rounded bg-white border border-[#b89259]"
              />
              <input
                value={skPurp}
                onChange={(e) => setSkPurp(e.target.value)}
                placeholder="Purpose & safety guardrails"
                className="px-2 py-1.5 rounded bg-white border border-[#b89259]"
              />
              <button
                onClick={async () => {
                  if (!skName.trim()) return;
                  const row: RdSkillIdeaItem = {
                    id: `sk_${Date.now().toString(36)}`,
                    skillName: skName.trim(),
                    purpose: skPurp.trim(),
                    stage: 'Draft',
                  };
                  await saveNext({ ...data, skillIdeas: [row, ...data.skillIdeas] });
                  setSkName('');
                  setSkPurp('');
                }}
                className="px-3 py-1.5 rounded bg-[#362316] text-[#fbe8b5] font-bold cursor-pointer"
              >
                ＋ Incubate Skill
              </button>
            </div>
          )}
          {data.skillIdeas.map((s) => (
            <div key={s.id} className="p-2.5 rounded-xl bg-white/85 border border-[#b89259]">
              <span className="font-bold text-[#331d0b]">{s.skillName}</span>{' '}
              <span className="px-1.5 py-0.5 rounded bg-[#efe0bc] text-[10px]">{s.stage}</span>
              {s.purpose && <div className="text-[#54371b]">{s.purpose}</div>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
