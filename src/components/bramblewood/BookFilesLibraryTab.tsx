import { useMemo, useState } from 'react';
import type { BramblewoodBook } from '../../data/bramblewoodData';
import {
  BRAMBLEWOOD_DRIVE_FOLDER_ID,
  getBookFileIcon,
  getDriveOpenUrl,
  getDriveThumbUrl,
  parseDriveIdFromUrl,
  type BookDriveFile,
  type BookFileKind,
} from '../../data/bramblewoodFiles';

interface BookFilesLibraryTabProps {
  canEdit: boolean;
  books: BramblewoodBook[];
  files: BookDriveFile[];
  onOpenFile: (file: BookDriveFile, siblings: BookDriveFile[]) => void;
  onSaveFiles: (next: BookDriveFile[]) => Promise<void>;
  onOpenSpreads: (bookNum: number) => void;
}

type LibraryFilter = 'all' | 'books' | 'guides' | 'spanish' | 'manuscripts';

function guessMimeFromKind(kind: BookFileKind): string {
  if (kind === 'manuscript-doc') return 'application/vnd.google-apps.document';
  if (kind === 'bundle-zip') return 'application/zip';
  if (kind === 'folder') return 'application/vnd.google-apps.folder';
  if (kind === 'reference') return 'image/jpeg';
  return 'application/pdf';
}

export function BookFilesLibraryTab({
  canEdit,
  books,
  files,
  onOpenFile,
  onSaveFiles,
  onOpenSpreads,
}: BookFilesLibraryTabProps) {
  const [filter, setFilter] = useState<LibraryFilter>('all');
  const [searchQ, setSearchQ] = useState('');
  const [adding, setAdding] = useState(false);

  const [newUrl, setNewUrl] = useState('');
  const [newBookNum, setNewBookNum] = useState('1');
  const [newLabel, setNewLabel] = useState('');
  const [newKind, setNewKind] = useState<BookFileKind>('ebook-pdf');
  const [newLang, setNewLang] = useState<'EN' | 'ES' | 'Bilingual'>('EN');
  const [formErr, setFormErr] = useState<string | null>(null);

  const q = searchQ.trim().toLowerCase();

  const matchesFilter = useMemo(() => {
    return (f: BookDriveFile) => {
      if (filter === 'spanish' && f.language !== 'ES' && f.kind !== 'spanish-pdf') return false;
      if (filter === 'manuscripts' && f.kind !== 'manuscript-doc') return false;
      if (!q) return true;
      return `${f.label} ${f.fileName} ${f.notes || ''}`.toLowerCase().includes(q);
    };
  }, [filter, q]);

  const seriesGuides = useMemo(
    () => files.filter((f) => f.bookNum === 0 && matchesFilter(f)),
    [files, matchesFilter]
  );

  async function handleAddLink() {
    setFormErr(null);
    const driveId = parseDriveIdFromUrl(newUrl);
    if (!driveId) {
      setFormErr('Paste a valid Google Drive file/doc/folder URL or ID.');
      return;
    }
    const label = newLabel.trim() || 'Linked Drive File';
    const nextFile: BookDriveFile = {
      id: `custom-${Date.now().toString(36)}`,
      bookNum: Number(newBookNum) || 0,
      label,
      fileName: label,
      driveId,
      kind: newKind,
      mimeType: guessMimeFromKind(newKind),
      language: newLang,
    };
    await onSaveFiles([...files, nextFile]);
    setNewUrl('');
    setNewLabel('');
    setAdding(false);
  }

  return (
    <div className="space-y-4 text-xs">
      {/* Header Panel */}
      <div className="parchment-panel p-4 rounded-2xl space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h2 className="font-atlas text-base sm:text-lg font-bold text-[#2e1e0f]">
              📂 Bramblewood Book Library &amp; In-App Reader
            </h2>
            <p className="text-[#6e4d28]">
              Every digital PDF, 8.5×8.5 print bleed, front cover, Spanish edition, and Google Doc manuscript opens right inside Cairnspire (or directly in Google Drive).
            </p>
          </div>
          <div className="flex flex-wrap gap-1.5">
            <a
              href={`https://drive.google.com/drive/folders/${BRAMBLEWOOD_DRIVE_FOLDER_ID}`}
              target="_blank"
              rel="noopener noreferrer"
              className="ribbon-btn px-3 py-1.5 rounded-xl font-bold"
            >
              📁 Open Drive Folder ↗
            </a>
            {canEdit && (
              <button
                type="button"
                onClick={() => setAdding((v) => !v)}
                className="px-3 py-1.5 rounded-xl bg-[#831843] text-white font-bold cursor-pointer"
              >
                {adding ? 'Cancel' : '＋ Link Drive File'}
              </button>
            )}
          </div>
        </div>

        {/* Search & Filters */}
        <div className="flex flex-wrap items-center gap-1.5">
          <input
            type="search"
            value={searchQ}
            onChange={(e) => setSearchQ(e.target.value)}
            placeholder="🔎 Search book titles, PDFs, covers, Spanish files..."
            className="flex-1 min-w-[200px] px-3 py-1.5 rounded-xl border border-[#cfa96e] bg-white"
          />
          {(
            [
              ['all', 'All (9 Books + Guides)'],
              ['books', 'Books 1–9'],
              ['guides', 'Series Guides & Extras'],
              ['spanish', 'Spanish (ES)'],
              ['manuscripts', 'Manuscripts'],
            ] as Array<[LibraryFilter, string]>
          ).map(([k, lbl]) => (
            <button
              key={k}
              type="button"
              onClick={() => setFilter(k)}
              className={`px-2.5 py-1.5 rounded-full text-[11px] font-bold border cursor-pointer ${
                filter === k
                  ? 'bg-[#2e1e0f] text-white border-[#2e1e0f]'
                  : 'bg-[#fdf7ea] text-[#2e1e0f] border-[#cfa96e]'
              }`}
            >
              {lbl}
            </button>
          ))}
        </div>

        {/* Link Drive File Drawer */}
        {adding && canEdit && (
          <div className="p-3 rounded-xl bg-[#fdf2f8] border border-[#f472b6] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-2">
            <input
              type="text"
              value={newUrl}
              onChange={(e) => setNewUrl(e.target.value)}
              placeholder="Google Drive URL or File ID"
              className="lg:col-span-2 px-2.5 py-1.5 rounded-lg border border-[#f472b6] bg-white"
            />
            <input
              type="text"
              value={newLabel}
              onChange={(e) => setNewLabel(e.target.value)}
              placeholder="Display label (e.g., Page 28 Redo)"
              className="px-2.5 py-1.5 rounded-lg border border-[#f472b6] bg-white"
            />
            <select
              value={newBookNum}
              onChange={(e) => setNewBookNum(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg border border-[#f472b6] bg-white font-semibold"
            >
              <option value="0">Series-Wide (0)</option>
              {books.map((b) => (
                <option key={b.num} value={String(b.num)}>
                  Book {b.num}: {b.title}
                </option>
              ))}
            </select>
            <select
              value={newKind}
              onChange={(e) => setNewKind(e.target.value as BookFileKind)}
              className="px-2.5 py-1.5 rounded-lg border border-[#f472b6] bg-white font-semibold"
            >
              <option value="ebook-pdf">Digital Book PDF</option>
              <option value="print-pdf">Print Bleed PDF</option>
              <option value="cover-pdf">Front Cover PDF</option>
              <option value="spanish-pdf">Spanish PDF</option>
              <option value="manuscript-doc">Manuscript Doc</option>
              <option value="activity-pdf">Activity / Guide PDF</option>
              <option value="reference">Reference / Art</option>
              <option value="bundle-zip">Bundle ZIP</option>
            </select>
            <div className="flex items-center gap-1.5">
              <select
                value={newLang}
                onChange={(e) => setNewLang(e.target.value as 'EN' | 'ES' | 'Bilingual')}
                className="px-2 py-1.5 rounded-lg border border-[#f472b6] bg-white font-semibold"
              >
                <option value="EN">EN</option>
                <option value="ES">ES</option>
                <option value="Bilingual">Bilingual</option>
              </select>
              <button
                type="button"
                onClick={() => void handleAddLink()}
                className="flex-1 px-3 py-1.5 rounded-lg bg-[#831843] text-white font-bold cursor-pointer"
              >
                Save Link
              </button>
            </div>
            {formErr && (
              <div className="sm:col-span-2 lg:col-span-6 text-red-700 font-bold">{formErr}</div>
            )}
          </div>
        )}
      </div>

      {/* 9-Book Visual Library Grid */}
      {filter !== 'guides' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {books.map((book) => {
            const allBookFiles = files.filter((f) => f.bookNum === book.num);
            const visibleFiles = allBookFiles.filter(matchesFilter);
            const bookTextMatch =
              !q || `book ${book.num} ${book.title}`.toLowerCase().includes(q);
            if (!visibleFiles.length && !(filter === 'books' && bookTextMatch) && !(filter === 'all' && bookTextMatch)) {
              return null;
            }
            const displayList = visibleFiles.length ? visibleFiles : allBookFiles;
            const ebook = allBookFiles.find((f) => f.kind === 'ebook-pdf') || allBookFiles[0];
            const coverFile =
              allBookFiles.find((f) => f.kind === 'cover-pdf') || ebook;

            return (
              <div
                key={book.num}
                className="parchment-panel p-3.5 rounded-2xl border-2 border-[#cfa96e] flex flex-col justify-between gap-3"
              >
                <div className="space-y-2.5">
                  {/* Cover Thumbnail + Book Header */}
                  <div className="flex items-start gap-3">
                    {coverFile ? (
                      <button
                        type="button"
                        onClick={() => onOpenFile(coverFile, allBookFiles)}
                        className="w-16 h-16 rounded-xl overflow-hidden border border-[#cfa96e] bg-[#fdf7ea] shrink-0 cursor-pointer hover:ring-2 hover:ring-[#831843]"
                        title="Preview Front Cover"
                      >
                        <img
                          src={getDriveThumbUrl(coverFile.driveId, 400)}
                          alt={book.title}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ) : (
                      <div className="w-16 h-16 rounded-xl bg-[#fdf2f8] border border-[#f472b6] flex items-center justify-center text-2xl shrink-0">
                        📖
                      </div>
                    )}
                    <div className="min-w-0 flex-1 space-y-1">
                      <div className="font-atlas font-bold text-sm text-[#2e1e0f] leading-tight">
                        Book {book.num}: {book.title}
                      </div>
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="px-2 py-0.5 rounded-full bg-white border border-[#cfa96e] text-[10px] font-bold">
                          {book.status}
                        </span>
                        <span className="text-[10px] text-[#6e4d28] font-semibold">
                          {allBookFiles.length} Drive files
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Primary Read Book CTA */}
                  {ebook && (
                    <button
                      type="button"
                      onClick={() => onOpenFile(ebook, allBookFiles)}
                      className="w-full py-2 px-3 rounded-xl bg-[#831843] hover:bg-[#6b1135] text-white font-bold cursor-pointer shadow-sm transition"
                    >
                      📖 Read Book PDF ({ebook.label})
                    </button>
                  )}

                  {/* Individual File Shelf */}
                  <div className="space-y-1">
                    {displayList.map((f) => (
                      <div
                        key={f.id}
                        className="flex items-center gap-1 rounded-lg bg-white/90 border border-[#e3cba0] hover:border-[#831843] transition"
                      >
                        <button
                          type="button"
                          onClick={() => onOpenFile(f, allBookFiles)}
                          className="flex-1 min-w-0 px-2.5 py-1.5 text-left flex items-center justify-between gap-1.5 cursor-pointer"
                        >
                          <span className="truncate font-semibold text-[#2e1e0f]">
                            {getBookFileIcon(f.kind)} {f.label}
                          </span>
                          {f.language && (
                            <span
                              className={`px-1.5 py-0.2 rounded text-[9px] font-bold shrink-0 ${
                                f.language === 'ES'
                                  ? 'bg-blue-100 text-blue-900'
                                  : 'bg-[#fdf2f8] text-[#831843]'
                              }`}
                            >
                              {f.language}
                            </span>
                          )}
                        </button>
                        <a
                          href={getDriveOpenUrl(f)}
                          target="_blank"
                          rel="noopener noreferrer"
                          title={`Open ${f.fileName} in Google Drive`}
                          className="px-2 py-1.5 text-[#6e4d28] hover:text-[#831843] font-bold border-l border-[#e3cba0]"
                        >
                          ↗
                        </a>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => onOpenSpreads(book.num)}
                  className="ribbon-btn w-full py-1.5 rounded-xl font-bold cursor-pointer"
                >
                  ✏️ Open Spreads Workbench →
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Series-Wide Guides, Character Art & Companions */}
      {(filter === 'all' || filter === 'guides' || filter === 'spanish' || filter === 'manuscripts') &&
        seriesGuides.length > 0 && (
          <div className="parchment-panel p-4 rounded-2xl space-y-3">
            <div>
              <h3 className="font-atlas font-bold text-base text-[#2e1e0f]">
                🌲 Series-Wide Guides, Turnarounds, Posters &amp; Companion Bundles
              </h3>
              <p className="text-[11px] text-[#6e4d28]">
                Click any guide or printable to inspect it inside the Cairnspire reader, or pop it out in Google Drive.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
              {seriesGuides.map((g) => (
                <div
                  key={g.id}
                  className="flex items-center gap-1 rounded-xl bg-white/95 border border-[#cfa96e] hover:border-[#831843] transition"
                >
                  <button
                    type="button"
                    onClick={() => onOpenFile(g, seriesGuides)}
                    className="flex-1 min-w-0 p-2.5 text-left flex items-center gap-2.5 cursor-pointer"
                  >
                    <span className="text-lg shrink-0">{getBookFileIcon(g.kind)}</span>
                    <div className="min-w-0 flex-1">
                      <div className="font-bold text-[#2e1e0f] truncate">{g.label}</div>
                      <div className="text-[10px] text-[#6e4d28] truncate">{g.fileName}</div>
                    </div>
                    {g.language && (
                      <span
                        className={`px-1.5 py-0.5 rounded text-[9px] font-bold shrink-0 ${
                          g.language === 'ES'
                            ? 'bg-blue-100 text-blue-900'
                            : 'bg-[#fdf2f8] text-[#831843]'
                        }`}
                      >
                        {g.language}
                      </span>
                    )}
                  </button>
                  <a
                    href={getDriveOpenUrl(g)}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={`Open ${g.fileName} in Google Drive`}
                    className="px-2.5 py-3 text-[#6e4d28] hover:text-[#831843] font-bold border-l border-[#e3cba0]"
                  >
                    ↗
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}
    </div>
  );
}
