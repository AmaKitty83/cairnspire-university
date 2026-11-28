import { useEffect, useState } from 'react';
import type { CampusRole } from '../../firebase';
import {
  INITIAL_SOCIAL_DOC,
  saveSocialMediaWorkspace,
  subscribeSocialMediaWorkspace,
  type ContentDraftItem,
  type SocialMediaWorkspaceDoc,
  type SocialPersonaItem,
} from '../../services/departmentWorkspacesService';
import { OfflineRosterPanel } from './OfflineRosterPanel';

interface SocialMediaInteriorProps {
  role: CampusRole;
  userEmail: string;
}

export function SocialMediaInterior({ role, userEmail }: SocialMediaInteriorProps) {
  const canEdit = role === 'chancellor' || role === 'university';
  const [tab, setTab] = useState<'personas' | 'calendar' | 'agency'>('personas');
  const [data, setData] = useState<SocialMediaWorkspaceDoc>(INITIAL_SOCIAL_DOC);
  const [syncErr, setSyncErr] = useState<string | null>(null);

  const [pName, setPName] = useState('');
  const [pPlat, setPPlat] = useState('');
  const [pTone, setPTone] = useState('');
  const [pPillars, setPPillars] = useState('');

  const [dPersona, setDPersona] = useState('');
  const [dPlat, setDPlat] = useState('');
  const [dCap, setDCap] = useState('');

  useEffect(() => {
    return subscribeSocialMediaWorkspace(setData, (e) => setSyncErr(e.message));
  }, []);

  async function saveNext(next: SocialMediaWorkspaceDoc) {
    if (!canEdit) return;
    setData(next);
    await saveSocialMediaWorkspace(next, userEmail);
  }

  return (
    <div className="space-y-3 text-xs">
      <div className="p-3 rounded-xl bg-[#fff8e7] border border-[#b08647] flex flex-wrap items-center justify-between gap-2">
        <div className="text-[#54371b]">
          <strong>Social Media Company (AI Personas):</strong> Autonomous AI-created and managed
          personas studio. All autonomous posting &amp; engagement remains <strong>paused</strong> pending
          Campus Constitution boundaries.
        </div>
        <span className="px-2 py-0.5 rounded-full bg-slate-900 border border-amber-400 text-amber-200 text-[10px] font-bold">
          ⏸️ 6-Agent Agency Offline
        </span>
      </div>

      {syncErr && <div className="p-2 rounded bg-red-100 text-red-900">{syncErr}</div>}

      <div className="flex flex-wrap gap-1.5 border-b border-[#cfa96e] pb-2">
        <button
          onClick={() => setTab('personas')}
          className={`px-3 py-1.5 rounded-lg font-semibold cursor-pointer ${
            tab === 'personas' ? 'bg-[#362316] text-[#fbe8b5]' : 'bg-[#f4e4c1] text-[#4a2b0f]'
          }`}
        >
          🎭 AI Personas &amp; Lore ({data.personas.length})
        </button>
        <button
          onClick={() => setTab('calendar')}
          className={`px-3 py-1.5 rounded-lg font-semibold cursor-pointer ${
            tab === 'calendar' ? 'bg-[#362316] text-[#fbe8b5]' : 'bg-[#f4e4c1] text-[#4a2b0f]'
          }`}
        >
          🗓️ Content Drafts ({data.contentDrafts.length})
        </button>
        <button
          onClick={() => setTab('agency')}
          className={`px-3 py-1.5 rounded-lg font-semibold cursor-pointer ${
            tab === 'agency' ? 'bg-[#362316] text-[#fbe8b5]' : 'bg-[#f4e4c1] text-[#4a2b0f]'
          }`}
        >
          🤖 6-Agent Company (Offline)
        </button>
      </div>

      {tab === 'personas' && (
        <div className="space-y-2.5">
          {canEdit && (
            <div className="p-3 rounded-xl bg-[#f7ead0] border border-[#b08647] grid grid-cols-1 sm:grid-cols-2 gap-2">
              <input
                value={pName}
                onChange={(e) => setPName(e.target.value)}
                placeholder="AI Persona name / handle"
                className="px-2 py-1.5 rounded bg-white border border-[#b89259]"
              />
              <input
                value={pPlat}
                onChange={(e) => setPPlat(e.target.value)}
                placeholder="Target platforms (TikTok, IG, YT)"
                className="px-2 py-1.5 rounded bg-white border border-[#b89259]"
              />
              <input
                value={pTone}
                onChange={(e) => setPTone(e.target.value)}
                placeholder="Voice & personality tone"
                className="px-2 py-1.5 rounded bg-white border border-[#b89259]"
              />
              <div className="flex gap-1.5">
                <input
                  value={pPillars}
                  onChange={(e) => setPPillars(e.target.value)}
                  placeholder="Content pillars / lore"
                  className="flex-1 px-2 py-1.5 rounded bg-white border border-[#b89259]"
                />
                <button
                  onClick={async () => {
                    if (!pName.trim()) return;
                    const item: SocialPersonaItem = {
                      id: `per_${Date.now().toString(36)}`,
                      name: pName.trim(),
                      platform: pPlat.trim(),
                      voiceTone: pTone.trim(),
                      pillars: pPillars.trim(),
                      status: 'Awaiting Constitution',
                    };
                    await saveNext({ ...data, personas: [item, ...data.personas] });
                    setPName('');
                    setPPlat('');
                    setPTone('');
                    setPPillars('');
                  }}
                  className="px-3 py-1.5 rounded bg-[#362316] text-[#fbe8b5] font-bold cursor-pointer"
                >
                  ＋
                </button>
              </div>
            </div>
          )}
          {data.personas.length === 0 ? (
            <div className="p-4 rounded-xl bg-white/75 border border-[#c9a86a] text-center text-[#6b4b28]">
              No AI personas drafted yet. Sketch persona voices and pillars above while the agency waits
              for Constitutional autonomy rules.
            </div>
          ) : (
            data.personas.map((p) => (
              <div
                key={p.id}
                className="p-2.5 rounded-xl bg-white/85 border border-[#b89259] flex items-start justify-between gap-2"
              >
                <div>
                  <div className="font-bold text-[#331d0b]">
                    {p.name} {p.platform ? `· ${p.platform}` : ''}
                    <span className="ml-2 px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[10px]">
                      {p.status}
                    </span>
                  </div>
                  {p.voiceTone && <div className="text-[#54371b]">Voice: {p.voiceTone}</div>}
                  {p.pillars && <div className="text-[11px] text-[#6b4b28]">Pillars: {p.pillars}</div>}
                </div>
                {canEdit && (
                  <button
                    onClick={() =>
                      void saveNext({
                        ...data,
                        personas: data.personas.filter((x) => x.id !== p.id),
                      })
                    }
                    className="text-red-700 font-bold cursor-pointer"
                  >
                    ✕
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {tab === 'calendar' && (
        <div className="space-y-2.5">
          {canEdit && (
            <div className="p-3 rounded-xl bg-[#f7ead0] border border-[#b08647] space-y-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <input
                  value={dPersona}
                  onChange={(e) => setDPersona(e.target.value)}
                  placeholder="Persona"
                  className="px-2 py-1.5 rounded bg-white border border-[#b89259]"
                />
                <input
                  value={dPlat}
                  onChange={(e) => setDPlat(e.target.value)}
                  placeholder="Platform"
                  className="px-2 py-1.5 rounded bg-white border border-[#b89259]"
                />
              </div>
              <div className="flex gap-2">
                <input
                  value={dCap}
                  onChange={(e) => setDCap(e.target.value)}
                  placeholder="Post / reel script draft..."
                  className="flex-1 px-2 py-1.5 rounded bg-white border border-[#b89259]"
                />
                <button
                  onClick={async () => {
                    if (!dCap.trim()) return;
                    const row: ContentDraftItem = {
                      id: `cd_${Date.now().toString(36)}`,
                      personaName: dPersona.trim() || 'Persona',
                      platform: dPlat.trim() || 'Social',
                      caption: dCap.trim(),
                      visualPrompt: '',
                      status: 'Permit Needed',
                    };
                    await saveNext({ ...data, contentDrafts: [row, ...data.contentDrafts] });
                    setDCap('');
                  }}
                  className="px-3 py-1.5 rounded bg-[#362316] text-[#fbe8b5] font-bold cursor-pointer"
                >
                  Save Draft
                </button>
              </div>
            </div>
          )}
          {data.contentDrafts.map((c) => (
            <div key={c.id} className="p-2.5 rounded-xl bg-white/85 border border-[#b89259]">
              <div className="font-bold text-[#331d0b]">
                {c.personaName} · {c.platform}{' '}
                <span className="ml-1 px-1.5 py-0.5 rounded bg-amber-100 text-amber-900 text-[10px]">
                  {c.status}
                </span>
              </div>
              <p className="text-[#4a2f17]">{c.caption}</p>
            </div>
          ))}
        </div>
      )}

      {tab === 'agency' && (
        <OfflineRosterPanel
          deptId="social-media"
          heading="🤖 6-Agent Social Media Company Roster (Offline · Standby)"
        />
      )}
    </div>
  );
}
