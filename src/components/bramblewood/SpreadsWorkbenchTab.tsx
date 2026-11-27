import { useMemo, useState } from 'react';
import {
  BRAMBLEWOOD_AGENTS,
  type BramblewoodAgentTask,
  type BramblewoodBook,
} from '../../data/bramblewoodData';
import type { BramblewoodSpreadItem } from '../../data/bramblewoodSpreads';
import { getBookFileIcon, type BookDriveFile } from '../../data/bramblewoodFiles';

interface SpreadsWorkbenchTabProps {
  canEdit: boolean;
  constitutionActive?: boolean;
  books: BramblewoodBook[];
  spreadsByBook: Record<number, BramblewoodSpreadItem[]>;
  selectedBookNum: number;
  bookFiles?: BookDriveFile[];
  onSelectBook: (num: number) => void;
  onSaveBookSpreads: (bookNum: number, items: BramblewoodSpreadItem[]) => Promise<void>;
  onDispatchTask: (task: Omit<BramblewoodAgentTask, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  onOpenFile?: (file: BookDriveFile, siblings: BookDriveFile[]) => void;
}

type SpreadFilter = 'all' | 'redo' | 'artPending' | 'enPending' | 'esPending' | 'approved' | 'notes';

function resolvePreviewImageUrl(raw: string): string {
  const s = raw.trim();
  if (!s) return '';
  const m = /\/file\/d\/([a-zA-Z0-9_-]+)/.exec(s) || /[?&]id=([a-zA-Z0-9_-]+)/.exec(s);
  if (m && /drive\.google\.com/i.test(s)) {
    return `https://drive.google.com/thumbnail?id=${m[1]}&sz=w800`;
  }
  return s;
}

export function SpreadsWorkbenchTab({
  canEdit,
  constitutionActive = false,
  books,
  spreadsByBook,
  selectedBookNum,
  bookFiles = [],
  onSelectBook,
  onSaveBookSpreads,
  onDispatchTask,
  onOpenFile,
}: SpreadsWorkbenchTabProps) {
  const [filter, setFilter] = useState<SpreadFilter>('all');
  const [searchQ, setSearchQ] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [lightboxUrl, setLightboxUrl] = useState<string | null>(null);
  const [addingItem, setAddingItem] = useState(false);
  const [newItemName, setNewItemName] = useState('');
  const [newPages, setNewPages] = useState('');
  const [newEn, setNewEn] = useState('');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const curBook = books.find((b) => b.num === selectedBookNum) || books[0];
  const items = spreadsByBook[selectedBookNum] || [];

  function flash(msg: string) {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 2000);
  }

  const stats = useMemo(() => {
    const artItems = items.filter((s) => s.isArtItem);
    const totalArt = artItems.length || items.length;
    const artDone = artItems.filter((s) => s.artApproved).length;
    const enDone = items.filter((s) => s.englishApproved).length;
    const esDone = items.filter((s) => s.spanishApproved).length;
    const redos = items.filter((s) => s.needsComfyRedo).length;
    const fullyReady = items.filter(
      (s) => (!s.isArtItem || s.artApproved) && s.englishApproved && s.spanishApproved && !s.needsComfyRedo
    ).length;
    const pct = items.length ? Math.round((fullyReady / items.length) * 100) : 0;
    return { totalArt, artDone, enDone, esDone, redos, fullyReady, total: items.length, pct };
  }, [items]);

  const filteredItems = useMemo(() => {
    const q = searchQ.trim().toLowerCase();
    return items.filter((s) => {
      if (filter === 'redo' && !s.needsComfyRedo) return false;
      if (filter === 'artPending' && (!s.isArtItem || s.artApproved)) return false;
      if (filter === 'enPending' && s.englishApproved) return false;
      if (filter === 'esPending' && s.spanishApproved) return false;
      if (
        filter === 'approved' &&
        !((!s.isArtItem || s.artApproved) && s.englishApproved && s.spanishApproved)
      ) {
        return false;
      }
      if (filter === 'notes' && !s.notes.trim()) return false;
      if (!q) return true;
      return `${s.item} ${s.englishText} ${s.spanishText} ${s.notes}`.toLowerCase().includes(q);
    });
  }, [items, filter, searchQ]);

  async function updateSpread(id: string, patch: Partial<BramblewoodSpreadItem>) {
    if (!canEdit) return;
    const next = items.map((s) => (s.id === id ? { ...s, ...patch } : s));
    await onSaveBookSpreads(selectedBookNum, next);
  }

  function exportBookCsv() {
    const hdr = ['Book', 'Item', 'Pages', 'Art Approved', 'English Approved', 'Spanish Approved', 'Needs ComfyUI Redo', 'English Text', 'Spanish Text', 'Notes'];
    const esc = (v: unknown) => `"${String(v ?? '').replace(/"/g, '""')}"`;
    const rows = items.map((s) =>
      [curBook?.title, s.item, s.pages, s.artApproved, s.englishApproved, s.spanishApproved, s.needsComfyRedo, s.englishText, s.spanishText, s.notes]
        .map(esc)
        .join(',')
    );
    const blob = new Blob([[hdr.map(esc).join(','), ...rows].join('\n')], { type: 'text/csv;charset=utf-8' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `bramblewood-book-${selectedBookNum}-spreads.csv`;
    a.click();
  }

  return (
    <div className="space-y-4">
      {/* Book Selector Pills */}
      <div className="parchment-panel p-3.5 rounded-2xl space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h2 className="font-atlas text-base sm:text-lg font-bold text-[#2e1e0f]">
              📖 Spread-by-Spread Approval Workbench
            </h2>
            <p className="text-xs text-[#6e4d28]">
              Rows turn green automatically when Art, English, and Spanish are all checked off (zero Excel syncing needed).
            </p>
          </div>
          {toastMsg && (
            <span className="px-3 py-1 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-900 text-xs font-bold">
              {toastMsg}
            </span>
          )}
        </div>

        <div className="flex flex-wrap gap-1.5">
          {books.map((b) => {
            const bSpreads = spreadsByBook[b.num] || [];
            const redoCount = bSpreads.filter((x) => x.needsComfyRedo).length;
            const active = b.num === selectedBookNum;
            return (
              <button
                key={b.num}
                onClick={() => {
                  onSelectBook(b.num);
                  setExpandedId(null);
                }}
                className={`px-2.5 py-1.5 rounded-xl text-xs font-bold cursor-pointer border flex items-center gap-1.5 transition ${
                  active
                    ? 'bg-[#831843] text-white border-[#500724] shadow-sm'
                    : 'bg-white text-[#2e1e0f] border-[#cfa96e] hover:bg-[#fdf2f8]'
                }`}
              >
                <span>#{b.num}</span>
                <span className="truncate max-w-[130px]">{b.title.replace(/^The /, '')}</span>
                {redoCount > 0 && (
                  <span
                    className={`px-1.5 rounded-full text-[10px] ${
                      active ? 'bg-amber-300 text-amber-950' : 'bg-amber-100 text-amber-900'
                    }`}
                  >
                    {redoCount} redo
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Selected Book Rollup & Filters */}
        <div className="p-3 rounded-xl bg-white/85 border border-[#cfa96e] space-y-2.5 text-xs">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <span className="font-atlas font-bold text-sm text-[#831843]">
                Book {selectedBookNum}: {curBook?.title}
              </span>
              <div className="text-[11px] text-[#6e4d28] mt-0.5 flex flex-wrap gap-3">
                <span>🎨 Art: <strong>{stats.artDone}/{stats.totalArt}</strong></span>
                <span>🇺🇸 English: <strong>{stats.enDone}/{stats.total}</strong></span>
                <span>🇲🇽 Spanish: <strong>{stats.esDone}/{stats.total}</strong></span>
                <span>🔁 ComfyUI Redos: <strong className={stats.redos ? 'text-amber-800' : 'text-emerald-700'}>{stats.redos} left</strong></span>
                <span>✅ Fully Ready: <strong>{stats.fullyReady}/{stats.total} ({stats.pct}%)</strong></span>
              </div>
            </div>
            <div className="flex flex-wrap gap-1.5">
              <button
                onClick={exportBookCsv}
                className="ribbon-btn px-2.5 py-1 rounded-lg font-bold cursor-pointer"
              >
                📥 Export CSV
              </button>
              {canEdit && (
                <button
                  onClick={() => setAddingItem((v) => !v)}
                  className="px-2.5 py-1 rounded-lg bg-[#831843] text-white font-bold cursor-pointer"
                >
                  ＋ Add Row
                </button>
              )}
            </div>
          </div>

          {onOpenFile && (() => {
            const curFiles = bookFiles.filter((f) => f.bookNum === selectedBookNum);
            if (!curFiles.length) return null;
            return (
              <div className="flex flex-wrap items-center gap-1.5 pt-1 border-t border-[#e7d4ac]">
                <span className="font-bold text-[#6e4d28]">📂 Open Book Files:</span>
                {curFiles.map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => onOpenFile(f, curFiles)}
                    className="px-2 py-1 rounded-lg bg-[#fdf2f8] hover:bg-[#fce7f3] border border-[#f472b6] text-[11px] font-bold text-[#831843] cursor-pointer"
                  >
                    {getBookFileIcon(f.kind)} {f.label}
                    {f.language === 'ES' ? ' (ES)' : ''}
                  </button>
                ))}
              </div>
            );
          })()}

          <div className="flex flex-wrap items-center gap-1.5">
            <input
              type="search"
              value={searchQ}
              onChange={(e) => setSearchQ(e.target.value)}
              placeholder="🔎 Search spread text or notes..."
              className="flex-1 min-w-[170px] px-2.5 py-1 rounded-lg border border-[#cfa96e] bg-white"
            />
            {(
              [
                ['all', `All (${items.length})`],
                ['redo', `ComfyUI Redo (${stats.redos})`],
                ['artPending', 'Art Pending'],
                ['enPending', 'EN Pending'],
                ['esPending', 'ES Pending'],
                ['approved', 'All 3 Approved'],
                ['notes', 'Has Notes'],
              ] as Array<[SpreadFilter, string]>
            ).map(([k, lbl]) => (
              <button
                key={k}
                onClick={() => setFilter(k)}
                className={`px-2 py-1 rounded-full text-[11px] font-bold border cursor-pointer ${
                  filter === k
                    ? 'bg-[#2e1e0f] text-white border-[#2e1e0f]'
                    : 'bg-[#fdf7ea] text-[#2e1e0f] border-[#cfa96e]'
                }`}
              >
                {lbl}
              </button>
            ))}
          </div>

          {addingItem && canEdit && (
            <div className="p-2.5 rounded-xl bg-[#fdf2f8] border border-[#f472b6] grid grid-cols-1 sm:grid-cols-3 gap-2">
              <input
                type="text"
                value={newItemName}
                onChange={(e) => setNewItemName(e.target.value)}
                placeholder="Item (e.g., Activity pack ES)"
                className="px-2.5 py-1 rounded border border-[#f472b6] bg-white"
              />
              <input
                type="text"
                value={newPages}
                onChange={(e) => setNewPages(e.target.value)}
                placeholder="Pages (e.g., 29-30)"
                className="px-2.5 py-1 rounded border border-[#f472b6] bg-white"
              />
              <button
                onClick={async () => {
                  if (!newItemName.trim()) return;
                  const newRow: BramblewoodSpreadItem = {
                    id: `b${selectedBookNum}-${Date.now().toString(36)}`,
                    bookNum: selectedBookNum,
                    item: newItemName.trim(),
                    pages: newPages.trim(),
                    isArtItem: true,
                    englishText: newEn.trim(),
                    spanishText: '',
                    artApproved: false,
                    englishApproved: false,
                    spanishApproved: false,
                    needsComfyRedo: true,
                    notes: '',
                    artPreviewUrl: '',
                    comfyPrompt: '',
                    assignedAgent: 'art-director',
                  };
                  await onSaveBookSpreads(selectedBookNum, [...items, newRow]);
                  setNewItemName('');
                  setNewPages('');
                  setNewEn('');
                  setAddingItem(false);
                  flash('Spread item added ✔');
                }}
                className="px-3 py-1 rounded bg-[#831843] text-white font-bold cursor-pointer"
              >
                Save New Spread
              </button>
              <textarea
                rows={2}
                value={newEn}
                onChange={(e) => setNewEn(e.target.value)}
                placeholder="English text (optional)"
                className="sm:col-span-3 px-2.5 py-1 rounded border border-[#f472b6] bg-white"
              />
            </div>
          )}
        </div>
      </div>

      {/* Spreads List */}
      <div className="space-y-2.5">
        {filteredItems.map((s) => {
          const allThree = (!s.isArtItem || s.artApproved) && s.englishApproved && s.spanishApproved;
          const isOpen = expandedId === s.id;
          const previewThumb = resolvePreviewImageUrl(s.artPreviewUrl);
          const cardBg = allThree && !s.needsComfyRedo
            ? 'bg-emerald-50 border-emerald-400'
            : s.needsComfyRedo
              ? 'bg-amber-50/90 border-amber-300'
              : 'bg-white border-[#cfa96e]';

          return (
            <div key={s.id} className={`p-3 rounded-2xl border-2 text-xs space-y-2 transition ${cardBg}`}>
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div className="flex items-start gap-2.5 min-w-0 flex-1">
                  {previewThumb ? (
                    <button
                      type="button"
                      onClick={() => setLightboxUrl(previewThumb)}
                      className="w-14 h-14 rounded-xl overflow-hidden border border-black/20 shrink-0 cursor-pointer"
                      title="Zoom artwork preview"
                    >
                      <img src={previewThumb} alt={s.item} className="w-full h-full object-cover" />
                    </button>
                  ) : (
                    <div className="w-11 h-11 rounded-xl bg-[#fbf3df] border border-[#cfa96e] flex flex-col items-center justify-center shrink-0 font-bold text-[#6e4d28]">
                      <span>{s.item.length <= 4 ? s.item.toUpperCase() : '📄'}</span>
                      {s.pages && <span className="text-[9px] font-normal">p.{s.pages}</span>}
                    </div>
                  )}
                  <div className="min-w-0 flex-1 space-y-1">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="font-bold text-sm text-[#2e1e0f]">{s.item}</span>
                      {s.pages && (
                        <span className="px-1.5 py-0.5 rounded bg-black/5 text-[10px] font-semibold">
                          Pages {s.pages}
                        </span>
                      )}
                      {allThree && !s.needsComfyRedo && (
                        <span className="px-2 py-0.5 rounded-full bg-emerald-600 text-white text-[10px] font-bold">
                          ✔ Ready
                        </span>
                      )}
                      {s.needsComfyRedo && (
                        <span className="px-2 py-0.5 rounded-full bg-amber-600 text-white text-[10px] font-bold">
                          🔁 Needs ComfyUI Redo
                        </span>
                      )}
                    </div>
                    <p className="text-[#374151] leading-snug line-clamp-2">
                      {s.englishText || <span className="italic text-[#6b7280]">No English text entered yet.</span>}
                    </p>
                    {s.spanishText && (
                      <p className="text-[#1d4ed8] text-[11px] line-clamp-1">🇲🇽 {s.spanishText}</p>
                    )}
                    {s.notes && (
                      <div className="text-[11px] text-[#78350f] font-medium">📝 {s.notes}</div>
                    )}
                  </div>
                </div>

                {/* Quick Approval Toggles */}
                <div className="flex flex-wrap items-center gap-1.5 shrink-0">
                  {s.isArtItem && (
                    <label className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-white border border-black/15 cursor-pointer font-bold">
                      <input
                        type="checkbox"
                        disabled={!canEdit}
                        checked={s.artApproved}
                        onChange={(e) =>
                          void updateSpread(s.id, {
                            artApproved: e.target.checked,
                            needsComfyRedo: e.target.checked ? false : s.needsComfyRedo,
                          })
                        }
                        className="accent-emerald-600"
                      />
                      Art
                    </label>
                  )}
                  <label className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-white border border-black/15 cursor-pointer font-bold">
                    <input
                      type="checkbox"
                      disabled={!canEdit}
                      checked={s.englishApproved}
                      onChange={(e) => void updateSpread(s.id, { englishApproved: e.target.checked })}
                      className="accent-emerald-600"
                    />
                    EN
                  </label>
                  <label className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-white border border-black/15 cursor-pointer font-bold">
                    <input
                      type="checkbox"
                      disabled={!canEdit}
                      checked={s.spanishApproved}
                      onChange={(e) => void updateSpread(s.id, { spanishApproved: e.target.checked })}
                      className="accent-emerald-600"
                    />
                    ES
                  </label>
                  <label className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-white border border-amber-400 cursor-pointer font-bold text-amber-900">
                    <input
                      type="checkbox"
                      disabled={!canEdit}
                      checked={s.needsComfyRedo}
                      onChange={(e) => void updateSpread(s.id, { needsComfyRedo: e.target.checked })}
                      className="accent-amber-600"
                    />
                    Redo
                  </label>
                  <button
                    onClick={() => setExpandedId(isOpen ? null : s.id)}
                    className="ribbon-btn px-2.5 py-1 rounded-lg font-bold cursor-pointer"
                  >
                    {isOpen ? 'Close' : '✏️ Edit & Art'}
                  </button>
                </div>
              </div>

              {/* Expanded Workbench Drawer */}
              {isOpen && (
                <div className="p-3 rounded-xl bg-white/95 border border-[#cfa96e] space-y-2.5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                    <div>
                      <label className="font-bold text-[#2e1e0f] block mb-1">🇺🇸 English Spread Text</label>
                      <textarea
                        rows={4}
                        disabled={!canEdit}
                        value={s.englishText}
                        onChange={(e) => void updateSpread(s.id, { englishText: e.target.value })}
                        className="w-full px-2.5 py-1.5 rounded-lg border border-[#cfa96e] bg-white"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-[#1d4ed8] block mb-1">🇲🇽 Spanish Localization Text</label>
                      <textarea
                        rows={4}
                        disabled={!canEdit}
                        value={s.spanishText}
                        onChange={(e) => void updateSpread(s.id, { spanishText: e.target.value })}
                        placeholder="Localized Spanish spread text..."
                        className="w-full px-2.5 py-1.5 rounded-lg border border-[#cfa96e] bg-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div>
                      <label className="font-bold text-[#2e1e0f] block mb-1">
                        🖼️ Artwork Preview URL / Google Drive File Link
                      </label>
                      <input
                        type="url"
                        disabled={!canEdit}
                        value={s.artPreviewUrl}
                        onChange={(e) => void updateSpread(s.id, { artPreviewUrl: e.target.value })}
                        placeholder="https://drive.google.com/file/d/... or direct image URL"
                        className="w-full px-2.5 py-1.5 rounded-lg border border-[#cfa96e] bg-white"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-[#2e1e0f] block mb-1">📝 Reviewer Notes</label>
                      <input
                        type="text"
                        disabled={!canEdit}
                        value={s.notes}
                        onChange={(e) => void updateSpread(s.id, { notes: e.target.value })}
                        placeholder="Approval notes, anatomy checks, wording tweaks..."
                        className="w-full px-2.5 py-1.5 rounded-lg border border-[#cfa96e] bg-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="font-bold text-[#6e4d28] block mb-1">🎨 ComfyUI Scene Prompt (Article V RTX 5090)</label>
                    <textarea
                      rows={2}
                      disabled={!canEdit}
                      value={s.comfyPrompt}
                      onChange={(e) => void updateSpread(s.id, { comfyPrompt: e.target.value })}
                      placeholder="Warm hand-painted children's picture book watercolor scene..."
                      className="w-full px-2.5 py-1.5 rounded-lg border border-[#cfa96e] bg-white"
                    />
                  </div>

                  {canEdit && (
                    <div className="flex flex-wrap items-center gap-1.5 pt-1 border-t border-[#e7d4ac]">
                      {constitutionActive ? (
                        <>
                          <span className="font-bold text-[#6e4d28]">🤖 Send to Agent:</span>
                          {BRAMBLEWOOD_AGENTS.filter((a) =>
                            ['art-director', 'story-editor', 'spanish-editor', 'safety-qa'].includes(a.id)
                          ).map((ag) => (
                            <button
                              key={ag.id}
                              onClick={async () => {
                                await onDispatchTask({
                                  agentId: ag.id,
                                  title: `[Book ${selectedBookNum} · ${s.item}] ${ag.id === 'art-director' ? 'ComfyUI Art Pass' : ag.id === 'spanish-editor' ? 'Spanish Translation' : ag.id === 'story-editor' ? 'English Copy Polish' : 'Article VII QA'}`,
                                  bookNum: selectedBookNum,
                                  spreadId: s.id,
                                  priority: s.needsComfyRedo ? 'High' : 'Normal',
                                  status: 'Queued',
                                  brief: `Book ${selectedBookNum} (${curBook?.title}), ${s.item} (p.${s.pages}). Current English: "${s.englishText}". Notes: "${s.notes || 'None'}".`,
                                  deliverable: '',
                                });
                                flash(`Task queued for ${ag.name} ✔`);
                              }}
                              className="px-2.5 py-1 rounded-lg bg-[#fdf2f8] hover:bg-[#fce7f3] border border-[#f472b6] font-bold text-[#831843] cursor-pointer"
                            >
                              {ag.emoji} {ag.name}
                            </button>
                          ))}
                        </>
                      ) : (
                        <span className="px-2.5 py-1 rounded-full bg-slate-100 border border-slate-300 text-slate-700 text-[11px] font-semibold">
                          ⏸️ Agent dispatching is offline until the Campus Constitution is ratified in Town Hall.
                        </span>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Lightbox Modal for Artwork Preview */}
      {lightboxUrl && (
        <div
          onClick={() => setLightboxUrl(null)}
          className="fixed inset-0 z-[90] bg-black/80 flex items-center justify-center p-4 cursor-pointer"
        >
          <div className="max-w-3xl max-h-[88vh] bg-white p-2 rounded-2xl shadow-2xl space-y-2">
            <img src={lightboxUrl} alt="Spread Artwork" className="max-h-[78vh] w-auto rounded-xl" />
            <div className="text-center text-xs font-bold text-[#2e1e0f]">Click anywhere to close</div>
          </div>
        </div>
      )}
    </div>
  );
}
