import { useState } from 'react';
import type { BramblewoodCharacter } from '../../data/bramblewoodData';

interface CharacterBibleTabProps {
  canEdit: boolean;
  characters: BramblewoodCharacter[];
  onSaveCharacters: (next: BramblewoodCharacter[]) => Promise<void>;
}

export function CharacterBibleTab({
  canEdit,
  characters,
  onSaveCharacters,
}: CharacterBibleTabProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);
  const [newName, setNewName] = useState('');
  const [newBook, setNewBook] = useState('1');
  const [newRole, setNewRole] = useState('');
  const [newPalette, setNewPalette] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  async function updateChar(id: string, patch: Partial<BramblewoodCharacter>) {
    if (!canEdit) return;
    await onSaveCharacters(characters.map((c) => (c.id === id ? { ...c, ...patch } : c)));
  }

  return (
    <div className="space-y-4 text-xs">
      <div className="parchment-panel p-4 rounded-2xl flex flex-wrap items-center justify-between gap-2">
        <div>
          <h2 className="font-atlas text-base sm:text-lg font-bold text-[#2e1e0f]">
            🦊 Character &amp; World Bible (ComfyUI Visual Consistency)
          </h2>
          <p className="text-[#6e4d28]">
            Locked visual specs for all 9 Friends + Ms. Hazel so Rowan Brush &amp; ComfyUI keep outfits, proportions, and props consistent across every book.
          </p>
        </div>
        {canEdit && (
          <button
            onClick={() => setAdding((v) => !v)}
            className="px-3 py-1.5 rounded-xl bg-[#831843] text-white font-bold cursor-pointer"
          >
            ＋ Add Character
          </button>
        )}
      </div>

      {adding && canEdit && (
        <div className="parchment-panel p-3.5 rounded-2xl grid grid-cols-1 sm:grid-cols-3 gap-2">
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Character name"
            className="px-2.5 py-1.5 rounded-lg border border-[#cfa96e] bg-white"
          />
          <input
            type="text"
            value={newRole}
            onChange={(e) => setNewRole(e.target.value)}
            placeholder="Species & Role"
            className="px-2.5 py-1.5 rounded-lg border border-[#cfa96e] bg-white"
          />
          <input
            type="number"
            value={newBook}
            onChange={(e) => setNewBook(e.target.value)}
            placeholder="Book # (1-9)"
            className="px-2.5 py-1.5 rounded-lg border border-[#cfa96e] bg-white"
          />
          <input
            type="text"
            value={newPalette}
            onChange={(e) => setNewPalette(e.target.value)}
            placeholder="Signature hex palette"
            className="sm:col-span-2 px-2.5 py-1.5 rounded-lg border border-[#cfa96e] bg-white"
          />
          <button
            onClick={async () => {
              if (!newName.trim()) return;
              const entry: BramblewoodCharacter = {
                id: `char-${Date.now().toString(36)}`,
                name: newName.trim(),
                bookNum: Number(newBook) || 1,
                role: newRole.trim() || 'Bramblewood Friend',
                theme: '',
                palette: newPalette.trim(),
                outfitProps: '',
                consistencyRules: '',
                voiceNotes: '',
                referenceUrl: '',
              };
              await onSaveCharacters([...characters, entry]);
              setNewName('');
              setNewRole('');
              setNewPalette('');
              setAdding(false);
            }}
            className="px-3 py-1.5 rounded-lg bg-[#831843] text-white font-bold cursor-pointer"
          >
            Save Character
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {characters.map((c) => {
          const isEdit = editingId === c.id;
          return (
            <div key={c.id} className="parchment-panel p-4 rounded-2xl space-y-2.5">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="font-atlas font-bold text-base text-[#2e1e0f]">
                    {c.name}{' '}
                    <span className="ml-1 px-2 py-0.5 rounded-full bg-[#fdf2f8] border border-[#f472b6] text-[10px] font-sans text-[#831843]">
                      Book {c.bookNum}
                    </span>
                  </div>
                  <div className="text-[11px] font-bold text-[#6e4d28]">{c.role}</div>
                </div>
                <div className="flex gap-1.5">
                  <button
                    onClick={() => {
                      const spec = `Bramblewood Character Spec — ${c.name} (Book ${c.bookNum}): ${c.role}. Outfit & Props: ${c.outfitProps}. Palette: ${c.palette}. Consistency Rules: ${c.consistencyRules}. Child-safe warm watercolor picture-book style.`;
                      void navigator.clipboard?.writeText(spec);
                      setCopiedId(c.id);
                      setTimeout(() => setCopiedId(null), 1600);
                    }}
                    className="ribbon-btn px-2 py-1 rounded-lg font-bold cursor-pointer"
                  >
                    {copiedId === c.id ? 'Copied ✔' : '📋 Copy Spec'}
                  </button>
                  {canEdit && (
                    <button
                      onClick={() => setEditingId(isEdit ? null : c.id)}
                      className="px-2 py-1 rounded-lg bg-white border border-[#cfa96e] font-bold cursor-pointer"
                    >
                      {isEdit ? 'Done' : '✏️'}
                    </button>
                  )}
                </div>
              </div>

              {isEdit && canEdit ? (
                <div className="space-y-2 p-2.5 rounded-xl bg-white border border-[#cfa96e]">
                  <input
                    type="text"
                    value={c.theme}
                    onChange={(e) => void updateChar(c.id, { theme: e.target.value })}
                    placeholder="Core neurodivergent theme"
                    className="w-full px-2 py-1 rounded border border-[#cfa96e]"
                  />
                  <input
                    type="text"
                    value={c.palette}
                    onChange={(e) => void updateChar(c.id, { palette: e.target.value })}
                    placeholder="Colors / hex codes"
                    className="w-full px-2 py-1 rounded border border-[#cfa96e]"
                  />
                  <input
                    type="text"
                    value={c.outfitProps}
                    onChange={(e) => void updateChar(c.id, { outfitProps: e.target.value })}
                    placeholder="Outfit & signature props"
                    className="w-full px-2 py-1 rounded border border-[#cfa96e]"
                  />
                  <textarea
                    rows={2}
                    value={c.consistencyRules}
                    onChange={(e) => void updateChar(c.id, { consistencyRules: e.target.value })}
                    placeholder="Anatomy / ComfyUI consistency rules"
                    className="w-full px-2 py-1 rounded border border-[#cfa96e]"
                  />
                  <textarea
                    rows={2}
                    value={c.voiceNotes}
                    onChange={(e) => void updateChar(c.id, { voiceNotes: e.target.value })}
                    placeholder="Voice & writing notes"
                    className="w-full px-2 py-1 rounded border border-[#cfa96e]"
                  />
                </div>
              ) : (
                <div className="p-3 rounded-xl bg-white/85 border border-[#cfa96e] space-y-1.5 text-[#374151]">
                  {c.theme && <div><strong>Theme:</strong> {c.theme}</div>}
                  {c.palette && <div><strong>Palette:</strong> {c.palette}</div>}
                  {c.outfitProps && <div><strong>Outfit &amp; Props:</strong> {c.outfitProps}</div>}
                  {c.consistencyRules && (
                    <div className="text-[#78350f]">
                      <strong>Visual Rules:</strong> {c.consistencyRules}
                    </div>
                  )}
                  {c.voiceNotes && <div className="italic text-[#4b5563]">“{c.voiceNotes}”</div>}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
