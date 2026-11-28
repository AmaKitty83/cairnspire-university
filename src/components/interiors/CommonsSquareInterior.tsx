import { useState } from 'react';
import { BUILDINGS, type BuildingDef } from '../../data/campusData';
import { CONVENTION_BRIEFS } from '../../data/departmentRosters';
import { ASSETS } from '../../data/assetMeta';
import type { CampusRole } from '../../firebase';
import {
  isCampusConstitutionRatified,
  seatAllConventionReps,
  type DepartmentRecord,
  type GovernanceProposal,
} from '../../services/firestoreService';
import { OfflineRosterPanel } from './OfflineRosterPanel';

interface CommonsSquareInteriorProps {
  role: CampusRole;
  userEmail: string;
  departments: Record<string, DepartmentRecord>;
  proposals: GovernanceProposal[];
  onSelectBuilding: (b: BuildingDef) => void;
}

const SEAT_BUILDINGS = BUILDINGS.filter((b) => b.id !== 'commons');

export function CommonsSquareInterior({
  role,
  userEmail,
  departments,
  proposals,
  onSelectBuilding,
}: CommonsSquareInteriorProps) {
  const [expandedDept, setExpandedDept] = useState<string | null>('town-hall');
  const [seatingBusy, setSeatingBusy] = useState(false);
  const [seatMsg, setSeatMsg] = useState<string | null>(null);

  const canWrite = role === 'chancellor' || role === 'university';
  const constitutionActive = isCampusConstitutionRatified(proposals);

  const seatedCount = SEAT_BUILDINGS.filter((b) => {
    const rec = departments[b.id];
    return rec && rec.repName.trim().length > 0 && rec.status !== 'recruiting';
  }).length;

  const openProposals = proposals.filter((p) => p.gate2Status === 'pending');

  async function handleSeatAll() {
    if (!canWrite) return;
    setSeatingBusy(true);
    setSeatMsg(null);
    try {
      const count = await seatAllConventionReps(departments, userEmail);
      setSeatMsg(
        count > 0
          ? `Seated ${count} remaining representative(s) in Commons Square (all agents remain Offline / Standby).`
          : 'All 13 Department Representatives are already seated in Commons Square!'
      );
    } finally {
      setSeatingBusy(false);
    }
  }

  return (
    <div className="space-y-3">
      <div className="p-3 rounded-xl bg-[#fff8e7] border border-[#b08647] space-y-2">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="font-atlas font-bold text-sm text-[#4a2b0f]">
            🏛️ Constitutional Convention &amp; Congressional Floor
          </div>
          <span className="px-2.5 py-0.5 rounded-full bg-[#362316] text-[#fbe8b5] text-[11px] font-bold">
            {seatedCount} / {SEAT_BUILDINGS.length} Reps Seated ({constitutionActive ? 'Active' : 'Offline · Standby'})
          </span>
        </div>
        <p className="text-xs text-[#54371b]">
          Per <strong>Article X</strong>, all <strong>13 Departments</strong> hold one representative seat
          around the elemental Cairnspire to draft the Campus Constitution and convene Congress — and
          agents across every hall also gather here socially when chatting &amp; hanging out. Tap any seat
          below to inspect its <strong>IN ✅ vs. OUT 🚫</strong> Constitutional Brief.
        </p>
        <div className="w-full h-2 rounded-full bg-[#e6cfa0] overflow-hidden">
          <div
            className="h-full bg-[#2d6a4f] transition-all"
            style={{ width: `${Math.round((seatedCount / SEAT_BUILDINGS.length) * 100)}%` }}
          />
        </div>
        <div className="flex flex-wrap items-center gap-2 pt-0.5">
          {canWrite && seatedCount < SEAT_BUILDINGS.length && (
            <button
              type="button"
              disabled={seatingBusy}
              onClick={() => void handleSeatAll()}
              className="px-3 py-1.5 rounded-lg bg-[#2d6a4f] hover:bg-[#1b4332] text-white text-xs font-bold cursor-pointer disabled:opacity-50"
            >
              {seatingBusy ? 'Seating Representatives…' : '🪑 Seat All 13 Reps for Convention (Standby)'}
            </button>
          )}
          <span
            className={`px-2.5 py-1 rounded-full text-[11px] font-bold border ${
              constitutionActive
                ? 'bg-emerald-100 border-emerald-400 text-emerald-900'
                : 'bg-slate-900 border-amber-400 text-amber-200'
            }`}
          >
            {constitutionActive
              ? '✅ Constitution Ratified · Agents Authorized'
              : '⏸️ Agents Locked Offline Until Constitution Signed'}
          </span>
        </div>
        {seatMsg && (
          <div className="p-2 rounded-lg bg-emerald-50 border border-emerald-300 text-xs text-emerald-900">
            {seatMsg}
          </div>
        )}
      </div>

      {/* 13 Department Representative Seats + Constitutional IN / OUT Briefs */}
      <div className="space-y-1.5">
        <div className="text-xs font-bold uppercase tracking-wide text-[#7c5021]">
          13 Department Representative Seats &amp; Convention Briefs (Tap Seat to Read IN / OUT Rules)
        </div>
        <div className="space-y-2">
          {SEAT_BUILDINGS.map((b) => {
            const rec = departments[b.id];
            const brief = CONVENTION_BRIEFS[b.id];
            const repSrc = ASSETS[b.repSprite]?.src || '';
            const status = rec?.status || 'recruiting';
            const isOpen = expandedDept === b.id;
            const badgeStyle =
              status === 'active' && constitutionActive
                ? 'bg-emerald-100 text-emerald-900'
                : status === 'seated'
                  ? 'bg-amber-100 text-amber-950'
                  : 'bg-[#efe0bc] text-[#6b4b28]';

            return (
              <div
                key={b.id}
                className="rounded-xl bg-white/85 border border-[#b89259] overflow-hidden"
              >
                <div className="p-2.5 flex items-center gap-2.5">
                  {repSrc && (
                    <img
                      src={repSrc}
                      alt={b.name}
                      className="w-8 h-9 object-contain shrink-0 drop-shadow-sm"
                    />
                  )}
                  <button
                    type="button"
                    onClick={() => setExpandedDept(isOpen ? null : b.id)}
                    className="min-w-0 flex-1 text-left cursor-pointer"
                  >
                    <div className="flex items-center justify-between gap-1.5 flex-wrap">
                      <span className="font-bold text-xs text-[#331d0b]">{b.name}</span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase shrink-0 ${badgeStyle}`}
                      >
                        {status === 'seated' ? 'Seated · Standby' : status}
                      </span>
                    </div>
                    <div className="text-[11px] text-[#6b4b28] truncate">
                      {rec?.repName ? rec.repName : brief?.repDefaultName || 'Open seat'} —{' '}
                      {brief?.repTitle || b.headRole}
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={() => onSelectBuilding(b)}
                    className="px-2 py-1 rounded-lg bg-[#f4e4c1] hover:bg-[#ead09c] text-[#4a2b0f] text-[10px] font-bold shrink-0 cursor-pointer"
                    title={`Visit ${b.name}`}
                  >
                    Visit →
                  </button>
                </div>

                {isOpen && brief && (
                  <div className="px-3 pb-3 pt-2 border-t border-[#e7d1a4] bg-[#fbf5e6] grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-[11px]">
                    <div className="p-2 rounded-lg bg-emerald-50 border border-emerald-300 space-y-1">
                      <div className="font-bold text-emerald-900">
                        ✅ Must Put IN Constitution
                      </div>
                      <ul className="list-disc pl-4 space-y-0.5 text-emerald-950">
                        {brief.mustInclude.map((item, idx) => (
                          <li key={idx}>{item}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="p-2 rounded-lg bg-red-50 border border-red-200 space-y-1">
                      <div className="font-bold text-red-900">
                        🚫 Must Keep OUT of Constitution
                      </div>
                      <ul className="list-disc pl-4 space-y-0.5 text-red-950">
                        {brief.mustExclude.map((item, idx) => (
                          <li key={idx}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Commons Neutral Lounge Host */}
      <OfflineRosterPanel deptId="commons" heading="☕ Commons Plaza Support (Neutral — No Vote)" />

      {/* Active Convention Floor Proposals */}
      <div className="p-3 rounded-xl bg-[#f7ead0] border border-[#b08647] space-y-1.5 text-xs">
        <div className="font-atlas font-bold text-sm text-[#3c230f]">
          Active Floor Agenda ({openProposals.length} Pending Proposals)
        </div>
        {openProposals.length === 0 ? (
          <p className="text-[#6b4b28]">
            No pending floor proposals right now — when ready, open <strong>Town Hall</strong> to
            draft the Campus Constitution after all 13 Reps review their IN / OUT briefs above.
          </p>
        ) : (
          <div className="space-y-1">
            {openProposals.map((p) => (
              <div
                key={p.id}
                className="px-2.5 py-1.5 rounded-lg bg-white/80 border border-[#c9a86a] flex items-center justify-between gap-2"
              >
                <span className="font-semibold text-[#331d0b] truncate">{p.title}</span>
                <span className="text-[10px] font-bold text-amber-800 uppercase shrink-0">
                  Gate 2 Pending
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
