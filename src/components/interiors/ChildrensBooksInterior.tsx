import { useEffect, useState } from 'react';
import type { CampusRole } from '../../firebase';
import {
  DRIVE_BOOK_RESOURCES,
  SPARROW_SPROCKET_BRAND,
  type BramblewoodBook,
  type PrintableProduct,
} from '../../data/bramblewoodData';
import {
  saveBramblewoodBooks,
  savePrintablesCatalog,
  subscribeBramblewoodBooks,
  subscribePrintablesCatalog,
} from '../../services/booksService';

interface ChildrensBooksInteriorProps {
  role: CampusRole;
  userEmail: string;
}

type BooksTab = 'series' | 'printables' | 'pipeline';

export function ChildrensBooksInterior({ role, userEmail }: ChildrensBooksInteriorProps) {
  const canEdit = role === 'chancellor' || role === 'university';
  const [tab, setTab] = useState<BooksTab>('series');
  const [books, setBooks] = useState<BramblewoodBook[]>([]);
  const [printables, setPrintables] = useState<PrintableProduct[]>([]);
  const [errMsg, setErrMsg] = useState<string | null>(null);
  const [savedToast, setSavedToast] = useState<string | null>(null);

  useEffect(() => {
    const onErr = (e: Error) => setErrMsg(e.message);
    const u1 = subscribeBramblewoodBooks(setBooks, onErr);
    const u2 = subscribePrintablesCatalog(setPrintables, onErr);
    return () => {
      u1();
      u2();
    };
  }, []);

  function flashSaved(msg: string) {
    setSavedToast(msg);
    setTimeout(() => setSavedToast(null), 1800);
  }

  async function updateBook(num: number, patch: Partial<BramblewoodBook>) {
    if (!canEdit) return;
    const next = books.map((b) => (b.num === num ? { ...b, ...patch } : b));
    setBooks(next);
    await saveBramblewoodBooks(next, userEmail);
    flashSaved('Book progress saved ✔');
  }

  async function updatePrintableStatus(id: string, status: PrintableProduct['status']) {
    if (!canEdit) return;
    const next = printables.map((p) => (p.id === id ? { ...p, status } : p));
    setPrintables(next);
    await savePrintablesCatalog(next, userEmail);
    flashSaved('Printable status saved ✔');
  }

  const totalSpreads = books.reduce((s, b) => s + b.illustrations, 0);
  const artDone = books.reduce((s, b) => s + b.artApproved, 0);
  const engDone = books.reduce((s, b) => s + b.englishApproved, 0);
  const espDone = books.reduce((s, b) => s + b.spanishApproved, 0);
  const redoRemaining = books.reduce((s, b) => s + b.comfyRedo, 0);

  return (
    <div className="space-y-3">
      {/* Header Banner */}
      <div className="p-3 rounded-xl bg-[#fdf2f8] border border-[#f472b6] flex flex-wrap items-center justify-between gap-2">
        <div>
          <div className="font-atlas font-bold text-sm text-[#831843]">
            📚 The Bramblewood Friends &amp; Printables Studio
          </div>
          <div className="text-[11px] text-[#9d174d]">
            Article VII Child-Safe Storybook Workshop · English + Español + Sparrow &amp; Sprocket Printables
          </div>
        </div>
        {savedToast && (
          <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 text-[11px] font-bold">
            {savedToast}
          </span>
        )}
      </div>

      {errMsg && (
        <div className="px-3 py-2 rounded-lg bg-red-100 border border-red-300 text-xs text-red-900">
          ⚠️ {errMsg}
        </div>
      )}

      <div className="px-3 py-2 rounded-xl bg-amber-50 border border-amber-300 text-[11px] text-amber-950 leading-relaxed">
        <strong>🌱 v3b Starter Approval Tracker:</strong> Use this room to track book approval counts
        and printables today. The full <strong>Bramblewood Publishing Suite &amp; Multi-Agent Studio</strong>{' '}
        (spread-by-spread visual approval workbench + dedicated publishing agent team) is planned for{' '}
        <strong>v4</strong>.
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setTab('series')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer border ${
            tab === 'series'
              ? 'bg-[#9d174d] text-white border-[#831843]'
              : 'bg-white text-[#831843] border-[#fbcfe8]'
          }`}
        >
          📖 Bramblewood Series ({books.length})
        </button>
        <button
          onClick={() => setTab('printables')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer border ${
            tab === 'printables'
              ? 'bg-[#9d174d] text-white border-[#831843]'
              : 'bg-white text-[#831843] border-[#fbcfe8]'
          }`}
        >
          🖨️ Printables &amp; Launch Kit ({printables.length})
        </button>
        <button
          onClick={() => setTab('pipeline')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer border ${
            tab === 'pipeline'
              ? 'bg-[#9d174d] text-white border-[#831843]'
              : 'bg-white text-[#831843] border-[#fbcfe8]'
          }`}
        >
          🎨 ComfyUI Art Pipeline ({redoRemaining} left)
        </button>
      </div>

      {/* TAB 1: BRAMBLEWOOD 9 BOOKS */}
      {tab === 'series' && (
        <div className="space-y-3">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
            <div className="p-2.5 rounded-xl bg-white border border-[#fbcfe8]">
              <div className="text-[10px] text-[#9d174d] font-bold uppercase">Art Approved</div>
              <div className="font-bold text-sm text-[#831843]">
                {artDone} / {totalSpreads}
              </div>
            </div>
            <div className="p-2.5 rounded-xl bg-white border border-[#fbcfe8]">
              <div className="text-[10px] text-[#9d174d] font-bold uppercase">ComfyUI Redos Left</div>
              <div className="font-bold text-sm text-[#831843]">{redoRemaining}</div>
            </div>
            <div className="p-2.5 rounded-xl bg-white border border-[#fbcfe8]">
              <div className="text-[10px] text-[#9d174d] font-bold uppercase">English Approved</div>
              <div className="font-bold text-sm text-[#831843]">
                {engDone} / {totalSpreads}
              </div>
            </div>
            <div className="p-2.5 rounded-xl bg-white border border-[#fbcfe8]">
              <div className="text-[10px] text-[#9d174d] font-bold uppercase">Spanish Approved</div>
              <div className="font-bold text-sm text-[#831843]">
                {espDone} / {totalSpreads}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            {books.map((b) => {
              const allReady =
                b.artApproved >= b.illustrations &&
                b.englishApproved >= b.illustrations &&
                b.spanishApproved >= b.illustrations;
              return (
                <div
                  key={b.num}
                  className={`p-3 rounded-xl border text-xs space-y-2 ${
                    allReady ? 'bg-emerald-50 border-emerald-300' : 'bg-white/95 border-[#fbcfe8]'
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="font-bold text-[#831843]">
                      Book {b.num}: {b.title}
                    </div>
                    {canEdit ? (
                      <select
                        value={b.status}
                        onChange={(e) =>
                          void updateBook(b.num, {
                            status: e.target.value as BramblewoodBook['status'],
                          })
                        }
                        className="px-2 py-0.5 rounded border border-[#f472b6] bg-[#fdf2f8] text-[11px] font-bold"
                      >
                        <option>Not started</option>
                        <option>Needs ComfyUI redo</option>
                        <option>In review</option>
                        <option>Approved</option>
                        <option>Published</option>
                      </select>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full bg-[#fdf2f8] text-[10px] font-bold text-[#831843]">
                        {b.status}
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
                    <div>
                      <span className="text-[#9d174d]">Art:</span>{' '}
                      <strong>
                        {b.artApproved}/{b.illustrations}
                      </strong>
                      {canEdit && (
                        <button
                          onClick={() =>
                            void updateBook(b.num, {
                              artApproved: Math.min(b.illustrations, b.artApproved + 1),
                              comfyRedo: Math.max(0, b.comfyRedo - 1),
                            })
                          }
                          className="ml-1 px-1.5 rounded bg-[#fce7f3] font-bold cursor-pointer"
                          title="Approve +1 spread"
                        >
                          +1
                        </button>
                      )}
                    </div>
                    <div>
                      <span className="text-[#9d174d]">English:</span>{' '}
                      <strong>
                        {b.englishApproved}/{b.illustrations}
                      </strong>
                      {canEdit && (
                        <button
                          onClick={() =>
                            void updateBook(b.num, {
                              englishApproved:
                                b.englishApproved >= b.illustrations ? 0 : b.illustrations,
                            })
                          }
                          className="ml-1 px-1.5 rounded bg-[#fce7f3] font-bold cursor-pointer"
                        >
                          {b.englishApproved >= b.illustrations ? 'Reset' : 'All'}
                        </button>
                      )}
                    </div>
                    <div>
                      <span className="text-[#9d174d]">Spanish:</span>{' '}
                      <strong>
                        {b.spanishApproved}/{b.illustrations}
                      </strong>
                      {canEdit && (
                        <button
                          onClick={() =>
                            void updateBook(b.num, {
                              spanishApproved:
                                b.spanishApproved >= b.illustrations ? 0 : b.illustrations,
                            })
                          }
                          className="ml-1 px-1.5 rounded bg-[#fce7f3] font-bold cursor-pointer"
                        >
                          {b.spanishApproved >= b.illustrations ? 'Reset' : 'All'}
                        </button>
                      )}
                    </div>
                    <div>
                      <span className="text-[#9d174d]">ComfyUI Redo:</span>{' '}
                      <strong>{b.comfyRedo} left</strong>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: PRINTABLES CATALOG */}
      {tab === 'printables' && (
        <div className="space-y-3 text-xs">
          <div className="p-3 rounded-xl bg-white border border-[#fbcfe8] space-y-2">
            <div className="font-bold text-[#831843]">
              🌿 {SPARROW_SPROCKET_BRAND.shopName} · Brand Kit
            </div>
            <p className="text-[11px] text-[#4b5563]">{SPARROW_SPROCKET_BRAND.tagline}</p>
            <div className="flex flex-wrap gap-1.5">
              {SPARROW_SPROCKET_BRAND.colors.map((c) => (
                <span
                  key={c.name}
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full border border-black/10 text-[10px] font-semibold bg-[#fafafa]"
                >
                  <span
                    className="w-2.5 h-2.5 rounded-full inline-block border border-black/20"
                    style={{ backgroundColor: c.hex }}
                  />
                  {c.name}
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
                  className="px-2.5 py-1 rounded-lg bg-[#fdf2f8] border border-[#f472b6] text-[#9d174d] font-bold underline"
                >
                  📁 {r.label} ↗
                </a>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {printables.map((pr) => (
              <div
                key={pr.id}
                className="p-3 rounded-xl bg-white border border-[#fbcfe8] space-y-1.5 flex flex-col justify-between"
              >
                <div className="space-y-1">
                  <div className="flex items-start justify-between gap-2">
                    <div className="font-bold text-[#831843]">
                      #{pr.num} · {pr.title}
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-[#fef3c7] text-[#92400e] text-[10px] font-bold shrink-0">
                      {pr.price}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#374151]">{pr.summary}</p>
                  <div className="text-[10px] text-[#6b7280]">
                    {pr.pages} · {pr.versions}
                  </div>
                </div>
                <div className="flex items-center justify-between pt-1">
                  {canEdit ? (
                    <select
                      value={pr.status}
                      onChange={(e) =>
                        void updatePrintableStatus(pr.id, e.target.value as PrintableProduct['status'])
                      }
                      className="px-2 py-0.5 rounded border border-[#f472b6] bg-[#fdf2f8] text-[11px] font-bold"
                    >
                      <option>Draft</option>
                      <option>Ready for Etsy</option>
                      <option>Listed</option>
                    </select>
                  ) : (
                    <span className="px-2 py-0.5 rounded-full bg-[#fdf2f8] text-[10px] font-bold text-[#831843]">
                      {pr.status}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: COMFYUI PIPELINE */}
      {tab === 'pipeline' && (
        <div className="p-3 rounded-xl bg-white border border-[#fbcfe8] space-y-2 text-xs text-[#374151]">
          <div className="font-bold text-sm text-[#831843]">🎨 ComfyUI Storybook Illustration Pipeline</div>
          <p>
            <strong>Rule from Tracker:</strong> Hold publishing until the ComfyUI art redo is approved
            for each book. Currently <strong>{artDone}</strong> of <strong>{totalSpreads}</strong>{' '}
            spreads are approved (Book 1: <em>Milo’s Zoom Brain</em> has 12/12 art approved;{' '}
            <strong>{redoRemaining}</strong> spreads across Books 2–9 are queued for ComfyUI).
          </p>
          <p className="text-[11px] text-[#6b7280]">
            Connected via A.I.R. to Ray’s RTX 5090 (<code>comfyui-local</code>) under strict Article V
            local-GPU preference &amp; Article VII warm, child-safe standards. Any future store publishing or
            paid listing fees go through an Executive Watch <code>! Permit</code> first.
          </p>
        </div>
      )}
    </div>
  );
}
