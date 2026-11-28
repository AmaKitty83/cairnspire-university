import { useEffect, useMemo, useState } from 'react';
import { ASSETS } from '../data/assetMeta';
import type { CampusRole } from '../firebase';
import {
  type BramblewoodAgentTask,
  type BramblewoodBook,
  type BramblewoodCharacter,
  type PrintableProduct,
} from '../data/bramblewoodData';
import type { BramblewoodSpreadItem } from '../data/bramblewoodSpreads';
import type { BookDriveFile } from '../data/bramblewoodFiles';
import {
  isCampusConstitutionRatified,
  type GovernanceProposal,
} from '../services/firestoreService';
import {
  saveAgentTasks,
  saveBookFiles,
  saveBramblewoodBooks,
  saveBramblewoodSpreads,
  saveCharacterBible,
  savePrintablesCatalog,
  subscribeAgentTasks,
  subscribeBookFiles,
  subscribeBramblewoodBooks,
  subscribeBramblewoodSpreads,
  subscribeCharacterBible,
  subscribePrintablesCatalog,
} from '../services/booksService';
import { AgentCompanyTab } from './bramblewood/AgentCompanyTab';
import { BookFilesLibraryTab } from './bramblewood/BookFilesLibraryTab';
import { BookFileViewerModal } from './bramblewood/BookFileViewerModal';
import { CharacterBibleTab } from './bramblewood/CharacterBibleTab';
import { PrintablesStudioTab } from './bramblewood/PrintablesStudioTab';
import { SpreadsWorkbenchTab } from './bramblewood/SpreadsWorkbenchTab';

interface BramblewoodSuiteViewProps {
  role: CampusRole;
  userEmail: string;
  proposals?: GovernanceProposal[];
  onExitToCampus: () => void;
  onOpenRoomView?: () => void;
}

type SuiteTab = 'overview' | 'library' | 'spreads' | 'agents' | 'bible' | 'printables';

export function BramblewoodSuiteView({
  role,
  userEmail,
  proposals = [],
  onExitToCampus,
  onOpenRoomView,
}: BramblewoodSuiteViewProps) {
  const canEdit = role === 'chancellor' || role === 'university';
  const constitutionActive = useMemo(() => isCampusConstitutionRatified(proposals), [proposals]);

  const [tab, setTab] = useState<SuiteTab>('overview');
  const [selectedBookNum, setSelectedBookNum] = useState<number>(1);
  const [bwDark, setBwDark] = useState<boolean>(() => {
    try {
      return localStorage.getItem('bw_dark') === '1';
    } catch {
      return false;
    }
  });

  const [books, setBooks] = useState<BramblewoodBook[]>([]);
  const [spreadsByBook, setSpreadsByBook] = useState<Record<number, BramblewoodSpreadItem[]>>({});
  const [characters, setCharacters] = useState<BramblewoodCharacter[]>([]);
  const [tasks, setTasks] = useState<BramblewoodAgentTask[]>([]);
  const [printables, setPrintables] = useState<PrintableProduct[]>([]);
  const [bookFiles, setBookFiles] = useState<BookDriveFile[]>([]);
  const [viewerState, setViewerState] = useState<{ file: BookDriveFile; siblings: BookDriveFile[] } | null>(null);
  const [syncError, setSyncError] = useState<string | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  useEffect(() => {
    const onErr = (err: Error) => setSyncError(err.message);
    const u1 = subscribeBramblewoodBooks(setBooks, onErr);
    const u2 = subscribeBramblewoodSpreads(setSpreadsByBook, onErr);
    const u3 = subscribeCharacterBible(setCharacters, onErr);
    const u4 = subscribeAgentTasks(setTasks, onErr);
    const u5 = subscribePrintablesCatalog(setPrintables, onErr);
    const u6 = subscribeBookFiles(setBookFiles, onErr);
    return () => {
      u1();
      u2();
      u3();
      u4();
      u5();
      u6();
    };
  }, []);

  function openViewer(file: BookDriveFile, siblings?: BookDriveFile[]) {
    const fallbackSiblings = bookFiles.filter((f) => f.bookNum === file.bookNum);
    setViewerState({
      file,
      siblings: siblings && siblings.length ? siblings : fallbackSiblings.length ? fallbackSiblings : [file],
    });
  }

  function flash(msg: string) {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 2000);
  }

  function toggleDark() {
    setBwDark((prev) => {
      const next = !prev;
      try {
        localStorage.setItem('bw_dark', next ? '1' : '0');
      } catch {
        // ignore
      }
      return next;
    });
  }

  // Compute live per-book rollups straight from spreadsByBook so Dashboard & Workbench stay 100% synced
  const bookRollups = useMemo(() => {
    return books.map((b) => {
      const items = spreadsByBook[b.num] || [];
      if (!items.length) {
        return {
          book: b,
          totalItems: b.illustrations,
          totalArt: b.illustrations,
          artApproved: b.artApproved,
          englishApproved: b.englishApproved,
          spanishApproved: b.spanishApproved,
          comfyRedo: b.comfyRedo,
          pctReady: 0,
        };
      }
      const artList = items.filter((s) => s.isArtItem);
      const artApproved = artList.filter((s) => s.artApproved).length;
      const englishApproved = items.filter((s) => s.englishApproved).length;
      const spanishApproved = items.filter((s) => s.spanishApproved).length;
      const comfyRedo = items.filter((s) => s.needsComfyRedo).length;
      const readyRows = items.filter(
        (s) => (!s.isArtItem || s.artApproved) && s.englishApproved && s.spanishApproved && !s.needsComfyRedo
      ).length;
      return {
        book: b,
        totalItems: items.length,
        totalArt: artList.length,
        artApproved,
        englishApproved,
        spanishApproved,
        comfyRedo,
        pctReady: Math.round((readyRows / items.length) * 100),
      };
    });
  }, [books, spreadsByBook]);

  const seriesTotals = useMemo(() => {
    const totalArt = bookRollups.reduce((s, x) => s + x.totalArt, 0);
    const artDone = bookRollups.reduce((s, x) => s + x.artApproved, 0);
    const totalItems = bookRollups.reduce((s, x) => s + x.totalItems, 0);
    const enDone = bookRollups.reduce((s, x) => s + x.englishApproved, 0);
    const esDone = bookRollups.reduce((s, x) => s + x.spanishApproved, 0);
    const redosLeft = bookRollups.reduce((s, x) => s + x.comfyRedo, 0);
    const needsApprovalTasks = tasks.filter((t) => t.status === 'Needs Approval').length;
    const openTasks = tasks.filter((t) => t.status !== 'Approved').length;
    return { totalArt, artDone, totalItems, enDone, esDone, redosLeft, needsApprovalTasks, openTasks };
  }, [bookRollups, tasks]);

  async function handleSaveBookSpreads(bookNum: number, items: BramblewoodSpreadItem[]) {
    if (!canEdit) return;
    const nextSpreads = { ...spreadsByBook, [bookNum]: items };
    setSpreadsByBook(nextSpreads);
    await saveBramblewoodSpreads(nextSpreads, userEmail);

    // Sync rollup counts onto bramblewood_series doc too
    const artList = items.filter((s) => s.isArtItem);
    const nextBooks = books.map((b) =>
      b.num === bookNum
        ? {
            ...b,
            illustrations: artList.length || b.illustrations,
            artApproved: artList.filter((s) => s.artApproved).length,
            englishApproved: items.filter((s) => s.englishApproved).length,
            spanishApproved: items.filter((s) => s.spanishApproved).length,
            comfyRedo: items.filter((s) => s.needsComfyRedo).length,
          }
        : b
    );
    setBooks(nextBooks);
    await saveBramblewoodBooks(nextBooks, userEmail);
    flash('Saved ✔');
  }

  async function handleSaveBookStatus(bookNum: number, status: BramblewoodBook['status']) {
    if (!canEdit) return;
    const next = books.map((b) => (b.num === bookNum ? { ...b, status } : b));
    setBooks(next);
    await saveBramblewoodBooks(next, userEmail);
    flash('Book status updated ✔');
  }

  async function handleDispatchTask(
    inp: Omit<BramblewoodAgentTask, 'id' | 'createdAt' | 'updatedAt'>
  ) {
    if (!canEdit || !constitutionActive) return;
    const today = new Date().toISOString().slice(0, 10);
    const nextTask: BramblewoodAgentTask = {
      ...inp,
      id: `task-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 5)}`,
      createdAt: today,
      updatedAt: today,
    };
    const next = [nextTask, ...tasks];
    setTasks(next);
    await saveAgentTasks(next, userEmail);
    flash('Agent task dispatched ✔');
  }

  function openBookSpreads(num: number) {
    setSelectedBookNum(num);
    setTab('spreads');
  }

  return (
    <section className={`fixed inset-0 z-50 flex flex-col ${bwDark ? 'hg-dark' : 'hg-storybook'}`}>
      {/* Top Cairnspire Studio Bar */}
      <header className="flex items-center justify-between gap-2 px-4 py-2.5 bg-[#4a152b] border-b-2 border-[#ad8042] text-[#fbf3df] shadow shrink-0">
        <div className="flex items-center gap-2.5 min-w-0">
          {ASSETS['crop-childrens-books']?.src && (
            <img
              src={ASSETS['crop-childrens-books'].src}
              alt="Children's Books"
              className="w-8 h-8 rounded-lg object-cover border border-[#ad8042] shrink-0"
            />
          )}
          <div className="min-w-0">
            <h1 className="font-atlas text-base sm:text-lg font-bold truncate">
              📚 The Bramblewood Publishing Suite &amp; Agent Studio
            </h1>
            <p className="text-[11px] text-[#f9a8d4] truncate">
              {constitutionActive
                ? 'Article VII Child-Safe Storybook Studio · 9 Books · 153 Spreads · 9 Agency Roles'
                : 'Article VII Child-Safe Storybook Studio · 9 Books · 153 Spreads · ⏸️ 9 Agency Roles Offline (Pending Constitution)'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {toastMsg && (
            <span className="hidden sm:inline-block px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-950 text-xs font-bold">
              {toastMsg}
            </span>
          )}
          {onOpenRoomView && (
            <button
              onClick={onOpenRoomView}
              className="ribbon-btn px-2.5 py-1 rounded-lg text-xs font-bold cursor-pointer"
              title="Visit the painted Children's Books RPG Library with all 9 agent sprites & workstations"
            >
              🏛️ 9-Agent RPG Room
            </button>
          )}
          <button
            onClick={toggleDark}
            className="ribbon-btn px-2.5 py-1 rounded-lg text-xs font-bold cursor-pointer"
            title="Toggle Daylight Parchment / Candlelight Theme"
          >
            {bwDark ? '☀️' : '🕯️'}
          </button>
          <button
            onClick={onExitToCampus}
            className="ribbon-btn px-3 py-1 rounded-lg text-xs font-bold cursor-pointer"
          >
            ← Campus Map
          </button>
        </div>
      </header>

      {syncError && (
        <div className="bg-red-100 border-b border-red-300 px-4 py-1.5 text-xs text-red-900 text-center">
          ⚠️ {syncError}
        </div>
      )}

      {/* Navigation Ribbon Bar */}
      <nav className="bg-[#f3e3be] border-b border-[#8a6235] px-4 py-2 flex items-center gap-1.5 overflow-x-auto no-scrollbar shrink-0">
        {(
          [
            ['overview', '📊 Series Overview'],
            ['library', `📂 Book Library & Reader (${bookFiles.length})`],
            ['spreads', `📖 Spreads Workbench (${seriesTotals.totalItems})`],
            [
              'agents',
              constitutionActive
                ? `🤖 Agent Company (${seriesTotals.needsApprovalTasks ? `${seriesTotals.needsApprovalTasks} need review` : `${seriesTotals.openTasks} open`})`
                : '⏸️ Agents (Offline · Draft Roster)',
            ],
            ['bible', `🦊 Character Bible (${characters.length})`],
            ['printables', `🖨️ Printables & Launch (${printables.length})`],
          ] as Array<[SuiteTab, string]>
        ).map(([k, lbl]) => (
          <button
            key={k}
            onClick={() => setTab(k)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap cursor-pointer border transition ${
              tab === k
                ? 'bg-[#831843] text-white border-[#500724] shadow-sm'
                : 'bg-white/90 text-[#2e1e0f] border-[#cfa96e] hover:bg-[#fdf2f8]'
            }`}
          >
            {lbl}
          </button>
        ))}
      </nav>

      {/* Scrolling Workspace Body */}
      <main className="flex-1 overflow-y-auto p-3 sm:p-5">
        <div className="max-w-6xl mx-auto">
          {tab === 'overview' && (
            <div className="space-y-4">
              {/* Top KPI Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 text-xs">
                <div className="parchment-panel p-3 rounded-2xl">
                  <div className="text-[10px] font-bold uppercase text-[#6e4d28]">Art Approved</div>
                  <div className="font-atlas font-bold text-lg text-[#831843]">
                    {seriesTotals.artDone} / {seriesTotals.totalArt}
                  </div>
                </div>
                <div className="parchment-panel p-3 rounded-2xl">
                  <div className="text-[10px] font-bold uppercase text-[#6e4d28]">ComfyUI Redos Left</div>
                  <div className="font-atlas font-bold text-lg text-amber-800">
                    {seriesTotals.redosLeft}
                  </div>
                </div>
                <div className="parchment-panel p-3 rounded-2xl">
                  <div className="text-[10px] font-bold uppercase text-[#6e4d28]">English Approved</div>
                  <div className="font-atlas font-bold text-lg text-[#2e1e0f]">
                    {seriesTotals.enDone} / {seriesTotals.totalItems}
                  </div>
                </div>
                <div className="parchment-panel p-3 rounded-2xl">
                  <div className="text-[10px] font-bold uppercase text-[#6e4d28]">Spanish Approved</div>
                  <div className="font-atlas font-bold text-lg text-[#1d4ed8]">
                    {seriesTotals.esDone} / {seriesTotals.totalItems}
                  </div>
                </div>
                <div className="parchment-panel p-3 rounded-2xl">
                  <div className="text-[10px] font-bold uppercase text-[#6e4d28]">
                    {constitutionActive ? 'Awaiting Amarette' : 'Agent Fleet'}
                  </div>
                  {constitutionActive ? (
                    <div className="font-atlas font-bold text-lg text-[#9d174d]">
                      {seriesTotals.needsApprovalTasks} tasks
                    </div>
                  ) : (
                    <>
                      <div className="font-atlas font-bold text-lg text-slate-700">⏸️ Offline</div>
                      <div className="text-[10px] font-semibold text-amber-800">
                        Pending Constitution
                      </div>
                    </>
                  )}
                </div>
                <div className="parchment-panel p-3 rounded-2xl">
                  <div className="text-[10px] font-bold uppercase text-[#6e4d28]">Printables Ready</div>
                  <div className="font-atlas font-bold text-lg text-emerald-800">
                    {printables.filter((p) => p.status !== 'Draft').length} / {printables.length}
                  </div>
                </div>
              </div>

              {/* 9-Book Visual Readiness Grid */}
              <div className="parchment-panel p-4 rounded-2xl space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <h2 className="font-atlas font-bold text-base text-[#2e1e0f]">
                      📚 The Bramblewood Friends · 9-Book Approval Matrix
                    </h2>
                    <p className="text-xs text-[#6e4d28]">
                      Click any book to jump straight into its 17 spread &amp; book-level approval rows.
                    </p>
                  </div>
                  <button
                    onClick={() => setTab(constitutionActive ? 'agents' : 'library')}
                    className="px-3 py-1.5 rounded-xl bg-[#831843] text-white text-xs font-bold cursor-pointer"
                  >
                    {constitutionActive
                      ? `🤖 Open Agent Approval Inbox (${seriesTotals.needsApprovalTasks})`
                      : '📂 Open Book Library & Reader'}
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
                  {bookRollups.map(({ book, totalItems, totalArt, artApproved, englishApproved, spanishApproved, comfyRedo, pctReady }) => (
                    <div
                      key={book.num}
                      className={`p-3.5 rounded-2xl border-2 space-y-2.5 flex flex-col justify-between ${
                        pctReady === 100
                          ? 'bg-emerald-50 border-emerald-400'
                          : comfyRedo <= 2
                            ? 'bg-[#fdf2f8] border-[#f472b6]'
                            : 'bg-white border-[#cfa96e]'
                      }`}
                    >
                      <div className="space-y-1.5">
                        <div className="flex items-start justify-between gap-2">
                          <div className="font-atlas font-bold text-sm text-[#2e1e0f]">
                            Book {book.num}: {book.title}
                          </div>
                          {canEdit ? (
                            <select
                              value={book.status}
                              onChange={(e) =>
                                void handleSaveBookStatus(book.num, e.target.value as BramblewoodBook['status'])
                              }
                              className="px-1.5 py-0.5 rounded border border-[#cfa96e] bg-white text-[10px] font-bold shrink-0"
                            >
                              <option>Not started</option>
                              <option>Needs ComfyUI redo</option>
                              <option>In review</option>
                              <option>Approved</option>
                              <option>Published</option>
                            </select>
                          ) : (
                            <span className="px-2 py-0.5 rounded-full bg-white text-[10px] font-bold">
                              {book.status}
                            </span>
                          )}
                        </div>

                        <div className="grid grid-cols-2 gap-1 text-[11px] text-[#374151]">
                          <div>🎨 Art: <strong>{artApproved}/{totalArt}</strong></div>
                          <div>🔁 Redos: <strong className={comfyRedo ? 'text-amber-800' : 'text-emerald-700'}>{comfyRedo}</strong></div>
                          <div>🇺🇸 English: <strong>{englishApproved}/{totalItems}</strong></div>
                          <div>🇲🇽 Spanish: <strong>{spanishApproved}/{totalItems}</strong></div>
                        </div>

                        <div className="w-full h-2 rounded-full bg-black/10 overflow-hidden">
                          <div
                            className="h-full bg-[#831843] transition-all"
                            style={{ width: `${pctReady}%` }}
                          />
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {(() => {
                          const thisBookFiles = bookFiles.filter((f) => f.bookNum === book.num);
                          const primary =
                            thisBookFiles.find((f) => f.kind === 'ebook-pdf') || thisBookFiles[0];
                          return primary ? (
                            <button
                              type="button"
                              onClick={() => openViewer(primary, thisBookFiles)}
                              className="flex-1 py-1.5 px-2.5 rounded-xl bg-[#831843] text-white font-bold cursor-pointer hover:bg-[#6b1135]"
                            >
                              📖 Read Book
                            </button>
                          ) : null;
                        })()}
                        <button
                          onClick={() => openBookSpreads(book.num)}
                          className="ribbon-btn flex-1 py-1.5 px-2.5 rounded-xl font-bold cursor-pointer"
                        >
                          ✏️ Spreads →
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {tab === 'library' && (
            <BookFilesLibraryTab
              canEdit={canEdit}
              books={books}
              files={bookFiles}
              onOpenFile={openViewer}
              onSaveFiles={async (next) => {
                if (!canEdit) return;
                setBookFiles(next);
                await saveBookFiles(next, userEmail);
                flash('Book library saved ✔');
              }}
              onOpenSpreads={openBookSpreads}
            />
          )}

          {tab === 'spreads' && (
            <SpreadsWorkbenchTab
              canEdit={canEdit}
              constitutionActive={constitutionActive}
              books={books}
              spreadsByBook={spreadsByBook}
              selectedBookNum={selectedBookNum}
              bookFiles={bookFiles}
              onSelectBook={setSelectedBookNum}
              onSaveBookSpreads={handleSaveBookSpreads}
              onDispatchTask={handleDispatchTask}
              onOpenFile={openViewer}
            />
          )}

          {tab === 'agents' && (
            <AgentCompanyTab
              canEdit={canEdit}
              constitutionActive={constitutionActive}
              books={books}
              spreadsByBook={spreadsByBook}
              characters={characters}
              tasks={tasks}
              onSaveTasks={async (next) => {
                if (!canEdit) return;
                setTasks(next);
                await saveAgentTasks(next, userEmail);
              }}
              onOpenSpread={openBookSpreads}
            />
          )}

          {tab === 'bible' && (
            <CharacterBibleTab
              canEdit={canEdit}
              characters={characters}
              bookFiles={bookFiles}
              onOpenFile={openViewer}
              onSaveCharacters={async (next) => {
                if (!canEdit) return;
                setCharacters(next);
                await saveCharacterBible(next, userEmail);
                flash('Character Bible saved ✔');
              }}
            />
          )}

          {tab === 'printables' && (
            <PrintablesStudioTab
              canEdit={canEdit}
              printables={printables}
              onOpenFile={openViewer}
              onSavePrintables={async (next) => {
                if (!canEdit) return;
                setPrintables(next);
                await savePrintablesCatalog(next, userEmail);
                flash('Printables Studio saved ✔');
              }}
            />
          )}
        </div>
      </main>

      {viewerState && (
        <BookFileViewerModal
          file={viewerState.file}
          siblings={viewerState.siblings}
          onSelectFile={(next) =>
            setViewerState((prev) => (prev ? { ...prev, file: next } : null))
          }
          onClose={() => setViewerState(null)}
        />
      )}
    </section>
  );
}
