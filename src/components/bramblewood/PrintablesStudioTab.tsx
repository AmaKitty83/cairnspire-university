import { useState } from 'react';
import {
  DRIVE_BOOK_RESOURCES,
  SPARROW_SPROCKET_BRAND,
  type PrintableChecklist,
  type PrintableProduct,
} from '../../data/bramblewoodData';
import {
  getBookFileIcon,
  PRINTABLE_DRIVE_FILES,
  type BookDriveFile,
} from '../../data/bramblewoodFiles';

interface PrintablesStudioTabProps {
  canEdit: boolean;
  printables: PrintableProduct[];
  onOpenFile?: (file: BookDriveFile, siblings: BookDriveFile[]) => void;
  onSavePrintables: (next: PrintableProduct[]) => Promise<void>;
}

const DEFAULT_CHECKLIST: PrintableChecklist = {
  pdfChecked: false,
  mockupReady: false,
  printedTest: false,
  permitApproved: false,
};

export function PrintablesStudioTab({
  canEdit,
  printables,
  onOpenFile,
  onSavePrintables,
}: PrintablesStudioTabProps) {
  const [expandedCopyId, setExpandedCopyId] = useState<string | null>(null);
  const [calcPrice, setCalcPrice] = useState('5.50');
  const [copiedMsg, setCopiedMsg] = useState<string | null>(null);

  function flashCopy(msg: string) {
    setCopiedMsg(msg);
    setTimeout(() => setCopiedMsg(null), 1800);
  }

  async function updateItem(id: string, patch: Partial<PrintableProduct>) {
    if (!canEdit) return;
    await onSavePrintables(printables.map((p) => (p.id === id ? { ...p, ...patch } : p)));
  }

  const priceNum = Math.max(0, Number(calcPrice) || 0);
  const estEtsyFees = +(priceNum * 0.095 + 0.25 + 0.2).toFixed(2);
  const estNet = Math.max(0, +(priceNum - estEtsyFees).toFixed(2));

  return (
    <div className="space-y-4 text-xs">
      {/* Brand Kit + Fee Calculator */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        <div className="parchment-panel p-4 rounded-2xl space-y-2 lg:col-span-2">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="font-atlas font-bold text-base text-[#2e1e0f]">
              🌿 {SPARROW_SPROCKET_BRAND.shopName} · Storefront Launch Kit
            </div>
            {copiedMsg && (
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 font-bold">
                {copiedMsg}
              </span>
            )}
          </div>
          <p className="text-[#4b5563]">{SPARROW_SPROCKET_BRAND.tagline}</p>
          <div className="text-[11px] text-[#6e4d28]">
            <strong>Typography:</strong> {SPARROW_SPROCKET_BRAND.fonts}
          </div>
          <div className="flex flex-wrap gap-1.5">
            {SPARROW_SPROCKET_BRAND.colors.map((c) => (
              <span
                key={c.name}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full border border-black/15 bg-white font-semibold text-[10px]"
              >
                <span
                  className="w-2.5 h-2.5 rounded-full border border-black/20"
                  style={{ backgroundColor: c.hex }}
                />
                {c.name} ({c.hex})
              </span>
            ))}
          </div>
          <div className="flex flex-wrap gap-2 pt-1">
            {DRIVE_BOOK_RESOURCES.map((r) => (
              <a
                key={r.label}
                href={r.url}
                target="_blank"
                rel="noopener noreferrer"
                className="ribbon-btn px-2.5 py-1 rounded-lg font-bold underline"
              >
                📁 {r.label} ↗
              </a>
            ))}
            <a
              href="https://www.uspto.gov/trademarks/search"
              target="_blank"
              rel="noopener noreferrer"
              className="ribbon-btn px-2.5 py-1 rounded-lg font-bold underline"
            >
              🔎 USPTO Trademark Search ↗
            </a>
          </div>
        </div>

        {/* Etsy Fee & Net Profit Estimator */}
        <div className="parchment-panel p-4 rounded-2xl space-y-2">
          <div className="font-bold text-sm text-[#2e1e0f]">💰 Etsy Fee Estimator</div>
          <p className="text-[11px] text-[#6e4d28]">
            6.5% transaction + 3%+$0.25 processing + $0.20 listing renewal
          </p>
          <div className="flex items-center gap-2">
            <span className="font-bold">Price $</span>
            <input
              type="number"
              step="0.50"
              value={calcPrice}
              onChange={(e) => setCalcPrice(e.target.value)}
              className="w-24 px-2 py-1 rounded border border-[#cfa96e] bg-white font-bold"
            />
          </div>
          <div className="p-2.5 rounded-xl bg-white border border-[#cfa96e] space-y-0.5">
            <div>Est. Fees: <strong>${estEtsyFees.toFixed(2)}</strong></div>
            <div className="text-emerald-800 font-bold text-sm">
              Est. Net Per Sale: ${estNet.toFixed(2)}
            </div>
          </div>
          <div className="text-[10px] text-[#78350f]">
            Note: Any Etsy/Gumroad account signup ($15 setup / $1.40 listings) requires an Executive{' '}
            <code>! Permit</code> first.
          </div>
        </div>
      </div>

      {/* Product Launch Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {printables.map((pr) => {
          const chk = pr.checklist || DEFAULT_CHECKLIST;
          const isExpanded = expandedCopyId === pr.id;
          return (
            <div key={pr.id} className="parchment-panel p-4 rounded-2xl space-y-2.5 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="font-atlas font-bold text-sm text-[#831843]">
                      #{pr.num} · {pr.title}
                    </div>
                    <div className="text-[11px] text-[#6e4d28]">
                      {pr.pages} · {pr.versions}
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 font-bold">
                      {pr.price}
                    </span>
                    {canEdit ? (
                      <select
                        value={pr.status}
                        onChange={(e) =>
                          void updateItem(pr.id, { status: e.target.value as PrintableProduct['status'] })
                        }
                        className="px-2 py-0.5 rounded border border-[#f472b6] bg-white font-bold"
                      >
                        <option>Draft</option>
                        <option>Ready for Etsy</option>
                        <option>Listed</option>
                      </select>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full bg-white border font-bold">{pr.status}</span>
                    )}
                  </div>
                </div>

                <p className="text-[#374151]">{pr.summary}</p>

                {onOpenFile && PRINTABLE_DRIVE_FILES[pr.id]?.length ? (
                  <div className="flex flex-wrap gap-1.5">
                    {PRINTABLE_DRIVE_FILES[pr.id].map((pf) => (
                      <button
                        key={pf.id}
                        type="button"
                        onClick={() => onOpenFile(pf, PRINTABLE_DRIVE_FILES[pr.id])}
                        className="px-2 py-1 rounded-lg bg-[#fdf2f8] hover:bg-[#fce7f3] border border-[#f472b6] text-[11px] font-bold text-[#831843] cursor-pointer"
                      >
                        {getBookFileIcon(pf.kind)} {pf.label}
                      </button>
                    ))}
                  </div>
                ) : null}

                {/* 4-Step Physical & Governance Readiness Checklist */}
                <div className="p-2.5 rounded-xl bg-white/85 border border-[#cfa96e] grid grid-cols-2 gap-1.5 text-[11px]">
                  {(
                    [
                      ['pdfChecked', 'PDF Checked'],
                      ['mockupReady', 'Mockup Ready'],
                      ['printedTest', 'Physical Print Test'],
                      ['permitApproved', 'Executive ! Permit'],
                    ] as Array<[keyof PrintableChecklist, string]>
                  ).map(([field, label]) => (
                    <label key={field} className="inline-flex items-center gap-1.5 cursor-pointer font-semibold">
                      <input
                        type="checkbox"
                        disabled={!canEdit}
                        checked={Boolean(chk[field])}
                        onChange={(e) =>
                          void updateItem(pr.id, {
                            checklist: { ...chk, [field]: e.target.checked },
                          })
                        }
                        className="accent-emerald-600"
                      />
                      {label}
                    </label>
                  ))}
                </div>
              </div>

              {/* Expandable Listing SEO Copy */}
              <div className="pt-1 space-y-2">
                <div className="flex flex-wrap gap-1.5">
                  <button
                    onClick={() => setExpandedCopyId(isExpanded ? null : pr.id)}
                    className="ribbon-btn px-2.5 py-1 rounded-lg font-bold cursor-pointer"
                  >
                    {isExpanded ? 'Hide Listing Copy' : '📝 View Etsy/Payhip Copy & Tags'}
                  </button>
                  {pr.listingTitle && (
                    <button
                      onClick={() => {
                        const pack = `TITLE:\n${pr.listingTitle}\n\nDESCRIPTION:\n${pr.listingDescription || pr.summary}\n\nTAGS:\n${pr.tags.join(', ')}`;
                        void navigator.clipboard?.writeText(pack);
                        flashCopy(`Copied ${pr.title} listing pack ✔`);
                      }}
                      className="px-2.5 py-1 rounded-lg bg-[#2e1e0f] text-white font-bold cursor-pointer"
                    >
                      📋 Copy Full Listing
                    </button>
                  )}
                </div>

                {isExpanded && (
                  <div className="p-2.5 rounded-xl bg-white border border-[#cfa96e] space-y-2 text-[11px]">
                    {pr.listingTitle && (
                      <div>
                        <strong className="text-[#831843]">SEO Title:</strong> {pr.listingTitle}
                      </div>
                    )}
                    {pr.listingDescription && (
                      <div className="whitespace-pre-line text-[#374151]">{pr.listingDescription}</div>
                    )}
                    <div>
                      <strong>Tags ({pr.tags.length}):</strong> {pr.tags.join(', ')}
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
