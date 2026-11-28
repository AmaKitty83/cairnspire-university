import { DEPARTMENT_ROSTERS } from '../../data/departmentRosters';

interface OfflineRosterPanelProps {
  deptId: string;
  heading?: string;
}

export function OfflineRosterPanel({ deptId, heading }: OfflineRosterPanelProps) {
  const slots = DEPARTMENT_ROSTERS[deptId];
  if (!slots?.length) return null;

  const hasTiers = slots.some((s) => Boolean(s.tier));
  const grouped = new Map<string, typeof slots>();
  for (const s of slots) {
    const key = s.tier || 'Department Team';
    const arr = grouped.get(key) || [];
    arr.push(s);
    grouped.set(key, arr);
  }

  return (
    <div className="p-3 rounded-xl bg-[#fff8e7] border border-[#b08647] space-y-2.5 text-xs">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="font-atlas font-bold text-sm text-[#3c230f]">
          {heading || `⏸️ ${slots.length}-Agent Department Roster (Offline · Standby)`}
        </div>
        <span className="px-2 py-0.5 rounded-full bg-slate-900 border border-amber-400 text-amber-200 text-[10px] font-bold">
          Paused Until Constitution Ratified
        </span>
      </div>

      {Array.from(grouped.entries()).map(([tierName, items]) => (
        <div key={tierName} className="space-y-1.5">
          {hasTiers && (
            <div className="text-[11px] font-bold uppercase tracking-wide text-[#7c5021] pt-1">
              {tierName}
            </div>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {items.map((slot) => (
              <div
                key={slot.id}
                className="p-2.5 rounded-xl bg-white/90 border border-[#cfa96e] space-y-1"
              >
                <div className="flex items-start justify-between gap-1.5">
                  <div className="font-bold text-[#2e1e0f]">
                    {slot.roleTitle}
                    {slot.defaultName ? (
                      <span className="font-normal text-[#6e4d28]"> ({slot.defaultName})</span>
                    ) : null}
                  </div>
                  <div className="flex gap-1 shrink-0">
                    {slot.isRep && (
                      <span className="px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[9px] font-bold">
                        Convention Rep
                      </span>
                    )}
                    <span className="px-1.5 py-0.5 rounded-full bg-slate-200 text-slate-800 text-[9px] font-bold">
                      ⏸️ Offline
                    </span>
                  </div>
                </div>
                <p className="text-[11px] text-[#4b5563] leading-snug">{slot.mandate}</p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
