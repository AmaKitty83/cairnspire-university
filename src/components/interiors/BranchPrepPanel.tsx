import { useState } from 'react';
import type { BranchPrepReport } from '../../data/governmentConventionPrep';

interface BranchPrepPanelProps {
  report: BranchPrepReport;
  extraTitle?: string;
  extraItems?: string[];
  defaultOpen?: boolean;
}

export function BranchPrepPanel({
  report,
  extraTitle,
  extraItems,
  defaultOpen = true,
}: BranchPrepPanelProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="p-3 rounded-xl bg-[#fff8e7] border border-[#b08647] space-y-2.5 text-xs">
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="font-atlas font-bold text-sm text-[#3c230f]">
            📋 Stage 1 Job Review &amp; Constitutional Convention Prep
          </div>
          <div className="text-[11px] text-[#54371b] mt-0.5">{report.statusSummary}</div>
        </div>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="px-2.5 py-1 rounded-lg bg-[#f4e4c1] hover:bg-[#ebd3a0] text-[#4a2b0f] font-semibold shrink-0 cursor-pointer"
        >
          {open ? 'Hide ▲' : 'Review ▼'}
        </button>
      </div>

      {open && (
        <div className="space-y-3 pt-1 border-t border-[#e5cda0]">
          <div className="space-y-1.5">
            <div className="text-[11px] font-bold uppercase tracking-wide text-[#7c5021]">
              Role-by-Role Readiness &amp; Surfaced Gaps
            </div>
            <div className="space-y-1.5">
              {report.roleChecks.map((rc) => (
                <div
                  key={rc.officer}
                  className="p-2 rounded-lg bg-white/90 border border-[#cfa96e] space-y-1"
                >
                  <div className="font-bold text-[#2e1e0f]">{rc.officer}</div>
                  <div className="text-[11px] text-emerald-900">
                    <strong>✓ Verified:</strong> {rc.verified}
                  </div>
                  <div className="text-[11px] text-amber-950">
                    <strong>⚠ Next / Gap:</strong> {rc.gap}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-2.5 rounded-lg bg-white/85 border border-[#cfa96e] space-y-1">
            <div className="text-[11px] font-bold uppercase tracking-wide text-[#7c5021]">
              Convention Charter Safeguards
            </div>
            <ul className="list-disc pl-4 space-y-0.5 text-[11px] text-[#3b2410]">
              {report.charterHighlights.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </div>

          {extraItems && extraItems.length > 0 && (
            <div className="p-2.5 rounded-lg bg-[#fbf5e6] border border-[#b89259] space-y-1">
              <div className="text-[11px] font-bold uppercase tracking-wide text-[#7c5021]">
                {extraTitle || 'Audit Checklist'}
              </div>
              <ul className="list-disc pl-4 space-y-0.5 text-[11px] text-[#3b2410]">
                {extraItems.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-300 space-y-1">
            <div className="text-[11px] font-bold uppercase tracking-wide text-amber-950">
              👑 Decisions Needed from Chancellor Amarette Before Gaveling Open
            </div>
            <ol className="list-decimal pl-4 space-y-0.5 text-[11px] text-amber-950">
              {report.chancellorDecisions.map((d, idx) => (
                <li key={idx}>{d}</li>
              ))}
            </ol>
          </div>
        </div>
      )}
    </div>
  );
}
