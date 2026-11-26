import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react';
import { speakText } from './PersonBadge';

interface ComicStudioProps {
  kid: 'Liam' | 'Oliver';
  starterLines: string[];
  speakEnabled: boolean;
  onBack: () => void;
}

type BubbleStyle = 'speech' | 'thought' | 'shout' | 'caption';

interface ComicSticker {
  id: string;
  emoji: string;
  x: number; // % 5..95
  y: number; // % 5..95
  scale: number; // 0.6..2.2
  flip: boolean;
  tilt: number; // -30..30 deg
}

interface ComicBubble {
  id: string;
  text: string;
  style: BubbleStyle;
  x: number; // % 10..90
  y: number; // % 10..90
}

interface ComicPanel {
  id: string;
  bg: string;
  stickers: ComicSticker[];
  bubbles: ComicBubble[];
}

interface SavedComic {
  id: string;
  title: string;
  layout: 2 | 3 | 4 | 6;
  panels: ComicPanel[];
  updatedAt: string;
}

interface SceneDef {
  id: string;
  name: string;
  icon: string;
  topColor: string;
  bottomColor: string;
  accent: string;
  decor: Array<{ emoji: string; x: number; y: number; size: number }>;
}

const SCENES: SceneDef[] = [
  {
    id: 'forest',
    name: 'Forest',
    icon: '🌲',
    topColor: '#bfe6ff',
    bottomColor: '#7fc27e',
    accent: '#2d6a4f',
    decor: [
      { emoji: '☀️', x: 84, y: 18, size: 22 },
      { emoji: '🌲', x: 14, y: 70, size: 30 },
      { emoji: '🌳', x: 85, y: 68, size: 30 },
      { emoji: '🍄', x: 26, y: 86, size: 16 },
    ],
  },
  {
    id: 'space',
    name: 'Space',
    icon: '🚀',
    topColor: '#0f172a',
    bottomColor: '#312e81',
    accent: '#a5b4fc',
    decor: [
      { emoji: '🪐', x: 20, y: 24, size: 26 },
      { emoji: '✨', x: 76, y: 20, size: 18 },
      { emoji: '🌙', x: 84, y: 34, size: 22 },
      { emoji: '⭐', x: 45, y: 18, size: 14 },
    ],
  },
  {
    id: 'castle',
    name: 'Castle',
    icon: '🏰',
    topColor: '#e9d5ff',
    bottomColor: '#a78bfa',
    accent: '#5b21b6',
    decor: [
      { emoji: '🏰', x: 50, y: 60, size: 42 },
      { emoji: '☁️', x: 18, y: 20, size: 22 },
      { emoji: '🚩', x: 82, y: 22, size: 18 },
    ],
  },
  {
    id: 'beach',
    name: 'Beach',
    icon: '🏖️',
    topColor: '#7dd3fc',
    bottomColor: '#fde68a',
    accent: '#0369a1',
    decor: [
      { emoji: '☀️', x: 82, y: 18, size: 24 },
      { emoji: '🌊', x: 30, y: 66, size: 24 },
      { emoji: '🌴', x: 14, y: 66, size: 32 },
      { emoji: '🦀', x: 82, y: 86, size: 16 },
    ],
  },
  {
    id: 'volcano',
    name: 'Volcano',
    icon: '🌋',
    topColor: '#fed7aa',
    bottomColor: '#ea580c',
    accent: '#9a3412',
    decor: [
      { emoji: '🌋', x: 50, y: 66, size: 44 },
      { emoji: '🔥', x: 46, y: 26, size: 20 },
      { emoji: '🪨', x: 18, y: 84, size: 20 },
    ],
  },
  {
    id: 'ocean',
    name: 'Underwater',
    icon: '🐠',
    topColor: '#0284c7',
    bottomColor: '#164e63',
    accent: '#bae6fd',
    decor: [
      { emoji: '🫧', x: 20, y: 24, size: 20 },
      { emoji: '🪸', x: 18, y: 84, size: 26 },
      { emoji: '🌿', x: 82, y: 82, size: 26 },
      { emoji: '🫧', x: 74, y: 30, size: 18 },
    ],
  },
  {
    id: 'dino',
    name: 'Dino Park',
    icon: '🦕',
    topColor: '#d9f99d',
    bottomColor: '#65a30d',
    accent: '#365314',
    decor: [
      { emoji: '🌴', x: 16, y: 64, size: 30 },
      { emoji: '🌋', x: 84, y: 58, size: 30 },
      { emoji: '🌿', x: 48, y: 86, size: 20 },
    ],
  },
  {
    id: 'room',
    name: 'Cozy Room',
    icon: '🛋️',
    topColor: '#fef3c7',
    bottomColor: '#f5d0a9',
    accent: '#92400e',
    decor: [
      { emoji: '🖼️', x: 24, y: 26, size: 22 },
      { emoji: '🪴', x: 82, y: 74, size: 24 },
      { emoji: '🛋️', x: 50, y: 78, size: 34 },
    ],
  },
  {
    id: 'city',
    name: 'City Night',
    icon: '🌃',
    topColor: '#1e1b4b',
    bottomColor: '#374151',
    accent: '#fde047',
    decor: [
      { emoji: '🌙', x: 18, y: 20, size: 22 },
      { emoji: '🏢', x: 34, y: 68, size: 32 },
      { emoji: '🏙️', x: 74, y: 66, size: 34 },
    ],
  },
  {
    id: 'snow',
    name: 'Snowy Peak',
    icon: '🏔️',
    topColor: '#dbeafe',
    bottomColor: '#f8fafc',
    accent: '#1d4ed8',
    decor: [
      { emoji: '❄️', x: 20, y: 22, size: 18 },
      { emoji: '🏔️', x: 50, y: 64, size: 42 },
      { emoji: '❄️', x: 82, y: 24, size: 18 },
      { emoji: '⛄', x: 82, y: 80, size: 24 },
    ],
  },
];

const STICKER_CATS: Array<{ id: string; label: string; items: string[] }> = [
  { id: 'heroes', label: '🐾 Heroes', items: ['🐉', '🦖', '🦕', '🤖', '🐱', '🐶', '🐸', '🦈', '🦄', '🦊', '🦁', '🐙'] },
  { id: 'people', label: '🧙 Folks', items: ['🦸', '🧙', '🥷', '🧑‍🚀', '👸', '🏴‍☠️', '👽', '👾', '👻', '🧚', '🤠', '🧑‍🚒'] },
  { id: 'props', label: '🍕 Props', items: ['🍕', '🌮', '🍦', '🍪', '🏆', '👑', '⚔️', '🛡️', '🚀', '🚗', '🎈', '🎁'] },
  { id: 'nature', label: '🌈 World', items: ['🔥', '⚡', '🌈', '❄️', '🌊', '💥', '⭐', '💎', '🪨', '🌋', '🛸', '💫'] },
  { id: 'sfx', label: '💥 Action Words', items: ['💥 BOOM!', '⚡ ZAP!', '💨 WHOOSH!', '⭐ POW!', '💦 SPLASH!', '😂 HAHA!', '❤️ LOVE!', '❓ WHAT?!'] },
];

function makeId(prefix: string): string {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`;
}

function makeDefaultPanels(count: 2 | 3 | 4 | 6, existing?: ComicPanel[]): ComicPanel[] {
  const out: ComicPanel[] = [];
  for (let i = 0; i < count; i++) {
    if (existing?.[i]) {
      out.push(existing[i]);
    } else {
      out.push({
        id: makeId('pn'),
        bg: SCENES[i % SCENES.length].id,
        stickers: i === 0 ? [{ id: makeId('st'), emoji: '🐉', x: 48, y: 62, scale: 1.25, flip: false, tilt: 0 }] : [],
        bubbles: [],
      });
    }
  }
  return out;
}

export function ComicStudio({ kid, starterLines, speakEnabled, onBack }: ComicStudioProps) {
  const storageKey = `hg_comics_${kid}`;
  const defaultTitle = `${kid}'s Big Adventure`;

  const [title, setTitle] = useState(defaultTitle);
  const [layout, setLayout] = useState<2 | 3 | 4 | 6>(3);
  const [panels, setPanels] = useState<ComicPanel[]>(() => makeDefaultPanels(3));
  const [activePanelIdx, setActivePanelIdx] = useState(0);
  const [selectedStickerId, setSelectedStickerId] = useState<string | null>(null);
  const [selectedBubbleId, setSelectedBubbleId] = useState<string | null>(null);
  const [stickerCat, setStickerCat] = useState('heroes');
  const [bubbleStyle, setBubbleStyle] = useState<BubbleStyle>('speech');
  const [customBubbleText, setCustomBubbleText] = useState('');
  const [shelfOpen, setShelfOpen] = useState(false);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);

  const [savedComics, setSavedComics] = useState<SavedComic[]>(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      const parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  });

  // Pointer drag ref for smooth mouse + touch dragging
  const dragRef = useRef<{
    panelIdx: number;
    kind: 'sticker' | 'bubble';
    itemId: string;
    rect: DOMRect;
  } | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(savedComics));
    } catch {
      // ignore quota errors
    }
  }, [savedComics, storageKey]);

  function flash(msg: string) {
    setStatusMsg(msg);
    setTimeout(() => setStatusMsg(null), 2200);
  }

  const activePanel = panels[activePanelIdx] || panels[0];
  const selectedSticker = activePanel.stickers.find((s) => s.id === selectedStickerId) || null;
  const selectedBubble = activePanel.bubbles.find((b) => b.id === selectedBubbleId) || null;

  function changeLayout(nextCount: 2 | 3 | 4 | 6) {
    setLayout(nextCount);
    setPanels((prev) => makeDefaultPanels(nextCount, prev));
    if (activePanelIdx >= nextCount) setActivePanelIdx(nextCount - 1);
  }

  function updatePanel(idx: number, updater: (p: ComicPanel) => ComicPanel) {
    setPanels((prev) => prev.map((p, i) => (i === idx ? updater(p) : p)));
  }

  function addSticker(emoji: string) {
    const st: ComicSticker = {
      id: makeId('st'),
      emoji,
      x: 32 + Math.floor(Math.random() * 36),
      y: 44 + Math.floor(Math.random() * 32),
      scale: emoji.length > 3 ? 0.95 : 1.2,
      flip: false,
      tilt: 0,
    };
    updatePanel(activePanelIdx, (p) => ({ ...p, stickers: [...p.stickers, st] }));
    setSelectedStickerId(st.id);
    setSelectedBubbleId(null);
  }

  function addBubble(text: string) {
    const clean = text.trim();
    if (!clean) return;
    const isCap = bubbleStyle === 'caption';
    const b: ComicBubble = {
      id: makeId('bb'),
      text: clean,
      style: bubbleStyle,
      x: 50,
      y: isCap ? 14 : 24 + (activePanel.bubbles.length % 3) * 16,
    };
    updatePanel(activePanelIdx, (p) => ({ ...p, bubbles: [...p.bubbles, b] }));
    setSelectedBubbleId(b.id);
    setSelectedStickerId(null);
    setCustomBubbleText('');
    speakText(clean, speakEnabled);
  }

  function startDrag(
    e: ReactPointerEvent<HTMLDivElement>,
    panelIdx: number,
    kind: 'sticker' | 'bubble',
    itemId: string
  ) {
    e.stopPropagation();
    const panelEl = e.currentTarget.parentElement;
    if (!panelEl) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    setActivePanelIdx(panelIdx);
    if (kind === 'sticker') {
      setSelectedStickerId(itemId);
      setSelectedBubbleId(null);
    } else {
      setSelectedBubbleId(itemId);
      setSelectedStickerId(null);
    }
    dragRef.current = {
      panelIdx,
      kind,
      itemId,
      rect: panelEl.getBoundingClientRect(),
    };
  }

  function onPointerMoveItem(e: ReactPointerEvent<HTMLDivElement>) {
    const d = dragRef.current;
    if (!d) return;
    const xPct = Math.min(93, Math.max(7, ((e.clientX - d.rect.left) / d.rect.width) * 100));
    const yPct = Math.min(92, Math.max(8, ((e.clientY - d.rect.top) / d.rect.height) * 100));
    updatePanel(d.panelIdx, (p) => {
      if (d.kind === 'sticker') {
        return {
          ...p,
          stickers: p.stickers.map((s) => (s.id === d.itemId ? { ...s, x: xPct, y: yPct } : s)),
        };
      }
      return {
        ...p,
        bubbles: p.bubbles.map((b) => (b.id === d.itemId ? { ...b, x: xPct, y: yPct } : b)),
      };
    });
  }

  function onPointerUpItem() {
    dragRef.current = null;
  }

  function readWholeComic() {
    const lines = panels
      .map((pn, i) => {
        const text = pn.bubbles.map((b) => b.text).join('. ');
        return text ? `Panel ${i + 1}: ${text}` : '';
      })
      .filter(Boolean);
    if (!lines.length) {
      speakText(`${title}. Add speech bubbles so I can read your story!`, true);
      return;
    }
    speakText(`${title}. ${lines.join(' ')}`, true);
  }

  function saveCurrentComic() {
    const item: SavedComic = {
      id: makeId('cm'),
      title: title.trim() || defaultTitle,
      layout,
      panels: JSON.parse(JSON.stringify(panels)) as ComicPanel[],
      updatedAt: new Date().toLocaleDateString(),
    };
    setSavedComics((prev) => [item, ...prev.slice(0, 14)]);
    flash('Comic saved to your shelf! 📚');
  }

  function downloadComicPng() {
    const cols = layout === 2 ? 2 : layout === 3 ? 3 : layout === 4 ? 2 : 3;
    const rows = Math.ceil(panels.length / cols);
    const panelW = 360;
    const panelH = 270;
    const pad = 18;
    const headerH = 62;
    const width = cols * panelW + (cols + 1) * pad;
    const height = headerH + rows * panelH + (rows + 1) * pad;

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Comic paper background
    ctx.fillStyle = '#fffbeb';
    ctx.fillRect(0, 0, width, height);

    // Header banner
    ctx.fillStyle = '#1b4332';
    ctx.fillRect(0, 0, width, headerH);
    ctx.fillStyle = '#fde68a';
    ctx.font = 'bold 26px Georgia, serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(title || defaultTitle, width / 2, headerH / 2);

    panels.forEach((pn, idx) => {
      const col = idx % cols;
      const row = Math.floor(idx / cols);
      const px = pad + col * (panelW + pad);
      const py = headerH + pad + row * (panelH + pad);
      const scene = SCENES.find((s) => s.id === pn.bg) || SCENES[0];

      ctx.save();
      ctx.beginPath();
      ctx.rect(px, py, panelW, panelH);
      ctx.clip();

      const grad = ctx.createLinearGradient(px, py, px, py + panelH);
      grad.addColorStop(0, scene.topColor);
      grad.addColorStop(0.58, scene.topColor);
      grad.addColorStop(0.62, scene.bottomColor);
      grad.addColorStop(1, scene.bottomColor);
      ctx.fillStyle = grad;
      ctx.fillRect(px, py, panelW, panelH);

      // Scene decorations
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      scene.decor.forEach((d) => {
        ctx.font = `${Math.round(d.size * 1.4)}px sans-serif`;
        ctx.fillText(d.emoji, px + (d.x / 100) * panelW, py + (d.y / 100) * panelH);
      });

      // Stickers
      pn.stickers.forEach((st) => {
        ctx.save();
        const sx = px + (st.x / 100) * panelW;
        const sy = py + (st.y / 100) * panelH;
        ctx.translate(sx, sy);
        ctx.rotate((st.tilt * Math.PI) / 180);
        ctx.scale(st.flip ? -1 : 1, 1);
        const isWordSfx = st.emoji.length > 3;
        ctx.font = isWordSfx
          ? `900 ${Math.round(20 * st.scale)}px Impact, sans-serif`
          : `${Math.round(38 * st.scale)}px sans-serif`;
        if (isWordSfx) {
          ctx.lineWidth = 4;
          ctx.strokeStyle = '#ffffff';
          ctx.strokeText(st.emoji, 0, 0);
          ctx.fillStyle = '#dc2626';
        }
        ctx.fillText(st.emoji, 0, 0);
        ctx.restore();
      });

      // Bubbles
      pn.bubbles.forEach((b) => {
        const bx = px + (b.x / 100) * panelW;
        const by = py + (b.y / 100) * panelH;
        ctx.font = 'bold 14px sans-serif';
        const textW = Math.min(panelW - 36, Math.max(70, ctx.measureText(b.text).width + 24));
        const bh = 32;
        ctx.fillStyle =
          b.style === 'shout' || b.style === 'caption' ? '#fef08a' : '#ffffff';
        ctx.strokeStyle = '#1e293b';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.roundRect(bx - textW / 2, by - bh / 2, textW, bh, b.style === 'caption' ? 4 : 14);
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = '#0f172a';
        ctx.fillText(b.text, bx, by, textW - 12);
      });

      ctx.restore();

      // Thick comic gutter border
      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 4;
      ctx.strokeRect(px, py, panelW, panelH);
    });

    const a = document.createElement('a');
    const safeName = (title || 'comic').toLowerCase().replace(/[^a-z0-9]+/g, '-');
    a.href = canvas.toDataURL('image/png');
    a.download = `${safeName}.png`;
    a.click();
    flash('Comic picture downloaded! 📸');
  }

  const gridColsClass =
    layout === 2 ? 'sm:grid-cols-2' : layout === 4 ? 'sm:grid-cols-2' : 'sm:grid-cols-3';

  return (
    <div className="p-4 rounded-3xl bg-white border-2 border-[#74c69d] space-y-4">
      {/* Studio Top Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <button
          onClick={onBack}
          className="px-3 py-1.5 rounded-xl bg-[#edf6f0] text-xs font-bold text-[#1b4332] cursor-pointer"
        >
          ← Back to School
        </button>
        <div className="font-atlas font-bold text-base text-[#1b4332]">🎨 {kid}’s Comic Studio</div>
        <div className="flex flex-wrap gap-1.5 text-xs">
          <button
            onClick={readWholeComic}
            className="px-2.5 py-1.5 rounded-xl bg-[#dbeafe] text-[#1e3a8a] font-bold cursor-pointer"
          >
            🔊 Read Comic
          </button>
          <button
            onClick={saveCurrentComic}
            className="px-2.5 py-1.5 rounded-xl bg-[#2d6a4f] text-white font-bold cursor-pointer"
          >
            💾 Save
          </button>
          <button
            onClick={downloadComicPng}
            className="px-2.5 py-1.5 rounded-xl bg-[#fef3c7] border border-[#f59e0b] text-[#78350f] font-bold cursor-pointer"
          >
            📸 Download PNG
          </button>
          <button
            onClick={() => setShelfOpen((v) => !v)}
            className="px-2.5 py-1.5 rounded-xl bg-[#f3e8ff] text-[#5b21b6] font-bold cursor-pointer"
          >
            📚 Shelf ({savedComics.length})
          </button>
        </div>
      </div>

      {statusMsg && (
        <div className="px-3 py-1.5 rounded-xl bg-emerald-100 border border-emerald-300 text-xs font-bold text-emerald-900 text-center">
          {statusMsg}
        </div>
      )}

      {/* Saved Shelf Drawer */}
      {shelfOpen && (
        <div className="p-3 rounded-2xl bg-[#faf5ff] border border-[#d8b4fe] space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <strong className="text-[#5b21b6]">📚 Saved Comics on This Device</strong>
            <button
              onClick={() => {
                setTitle(defaultTitle);
                setLayout(3);
                setPanels(makeDefaultPanels(3));
                setActivePanelIdx(0);
                setShelfOpen(false);
              }}
              className="px-2.5 py-1 rounded-lg bg-white border border-[#c4b5fd] font-bold cursor-pointer"
            >
              ✨ Start Blank Comic
            </button>
          </div>
          {!savedComics.length ? (
            <p className="text-[#6b21a8]">No saved comics yet — tap Save anytime!</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {savedComics.map((sc) => (
                <div
                  key={sc.id}
                  className="p-2 rounded-xl bg-white border border-[#e9d5ff] flex items-center justify-between gap-2"
                >
                  <div>
                    <div className="font-bold text-[#4c1d95]">{sc.title}</div>
                    <div className="text-[10px] text-[#6b7280]">
                      {sc.layout} panels · {sc.updatedAt}
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => {
                        setTitle(sc.title);
                        setLayout(sc.layout);
                        setPanels(sc.panels);
                        setActivePanelIdx(0);
                        setShelfOpen(false);
                      }}
                      className="px-2 py-1 rounded bg-[#ede9fe] font-bold cursor-pointer"
                    >
                      Open
                    </button>
                    <button
                      onClick={() => setSavedComics((p) => p.filter((x) => x.id !== sc.id))}
                      className="px-2 py-1 rounded bg-red-50 text-red-700 font-bold cursor-pointer"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Title & Layout Row */}
      <div className="flex flex-wrap items-center gap-2 text-xs">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Comic Title"
          className="flex-1 min-w-[180px] px-3 py-1.5 rounded-xl border border-[#95d5b2] font-bold text-[#1b4332]"
        />
        <div className="flex items-center gap-1">
          <span className="font-bold text-[#40916c]">Panels:</span>
          {([2, 3, 4, 6] as const).map((cnt) => (
            <button
              key={cnt}
              onClick={() => changeLayout(cnt)}
              className={`px-2.5 py-1 rounded-lg font-bold cursor-pointer border ${
                layout === cnt
                  ? 'bg-[#1b4332] text-white border-[#1b4332]'
                  : 'bg-[#f4fbf6] text-[#1b4332] border-[#95d5b2]'
              }`}
            >
              {cnt}
            </button>
          ))}
        </div>
      </div>

      {/* Comic Strip Canvas Grid */}
      <div className={`grid grid-cols-1 ${gridColsClass} gap-3 bg-[#fffbeb] p-3 rounded-2xl border-2 border-slate-800`}>
        {panels.map((pn, idx) => {
          const sc = SCENES.find((s) => s.id === pn.bg) || SCENES[0];
          const isCurrent = idx === activePanelIdx;
          return (
            <div
              key={pn.id}
              onClick={() => {
                setActivePanelIdx(idx);
                setSelectedStickerId(null);
                setSelectedBubbleId(null);
              }}
              style={{
                background: `linear-gradient(to bottom, ${sc.topColor} 0%, ${sc.topColor} 58%, ${sc.bottomColor} 62%, ${sc.bottomColor} 100%)`,
                touchAction: 'none',
              }}
              className={`relative h-56 rounded-lg border-4 overflow-hidden select-none cursor-pointer transition ${
                isCurrent ? 'border-[#16a34a] ring-4 ring-[#86efac]' : 'border-slate-900'
              }`}
            >
              {/* Panel Badge */}
              <span className="absolute top-1.5 left-1.5 z-10 px-1.5 py-0.5 rounded bg-slate-900/75 text-white text-[10px] font-bold">
                #{idx + 1}
              </span>

              {/* Scene Decor */}
              {sc.decor.map((d, dIdx) => (
                <span
                  key={dIdx}
                  style={{ left: `${d.x}%`, top: `${d.y}%`, fontSize: `${d.size}px` }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-85"
                >
                  {d.emoji}
                </span>
              ))}

              {/* Draggable Stickers */}
              {pn.stickers.map((st) => {
                const isSel = isCurrent && st.id === selectedStickerId;
                const isSfx = st.emoji.length > 3;
                return (
                  <div
                    key={st.id}
                    onPointerDown={(e) => startDrag(e, idx, 'sticker', st.id)}
                    onPointerMove={onPointerMoveItem}
                    onPointerUp={onPointerUpItem}
                    style={{
                      left: `${st.x}%`,
                      top: `${st.y}%`,
                      transform: `translate(-50%, -50%) scale(${st.scale}) rotate(${st.tilt}deg) scaleX(${st.flip ? -1 : 1})`,
                      touchAction: 'none',
                    }}
                    className={`absolute z-20 cursor-grab active:cursor-grabbing ${
                      isSel ? 'ring-2 ring-amber-400 rounded-lg bg-white/25' : ''
                    } ${
                      isSfx
                        ? 'font-black text-red-600 text-sm whitespace-nowrap drop-shadow-[0_1px_1px_rgba(255,255,255,1)] px-1'
                        : 'text-4xl leading-none'
                    }`}
                  >
                    {st.emoji}
                  </div>
                );
              })}

              {/* Draggable Speech/Thought/Shout/Caption Bubbles */}
              {pn.bubbles.map((b) => {
                const isSel = isCurrent && b.id === selectedBubbleId;
                const baseCls =
                  b.style === 'caption'
                    ? 'bg-amber-200 border-2 border-slate-900 rounded px-2 py-1 text-[11px] font-bold uppercase tracking-wide'
                    : b.style === 'shout'
                      ? 'bg-yellow-300 border-2 border-red-700 rounded-2xl px-2.5 py-1 text-xs font-black text-red-900 shadow-md'
                      : b.style === 'thought'
                        ? 'bg-white border-2 border-dashed border-sky-700 rounded-full px-3 py-1 text-xs font-bold text-slate-900 shadow'
                        : 'bg-white border-2 border-slate-900 rounded-2xl px-2.5 py-1 text-xs font-bold text-slate-900 shadow';
                return (
                  <div
                    key={b.id}
                    onPointerDown={(e) => startDrag(e, idx, 'bubble', b.id)}
                    onPointerMove={onPointerMoveItem}
                    onPointerUp={onPointerUpItem}
                    style={{
                      left: `${b.x}%`,
                      top: `${b.y}%`,
                      transform: 'translate(-50%, -50%)',
                      touchAction: 'none',
                    }}
                    className={`absolute z-30 max-w-[85%] text-center cursor-grab active:cursor-grabbing ${baseCls} ${
                      isSel ? 'ring-2 ring-emerald-500' : ''
                    }`}
                  >
                    {b.text}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>

      {/* Selected Item Controls (Sticker or Bubble) */}
      {selectedSticker && (
        <div className="p-2.5 rounded-2xl bg-[#fef3c7] border border-[#f59e0b] flex flex-wrap items-center justify-between gap-2 text-xs">
          <span className="font-bold text-[#78350f]">Editing Sticker {selectedSticker.emoji} (drag anywhere in panel!):</span>
          <div className="flex flex-wrap gap-1.5">
            <button
              onClick={() =>
                updatePanel(activePanelIdx, (p) => ({
                  ...p,
                  stickers: p.stickers.map((s) =>
                    s.id === selectedSticker.id ? { ...s, scale: Math.min(2.2, +(s.scale + 0.2).toFixed(2)) } : s
                  ),
                }))
              }
              className="px-2.5 py-1 rounded-lg bg-white border border-[#f59e0b] font-bold cursor-pointer"
            >
              ➕ Bigger
            </button>
            <button
              onClick={() =>
                updatePanel(activePanelIdx, (p) => ({
                  ...p,
                  stickers: p.stickers.map((s) =>
                    s.id === selectedSticker.id ? { ...s, scale: Math.max(0.6, +(s.scale - 0.2).toFixed(2)) } : s
                  ),
                }))
              }
              className="px-2.5 py-1 rounded-lg bg-white border border-[#f59e0b] font-bold cursor-pointer"
            >
              ➖ Smaller
            </button>
            <button
              onClick={() =>
                updatePanel(activePanelIdx, (p) => ({
                  ...p,
                  stickers: p.stickers.map((s) =>
                    s.id === selectedSticker.id ? { ...s, flip: !s.flip } : s
                  ),
                }))
              }
              className="px-2.5 py-1 rounded-lg bg-white border border-[#f59e0b] font-bold cursor-pointer"
            >
              ↔ Flip
            </button>
            <button
              onClick={() =>
                updatePanel(activePanelIdx, (p) => ({
                  ...p,
                  stickers: p.stickers.map((s) =>
                    s.id === selectedSticker.id ? { ...s, tilt: s.tilt >= 20 ? -20 : s.tilt + 10 } : s
                  ),
                }))
              }
              className="px-2.5 py-1 rounded-lg bg-white border border-[#f59e0b] font-bold cursor-pointer"
            >
              ↻ Tilt
            </button>
            <button
              onClick={() => {
                updatePanel(activePanelIdx, (p) => ({
                  ...p,
                  stickers: p.stickers.filter((s) => s.id !== selectedSticker.id),
                }));
                setSelectedStickerId(null);
              }}
              className="px-2.5 py-1 rounded-lg bg-red-600 text-white font-bold cursor-pointer"
            >
              🗑️ Delete
            </button>
          </div>
        </div>
      )}

      {selectedBubble && (
        <div className="p-2.5 rounded-2xl bg-[#dbeafe] border border-[#60a5fa] flex flex-wrap items-center justify-between gap-2 text-xs">
          <span className="font-bold text-[#1e3a8a] truncate">
            Editing Bubble: “{selectedBubble.text}” (drag to move!)
          </span>
          <div className="flex gap-1.5">
            <button
              onClick={() => speakText(selectedBubble.text, true)}
              className="px-2.5 py-1 rounded-lg bg-white font-bold cursor-pointer"
            >
              🔊 Read
            </button>
            <button
              onClick={() => {
                updatePanel(activePanelIdx, (p) => ({
                  ...p,
                  bubbles: p.bubbles.filter((b) => b.id !== selectedBubble.id),
                }));
                setSelectedBubbleId(null);
              }}
              className="px-2.5 py-1 rounded-lg bg-red-600 text-white font-bold cursor-pointer"
            >
              🗑️ Delete Bubble
            </button>
          </div>
        </div>
      )}

      {/* Scene + Sticker + Bubble Studio Controls for Active Panel */}
      <div className="p-3 rounded-2xl bg-[#f4fbf6] border border-[#95d5b2] space-y-3 text-xs">
        <div className="font-bold text-[#1b4332]">
          Editing Panel #{activePanelIdx + 1} · Pick Scene Backdrop:
        </div>
        <div className="flex flex-wrap gap-1.5">
          {SCENES.map((sc) => (
            <button
              key={sc.id}
              onClick={() => updatePanel(activePanelIdx, (p) => ({ ...p, bg: sc.id }))}
              className={`px-2.5 py-1 rounded-xl font-bold cursor-pointer border flex items-center gap-1 ${
                activePanel.bg === sc.id
                  ? 'bg-[#2d6a4f] text-white border-[#1b4332]'
                  : 'bg-white text-[#1b4332] border-[#95d5b2]'
              }`}
            >
              <span>{sc.icon}</span>
              <span>{sc.name}</span>
            </button>
          ))}
        </div>

        {/* Sticker Picker Tabs */}
        <div className="space-y-2 pt-1 border-t border-[#d8f3dc]">
          <div className="flex flex-wrap gap-1.5 items-center">
            <span className="font-bold text-[#40916c]">Add Stickers &amp; Heroes:</span>
            {STICKER_CATS.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setStickerCat(cat.id)}
                className={`px-2.5 py-1 rounded-full font-bold cursor-pointer border ${
                  stickerCat === cat.id
                    ? 'bg-[#1b4332] text-white border-[#1b4332]'
                    : 'bg-white text-[#1b4332] border-[#95d5b2]'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap gap-1.5">
            {(STICKER_CATS.find((c) => c.id === stickerCat)?.items || []).map((em) => (
              <button
                key={em}
                onClick={() => addSticker(em)}
                className="px-2.5 py-1.5 rounded-xl bg-white hover:bg-[#d8f3dc] border border-[#95d5b2] text-base font-bold cursor-pointer"
              >
                {em}
              </button>
            ))}
          </div>
        </div>

        {/* Speech Bubble Builder */}
        <div className="space-y-2 pt-1 border-t border-[#d8f3dc]">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="font-bold text-[#40916c]">Add Bubble / Words:</span>
            {(
              [
                ['speech', '💬 Speech'],
                ['thought', '💭 Thought'],
                ['shout', '💥 Shout'],
                ['caption', '🟨 Story Box'],
              ] as Array<[BubbleStyle, string]>
            ).map(([k, lbl]) => (
              <button
                key={k}
                onClick={() => setBubbleStyle(k)}
                className={`px-2.5 py-1 rounded-full font-bold cursor-pointer border ${
                  bubbleStyle === k
                    ? 'bg-[#1d4ed8] text-white border-[#1e40af]'
                    : 'bg-white text-[#1e3a8a] border-[#93c5fd]'
                }`}
              >
                {lbl}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap gap-1.5">
            {starterLines.map((ln) => (
              <button
                key={ln}
                onClick={() => addBubble(ln)}
                className="px-2.5 py-1 rounded-full bg-white hover:bg-[#dbeafe] border border-[#93c5fd] font-semibold cursor-pointer"
              >
                + {ln}
              </button>
            ))}
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={customBubbleText}
              onChange={(e) => setCustomBubbleText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') addBubble(customBubbleText);
              }}
              placeholder="Type your own words to put in this panel..."
              className="flex-1 px-3 py-1.5 rounded-xl border border-[#95d5b2] bg-white"
            />
            <button
              onClick={() => addBubble(customBubbleText)}
              className="px-3 py-1.5 rounded-xl bg-[#2d6a4f] text-white font-bold cursor-pointer"
            >
              ＋ Add
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
