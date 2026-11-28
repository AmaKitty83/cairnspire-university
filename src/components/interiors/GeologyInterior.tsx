import { useEffect, useState } from 'react';
import type { CampusRole } from '../../firebase';
import {
  INITIAL_GEOLOGY_DOC,
  saveGeologyWorkspace,
  subscribeGeologyWorkspace,
  type GeologySpecimen,
  type GeologyWorkspaceDoc,
  type LapidaryItem,
  type RoadtripStop,
} from '../../services/departmentWorkspacesService';
import { OfflineRosterPanel } from './OfflineRosterPanel';

interface GeologyInteriorProps {
  role: CampusRole;
  userEmail: string;
}

export function GeologyInterior({ role, userEmail }: GeologyInteriorProps) {
  const canEdit = role === 'chancellor' || role === 'university';
  const [tab, setTab] = useState<'specimens' | 'route' | 'lapidary' | 'team'>('specimens');
  const [data, setData] = useState<GeologyWorkspaceDoc>(INITIAL_GEOLOGY_DOC);
  const [syncErr, setSyncErr] = useState<string | null>(null);

  // Add Specimen
  const [spName, setSpName] = useState('');
  const [spGroup, setSpGroup] = useState('');
  const [spLoc, setSpLoc] = useState('');
  const [spForm, setSpForm] = useState('');

  // Add Route Stop
  const [rtRegion, setRtRegion] = useState('');
  const [rtSite, setRtSite] = useState('');
  const [rtMin, setRtMin] = useState('');
  const [rtAccess, setRtAccess] = useState('');

  // Add Lapidary
  const [lapPiece, setLapPiece] = useState('');
  const [lapStage, setLapStage] = useState<LapidaryItem['stage']>('Rough');
  const [lapNotes, setLapNotes] = useState('');

  useEffect(() => {
    return subscribeGeologyWorkspace(setData, (e) => setSyncErr(e.message));
  }, []);

  async function saveNext(next: GeologyWorkspaceDoc) {
    if (!canEdit) return;
    setData(next);
    await saveGeologyWorkspace(next, userEmail);
  }

  return (
    <div className="space-y-3 text-xs">
      <div className="p-3 rounded-xl bg-[#fff8e7] border border-[#b08647] flex flex-wrap items-center justify-between gap-2">
        <div className="text-[#54371b]">
          <strong>Rockhounding &amp; Specimen Observatory:</strong> Personal mineral vault,
          St. Louis ↔ Lillington roadtrip stops, lapidary queue &amp; 12-agent expedition team.
        </div>
        <span className="px-2 py-0.5 rounded-full bg-slate-900 border border-amber-400 text-amber-200 text-[10px] font-bold">
          ⏸️ 12 Agents Offline
        </span>
      </div>

      {syncErr && <div className="p-2 rounded bg-red-100 text-red-900">{syncErr}</div>}

      <div className="flex flex-wrap gap-1.5 border-b border-[#cfa96e] pb-2">
        {(
          [
            ['specimens', `💎 Specimen Vault (${data.specimens.length})`],
            ['route', `🗺️ St. Louis ↔ Lillington (${data.roadtripStops.length})`],
            ['lapidary', `🪨 Lapidary & Notes (${data.lapidaryQueue.length})`],
            ['team', '🧭 12-Agent Team (Offline)'],
          ] as const
        ).map(([id, lbl]) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={`px-3 py-1.5 rounded-lg font-semibold cursor-pointer ${
              tab === id
                ? 'bg-[#362316] text-[#fbe8b5]'
                : 'bg-[#f4e4c1] hover:bg-[#ebd3a0] text-[#4a2b0f]'
            }`}
          >
            {lbl}
          </button>
        ))}
      </div>

      {tab === 'specimens' && (
        <div className="space-y-2.5">
          {canEdit && (
            <div className="p-3 rounded-xl bg-[#f7ead0] border border-[#b08647] grid grid-cols-1 sm:grid-cols-4 gap-2">
              <input
                value={spName}
                onChange={(e) => setSpName(e.target.value)}
                placeholder="Specimen (e.g., Druzy Quartz)"
                className="px-2 py-1.5 rounded bg-white border border-[#b89259]"
              />
              <input
                value={spGroup}
                onChange={(e) => setSpGroup(e.target.value)}
                placeholder="Mineral group / habit"
                className="px-2 py-1.5 rounded bg-white border border-[#b89259]"
              />
              <input
                value={spLoc}
                onChange={(e) => setSpLoc(e.target.value)}
                placeholder="Locality / State"
                className="px-2 py-1.5 rounded bg-white border border-[#b89259]"
              />
              <div className="flex gap-1.5">
                <input
                  value={spForm}
                  onChange={(e) => setSpForm(e.target.value)}
                  placeholder="Formation / Notes"
                  className="flex-1 px-2 py-1.5 rounded bg-white border border-[#b89259]"
                />
                <button
                  onClick={async () => {
                    if (!spName.trim()) return;
                    const item: GeologySpecimen = {
                      id: `sp_${Date.now().toString(36)}`,
                      name: spName.trim(),
                      mineralGroup: spGroup.trim(),
                      locality: spLoc.trim(),
                      formation: spForm.trim(),
                      notes: '',
                    };
                    await saveNext({ ...data, specimens: [item, ...data.specimens] });
                    setSpName('');
                    setSpGroup('');
                    setSpLoc('');
                    setSpForm('');
                  }}
                  className="px-3 py-1.5 rounded bg-[#362316] text-[#fbe8b5] font-bold cursor-pointer"
                >
                  ＋
                </button>
              </div>
            </div>
          )}
          {data.specimens.length === 0 ? (
            <div className="p-4 rounded-xl bg-white/75 border border-[#c9a86a] text-center text-[#6b4b28]">
              No specimens cataloged yet. Add your first rock or mineral above!
            </div>
          ) : (
            <div className="space-y-1.5">
              {data.specimens.map((s) => (
                <div
                  key={s.id}
                  className="p-2.5 rounded-xl bg-white/85 border border-[#b89259] flex items-start justify-between gap-2"
                >
                  <div>
                    <div className="font-bold text-[#331d0b]">
                      {s.name} {s.mineralGroup ? `· ${s.mineralGroup}` : ''}
                    </div>
                    <div className="text-[11px] text-[#6b4b28]">
                      {s.locality || 'Locality TBD'}
                      {s.formation ? ` — ${s.formation}` : ''}
                    </div>
                  </div>
                  {canEdit && (
                    <button
                      onClick={() =>
                        void saveNext({
                          ...data,
                          specimens: data.specimens.filter((x) => x.id !== s.id),
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
        </div>
      )}

      {tab === 'route' && (
        <div className="space-y-2.5">
          {canEdit && (
            <div className="p-3 rounded-xl bg-[#f7ead0] border border-[#b08647] grid grid-cols-1 sm:grid-cols-2 gap-2">
              <input
                value={rtRegion}
                onChange={(e) => setRtRegion(e.target.value)}
                placeholder="Corridor segment (e.g., Southern IL / Western NC)"
                className="px-2 py-1.5 rounded bg-white border border-[#b89259]"
              />
              <input
                value={rtSite}
                onChange={(e) => setRtSite(e.target.value)}
                placeholder="Verified park, fee-dig, or roadcut"
                className="px-2 py-1.5 rounded bg-white border border-[#b89259]"
              />
              <input
                value={rtMin}
                onChange={(e) => setRtMin(e.target.value)}
                placeholder="Target minerals / rocks"
                className="px-2 py-1.5 rounded bg-white border border-[#b89259]"
              />
              <div className="flex gap-1.5">
                <input
                  value={rtAccess}
                  onChange={(e) => setRtAccess(e.target.value)}
                  placeholder="Access / permit notes"
                  className="flex-1 px-2 py-1.5 rounded bg-white border border-[#b89259]"
                />
                <button
                  onClick={async () => {
                    if (!rtSite.trim()) return;
                    const stop: RoadtripStop = {
                      id: `rt_${Date.now().toString(36)}`,
                      region: rtRegion.trim() || 'St. Louis ↔ Lillington',
                      siteName: rtSite.trim(),
                      targetMinerals: rtMin.trim(),
                      accessNotes: rtAccess.trim(),
                    };
                    await saveNext({ ...data, roadtripStops: [...data.roadtripStops, stop] });
                    setRtRegion('');
                    setRtSite('');
                    setRtMin('');
                    setRtAccess('');
                  }}
                  className="px-3 py-1.5 rounded bg-[#362316] text-[#fbe8b5] font-bold cursor-pointer"
                >
                  ＋ Add Stop
                </button>
              </div>
            </div>
          )}
          <div className="space-y-2">
            {data.roadtripStops.map((st) => (
              <div
                key={st.id}
                className="p-3 rounded-xl bg-white/85 border border-[#b89259] flex items-start justify-between gap-2"
              >
                <div className="space-y-0.5">
                  <div className="text-[10px] font-bold uppercase text-[#7c5021]">{st.region}</div>
                  <div className="font-bold text-[#331d0b]">{st.siteName}</div>
                  {st.targetMinerals && <div className="text-[#2d6a4f]">⛏️ {st.targetMinerals}</div>}
                  {st.accessNotes && <div className="text-[11px] text-[#54371b]">{st.accessNotes}</div>}
                </div>
                {canEdit && (
                  <button
                    onClick={() =>
                      void saveNext({
                        ...data,
                        roadtripStops: data.roadtripStops.filter((x) => x.id !== st.id),
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
        </div>
      )}

      {tab === 'lapidary' && (
        <div className="space-y-2.5">
          {canEdit && (
            <div className="p-3 rounded-xl bg-[#f7ead0] border border-[#b08647] grid grid-cols-1 sm:grid-cols-3 gap-2">
              <input
                value={lapPiece}
                onChange={(e) => setLapPiece(e.target.value)}
                placeholder="Piece / rough material"
                className="px-2 py-1.5 rounded bg-white border border-[#b89259]"
              />
              <select
                value={lapStage}
                onChange={(e) => setLapStage(e.target.value as LapidaryItem['stage'])}
                className="px-2 py-1.5 rounded bg-white border border-[#b89259]"
              >
                <option>Rough</option>
                <option>Slabbed</option>
                <option>Tumbling</option>
                <option>Cabochon</option>
                <option>Polished</option>
              </select>
              <div className="flex gap-1.5">
                <input
                  value={lapNotes}
                  onChange={(e) => setLapNotes(e.target.value)}
                  placeholder="Grit / saw notes"
                  className="flex-1 px-2 py-1.5 rounded bg-white border border-[#b89259]"
                />
                <button
                  onClick={async () => {
                    if (!lapPiece.trim()) return;
                    const row: LapidaryItem = {
                      id: `lap_${Date.now().toString(36)}`,
                      piece: lapPiece.trim(),
                      stage: lapStage,
                      notes: lapNotes.trim(),
                    };
                    await saveNext({ ...data, lapidaryQueue: [row, ...data.lapidaryQueue] });
                    setLapPiece('');
                    setLapNotes('');
                  }}
                  className="px-3 py-1.5 rounded bg-[#362316] text-[#fbe8b5] font-bold cursor-pointer"
                >
                  ＋
                </button>
              </div>
            </div>
          )}
          <div className="space-y-1.5">
            {data.lapidaryQueue.map((item) => (
              <div
                key={item.id}
                className="p-2.5 rounded-xl bg-white/85 border border-[#b89259] flex items-center justify-between gap-2"
              >
                <div>
                  <span className="font-bold text-[#331d0b]">{item.piece}</span>
                  <span className="ml-2 px-2 py-0.5 rounded-full bg-[#efe0bc] text-[10px] font-bold">
                    {item.stage}
                  </span>
                  {item.notes && <span className="ml-2 text-[#54371b]">{item.notes}</span>}
                </div>
                {canEdit && (
                  <button
                    onClick={() =>
                      void saveNext({
                        ...data,
                        lapidaryQueue: data.lapidaryQueue.filter((x) => x.id !== item.id),
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
          <div>
            <label className="font-bold text-[#3c230f] block mb-1">
              📓 Field Journal &amp; LiDAR / Batholith Research Notes
            </label>
            <textarea
              rows={4}
              disabled={!canEdit}
              value={data.fieldNotes}
              onChange={(e) => void saveNext({ ...data, fieldNotes: e.target.value })}
              placeholder="Save outcrop notes, hardness observations, USGS quad references..."
              className="w-full px-2.5 py-1.5 rounded-xl bg-white border border-[#b89259]"
            />
          </div>
        </div>
      )}

      {tab === 'team' && (
        <OfflineRosterPanel deptId="geology" heading="🧭 12-Agent Geology & Rockhounding Team (Offline · Standby)" />
      )}
    </div>
  );
}
