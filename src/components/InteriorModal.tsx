import { useEffect, useState } from 'react';
import { BILL_OF_RIGHTS_ARTICLES, type BuildingDef } from '../data/campusData';
import { ASSETS } from '../data/assetMeta';

interface InteriorModalProps {
  building: BuildingDef | null;
  onClose: () => void;
  onOpenFamilyPreview: () => void;
}

export function InteriorModal({
  building,
  onClose,
  onOpenFamilyPreview,
}: InteriorModalProps) {
  const [repName, setRepName] = useState('');
  const [savedFlag, setSavedFlag] = useState(false);
  const [showCharter, setShowCharter] = useState(false);

  useEffect(() => {
    if (!building) return;
    setRepName(localStorage.getItem('cairnspire_rep_' + building.id) || '');
    setSavedFlag(false);
    setShowCharter(false);
  }, [building]);

  if (!building) return null;

  const cropSrc = ASSETS['crop-' + building.id]?.src || ASSETS['world-map']?.src || '';
  const repSrc = ASSETS[building.repSprite]?.src || '';

  function handleSaveRep() {
    if (!building) return;
    localStorage.setItem('cairnspire_rep_' + building.id, repName.trim());
    setSavedFlag(true);
    setTimeout(() => setSavedFlag(false), 1400);
  }

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-40 bg-black/55 backdrop-blur-[2px] flex items-end sm:items-center justify-center p-0 sm:p-4"
    >
      <div className="parchment-panel w-full sm:max-w-xl max-h-[88vh] rounded-t-2xl sm:rounded-2xl overflow-hidden flex flex-col">
        <div className="flex items-center justify-between gap-3 px-4 py-3 bg-[#362316] text-[#fbe8b5] border-b-2 border-[#a87e45]">
          <div className="min-w-0">
            <div className="text-[11px] uppercase tracking-wider text-[#dfb97a] font-semibold">
              {building.district}
            </div>
            <h2 className="font-atlas text-lg font-bold truncate">{building.name}</h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#4e3523] hover:bg-[#66462f] text-[#fbe8b5] font-bold flex items-center justify-center shrink-0 cursor-pointer"
          >
            ✕
          </button>
        </div>

        <div className="p-4 overflow-y-auto space-y-4 text-sm text-[#352110]">
          <div className="flex flex-col sm:flex-row items-center gap-4 p-3 rounded-xl bg-[#fbf4e1] border border-[#c4a167]">
            {cropSrc && (
              <img
                src={cropSrc}
                alt={building.name}
                className="w-44 h-32 object-cover rounded-lg border border-[#a87e45] shrink-0 shadow"
              />
            )}
            <div className="space-y-1.5 text-center sm:text-left">
              <span className="inline-block px-2.5 py-0.5 rounded-full bg-[#e6cfa0] text-[#4a2b0f] text-xs font-semibold">
                {building.phase}
              </span>
              <p className="text-xs leading-relaxed text-[#462d16]">{building.motif}</p>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-[#f7ead0] border border-[#b08647]/70 flex items-center gap-3">
            {repSrc && (
              <img
                src={repSrc}
                alt="Representative"
                className="w-12 h-14 object-contain shrink-0 drop-shadow"
              />
            )}
            <div className="flex-1 min-w-0 space-y-1.5">
              <div className="text-[11px] font-bold uppercase tracking-wide text-[#7c5021]">
                Department Head &amp; Government Rep
              </div>
              <div className="text-xs font-semibold text-[#3a2210]">{building.headRole}</div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={repName}
                  onChange={(e) => setRepName(e.target.value)}
                  placeholder="Name this Dept. Head..."
                  className="flex-1 min-w-0 px-2.5 py-1.5 rounded-lg bg-white/90 border border-[#a87e45] text-xs text-[#2b1a0c]"
                />
                <button
                  onClick={handleSaveRep}
                  className="px-3 py-1.5 rounded-lg bg-[#6b4423] hover:bg-[#7d512b] text-[#fbe8b5] text-xs font-semibold shrink-0 cursor-pointer"
                >
                  {savedFlag ? 'Saved ✓' : 'Save'}
                </button>
              </div>
            </div>
          </div>

          {building.special === 'town-hall' && (
            <div className="p-3 rounded-xl bg-[#fff8e7] border border-[#b08647] space-y-2">
              <div className="flex items-center justify-between gap-2">
                <div className="font-atlas font-bold text-sm text-[#4a2b0f]">
                  📜 Preliminary Bill of Rights — Stage 0
                </div>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 border border-emerald-400 text-emerald-900 text-[11px] font-bold shrink-0">
                  RATIFIED · 2026-11-25
                </span>
              </div>
              <p className="text-xs text-[#54371b]">
                Gate 1 (Antigravity Audit):{' '}
                <span className="font-bold text-emerald-700">Passed</span> · Gate 2 (Chancellor
                Amarette): <span className="font-bold text-emerald-700">Ratified &amp; Active</span>
              </p>
              <button
                onClick={() => setShowCharter((s) => !s)}
                className="px-3 py-1.5 rounded-lg bg-[#6b4423] hover:bg-[#7e512a] text-[#fbe8b5] text-xs font-semibold cursor-pointer"
              >
                {showCharter ? 'Hide Ten Foundational Articles ▲' : 'Read Ten Foundational Articles ▼'}
              </button>
              {showCharter && (
                <div className="pt-2 space-y-2 border-t border-[#d8bc8a]">
                  {BILL_OF_RIGHTS_ARTICLES.map((art) => (
                    <div
                      key={art.num}
                      className="p-2.5 rounded-lg bg-white/75 border border-[#d6b782] text-xs space-y-0.5"
                    >
                      <div className="font-bold text-[#3c230f]">
                        {art.num} — {art.title}
                      </div>
                      <p className="text-[#523519] leading-snug">{art.summary}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {building.special === 'commons' && (
            <div className="p-3 rounded-xl bg-[#fff8e7] border border-[#b08647] space-y-1.5">
              <div className="font-atlas font-bold text-sm text-[#4a2b0f]">
                🏛️ Constitutional Convention Floor
              </div>
              <p className="text-xs text-[#54371b]">
                <strong>13 Department Representative Seats</strong> arranged around the spiraling
                elemental Cairnspire, facing the front <strong>Chancellor &amp; Speaker Dais</strong>.
              </p>
            </div>
          )}

          {building.special === 'stocks' && (
            <div className="p-3 rounded-xl bg-[#fff8e7] border border-[#b08647] space-y-1.5">
              <div className="font-atlas font-bold text-sm text-[#4a2b0f]">
                📈 Article VIII Scoped Trading Charter
              </div>
              <p className="text-xs text-[#54371b]">
                Live trades are strictly walled to a single designated agent (currently GrokBot, or
                a future Chancellor-authorized upgraded agent) operating inside its dedicated{' '}
                <strong>Robinhood MCP agent account</strong> under explicit hard rules &amp;
                Courthouse audit logging. All other Stocks roles are strictly research and
                human-defined jobs.
              </p>
            </div>
          )}

          {building.special === 'home-garden' && (
            <div className="p-3 rounded-xl bg-[#e9f5ec] border border-[#2d6a4f] space-y-2">
              <div className="font-atlas font-bold text-sm text-[#1b4332]">
                🏡 Family-Locked Wing (App-Within-the-App)
              </div>
              <p className="text-xs text-[#2d6a4f]">
                Amarette and Ray have full University access; other family logins (and Liam &amp;
                Oliver’s Parent-Paired Kid Mode) open <strong>strictly inside Home and Garden</strong>.
              </p>
              <button
                onClick={() => {
                  onClose();
                  onOpenFamilyPreview();
                }}
                className="px-3 py-1.5 rounded-lg bg-[#2d6a4f] hover:bg-[#1b4332] text-white text-xs font-semibold cursor-pointer"
              >
                Test Liam &amp; Oliver Kid Mode →
              </button>
            </div>
          )}

          <div className="space-y-1.5">
            <div className="text-xs font-bold uppercase tracking-wide text-[#7c5021]">
              Department Zones &amp; Specialist Slots
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {building.zones.map((z) => (
                <div
                  key={z}
                  className="px-3 py-2 rounded-lg bg-white/65 border border-[#b89259] text-xs font-medium text-[#3b2410]"
                >
                  ✦ {z}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
