import { useEffect, useState } from 'react';
import {
  getBookFileIcon,
  getDriveDownloadUrl,
  getDriveEmbedUrl,
  getDriveOpenUrl,
  getDriveThumbUrl,
  type BookDriveFile,
} from '../../data/bramblewoodFiles';

interface BookFileViewerModalProps {
  file: BookDriveFile;
  siblings?: BookDriveFile[];
  onSelectFile?: (next: BookDriveFile) => void;
  onClose: () => void;
}

export function BookFileViewerModal({
  file,
  siblings = [],
  onSelectFile,
  onClose,
}: BookFileViewerModalProps) {
  const [imgFallback, setImgFallback] = useState(false);

  useEffect(() => {
    setImgFallback(false);
  }, [file.id, file.driveId]);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const list = siblings.length ? siblings : [file];
  const curIdx = list.findIndex((f) => f.id === file.id);
  const canPrev = list.length > 1 && curIdx > 0;
  const canNext = list.length > 1 && curIdx >= 0 && curIdx < list.length - 1;
  const isImage = file.mimeType.startsWith('image/');
  const isGoogleNative =
    file.mimeType === 'application/vnd.google-apps.document' ||
    file.mimeType === 'application/vnd.google-apps.spreadsheet' ||
    file.mimeType === 'application/vnd.google-apps.folder';

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-[95] bg-black/75 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-5xl bg-[#fdf7ea] border-2 border-[#ad8042] rounded-2xl shadow-2xl flex flex-col overflow-hidden"
      >
        {/* Top Modal Header */}
        <div className="bg-[#4a152b] text-[#fbf3df] px-3.5 py-2.5 border-b border-[#ad8042] flex flex-wrap items-center justify-between gap-2">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-base">{getBookFileIcon(file.kind)}</span>
              <span className="font-atlas font-bold text-sm sm:text-base truncate">
                {file.bookNum > 0 ? `Book ${file.bookNum} · ` : ''}
                {file.label}
              </span>
              {file.language && (
                <span className="px-1.5 py-0.5 rounded-full bg-[#831843] border border-[#f472b6]/50 text-[10px] font-bold">
                  {file.language}
                </span>
              )}
            </div>
            <div className="text-[11px] text-[#f9a8d4] truncate">{file.fileName}</div>
          </div>

          <div className="flex flex-wrap items-center gap-1.5 shrink-0">
            {list.length > 1 && onSelectFile && (
              <>
                <button
                  type="button"
                  disabled={!canPrev}
                  onClick={() => canPrev && onSelectFile(list[curIdx - 1])}
                  className="px-2.5 py-1 rounded-lg bg-[#6b2140] disabled:opacity-40 text-xs font-bold cursor-pointer"
                >
                  ◀ Prev
                </button>
                <button
                  type="button"
                  disabled={!canNext}
                  onClick={() => canNext && onSelectFile(list[curIdx + 1])}
                  className="px-2.5 py-1 rounded-lg bg-[#6b2140] disabled:opacity-40 text-xs font-bold cursor-pointer"
                >
                  Next ▶
                </button>
              </>
            )}
            <a
              href={getDriveOpenUrl(file)}
              target="_blank"
              rel="noopener noreferrer"
              className="px-2.5 py-1 rounded-lg bg-[#ad8042] text-[#2e1e0f] text-xs font-bold hover:brightness-110"
            >
              ↗ Open in Drive
            </a>
            {!isGoogleNative && (
              <a
                href={getDriveDownloadUrl(file.driveId)}
                target="_blank"
                rel="noopener noreferrer"
                className="px-2.5 py-1 rounded-lg bg-white/15 border border-white/25 text-xs font-bold hover:bg-white/25"
              >
                📥 Download
              </a>
            )}
            <button
              type="button"
              onClick={onClose}
              className="px-2.5 py-1 rounded-lg bg-black/35 text-xs font-bold cursor-pointer hover:bg-black/55"
            >
              ✕ Close
            </button>
          </div>
        </div>

        {/* Sibling Quick-Switch Pill Bar */}
        {list.length > 1 && onSelectFile && (
          <div className="bg-[#f3e3be] border-b border-[#cfa96e] px-3 py-1.5 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {list.map((item) => {
              const active = item.id === file.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onSelectFile(item)}
                  className={`px-2.5 py-1 rounded-full text-[11px] font-bold whitespace-nowrap border cursor-pointer transition ${
                    active
                      ? 'bg-[#831843] text-white border-[#500724]'
                      : 'bg-white/90 text-[#2e1e0f] border-[#cfa96e] hover:bg-[#fdf2f8]'
                  }`}
                >
                  {getBookFileIcon(item.kind)} {item.label}
                  {item.language === 'ES' ? ' (ES)' : ''}
                </button>
              );
            })}
          </div>
        )}

        {/* Viewer Body */}
        {isImage && !imgFallback ? (
          <div className="w-full h-[72vh] sm:h-[78vh] bg-[#1f1a15] flex items-center justify-center p-4 overflow-auto">
            <img
              src={getDriveThumbUrl(file.driveId, 1600)}
              alt={file.fileName}
              onError={() => setImgFallback(true)}
              className="max-h-full max-w-full rounded-xl shadow-lg object-contain"
            />
          </div>
        ) : (
          <iframe
            key={file.driveId}
            src={getDriveEmbedUrl(file)}
            title={file.fileName}
            className="w-full h-[72vh] sm:h-[78vh] bg-[#1f1a15] border-0"
            allow="autoplay"
          />
        )}

        {/* Subtle Access Tip Footer */}
        <div className="bg-[#f3e3be] border-t border-[#cfa96e] px-3.5 py-1.5 text-[11px] text-[#5c3d1e] flex flex-wrap items-center justify-between gap-2">
          <span>
            Tip: Files load securely using your signed-in Google account (private to your Drive). If your browser blocks embedded Drive previews, click <strong>Open in Drive ↗</strong> above.
          </span>
          {file.notes && <span className="font-semibold text-[#831843]">📝 {file.notes}</span>}
        </div>
      </div>
    </div>
  );
}
