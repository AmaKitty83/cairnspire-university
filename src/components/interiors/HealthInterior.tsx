import { useEffect, useState, type ChangeEvent } from 'react';
import type { CampusRole } from '../../firebase';
import {
  importFamilyHubBundle,
  isoDateLocal,
  saveGroceryList,
  subscribeGrocery,
  type FamilyHubBundle,
  type GroceryItem,
} from '../../services/familyHubService';
import { FAMILY_PEOPLE } from '../../services/familyHubService';
import {
  EMPTY_FAMILY_CARD,
  getFamilyMedCardImage,
  saveAmaretteMedicalList,
  saveFamilyMedCardImage,
  saveFamilyMedicalCard,
  saveShowedUpDate,
  subscribeAmaretteMedical,
  subscribeFamilyMedical,
  subscribeHealthFitnessContent,
  subscribeHealthFitnessDays,
  subscribeShowedUpLog,
  type AmaretteMedicalItem,
  type AmaretteMedicalType,
  type CardSide,
  type FamilyMedicalCardFields,
  type FamilyMedicalEntry,
  type HealthContentCard,
  type HealthContentSection,
  type HealthFitnessContentDoc,
  type OuraDayRecord,
} from '../../services/healthService';
import { OfflineRosterPanel } from './OfflineRosterPanel';

interface HealthInteriorProps {
  role: CampusRole;
  userEmail: string;
}

type MainTab = 'fitness' | 'medical' | 'cards';
type FitnessSubTab = 'dash' | 'trainer' | 'nutritionist' | 'meno';
type MoodCheck = 'good' | 'low' | 'hip';

const MED_TYPES: AmaretteMedicalType[] = ['Provider', 'Condition', 'Medication', 'Note'];

const WEEKDAY_MOVES: Record<number, { label: string; move: string; justStart: string }> = {
  1: { label: 'Mon (Strength A)', move: '15 min: Glute bridges, wall push-ups, seated band rows, bird dog + 5 min downshift', justStart: '5 min: 1 set of glute bridges + slow breathing' },
  2: { label: 'Tue (Zone 2)', move: '20 min relaxed walk (can talk, cannot sing)', justStart: '5 min fresh-air walk out by the chickens' },
  3: { label: 'Wed (Mobility)', move: '15 min gentle hip circles lying down, cat-cow + 5 min downshift', justStart: '3 min: 4–6 breathing or physiological sigh' },
  4: { label: 'Thu (Strength A)', move: '15 min gentle strength + 5 min vagus downshift', justStart: '5 min: 1 set of wall push-ups + seated rows' },
  5: { label: 'Fri (Zone 2)', move: '20 min Zone 2 walk (rockhounding counts!)', justStart: '5 min: quick stroll around the yard' },
  6: { label: 'Sat (Play / Yard)', move: 'Easy fun movement: yard, chickens, walk with the boys', justStart: '5 min outside in the sun' },
  0: { label: 'Sun (Rest)', move: 'Rest + 5 min downshift + gentle pelvic floor relaxation', justStart: '3 min belly breathing lying down' },
};

const ZERO_ENERGY_STASH = [
  { item: 'Sugar-free meat sticks (Chomps / beef or turkey)', protein: '~9g', cat: 'Snacks' },
  { item: 'Dairy-free protein powder + Unsweetened almond milk', protein: '~25g', cat: 'Pantry' },
  { item: 'Rotisserie chicken', protein: '~35g/bowl', cat: 'Meat & Seafood' },
  { item: 'Hard-boiled eggs + Cherry tomatoes', protein: '~12g', cat: 'Dairy & Eggs' },
  { item: 'Frozen shrimp + Bagged coleslaw mix + Coconut aminos', protein: '~30g', cat: 'Meat & Seafood' },
];

function hfAvg(arr: OuraDayRecord[], key: keyof OuraDayRecord): number | null {
  const vals = arr
    .map((d) => d[key])
    .filter((v): v is number => typeof v === 'number' && Number.isFinite(v));
  if (!vals.length) return null;
  return vals.reduce((sum, v) => sum + v, 0) / vals.length;
}

function hfFmt(v: number | null | undefined, dp = 0): string {
  if (v == null || !Number.isFinite(v)) return '—';
  return v.toFixed(dp);
}

function hfTone(v: number | null | undefined): { word: string; ring: string; bg: string; text: string } {
  if (v == null) return { word: 'No data yet', ring: '#cbd5e1', bg: '#f8fafc', text: '#475569' };
  if (v >= 85) return { word: 'Thriving', ring: '#16a34a', bg: '#dcfce7', text: '#166534' };
  if (v >= 70) return { word: 'Steady', ring: '#2563eb', bg: '#dbeafe', text: '#1e40af' };
  return { word: 'Gentle day', ring: '#d97706', bg: '#fef3c7', text: '#92400e' };
}

function hfWeeks(days: OuraDayRecord[]): Array<{ wk: string; arr: OuraDayRecord[] }> {
  const by: Record<string, OuraDayRecord[]> = {};
  const order: string[] = [];
  days.forEach((x) => {
    const dt = new Date(`${x.date}T12:00:00`);
    const m = new Date(dt);
    m.setDate(dt.getDate() - ((dt.getDay() + 6) % 7));
    const k = `${m.getFullYear()}-${String(m.getMonth() + 1).padStart(2, '0')}-${String(m.getDate()).padStart(2, '0')}`;
    if (!by[k]) {
      by[k] = [];
      order.push(k);
    }
    by[k].push(x);
  });
  return order
    .slice(-5)
    .reverse()
    .map((wk) => ({ wk, arr: by[wk] }));
}

function ScoreRing({ label, val, sub }: { label: string; val: number | null; sub: string }) {
  const tone = hfTone(val);
  const r = 32;
  const circ = 2 * Math.PI * r;
  const pct = val == null ? 0 : Math.max(0, Math.min(100, val)) / 100;
  return (
    <div
      className="flex items-center gap-3 p-3 rounded-xl border border-[#b7d8c2]"
      style={{ backgroundColor: tone.bg }}
    >
      <svg viewBox="0 0 80 80" className="w-16 h-16 shrink-0" aria-hidden="true">
        <circle cx="40" cy="40" r={r} fill="none" stroke="#e2e8f0" strokeWidth="7" />
        <circle
          cx="40"
          cy="40"
          r={r}
          fill="none"
          stroke={tone.ring}
          strokeWidth="7"
          strokeLinecap="round"
          strokeDasharray={`${(circ * pct).toFixed(1)} ${circ.toFixed(1)}`}
          transform="rotate(-90 40 40)"
        />
        <text x="40" y="45" textAnchor="middle" className="text-base font-bold fill-[#1b4332]">
          {val == null ? '—' : Math.round(val)}
        </text>
      </svg>
      <div className="min-w-0">
        <div className="text-sm font-bold text-[#1b4332]">{label}</div>
        <div className="text-xs font-semibold" style={{ color: tone.text }}>
          {tone.word}
        </div>
        {sub && <div className="text-[11px] text-[#355e47]">{sub}</div>}
      </div>
    </div>
  );
}

function MiniChart({
  title,
  days,
  series,
}: {
  title: string;
  days: OuraDayRecord[];
  series: Array<{ k: keyof OuraDayRecord; label: string; color: string; type?: 'bar' | 'line' }>;
}) {
  const vals: number[] = [];
  series.forEach((s) => {
    days.forEach((d) => {
      const v = d[s.k];
      if (typeof v === 'number' && Number.isFinite(v)) vals.push(v);
    });
  });
  if (!vals.length) {
    return (
      <div className="p-3 rounded-xl bg-white/85 border border-[#b7d8c2]">
        <div className="text-xs font-bold text-[#1b4332]">{title}</div>
        <div className="text-[11px] text-[#52796f] mt-1">No data yet for this range.</div>
      </div>
    );
  }
  const W = 300;
  const H = 116;
  const pl = 30;
  const pb = 16;
  const pt = 8;
  let mn = Math.min(...vals);
  let mx = Math.max(...vals);
  if (series[0].type === 'bar') mn = 0;
  if (mx === mn) {
    mx += 1;
    mn = Math.max(0, mn - 1);
  }
  const n = days.length;
  const X = (i: number) => pl + (n < 2 ? (W - pl - 6) / 2 : (i * (W - pl - 6)) / (n - 1));
  const Y = (v: number) => pt + (H - pt - pb) * (1 - (v - mn) / (mx - mn));

  return (
    <div className="p-3 rounded-xl bg-white/95 border border-[#b7d8c2]">
      <div className="text-xs font-bold text-[#1b4332] mb-1">{title}</div>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-28" role="img" aria-label={title}>
        <line x1={pl} y1={H - pb} x2={W} y2={H - pb} stroke="#cbd5e1" strokeWidth="1" />
        <text x="2" y={pt + 8} className="text-[9px] fill-[#475569]">
          {hfFmt(mx, mx < 20 ? 1 : 0)}
        </text>
        <text x="2" y={H - pb} className="text-[9px] fill-[#475569]">
          {hfFmt(mn, mx < 20 ? 1 : 0)}
        </text>
        <text x={pl} y={H - 2} className="text-[9px] fill-[#64748b]">
          {days[0]?.date.slice(5)}
        </text>
        <text x={W} y={H - 2} textAnchor="end" className="text-[9px] fill-[#64748b]">
          {days[days.length - 1]?.date.slice(5)}
        </text>
        {series.map((s) => {
          if (s.type === 'bar') {
            const bw = Math.max(3, ((W - pl - 6) / Math.max(1, n)) * 0.65);
            return days.map((d, i) => {
              const v = d[s.k];
              if (typeof v !== 'number') return null;
              const y = Y(v);
              return (
                <rect
                  key={`${String(s.k)}-${d.date}`}
                  x={X(i) - bw / 2}
                  y={y}
                  width={bw}
                  height={Math.max(1, H - pb - y)}
                  rx="2"
                  fill={s.color}
                >
                  <title>{`${d.date}: ${v}`}</title>
                </rect>
              );
            });
          }
          const pts = days
            .map((d, i) => {
              const v = d[s.k];
              return typeof v === 'number' ? `${X(i).toFixed(1)},${Y(v).toFixed(1)}` : '';
            })
            .filter(Boolean)
            .join(' ');
          return (
            <g key={String(s.k)}>
              <polyline fill="none" stroke={s.color} strokeWidth="2" points={pts} />
              {days.map((d, i) => {
                const v = d[s.k];
                if (typeof v !== 'number') return null;
                return (
                  <circle key={`${String(s.k)}-${d.date}`} cx={X(i)} cy={Y(v)} r="2.4" fill={s.color}>
                    <title>{`${d.date}: ${v}`}</title>
                  </circle>
                );
              })}
            </g>
          );
        })}
      </svg>
      {series.length > 1 && (
        <div className="flex flex-wrap gap-3 mt-1 text-[10px] text-[#355e47]">
          {series.map((s) => (
            <span key={String(s.k)} className="inline-flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ backgroundColor: s.color }} />
              {s.label}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

async function compressImageToDataUrl(file: File): Promise<string> {
  const dataUrl = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ''));
    reader.onerror = () => reject(new Error('Could not read selected image file.'));
    reader.readAsDataURL(file);
  });
  const img = await new Promise<HTMLImageElement>((resolve, reject) => {
    const i = new Image();
    i.onload = () => resolve(i);
    i.onerror = () => reject(new Error('Invalid image file.'));
    i.src = dataUrl;
  });
  const maxSide = 1200;
  const scale = Math.min(1, maxSide / Math.max(img.width, img.height));
  const canvas = document.createElement('canvas');
  canvas.width = Math.max(1, Math.round(img.width * scale));
  canvas.height = Math.max(1, Math.round(img.height * scale));
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Could not prepare image canvas.');
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  return canvas.toDataURL('image/jpeg', 0.82);
}

function verdictPill(cell: string) {
  const v = cell.trim();
  if (/^legit/i.test(v)) {
    return (
      <span className="inline-block px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900 font-bold text-[10px]">
        {v}
      </span>
    );
  }
  if (/^(partly|probably)/i.test(v)) {
    return (
      <span className="inline-block px-2 py-0.5 rounded-full bg-sky-100 text-sky-900 font-bold text-[10px]">
        {v}
      </span>
    );
  }
  if (/^(mostly )?(gimmick|not legit|myth)/i.test(v)) {
    return (
      <span className="inline-block px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 font-bold text-[10px]">
        {v}
      </span>
    );
  }
  return v;
}

function ContentSectionView({ section }: { section: HealthContentSection }) {
  return (
    <div className="space-y-3">
      <div className="p-3 rounded-xl bg-[#e9f5ec] border border-[#74c69d]">
        <h4 className="font-atlas font-bold text-sm text-[#1b4332]">{section.title}</h4>
        {section.intro && <p className="text-xs text-[#2d6a4f] mt-1 leading-relaxed">{section.intro}</p>}
      </div>
      <div className="space-y-3">
        {(section.cards || []).map((card: HealthContentCard) => (
          <div key={card.id} className="p-3 rounded-xl bg-white/95 border border-[#b7d8c2] space-y-2">
            <div className="font-bold text-xs text-[#1b4332]">{card.title}</div>
            {(card.blocks || []).map((b, bIdx) => {
              if (b.type === 'text' && b.text) {
                return (
                  <p key={bIdx} className="text-xs text-[#2b3a30] leading-relaxed">
                    {b.text}
                  </p>
                );
              }
              if (b.type === 'table' && b.columns && b.rows) {
                return (
                  <div key={bIdx} className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-[11px]">
                      <thead>
                        <tr className="bg-[#edf6f0] text-[#1b4332]">
                          {b.columns.map((c) => (
                            <th key={c} className="p-1.5 border border-[#cbe2d3] font-bold">
                              {c}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {b.rows.map((r, rIdx) => (
                          <tr key={rIdx} className="odd:bg-white even:bg-[#f8fcf9]">
                            {r.map((cell, cIdx) => (
                              <td key={cIdx} className="p-1.5 border border-[#e0ede5] align-top text-[#26382c]">
                                {verdictPill(cell)}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                );
              }
              if (b.type === 'sources' && b.links) {
                return (
                  <div key={bIdx} className="text-[11px] text-[#355e47] flex flex-wrap gap-2">
                    <span className="font-semibold">Sources:</span>
                    {b.links.map((l, lIdx) =>
                      /^https:\/\//.test(l[1] || '') ? (
                        <a
                          key={lIdx}
                          href={l[1]}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="underline text-[#1d4ed8]"
                        >
                          {l[0]}
                        </a>
                      ) : (
                        <span key={lIdx}>{l[0]}</span>
                      )
                    )}
                  </div>
                );
              }
              return null;
            })}
          </div>
        ))}
      </div>
      {section.disclaimer && (
        <div className="text-[11px] text-[#5c4820] bg-[#fef9c3] border border-[#fde047] rounded-lg px-3 py-2">
          💛 {section.disclaimer}
        </div>
      )}
    </div>
  );
}

export function HealthInterior({ role, userEmail }: HealthInteriorProps) {
  const isChancellor = role === 'chancellor';
  const canSeeFamilyCards = role === 'chancellor' || role === 'university';

  const [tab, setTab] = useState<MainTab>(isChancellor ? 'fitness' : 'cards');
  const [fitSubTab, setFitSubTab] = useState<FitnessSubTab>('dash');
  const [trendSpan, setTrendSpan] = useState<7 | 30>(7);
  const [fullScreen, setFullScreen] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    try {
      return localStorage.getItem('cs_health_dark') === '1';
    } catch {
      return false;
    }
  });
  const [mood, setMood] = useState<MoodCheck>('good');
  const [stashNotice, setStashNotice] = useState<string | null>(null);

  // Live Firestore states
  const [days, setDays] = useState<OuraDayRecord[]>([]);
  const [contentDoc, setContentDoc] = useState<HealthFitnessContentDoc | null>(null);
  const [amaretteMed, setAmaretteMed] = useState<AmaretteMedicalItem[]>([]);
  const [familyCards, setFamilyCards] = useState<Record<string, FamilyMedicalEntry>>({});
  const [showedUpDates, setShowedUpDates] = useState<string[]>([]);
  const [groceryItems, setGroceryItems] = useState<GroceryItem[]>([]);
  const [errMsg, setErrMsg] = useState<string | null>(null);

  // Import state (Chancellor only)
  const [importing, setImporting] = useState(false);
  const [importMsg, setImportMsg] = useState<string | null>(null);

  // Amarette Medical form state
  const [editingMed, setEditingMed] = useState<AmaretteMedicalItem | null>(null);
  const [medType, setMedType] = useState<AmaretteMedicalType>('Provider');
  const [medName, setMedName] = useState('');
  const [medDetail, setMedDetail] = useState('');
  const [medLocation, setMedLocation] = useState('');
  const [medPhone, setMedPhone] = useState('');
  const [medNotes, setMedNotes] = useState('');
  const [savingMed, setSavingMed] = useState(false);

  // Family Health Cards UI state
  const [selectedPerson, setSelectedPerson] = useState('Amarette');
  const [editingCard, setEditingCard] = useState(false);
  const [cardDraft, setCardDraft] = useState<FamilyMedicalCardFields>({ ...EMPTY_FAMILY_CARD });
  const [savingCard, setSavingCard] = useState(false);
  const [cardImgPreview, setCardImgPreview] = useState<{ side: CardSide; url: string } | null>(null);

  useEffect(() => {
    const unsubs: Array<() => void> = [];
    const onErr = (e: Error) => setErrMsg(e.message);

    if (isChancellor) {
      unsubs.push(
        subscribeHealthFitnessDays(setDays, onErr),
        subscribeHealthFitnessContent(setContentDoc, onErr),
        subscribeAmaretteMedical(setAmaretteMed, onErr),
        subscribeShowedUpLog(setShowedUpDates, onErr),
        subscribeGrocery(setGroceryItems, onErr)
      );
    }
    if (canSeeFamilyCards) {
      unsubs.push(subscribeFamilyMedical(setFamilyCards, onErr));
    }
    return () => unsubs.forEach((u) => u());
  }, [isChancellor, canSeeFamilyCards]);

  useEffect(() => {
    const existing = familyCards[selectedPerson]?.card || EMPTY_FAMILY_CARD;
    setCardDraft({ ...EMPTY_FAMILY_CARD, ...existing });
    setEditingCard(false);
    setCardImgPreview(null);
  }, [selectedPerson, familyCards]);

  if (role === 'guest') {
    return (
      <div className="p-4 rounded-xl bg-[#f1f6f9] border border-[#8fb2c9] space-y-2 text-[#1e3a4c]">
        <div className="font-atlas font-bold text-sm">🔒 School of Health · Article III Private Vault</div>
        <p className="text-xs leading-relaxed">
          Under Cairnspire’s ratified Preliminary Bill of Rights (Article III), medical records,
          insurance cards, and personal Oura biometric wellness logs are strictly locked to authorized
          household parents and are hidden from Campus Guest read-only views.
        </p>
      </div>
    );
  }

  async function handleBundleImport(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !isChancellor) return;
    setImporting(true);
    setImportMsg(null);
    setErrMsg(null);
    try {
      const txt = await file.text();
      const parsed = JSON.parse(txt) as FamilyHubBundle;
      if (parsed.homeAndGarden) {
        const res = await importFamilyHubBundle(parsed, userEmail);
        setImportMsg(
          `Imported full bundle (${res.counts.healthDays} Oura days, ${res.counts.chores} chores, ${res.counts.recipes} recipes, ${res.counts.events} calendar events)!`
        );
      } else {
        setErrMsg('Selected JSON does not match the Cairnspire v3a migration bundle format.');
      }
    } catch (err: unknown) {
      setErrMsg(err instanceof Error ? err.message : 'Failed to import bundle.');
    } finally {
      setImporting(false);
      e.target.value = '';
    }
  }

  async function handleRestockZeroEnergy() {
    if (!isChancellor) return;
    const haveSet = new Set(groceryItems.filter((g) => !g.got).map((g) => g.item.toLowerCase()));
    const toAdd: GroceryItem[] = [];
    ZERO_ENERGY_STASH.forEach((s, i) => {
      if (haveSet.has(s.item.toLowerCase())) return;
      toAdd.push({
        id: `gr_${Date.now().toString(36)}_${i}`,
        item: s.item,
        category: s.cat,
        qty: '',
        store: 'Walmart',
        by: 'Amarette',
        meal: 'Zero-Energy Stash',
        got: false,
        notes: `${s.protein} protein · Grab & heat`,
      });
    });
    if (toAdd.length) {
      await saveGroceryList([...groceryItems, ...toAdd], userEmail);
      setStashNotice(`Added ${toAdd.length} safe grab-and-heat items to Walmart Grocery List 🛒`);
    } else {
      setStashNotice('Your Zero-Energy Stash items are already on the Grocery List ✔');
    }
    setTimeout(() => setStashNotice(null), 3000);
  }

  function startEditMed(item: AmaretteMedicalItem) {
    setEditingMed(item);
    setMedType((MED_TYPES.includes(item.type as AmaretteMedicalType) ? item.type : 'Note') as AmaretteMedicalType);
    setMedName(item.name);
    setMedDetail(item.detail);
    setMedLocation(item.location);
    setMedPhone(item.phone);
    setMedNotes(item.notes);
  }

  function clearMedForm() {
    setEditingMed(null);
    setMedType('Provider');
    setMedName('');
    setMedDetail('');
    setMedLocation('');
    setMedPhone('');
    setMedNotes('');
  }

  async function handleSaveMed() {
    if (!isChancellor || !medName.trim()) return;
    setSavingMed(true);
    setErrMsg(null);
    try {
      const nextItem: AmaretteMedicalItem = {
        id: editingMed?.id || `med_${Date.now().toString(36)}`,
        type: medType,
        name: medName.trim(),
        detail: medDetail.trim(),
        location: medLocation.trim(),
        phone: medPhone.trim(),
        notes: medNotes.trim(),
        updated: new Date().toISOString().slice(0, 10),
      };
      const updated = editingMed
        ? amaretteMed.map((m) => (m.id === editingMed.id ? nextItem : m))
        : [...amaretteMed, nextItem];
      await saveAmaretteMedicalList(updated, userEmail);
      clearMedForm();
    } catch (err: unknown) {
      setErrMsg(err instanceof Error ? err.message : 'Could not save medical record.');
    } finally {
      setSavingMed(false);
    }
  }

  async function handleDeleteMed(id: string) {
    if (!isChancellor) return;
    try {
      await saveAmaretteMedicalList(
        amaretteMed.filter((m) => m.id !== id),
        userEmail
      );
    } catch (err: unknown) {
      setErrMsg(err instanceof Error ? err.message : 'Could not delete medical record.');
    }
  }

  async function handleSaveFamilyCard() {
    if (!canSeeFamilyCards) return;
    setSavingCard(true);
    setErrMsg(null);
    try {
      const cur = familyCards[selectedPerson];
      await saveFamilyMedicalCard(
        selectedPerson,
        cardDraft,
        { hasFront: cur?.hasFront, hasBack: cur?.hasBack, hasCombined: cur?.hasCombined },
        familyCards,
        userEmail
      );
      setEditingCard(false);
    } catch (err: unknown) {
      setErrMsg(err instanceof Error ? err.message : 'Could not save family health card.');
    } finally {
      setSavingCard(false);
    }
  }

  async function handleCardImageUpload(side: CardSide, e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !canSeeFamilyCards) return;
    setErrMsg(null);
    try {
      const dataUrl = await compressImageToDataUrl(file);
      await saveFamilyMedCardImage(selectedPerson, side, dataUrl, familyCards, userEmail);
      setCardImgPreview({ side, url: dataUrl });
    } catch (err: unknown) {
      setErrMsg(err instanceof Error ? err.message : 'Could not upload card photo.');
    } finally {
      e.target.value = '';
    }
  }

  async function handleViewCardImage(side: CardSide) {
    setErrMsg(null);
    try {
      const url = await getFamilyMedCardImage(selectedPerson, side);
      if (url) setCardImgPreview({ side, url });
    } catch (err: unknown) {
      setErrMsg(err instanceof Error ? err.message : 'Could not load card image.');
    }
  }

  const latestDay = days[days.length - 1];
  const spanDays = days.slice(-trendSpan);
  const weekAverages = hfWeeks(days.slice(-35));
  const activeEntry = familyCards[selectedPerson];
  const activeCard = activeEntry?.card || EMPTY_FAMILY_CARD;

  const todayKey = isoDateLocal();
  const showedUpToday = showedUpDates.includes(todayKey);
  const todayPlan = WEEKDAY_MOVES[new Date().getDay()];
  const readiness = latestDay?.ready ?? null;

  const tailoredMoveText =
    mood === 'hip'
      ? 'Hip feels tender today → Skip squats/lunges/hills. Try lying-down hip circles, seated band rows, or a flat 10-min easy stroll. Sharp/pinching pain = stop sign.'
      : mood === 'low' || (readiness != null && readiness < 70)
        ? `Gentle-day readiness${readiness != null ? ` (${Math.round(readiness)})` : ''} → Skip high intensity. Pick a slow 10–15 min walk + 5 min downshift, or just the 5-min option below.`
        : todayPlan.move;

  const containerCls = fullScreen
    ? `fixed inset-0 z-[55] overflow-y-auto p-4 sm:p-6 ${
        darkMode ? 'bg-[#0f1c16] text-[#e2f2e8]' : 'bg-gradient-to-b from-[#eff9f2] to-[#fbfdf9] text-[#1b4332]'
      }`
    : `space-y-3 ${darkMode ? 'bg-[#102018] text-[#e2f2e8] p-3 rounded-2xl' : ''}`;

  return (
    <div className={containerCls}>
      <div className={fullScreen ? 'max-w-4xl mx-auto space-y-4' : 'space-y-3'}>
        {/* Header & Controls */}
        <div className="p-3 rounded-xl bg-[#e9f5ec] border border-[#52b788] flex flex-wrap items-center justify-between gap-2 text-[#1b4332]">
          <div>
            <div className="font-atlas font-bold text-sm">
              🌿 School of Health · Confidential Vault
            </div>
            <div className="text-[11px] text-[#2d6a4f]">
              {isChancellor
                ? 'Chancellor-Only: Health & Fitness + Amarette Medical · Parents: Family Health Cards'
                : 'Parent View (Ray): Family Health & Insurance Cards'}
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              onClick={() => {
                const next = !darkMode;
                setDarkMode(next);
                try {
                  localStorage.setItem('cs_health_dark', next ? '1' : '0');
                } catch {
                  // ignore
                }
              }}
              className="px-2.5 py-1.5 rounded-lg bg-white border border-[#95d5b2] text-xs font-bold cursor-pointer"
              title="Toggle light or dark palette"
            >
              {darkMode ? '☀️' : '🌙'}
            </button>
            <button
              onClick={() => setFullScreen((v) => !v)}
              className="px-2.5 py-1.5 rounded-lg bg-white border border-[#95d5b2] text-xs font-bold cursor-pointer"
            >
              {fullScreen ? '✕ Compact' : '⤢ Full Screen'}
            </button>
            {isChancellor && (
              <label className="px-2.5 py-1.5 rounded-lg bg-[#2d6a4f] hover:bg-[#1b4332] text-white text-xs font-semibold cursor-pointer">
                {importing ? 'Importing…' : '📥 Import JSON'}
                <input
                  type="file"
                  accept=".json,application/json"
                  onChange={(e) => void handleBundleImport(e)}
                  className="hidden"
                  disabled={importing}
                />
              </label>
            )}
          </div>
        </div>

        {importMsg && (
          <div className="px-3 py-2 rounded-lg bg-emerald-100 border border-emerald-400 text-xs text-emerald-900 font-semibold">
            ✅ {importMsg}
          </div>
        )}
        {stashNotice && (
          <div className="px-3 py-2 rounded-lg bg-emerald-100 border border-emerald-400 text-xs text-emerald-900 font-semibold">
            ✅ {stashNotice}
          </div>
        )}
        {errMsg && (
          <div className="px-3 py-2 rounded-lg bg-red-100 border border-red-400 text-xs text-red-900 font-semibold flex items-start justify-between gap-2 select-text">
            <span className="break-words select-all">⚠️ {errMsg}</span>
            <button
              type="button"
              onClick={() => void navigator.clipboard?.writeText(errMsg)}
              className="px-2 py-0.5 rounded bg-white border border-red-300 text-[10px] font-bold shrink-0 cursor-pointer"
            >
              Copy
            </button>
          </div>
        )}

        {/* Primary Section Tabs */}
        <div className="flex flex-wrap gap-2">
          {isChancellor && (
            <>
              <button
                onClick={() => setTab('fitness')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer border ${
                  tab === 'fitness'
                    ? 'bg-[#2d6a4f] text-white border-[#1b4332]'
                    : 'bg-white text-[#1b4332] border-[#95d5b2]'
                }`}
              >
                💪 Health &amp; Fitness ({days.length}d)
              </button>
              <button
                onClick={() => setTab('medical')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer border ${
                  tab === 'medical'
                    ? 'bg-[#2d6a4f] text-white border-[#1b4332]'
                    : 'bg-white text-[#1b4332] border-[#95d5b2]'
                }`}
              >
                🩺 Amarette Medical ({amaretteMed.length})
              </button>
            </>
          )}
          <button
            onClick={() => setTab('cards')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer border ${
              tab === 'cards'
                ? 'bg-[#2d6a4f] text-white border-[#1b4332]'
                : 'bg-white text-[#1b4332] border-[#95d5b2]'
            }`}
          >
            🪪 Family Health Cards
          </button>
        </div>

        {/* TAB 1: HEALTH & FITNESS (CHANCELLOR ONLY) */}
        {tab === 'fitness' && isChancellor && (
          <div className="space-y-3 text-[#1b4332]">
            <div className="flex flex-wrap gap-1.5">
              {(
                [
                  ['dash', '📊 Dashboard & Today’s Move'],
                  ['nutritionist', '🥣 Nutrition & Zero-Energy Food'],
                  ['trainer', '🏋️ Personal Trainer'],
                  ['meno', '🌸 Menopause Impact'],
                ] as Array<[FitnessSubTab, string]>
              ).map(([k, label]) => (
                <button
                  key={k}
                  onClick={() => setFitSubTab(k)}
                  className={`px-2.5 py-1 rounded-full text-[11px] font-bold cursor-pointer border ${
                    fitSubTab === k
                      ? 'bg-[#1b4332] text-[#d8f3dc] border-[#1b4332]'
                      : 'bg-[#f4fbf6] text-[#2d6a4f] border-[#b7d8c2]'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            {fitSubTab === 'dash' && (
              <div className="space-y-3">
                {/* RING-MATCHED "JUST START" HERO CARD */}
                <div className="p-4 rounded-2xl bg-gradient-to-r from-[#eefbf3] to-[#f0f9ff] border-2 border-[#74c69d] space-y-2.5">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <div className="font-atlas font-bold text-sm text-[#1b4332]">
                        🌱 Today’s Ring-Matched Move · {todayPlan.label}
                      </div>
                      <div className="text-[11px] text-[#355e47]">
                        How does your body feel right now?
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {(
                        [
                          ['good', '💪 Feeling Good'],
                          ['low', '🪫 Low Energy'],
                          ['hip', '🦵 Hip Sore'],
                        ] as Array<[MoodCheck, string]>
                      ).map(([m, label]) => (
                        <button
                          key={m}
                          onClick={() => setMood(m)}
                          className={`px-2.5 py-1 rounded-full text-[11px] font-bold cursor-pointer border ${
                            mood === m
                              ? 'bg-[#2d6a4f] text-white border-[#1b4332]'
                              : 'bg-white text-[#1b4332] border-[#95d5b2]'
                          }`}
                        >
                          {label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-white/95 border border-[#b7e4c7] space-y-1.5 text-xs">
                    <div>
                      <strong>Recommended today:</strong> {tailoredMoveText}
                    </div>
                    <div className="text-[#15803d]">
                      <strong>⏱️ Zero-guilt 5-minute “Just Start”:</strong> {todayPlan.justStart}
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                    <button
                      onClick={() => void saveShowedUpDate(todayKey, showedUpDates, userEmail)}
                      className={`px-3 py-1.5 rounded-xl font-bold cursor-pointer border ${
                        showedUpToday
                          ? 'bg-[#16a34a] text-white border-[#15803d]'
                          : 'bg-white text-[#1b4332] border-[#74c69d] hover:bg-[#d8f3dc]'
                      }`}
                    >
                      {showedUpToday ? '✔ I showed up today! 🌟' : '🌱 Tap when you do any 5+ min move'}
                    </button>
                    <span className="text-[11px] text-[#355e47]">
                      Gentle check-ins logged: <strong>{showedUpDates.length}</strong> (zero streaks, zero guilt!)
                    </span>
                  </div>
                </div>

                {/* ZERO-ENERGY QUICK FOOD STRIP */}
                <div className="p-3.5 rounded-2xl bg-[#fff7ed] border border-[#fdba74] space-y-2 text-xs">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="font-bold text-[#7c2d12]">
                      🥣 Low-Energy Safe Eating Shortcuts (Zero Dairy · Zero Added Sugar · Corn-Only)
                    </div>
                    <button
                      onClick={() => void handleRestockZeroEnergy()}
                      className="px-2.5 py-1 rounded-lg bg-[#2d6a4f] text-white text-[11px] font-bold cursor-pointer"
                    >
                      🛒 Restock Safe Stash → Walmart
                    </button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-[11px] text-[#7c2d12]">
                    <div className="p-2 rounded-lg bg-white/90 border border-[#fed7aa]">
                      <strong>Want Wow Bao?</strong> → Heated coconut-aminos <em>Egg Roll in a Bowl</em>{' '}
                      (coleslaw mix + pre-cooked meat) or frozen shrimp (~30g protein).
                    </div>
                    <div className="p-2 rounded-lg bg-white/90 border border-[#fed7aa]">
                      <strong>Want Chips / Caramel Corn?</strong> → Salted olive-oil popcorn (corn!) +
                      sugar-free meat stick + sliced avocado (~12g+ protein).
                    </div>
                  </div>
                </div>

                {!days.length ? (
                  <div className="p-4 rounded-xl bg-white/90 border border-[#b7d8c2] text-xs text-[#2d6a4f]">
                    🌙 No Oura Ring metrics loaded yet. Use <strong>📥 Import JSON</strong> above with
                    your <code>cairnspire_v3a_import.json</code> file.
                  </div>
                ) : (
                  <>
                    <div className="p-3 rounded-xl bg-white/95 border border-[#b7d8c2] space-y-2.5">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-[#1b4332]">
                          ☀️ Latest Oura Sync ({latestDay.date})
                        </span>
                        {latestDay.workouts && (
                          <span className="text-[11px] px-2 py-0.5 rounded-full bg-[#d8f3dc] text-[#1b4332]">
                            🏃 {latestDay.workouts}
                          </span>
                        )}
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        <ScoreRing
                          label="Sleep"
                          val={latestDay.sleep}
                          sub={latestDay.sleepH != null ? `${hfFmt(latestDay.sleepH, 1)} h asleep` : ''}
                        />
                        <ScoreRing
                          label="Readiness"
                          val={latestDay.ready}
                          sub={latestDay.rhr != null ? `Resting HR ${hfFmt(latestDay.rhr)} bpm` : ''}
                        />
                        <ScoreRing
                          label="Activity"
                          val={latestDay.act}
                          sub={
                            latestDay.steps != null
                              ? `${Math.round(latestDay.steps).toLocaleString()} steps`
                              : ''
                          }
                        />
                      </div>
                      <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 text-[11px]">
                        <div className="p-2 rounded-lg bg-[#f4fbf6] border border-[#dcefe2]">
                          <div className="text-[#52796f]">Deep / REM</div>
                          <div className="font-bold text-[#1b4332]">
                            {hfFmt(latestDay.deepH, 1)} / {hfFmt(latestDay.remH, 1)}h
                          </div>
                        </div>
                        <div className="p-2 rounded-lg bg-[#f4fbf6] border border-[#dcefe2]">
                          <div className="text-[#52796f]">Efficiency</div>
                          <div className="font-bold text-[#1b4332]">{hfFmt(latestDay.eff)}%</div>
                        </div>
                        <div className="p-2 rounded-lg bg-[#f4fbf6] border border-[#dcefe2]">
                          <div className="text-[#52796f]">HRV</div>
                          <div className="font-bold text-[#1b4332]">{hfFmt(latestDay.hrv)} ms</div>
                        </div>
                        <div className="p-2 rounded-lg bg-[#f4fbf6] border border-[#dcefe2]">
                          <div className="text-[#52796f]">Temp</div>
                          <div className="font-bold text-[#1b4332]">
                            {latestDay.temp == null
                              ? '—'
                              : `${latestDay.temp > 0 ? '+' : ''}${hfFmt(latestDay.temp, 2)}°`}
                          </div>
                        </div>
                        <div className="p-2 rounded-lg bg-[#f4fbf6] border border-[#dcefe2]">
                          <div className="text-[#52796f]">SpO2</div>
                          <div className="font-bold text-[#1b4332]">{hfFmt(latestDay.spo2, 1)}%</div>
                        </div>
                        <div className="p-2 rounded-lg bg-[#f4fbf6] border border-[#dcefe2]">
                          <div className="text-[#52796f]">Active Cal</div>
                          <div className="font-bold text-[#1b4332]">{hfFmt(latestDay.cal)}</div>
                        </div>
                      </div>
                    </div>

                    {/* Trends */}
                    <div className="p-3 rounded-xl bg-[#f4fbf6] border border-[#b7d8c2] space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-[#1b4332]">📈 Trends</span>
                        <div className="flex gap-1">
                          {([7, 30] as const).map((n) => (
                            <button
                              key={n}
                              onClick={() => setTrendSpan(n)}
                              className={`px-2 py-0.5 rounded text-[11px] font-bold cursor-pointer ${
                                trendSpan === n
                                  ? 'bg-[#2d6a4f] text-white'
                                  : 'bg-white text-[#2d6a4f] border border-[#b7d8c2]'
                              }`}
                            >
                              {n}d
                            </button>
                          ))}
                        </div>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <MiniChart
                          title="😴 Sleep Hours"
                          days={spanDays}
                          series={[{ k: 'sleepH', label: 'Sleep h', color: '#3b82f6', type: 'bar' }]}
                        />
                        <MiniChart
                          title="🔋 Readiness"
                          days={spanDays}
                          series={[{ k: 'ready', label: 'Readiness', color: '#16a34a', type: 'line' }]}
                        />
                        <MiniChart
                          title="👟 Steps"
                          days={spanDays}
                          series={[{ k: 'steps', label: 'Steps', color: '#8b5cf6', type: 'bar' }]}
                        />
                        <MiniChart
                          title="💓 Resting HR & HRV"
                          days={spanDays}
                          series={[
                            { k: 'rhr', label: 'Resting HR', color: '#ef4444', type: 'line' },
                            { k: 'hrv', label: 'HRV', color: '#0ea5e9', type: 'line' },
                          ]}
                        />
                      </div>
                    </div>

                    {/* Weekly Averages Table */}
                    {weekAverages.length > 0 && (
                      <div className="p-3 rounded-xl bg-white/95 border border-[#c084fc] space-y-2">
                        <div className="font-bold text-xs text-[#581c87]">🗓️ Weekly Averages (Last 5 Weeks)</div>
                        <div className="overflow-x-auto">
                          <table className="w-full text-left border-collapse text-[11px]">
                            <thead>
                              <tr className="bg-[#faf5ff] text-[#581c87]">
                                <th className="p-1.5 border border-[#e9d5ff]">Week of</th>
                                <th className="p-1.5 border border-[#e9d5ff]">Sleep h</th>
                                <th className="p-1.5 border border-[#e9d5ff]">Readiness</th>
                                <th className="p-1.5 border border-[#e9d5ff]">Steps</th>
                                <th className="p-1.5 border border-[#e9d5ff]">Resting HR</th>
                                <th className="p-1.5 border border-[#e9d5ff]">HRV</th>
                              </tr>
                            </thead>
                            <tbody>
                              {weekAverages.map((w) => {
                                const st = hfAvg(w.arr, 'steps');
                                return (
                                  <tr key={w.wk} className="odd:bg-white even:bg-[#fdfaff]">
                                    <td className="p-1.5 border border-[#f3e8ff] font-semibold">
                                      {w.wk.slice(5)}
                                    </td>
                                    <td className="p-1.5 border border-[#f3e8ff]">
                                      {hfFmt(hfAvg(w.arr, 'sleepH'), 1)}
                                    </td>
                                    <td className="p-1.5 border border-[#f3e8ff]">
                                      {hfFmt(hfAvg(w.arr, 'ready'))}
                                    </td>
                                    <td className="p-1.5 border border-[#f3e8ff]">
                                      {st == null ? '—' : Math.round(st).toLocaleString()}
                                    </td>
                                    <td className="p-1.5 border border-[#f3e8ff]">
                                      {hfFmt(hfAvg(w.arr, 'rhr'))}
                                    </td>
                                    <td className="p-1.5 border border-[#f3e8ff]">
                                      {hfFmt(hfAvg(w.arr, 'hrv'))}
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}

                    {/* Wellness Goals Card (Original Parity) */}
                    <div className="p-3 rounded-xl bg-[#fff7ed] border border-[#fdba74] space-y-2 text-xs">
                      <div className="font-bold text-[#7c2d12]">🎯 My Wellness Goals</div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                        <div className="p-2 rounded-lg bg-white/90">
                          <strong>⚡ Energy:</strong> Steady energy most afternoons; watch Oura readiness &amp;
                          sleep continuity.
                        </div>
                        <div className="p-2 rounded-lg bg-white/90">
                          <strong>🍳 Protein:</strong> ~30 g each meal, 100–120 g/day (zero-energy shakes &amp;
                          ready protein count!).
                        </div>
                        <div className="p-2 rounded-lg bg-white/90">
                          <strong>🦵 Hip-friendly movement:</strong> Strength 2–3x/wk + Zone 2 walks; swap anything
                          the hip dislikes.
                        </div>
                        <div className="p-2 rounded-lg bg-white/90">
                          <strong>🌸 Pelvic floor:</strong> 5–8 gentle minutes daily, relaxation first. ~0.5–1 lb/wk
                          kind pace.
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}

            {fitSubTab === 'trainer' && (
              <div className="space-y-2">
                {contentDoc?.content?.sections?.find((s) => s.id === 'trainer') ? (
                  <ContentSectionView
                    section={contentDoc.content.sections.find((s) => s.id === 'trainer')!}
                  />
                ) : (
                  <div className="p-4 rounded-xl bg-white/85 border border-[#b7d8c2] text-xs text-[#2d6a4f]">
                    Import your <code>cairnspire_v3a_import.json</code> bundle to view your Personal Trainer
                    guidance.
                  </div>
                )}
              </div>
            )}

            {fitSubTab === 'nutritionist' && (
              <div className="space-y-3">
                <div className="p-3.5 rounded-xl bg-[#fff7ed] border border-[#fdba74] space-y-2 text-xs">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <strong className="text-[#7c2d12]">🥣 Zero-Energy Grab &amp; Heat Menu</strong>
                    <button
                      onClick={() => void handleRestockZeroEnergy()}
                      className="px-2.5 py-1 rounded-lg bg-[#2d6a4f] text-white text-[11px] font-bold cursor-pointer"
                    >
                      🛒 Add All Missing to Walmart List
                    </button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-[11px]">
                    {ZERO_ENERGY_STASH.map((z) => (
                      <div key={z.item} className="p-2 rounded bg-white/90 border border-[#fed7aa]">
                        <strong>{z.item}</strong> · {z.protein}
                      </div>
                    ))}
                  </div>
                </div>

                {contentDoc?.content?.sections?.find((s) => s.id === 'nutritionist') ? (
                  <ContentSectionView
                    section={contentDoc.content.sections.find((s) => s.id === 'nutritionist')!}
                  />
                ) : (
                  <div className="p-4 rounded-xl bg-white/85 border border-[#b7d8c2] text-xs text-[#2d6a4f]">
                    Import your <code>cairnspire_v3a_import.json</code> bundle to view your Nutritionist
                    plan.
                  </div>
                )}
              </div>
            )}

            {fitSubTab === 'meno' && (
              <div className="space-y-2">
                {contentDoc?.meno ? (
                  <div className="space-y-3">
                    <div className="p-3 rounded-xl bg-[#f3e8ff] border border-[#c084fc] space-y-2">
                      <div className="font-bold text-xs text-[#581c87]">🌸 {contentDoc.meno.title}</div>
                      <div className="inline-block px-2 py-0.5 rounded-full bg-white text-[11px] font-bold text-[#6b21a8]">
                        Overall: {contentDoc.meno.overall}
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {contentDoc.meno.categories.map(([cat, lvl]) => (
                          <span
                            key={cat}
                            className="px-2 py-1 rounded-lg bg-white/90 border border-[#d8b4fe] text-[11px]"
                          >
                            <strong>{cat}:</strong> {lvl}
                          </span>
                        ))}
                      </div>
                    </div>

                    {contentDoc.meno.levels?.length > 0 && (
                      <div className="p-3 rounded-xl bg-white/95 border border-[#fbcfe8] space-y-1.5">
                        <div className="font-bold text-xs text-[#831843]">What It Showed</div>
                        <table className="w-full text-left border-collapse text-[11px]">
                          <tbody>
                            {contentDoc.meno.levels.map(([lvl, desc]) => (
                              <tr key={lvl} className="border-b border-[#fce7f3]">
                                <td className="py-1.5 pr-2 font-bold text-[#9d174d] whitespace-nowrap align-top">
                                  {lvl}
                                </td>
                                <td className="py-1.5 text-[#374151]">{desc}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}

                    <div className="p-3 rounded-xl bg-white/95 border border-[#d8b4fe] space-y-1.5">
                      <div className="font-bold text-xs text-[#581c87]">💍 Oura 30-Day Snapshot</div>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
                        {contentDoc.meno.oura30.map(([k, v]) => (
                          <div key={k} className="p-2 rounded bg-[#faf5ff] border border-[#e9d5ff]">
                            <div className="text-[#6b21a8]">{k}</div>
                            <div className="font-bold">{v}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="p-3 rounded-xl bg-white/95 border border-[#b7d8c2] space-y-1.5">
                      <div className="font-bold text-xs text-[#1b4332]">🧭 Focus Plan</div>
                      <ul className="list-disc pl-4 text-xs text-[#26382c] space-y-1">
                        {contentDoc.meno.plan.map((p) => (
                          <li key={p}>{p}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 rounded-xl bg-white/85 border border-[#b7d8c2] text-xs text-[#2d6a4f]">
                    Import your <code>cairnspire_v3a_import.json</code> bundle to view Menopause Impact notes.
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: AMARETTE MEDICAL (CHANCELLOR ONLY) */}
        {tab === 'medical' && isChancellor && (
          <div className="space-y-3 text-[#1b4332]">
            {MED_TYPES.map((type) => {
              const list = amaretteMed.filter((m) => m.type === type);
              const icon =
                type === 'Provider' ? '👩‍⚕️' : type === 'Condition' ? '📋' : type === 'Medication' ? '💊' : '📝';
              return (
                <div key={type} className="p-3 rounded-xl bg-white/95 border border-[#b7d8c2] space-y-2">
                  <div className="font-bold text-xs text-[#1b4332]">
                    {icon} {type}s ({list.length})
                  </div>
                  {!list.length ? (
                    <div className="text-[11px] text-[#52796f]">No {type.toLowerCase()}s added yet.</div>
                  ) : (
                    <div className="space-y-1.5">
                      {list.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-start justify-between gap-2 p-2 rounded-lg bg-[#f4fbf6] border border-[#dcefe2]"
                        >
                          <div className="min-w-0 text-xs">
                            <div className="font-bold text-[#1b4332]">{item.name}</div>
                            {(item.detail || item.location || item.phone) && (
                              <div className="text-[11px] text-[#355e47]">
                                {[item.detail, item.location, item.phone].filter(Boolean).join(' · ')}
                              </div>
                            )}
                            {item.notes && <div className="text-[11px] text-[#475569] mt-0.5">{item.notes}</div>}
                          </div>
                          <div className="flex gap-1 shrink-0">
                            <button
                              onClick={() => startEditMed(item)}
                              className="px-2 py-1 rounded bg-white border border-[#b7d8c2] text-[11px] cursor-pointer"
                            >
                              ✏️
                            </button>
                            <button
                              onClick={() => void handleDeleteMed(item.id)}
                              className="px-2 py-1 rounded bg-white border border-red-200 text-[11px] cursor-pointer"
                            >
                              🗑️
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}

            <div className="p-3 rounded-xl bg-[#f4fbf6] border border-[#74c69d] space-y-2">
              <div className="font-bold text-xs text-[#1b4332]">
                {editingMed ? '✏️ Edit Medical Entry' : '➕ Add Medical Entry'}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <select
                  value={medType}
                  onChange={(e) => setMedType(e.target.value as AmaretteMedicalType)}
                  className="px-2.5 py-1.5 rounded-lg bg-white border border-[#95d5b2] text-xs"
                >
                  {MED_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
                <input
                  type="text"
                  value={medName}
                  onChange={(e) => setMedName(e.target.value)}
                  placeholder="Name / Title"
                  className="px-2.5 py-1.5 rounded-lg bg-white border border-[#95d5b2] text-xs"
                />
                <input
                  type="text"
                  value={medDetail}
                  onChange={(e) => setMedDetail(e.target.value)}
                  placeholder={medType === 'Medication' ? 'Dose / schedule' : 'Specialty / detail'}
                  className="px-2.5 py-1.5 rounded-lg bg-white border border-[#95d5b2] text-xs"
                />
                <input
                  type="text"
                  value={medLocation}
                  onChange={(e) => setMedLocation(e.target.value)}
                  placeholder="Location / clinic"
                  className="px-2.5 py-1.5 rounded-lg bg-white border border-[#95d5b2] text-xs"
                />
                <input
                  type="text"
                  value={medPhone}
                  onChange={(e) => setMedPhone(e.target.value)}
                  placeholder="Phone"
                  className="px-2.5 py-1.5 rounded-lg bg-white border border-[#95d5b2] text-xs"
                />
                <input
                  type="text"
                  value={medNotes}
                  onChange={(e) => setMedNotes(e.target.value)}
                  placeholder="Notes"
                  className="px-2.5 py-1.5 rounded-lg bg-white border border-[#95d5b2] text-xs"
                />
              </div>
              <div className="flex gap-2">
                <button
                  disabled={savingMed || !medName.trim()}
                  onClick={() => void handleSaveMed()}
                  className="px-3 py-1.5 rounded-lg bg-[#2d6a4f] text-white text-xs font-bold cursor-pointer disabled:opacity-50"
                >
                  {savingMed ? 'Saving…' : 'Save Entry'}
                </button>
                {editingMed && (
                  <button
                    onClick={clearMedForm}
                    className="px-3 py-1.5 rounded-lg bg-white border border-[#95d5b2] text-xs cursor-pointer"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: FAMILY HEALTH CARDS (CHANCELLOR + RAY) */}
        {tab === 'cards' && canSeeFamilyCards && (
          <div className="space-y-3 text-[#1b4332]">
            <div className="flex flex-wrap gap-1.5">
              {FAMILY_PEOPLE.map((p) => (
                <button
                  key={p.name}
                  onClick={() => setSelectedPerson(p.name)}
                  className={`px-2.5 py-1 rounded-full text-xs font-bold cursor-pointer border transition ${
                    selectedPerson === p.name ? 'ring-2 ring-[#1b4332]' : 'opacity-80 hover:opacity-100'
                  }`}
                  style={{ backgroundColor: p.color, color: p.ink, borderColor: '#6b7280' }}
                >
                  {p.emoji} {p.name}
                </button>
              ))}
            </div>

            <div className="p-3 rounded-xl bg-white/95 border border-[#b7d8c2] space-y-3">
              <div className="flex items-center justify-between gap-2">
                <div>
                  <h4 className="font-bold text-sm text-[#1b4332]">{selectedPerson}’s Health Card</h4>
                  {activeEntry?.updated && (
                    <div className="text-[10px] text-[#52796f]">Updated: {activeEntry.updated}</div>
                  )}
                </div>
                <button
                  onClick={() => setEditingCard((v) => !v)}
                  className="px-2.5 py-1 rounded-lg bg-[#edf6f0] hover:bg-[#d8f3dc] text-[#1b4332] text-xs font-bold cursor-pointer"
                >
                  {editingCard ? 'Close Editor' : '✏️ Edit Card'}
                </button>
              </div>

              {!editingCard ? (
                <div className="space-y-2.5 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div className="p-2.5 rounded-lg bg-[#f4fbf6] border border-[#dcefe2] space-y-1">
                      <div className="font-bold text-[#1b4332]">🪪 Insurance</div>
                      <div>
                        <strong>Carrier:</strong> {activeCard.carrier || '—'}
                      </div>
                      <div>
                        <strong>Member ID:</strong> {activeCard.memberId || '—'}
                      </div>
                      <div>
                        <strong>Group #:</strong> {activeCard.group || '—'}
                      </div>
                      <div>
                        <strong>Plan:</strong> {activeCard.plan || '—'}
                      </div>
                      {(activeCard.rxBin || activeCard.rxPcn) && (
                        <div>
                          <strong>Rx BIN / PCN:</strong> {activeCard.rxBin || '—'} / {activeCard.rxPcn || '—'}
                        </div>
                      )}
                      {activeCard.memberPhone && (
                        <div>
                          <strong>Member Services:</strong>{' '}
                          <a href={`tel:${activeCard.memberPhone}`} className="underline text-[#1d4ed8]">
                            {activeCard.memberPhone}
                          </a>
                        </div>
                      )}
                    </div>

                    <div className="p-2.5 rounded-lg bg-[#f4fbf6] border border-[#dcefe2] space-y-1">
                      <div className="font-bold text-[#1b4332]">👩‍⚕️ Doctors &amp; Health</div>
                      <div>
                        <strong>Primary Doctor:</strong> {activeCard.doctor || '—'}{' '}
                        {activeCard.doctorPhone && (
                          <a href={`tel:${activeCard.doctorPhone}`} className="underline text-[#1d4ed8]">
                            ({activeCard.doctorPhone})
                          </a>
                        )}
                      </div>
                      <div>
                        <strong>Dentist:</strong> {activeCard.dentist || '—'}{' '}
                        {activeCard.dentistPhone && (
                          <a href={`tel:${activeCard.dentistPhone}`} className="underline text-[#1d4ed8]">
                            ({activeCard.dentistPhone})
                          </a>
                        )}
                      </div>
                      <div>
                        <strong>Allergies:</strong> {activeCard.allergies || 'None listed'}
                      </div>
                      <div>
                        <strong>Medications:</strong> {activeCard.meds || 'None listed'}
                      </div>
                      {activeCard.notes && (
                        <div>
                          <strong>Notes:</strong> {activeCard.notes}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Card Images */}
                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    <span className="text-[11px] font-bold text-[#355e47]">Card Photos:</span>
                    {(['front', 'back', 'combined'] as CardSide[]).map((side) => {
                      const hasSide =
                        side === 'front'
                          ? activeEntry?.hasFront
                          : side === 'back'
                            ? activeEntry?.hasBack
                            : activeEntry?.hasCombined;
                      return (
                        <div key={side} className="inline-flex items-center gap-1">
                          {hasSide && (
                            <button
                              onClick={() => void handleViewCardImage(side)}
                              className="px-2 py-1 rounded bg-[#d8f3dc] text-[#1b4332] text-[11px] font-semibold cursor-pointer"
                            >
                              👁 View {side}
                            </button>
                          )}
                          <label className="px-2 py-1 rounded bg-[#edf6f0] hover:bg-[#d8f3dc] text-[11px] cursor-pointer border border-[#b7d8c2]">
                            📷 Upload {side}
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => void handleCardImageUpload(side, e)}
                              className="hidden"
                            />
                          </label>
                        </div>
                      );
                    })}
                  </div>

                  {cardImgPreview && (
                    <div className="p-2 rounded-lg bg-slate-900 text-white space-y-1">
                      <div className="flex items-center justify-between text-[11px]">
                        <span>
                          {selectedPerson} · Card {cardImgPreview.side}
                        </span>
                        <button
                          onClick={() => setCardImgPreview(null)}
                          className="underline cursor-pointer"
                        >
                          Close
                        </button>
                      </div>
                      <img
                        src={cardImgPreview.url}
                        alt={`${selectedPerson} card ${cardImgPreview.side}`}
                        className="max-h-72 rounded mx-auto object-contain"
                      />
                    </div>
                  )}

                  <details className="text-[11px] text-[#355e47]">
                    <summary className="cursor-pointer font-semibold">More card details</summary>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pt-2">
                      <div>
                        <strong>Name on card:</strong> {activeCard.nameOnCard || '—'}
                      </div>
                      <div>
                        <strong>Plan code:</strong> {activeCard.planCode || '—'}
                      </div>
                      <div>
                        <strong>Deductible:</strong> {activeCard.deductible || '—'}
                      </div>
                      <div>
                        <strong>OOP Max:</strong> {activeCard.oopMax || '—'}
                      </div>
                      <div>
                        <strong>Website:</strong> {activeCard.website || '—'}
                      </div>
                      <div>
                        <strong>Issued:</strong> {activeCard.issued || '—'}
                      </div>
                      <div className="sm:col-span-2">
                        <strong>Other phones:</strong> {activeCard.phones || '—'}
                      </div>
                      <div className="sm:col-span-2">
                        <strong>Claims address:</strong> {activeCard.claims || '—'}
                      </div>
                    </div>
                  </details>
                </div>
              ) : (
                <div className="space-y-2 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {(
                      [
                        ['carrier', 'Carrier'],
                        ['memberId', 'Member ID'],
                        ['group', 'Group #'],
                        ['plan', 'Plan'],
                        ['rxBin', 'Rx BIN'],
                        ['rxPcn', 'Rx PCN'],
                        ['memberPhone', 'Member Services Phone'],
                        ['doctor', 'Primary Doctor'],
                        ['doctorPhone', 'Doctor Phone'],
                        ['dentist', 'Dentist'],
                        ['dentistPhone', 'Dentist Phone'],
                        ['allergies', 'Allergies'],
                        ['meds', 'Medications'],
                        ['nameOnCard', 'Name on Card'],
                        ['planCode', 'Plan Code'],
                        ['deductible', 'Deductible'],
                        ['oopMax', 'Out-of-Pocket Max'],
                        ['website', 'Website'],
                        ['issued', 'Card Issued'],
                      ] as Array<[keyof FamilyMedicalCardFields, string]>
                    ).map(([field, label]) => (
                      <label key={field} className="block">
                        <span className="text-[10px] font-bold text-[#355e47]">{label}</span>
                        <input
                          type="text"
                          value={cardDraft[field]}
                          onChange={(e) => setCardDraft((c) => ({ ...c, [field]: e.target.value }))}
                          className="mt-0.5 w-full px-2 py-1 rounded border border-[#95d5b2] bg-white text-xs"
                        />
                      </label>
                    ))}
                  </div>
                  <label className="block">
                    <span className="text-[10px] font-bold text-[#355e47]">Notes</span>
                    <textarea
                      rows={2}
                      value={cardDraft.notes}
                      onChange={(e) => setCardDraft((c) => ({ ...c, notes: e.target.value }))}
                      className="mt-0.5 w-full px-2 py-1 rounded border border-[#95d5b2] bg-white text-xs"
                    />
                  </label>
                  <div className="flex gap-2">
                    <button
                      disabled={savingCard}
                      onClick={() => void handleSaveFamilyCard()}
                      className="px-3 py-1.5 rounded-lg bg-[#2d6a4f] text-white font-bold text-xs cursor-pointer disabled:opacity-50"
                    >
                      {savingCard ? 'Saving…' : 'Save Card'}
                    </button>
                    <button
                      onClick={() => setEditingCard(false)}
                      className="px-3 py-1.5 rounded-lg bg-white border border-[#95d5b2] text-xs cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        <OfflineRosterPanel
          deptId="health"
          heading="🩺 School of Health · 10 Specialist Advisors (Offline · Research & Prep Only)"
        />
      </div>
    </div>
  );
}
