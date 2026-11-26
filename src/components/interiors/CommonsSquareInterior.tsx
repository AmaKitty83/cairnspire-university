import { BUILDINGS, type BuildingDef } from '../../data/campusData';
import { ASSETS } from '../../data/assetMeta';
import type { DepartmentRecord, GovernanceProposal } from '../../services/firestoreService';

interface CommonsSquareInteriorProps {
  departments: Record<string, DepartmentRecord>;
  proposals: GovernanceProposal[];
  onSelectBuilding: (b: BuildingDef) => void;
}

const SEAT_BUILDINGS = BUILDINGS.filter((b) => b.id !== 'commons');

export function CommonsSquareInterior({
  departments,
  proposals,
  onSelectBuilding,
}: CommonsSquareInteriorProps) {
  const seatedCount = SEAT_BUILDINGS.filter((b) => {
    const rec = departments[b.id];
    return rec && rec.repName.trim().length > 0 && rec.status !== 'recruiting';
  }).length;

  const openProposals = proposals.filter((p) => p.gate2Status === 'pending');

  return (
    <div className="space-y-3">
      <div className="p-3 rounded-xl bg-[#fff8e7] border border-[#b08647] space-y-2">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="font-atlas font-bold text-sm text-[#4a2b0f]">
            🏛️ Constitutional Convention Floor
          </div>
          <span className="px-2.5 py-0.5 rounded-full bg-[#362316] text-[#fbe8b5] text-[11px] font-bold">
            {seatedCount} / {SEAT_BUILDINGS.length} Reps Seated
          </span>
        </div>
        <p className="text-xs text-[#54371b]">
          Per <strong>Article X</strong>, every campus department (excluding neutral Commons Square)
          holds <strong>one representative seat</strong> around the spiraling elemental Cairnspire,
          facing the Chancellor &amp; Speaker Dais.
        </p>
        <div className="w-full h-2 rounded-full bg-[#e6cfa0] overflow-hidden">
          <div
            className="h-full bg-[#2d6a4f] transition-all"
            style={{ width: `${Math.round((seatedCount / SEAT_BUILDINGS.length) * 100)}%` }}
          />
        </div>
      </div>

      {/* 13 Department Representative Seats */}
      <div className="space-y-1.5">
        <div className="text-xs font-bold uppercase tracking-wide text-[#7c5021]">
          13 Department Representative Seats (Tap Any Seat to Visit Hall)
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {SEAT_BUILDINGS.map((b) => {
            const rec = departments[b.id];
            const repSrc = ASSETS[b.repSprite]?.src || '';
            const status = rec?.status || 'recruiting';
            const badgeStyle =
              status === 'active'
                ? 'bg-emerald-100 text-emerald-900'
                : status === 'seated'
                  ? 'bg-amber-100 text-amber-900'
                  : 'bg-[#efe0bc] text-[#6b4b28]';

            return (
              <button
                key={b.id}
                onClick={() => onSelectBuilding(b)}
                className="p-2.5 rounded-xl bg-white/80 hover:bg-[#fffaf0] border border-[#b89259] flex items-center gap-2.5 text-left transition cursor-pointer"
              >
                {repSrc && (
                  <img
                    src={repSrc}
                    alt={b.name}
                    className="w-8 h-9 object-contain shrink-0 drop-shadow-sm"
                  />
                )}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-1">
                    <span className="font-bold text-xs text-[#331d0b] truncate">{b.name}</span>
                    <span
                      className={`px-1.5 py-0.5 rounded-full text-[9px] font-bold uppercase shrink-0 ${badgeStyle}`}
                    >
                      {status}
                    </span>
                  </div>
                  <div className="text-[11px] text-[#6b4b28] truncate">
                    {rec?.repName ? rec.repName : 'Seat open — tap hall to assign'}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Convention Floor Proposals */}
      <div className="p-3 rounded-xl bg-[#f7ead0] border border-[#b08647] space-y-1.5 text-xs">
        <div className="font-atlas font-bold text-sm text-[#3c230f]">
          Active Floor Agenda ({openProposals.length} Pending Proposals)
        </div>
        {openProposals.length === 0 ? (
          <p className="text-[#6b4b28]">
            No pending floor proposals right now — open <strong>Town Hall</strong> to draft new
            Constitutional articles or amendments.
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
