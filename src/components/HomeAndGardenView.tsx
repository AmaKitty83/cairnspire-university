import { useEffect, useMemo, useState, type ChangeEvent } from 'react';
import { ASSETS } from '../data/assetMeta';
import { signOutUser, type CampusRole } from '../firebase';
import {
  FAMILY_PEOPLE,
  importFamilyHubBundle,
  saveAnnouncementsData,
  saveCalendarData,
  saveChatRooms,
  saveChoresList,
  saveGiftSections,
  saveGoalsList,
  saveGroceryList,
  saveKidPins,
  saveMealsData,
  savePantryData,
  saveParentGiftBought,
  saveRecipesList,
  sendFamilyChatMessage,
  subscribeAnnouncements,
  subscribeCalendar,
  subscribeChatMessages,
  subscribeChatRooms,
  subscribeChores,
  subscribeGifts,
  subscribeGoals,
  subscribeGrocery,
  subscribeKidPins,
  subscribeLinks,
  subscribeMeals,
  subscribePantry,
  subscribeParentGiftBought,
  subscribeRecipes,
  todayDayKey,
  type AnchorMealRow,
  type CalendarEventItem,
  type ChatMessage,
  type ChatRoom,
  type ChoreItem,
  type DayKey,
  type DietaryProfile,
  type FamilyCalendarDoc,
  type FamilyHubBundle,
  type FamilyMode,
  type GiftItem,
  type GiftSection,
  type GoalItem,
  type GroceryItem,
  type HouseholdAnnouncementsDoc,
  type LinkGroup,
  type MealPickRow,
  type MealWeekRow,
  type PantryItem,
  type RecipeItem,
} from '../services/familyHubService';
import { FamilyChatTab } from './family/FamilyChatTab';
import { FamilyChoresTab } from './family/FamilyChoresTab';
import {
  FamilyGiftsTab,
  FamilyGoalsTab,
  FamilyInfoTab,
  FamilyLinksTab,
} from './family/FamilyExtrasTab';
import { FamilyGroceryTab } from './family/FamilyGroceryTab';
import { FamilyHomeTab } from './family/FamilyHomeTab';
import { FamilyMealsTab } from './family/FamilyMealsTab';
import { PersonIcon, speakText } from './family/PersonBadge';

interface HomeAndGardenViewProps {
  canExitToCampus: boolean;
  onExitToCampus?: () => void;
  userEmail?: string | null;
  role: CampusRole;
}

type NavPageId =
  | 'home'
  | 'chores'
  | 'meals'
  | 'grocery'
  | 'goals'
  | 'gifts'
  | 'chat'
  | 'links'
  | 'info'
  | 'school'
  | 'quests';

const NAV_PAGES: Record<FamilyMode, Array<{ id: NavPageId; icon: string; label: string }>> = {
  little: [
    { id: 'home', icon: '🏠', label: 'Home' },
    { id: 'chores', icon: '🧹', label: 'Jobs' },
    { id: 'school', icon: '🏫', label: 'School' },
    { id: 'gifts', icon: '🎁', label: 'Wish' },
    { id: 'links', icon: '🌟', label: 'Fun' },
    { id: 'meals', icon: '🍳', label: 'Food' },
    { id: 'chat', icon: '💬', label: 'Chat' },
  ],
  teen: [
    { id: 'home', icon: '🏠', label: 'Home' },
    { id: 'school', icon: '🏫', label: 'School' },
    { id: 'goals', icon: '🎯', label: 'Goals' },
    { id: 'chores', icon: '🧹', label: 'Chores' },
    { id: 'grocery', icon: '🛒', label: 'Grocery' },
    { id: 'meals', icon: '🍽️', label: 'Meals' },
    { id: 'gifts', icon: '🎁', label: 'Gifts' },
    { id: 'links', icon: '🔗', label: 'Links' },
    { id: 'chat', icon: '💬', label: 'Chat' },
  ],
  gabe: [
    { id: 'home', icon: '🏠', label: 'Home' },
    { id: 'goals', icon: '🎯', label: 'Goals' },
    { id: 'chores', icon: '🧹', label: 'Chores' },
    { id: 'meals', icon: '🍽️', label: 'Meals' },
    { id: 'gifts', icon: '🎁', label: 'Gifts' },
    { id: 'links', icon: '🔗', label: 'Links' },
    { id: 'grocery', icon: '🛒', label: 'Grocery' },
    { id: 'school', icon: '🏫', label: 'School' },
    { id: 'quests', icon: '📜', label: 'Quests' },
    { id: 'chat', icon: '💬', label: 'Chat' },
  ],
  parent: [
    { id: 'home', icon: '🏠', label: 'Home' },
    { id: 'chores', icon: '🧹', label: 'Chores' },
    { id: 'meals', icon: '🍽️', label: 'Meals' },
    { id: 'grocery', icon: '🛒', label: 'Grocery' },
    { id: 'goals', icon: '🎯', label: 'Goals' },
    { id: 'gifts', icon: '🎁', label: 'Gifts' },
    { id: 'chat', icon: '💬', label: 'Chat' },
    { id: 'links', icon: '🔗', label: 'Links' },
    { id: 'info', icon: '📌', label: 'Info' },
    { id: 'school', icon: '🏫', label: 'School (v3b)' },
    { id: 'quests', icon: '📜', label: 'Quests (v3b)' },
  ],
};

const KID_LOCK_PAGES = new Set<NavPageId>(['home', 'chores', 'school', 'gifts', 'links']);

export function HomeAndGardenView({
  canExitToCampus,
  onExitToCampus,
  userEmail,
  role,
}: HomeAndGardenViewProps) {
  const actorEmail = (userEmail || '').trim().toLowerCase();
  const isReadOnly = role === 'guest';
  const isParentAuth = role === 'chancellor' || role === 'university';
  const isChancellor = role === 'chancellor';

  // Person & Kid Lock states
  const [selectedName, setSelectedName] = useState<string>(() => {
    try {
      const kl = localStorage.getItem('hg_kid_lock');
      if (kl && FAMILY_PEOPLE.some((p) => p.name === kl)) return kl;
      const saved = localStorage.getItem('hg_person');
      if (saved && FAMILY_PEOPLE.some((p) => p.name === saved)) return saved;
    } catch {
      // ignore
    }
    return isReadOnly ? 'Amarette' : '';
  });
  const [kidLockName, setKidLockName] = useState<string>(() => {
    try {
      return localStorage.getItem('hg_kid_lock') || '';
    } catch {
      return '';
    }
  });
  const [viewAs, setViewAs] = useState<string>('');
  const [activeTab, setActiveTab] = useState<NavPageId>('home');
  const [speakEnabled, setSpeakEnabled] = useState(true);

  // Kid Login PIN modal state
  const [kidLoginOpen, setKidLoginOpen] = useState(false);
  const [pinTargetKid, setPinTargetKid] = useState<string | null>(null);
  const [pinUnlockMode, setPinUnlockMode] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState<string | null>(null);

  // Chancellor Admin Modal (Import JSON + Kid PIN Manager)
  const [adminOpen, setAdminOpen] = useState(false);
  const [importing, setImporting] = useState(false);
  const [importStatus, setImportStatus] = useState<string | null>(null);
  const [liamPinDraft, setLiamPinDraft] = useState('');
  const [oliverPinDraft, setOliverPinDraft] = useState('');
  const [savingPins, setSavingPins] = useState(false);

  // Live Firestore States
  const [choresWeekOf, setChoresWeekOf] = useState('');
  const [chores, setChores] = useState<ChoreItem[]>([]);
  const [grocery, setGrocery] = useState<GroceryItem[]>([]);
  const [mealsData, setMealsData] = useState<{
    weekOf: string;
    week: MealWeekRow[];
    anchors: AnchorMealRow[];
    picks: MealPickRow[];
  }>({ weekOf: '', week: [], anchors: [], picks: [] });
  const [recipes, setRecipes] = useState<RecipeItem[]>([]);
  const [pantryData, setPantryData] = useState<{
    items: PantryItem[];
    dietaryProfiles: DietaryProfile[];
  }>({ items: [], dietaryProfiles: [] });
  const [announcementsData, setAnnouncementsData] = useState<HouseholdAnnouncementsDoc>({
    announcements: [],
    info: [],
    rules: [],
    contacts: [],
  });
  const [goals, setGoals] = useState<GoalItem[]>([]);
  const [giftSections, setGiftSections] = useState<GiftSection[]>([]);
  const [parentGiftBought, setParentGiftBought] = useState<Record<string, string>>({});
  const [kidPins, setKidPins] = useState<Record<string, string>>({});
  const [linkGroups, setLinkGroups] = useState<LinkGroup[]>([]);
  const [calendarData, setCalendarData] = useState<FamilyCalendarDoc>({
    events: [],
    reminders: [],
    prestonDue: [],
    ccccCalendar: [],
  });
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [syncError, setSyncError] = useState<string | null>(null);

  useEffect(() => {
    const onErr = (err: Error) => setSyncError(err.message);
    const unsubs = [
      subscribeChores((d) => {
        setChoresWeekOf(d.weekOf);
        setChores(d.items);
      }, onErr),
      subscribeGrocery(setGrocery, onErr),
      subscribeMeals(setMealsData, onErr),
      subscribeRecipes(setRecipes, onErr),
      subscribePantry(setPantryData, onErr),
      subscribeAnnouncements(setAnnouncementsData, onErr),
      subscribeGoals(setGoals, onErr),
      subscribeGifts(setGiftSections, onErr),
      subscribeLinks(setLinkGroups, onErr),
      subscribeCalendar(setCalendarData, onErr),
      subscribeChatRooms(setChatRooms, onErr),
      subscribeChatMessages(setChatMessages, onErr),
    ];
    if (isParentAuth) {
      unsubs.push(
        subscribeParentGiftBought(setParentGiftBought, onErr),
        subscribeKidPins((p) => {
          setKidPins(p);
          setLiamPinDraft(p.Liam || '');
          setOliverPinDraft(p.Oliver || '');
        }, onErr)
      );
    }
    return () => unsubs.forEach((u) => u());
  }, [isParentAuth]);

  const effectiveName = viewAs || selectedName;
  const activePerson = useMemo(
    () => FAMILY_PEOPLE.find((p) => p.name === effectiveName) || null,
    [effectiveName]
  );

  const canEdit = !isReadOnly && !viewAs && Boolean(activePerson);

  function selectPerson(name: string) {
    if (kidLockName && name !== kidLockName) {
      setPinTargetKid(kidLockName);
      setPinUnlockMode(true);
      setPinInput('');
      setPinError(null);
      return;
    }
    setViewAs('');
    setSelectedName(name);
    setActiveTab('home');
    try {
      localStorage.setItem('hg_person', name);
    } catch {
      // ignore
    }
  }

  function startKidLogin(kidName: string) {
    const knownOk = (() => {
      try {
        return localStorage.getItem(`hg_kid_ok_${kidName}`) === '1';
      } catch {
        return false;
      }
    })();
    if (knownOk || !kidPins[kidName]) {
      try {
        localStorage.setItem('hg_kid_lock', kidName);
      } catch {
        // ignore
      }
      setKidLockName(kidName);
      setSelectedName(kidName);
      setViewAs('');
      setKidLoginOpen(false);
      setActiveTab('home');
      return;
    }
    setPinTargetKid(kidName);
    setPinUnlockMode(false);
    setPinInput('');
    setPinError(null);
  }

  function handleVerifyPin() {
    if (!pinTargetKid) return;
    const expected = kidPins[pinTargetKid] || '';
    if (expected && pinInput !== expected) {
      setPinError('Try again — grown-up PIN did not match.');
      setPinInput('');
      return;
    }
    if (pinUnlockMode) {
      try {
        localStorage.removeItem('hg_kid_lock');
      } catch {
        // ignore
      }
      setKidLockName('');
      setSelectedName('');
      setPinTargetKid(null);
      setPinUnlockMode(false);
      setPinInput('');
    } else {
      try {
        localStorage.setItem(`hg_kid_ok_${pinTargetKid}`, '1');
        localStorage.setItem('hg_kid_lock', pinTargetKid);
      } catch {
        // ignore
      }
      setKidLockName(pinTargetKid);
      setSelectedName(pinTargetKid);
      setPinTargetKid(null);
      setKidLoginOpen(false);
      setActiveTab('home');
    }
  }

  async function handleBundleUpload(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !isChancellor) return;
    setImporting(true);
    setImportStatus(null);
    setSyncError(null);
    try {
      const parsed = JSON.parse(await file.text()) as FamilyHubBundle;
      const res = await importFamilyHubBundle(parsed, actorEmail);
      setImportStatus(
        `Imported ${res.counts.chores} chores, ${res.counts.recipes} recipes, ${res.counts.pantry} pantry items, ${res.counts.grocery} groceries, ${res.counts.events} calendar events, ${res.counts.messages} chat messages, and ${res.counts.healthDays} Oura days!`
      );
    } catch (err: unknown) {
      setSyncError(err instanceof Error ? err.message : 'Bundle import failed.');
    } finally {
      setImporting(false);
      e.target.value = '';
    }
  }

  async function handleSaveKidPins() {
    if (!isParentAuth) return;
    setSavingPins(true);
    try {
      await saveKidPins(
        {
          Liam: liamPinDraft.trim(),
          Oliver: oliverPinDraft.trim(),
        },
        actorEmail
      );
      setImportStatus('Kid login PINs updated ✔');
    } finally {
      setSavingPins(false);
    }
  }

  // Visible nav items
  const navItems = useMemo(() => {
    if (!activePerson) return [];
    return NAV_PAGES[activePerson.mode].filter((item) => {
      if (viewAs && item.id === 'chat') return false;
      if (kidLockName && !KID_LOCK_PAGES.has(item.id)) return false;
      return true;
    });
  }, [activePerson, viewAs, kidLockName]);

  // PIN Prompt Modal (used both on initial kid login and unlocking kid tablet mode)
  const pinDialog = pinTargetKid && (
    <div className="fixed inset-0 z-[70] bg-black/55 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-xs w-full p-5 space-y-3 border-2 border-[#74c69d] text-center shadow-xl">
        <div className="font-bold text-base text-[#1b4332]">
          {pinUnlockMode
            ? `Switch out of ${pinTargetKid}’s session`
            : `Grown-up unlock for ${pinTargetKid}`}
        </div>
        <p className="text-xs text-[#40916c]">
          Enter {pinTargetKid}’s parent PIN {pinUnlockMode ? 'to exit tablet mode' : 'once on this device'}.
        </p>
        <input
          type="password"
          inputMode="numeric"
          value={pinInput}
          onChange={(e) => setPinInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleVerifyPin();
          }}
          placeholder="PIN"
          className="w-full px-3 py-2 rounded-xl border-2 border-[#74c69d] text-center text-lg tracking-widest"
          autoFocus
        />
        {pinError && <div className="text-xs font-semibold text-red-600">{pinError}</div>}
        <div className="flex gap-2 justify-center">
          <button
            onClick={handleVerifyPin}
            className="px-4 py-2 rounded-xl bg-[#2d6a4f] text-white text-xs font-bold cursor-pointer"
          >
            OK
          </button>
          <button
            onClick={() => {
              setPinTargetKid(null);
              setPinError(null);
            }}
            className="px-4 py-2 rounded-xl bg-[#edf6f0] text-[#1b4332] text-xs font-bold cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );

  // Chancellor Admin Drawer (Import JSON + Kid PIN Setup)
  const adminDrawer = adminOpen && isChancellor && (
    <div className="bg-[#f4fbf6] border-b-2 border-[#52b788] p-4 space-y-3 shrink-0">
      <div className="max-w-3xl mx-auto space-y-3 text-xs">
        <div className="flex items-center justify-between">
          <strong className="text-sm text-[#1b4332]">⚙️ Chancellor Setup: Data Import &amp; Kid PINs</strong>
          <button onClick={() => setAdminOpen(false)} className="underline cursor-pointer">
            Close
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="p-3 rounded-xl bg-white border border-[#95d5b2] space-y-1.5">
            <div className="font-bold text-[#1b4332]">📥 Import Family Hub Bundle (.json)</div>
            <p className="text-[11px] text-[#40916c]">
              Upload your private <code>cairnspire_v3a_import.json</code> to load live Sheet data +
              Family Calendar + Oura/Health Vault into Firestore.
            </p>
            <label className="inline-block px-3 py-1.5 rounded-lg bg-[#2d6a4f] text-white font-bold cursor-pointer">
              {importing ? 'Importing…' : 'Choose cairnspire_v3a_import.json'}
              <input
                type="file"
                accept=".json,application/json"
                onChange={(e) => void handleBundleUpload(e)}
                className="hidden"
                disabled={importing}
              />
            </label>
          </div>
          <div className="p-3 rounded-xl bg-white border border-[#95d5b2] space-y-1.5">
            <div className="font-bold text-[#1b4332]">🔐 Liam &amp; Oliver Tablet PINs</div>
            <div className="flex gap-2">
              <input
                type="password"
                inputMode="numeric"
                value={liamPinDraft}
                onChange={(e) => setLiamPinDraft(e.target.value)}
                placeholder="Liam PIN"
                className="w-1/2 px-2 py-1 rounded border border-[#95d5b2]"
              />
              <input
                type="password"
                inputMode="numeric"
                value={oliverPinDraft}
                onChange={(e) => setOliverPinDraft(e.target.value)}
                placeholder="Oliver PIN"
                className="w-1/2 px-2 py-1 rounded border border-[#95d5b2]"
              />
            </div>
            <button
              disabled={savingPins}
              onClick={() => void handleSaveKidPins()}
              className="px-3 py-1 rounded-lg bg-[#2d6a4f] text-white font-bold cursor-pointer"
            >
              {savingPins ? 'Saving…' : 'Save Kid PINs'}
            </button>
          </div>
        </div>
        {importStatus && <div className="text-emerald-800 font-semibold">✅ {importStatus}</div>}
        {syncError && <div className="text-red-800 font-semibold">⚠️ {syncError}</div>}
      </div>
    </div>
  );

  // Person Picker Screen (when nobody picked yet or clicking Switch Person)
  if (!activePerson) {
    return (
      <section className="fixed inset-0 z-50 bg-gradient-to-b from-[#e9f5ec] to-[#d4ebd9] text-[#1b4332] flex flex-col overflow-y-auto">
        <div className="flex items-center justify-between gap-2 px-4 py-3 bg-[#2d6a4f] text-white shadow">
          <div className="min-w-0">
            <h2 className="font-atlas text-lg font-bold truncate">🏡 Home and Garden</h2>
            <p className="text-xs text-[#b7e4c7] truncate">
              Family Sanctuary · Strictly Isolated from University Vaults
            </p>
          </div>
          <div className="flex items-center gap-2">
            {isChancellor && (
              <button
                onClick={() => setAdminOpen((v) => !v)}
                className="px-2.5 py-1.5 rounded-lg bg-white/15 hover:bg-white/25 text-xs font-semibold border border-white/30 cursor-pointer"
              >
                ⚙️ Import / PINs
              </button>
            )}
            {canExitToCampus && onExitToCampus ? (
              <button
                onClick={onExitToCampus}
                className="px-3 py-1.5 rounded-lg bg-white/15 hover:bg-white/25 text-xs font-semibold border border-white/30 cursor-pointer"
              >
                ← Campus Map
              </button>
            ) : (
              <button
                onClick={() => void signOutUser()}
                className="px-3 py-1.5 rounded-lg bg-white/15 hover:bg-white/25 text-xs font-semibold border border-white/30 cursor-pointer"
              >
                Sign Out
              </button>
            )}
          </div>
        </div>
        {adminDrawer}

        <div className="max-w-lg w-full mx-auto p-5 space-y-5">
          {ASSETS['crop-home-garden']?.src && (
            <div className="flex justify-center">
              <img
                src={ASSETS['crop-home-garden'].src}
                alt="Home and Garden"
                className="w-40 h-auto rounded-2xl border-2 border-[#74c69d] shadow-md"
              />
            </div>
          )}

          {!kidLoginOpen ? (
            <div className="p-5 rounded-3xl bg-white border-2 border-[#74c69d] shadow space-y-4 text-center">
              <div>
                <h3 className="font-atlas text-xl font-bold text-[#1b4332]">👋 Who is using the Hub?</h3>
                <p className="text-xs text-[#40916c]">Tap your name (youngest to oldest for the kids!)</p>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {FAMILY_PEOPLE.map((p) => (
                  <button
                    key={p.name}
                    onClick={() => selectPerson(p.name)}
                    className="p-3 rounded-2xl border border-black/10 shadow-sm hover:shadow-md flex flex-col items-center gap-1.5 cursor-pointer transition"
                    style={{ backgroundColor: p.color, color: p.ink }}
                  >
                    <PersonIcon person={p} size="lg" />
                    <span className="font-bold text-sm">{p.name}</span>
                  </button>
                ))}
              </div>
              <button
                onClick={() => setKidLoginOpen(true)}
                className="px-4 py-2 rounded-xl bg-[#edf6f0] hover:bg-[#d8f3dc] text-xs font-bold text-[#1b4332] cursor-pointer"
              >
                🧒 Kid Login (Liam &amp; Oliver Tablet Mode)
              </button>
            </div>
          ) : (
            <div className="p-5 rounded-3xl bg-white border-2 border-[#74c69d] shadow space-y-4 text-center">
              <h3 className="font-atlas text-xl font-bold text-[#1b4332]">🧒 Who is playing?</h3>
              <p className="text-xs text-[#40916c]">Tap your picture!</p>
              <div className="grid grid-cols-2 gap-4">
                {FAMILY_PEOPLE.filter((p) => p.mode === 'little').map((p) => (
                  <button
                    key={p.name}
                    onClick={() => startKidLogin(p.name)}
                    className="p-6 rounded-3xl border-2 border-[#74c69d] shadow hover:shadow-md flex flex-col items-center gap-2 cursor-pointer"
                    style={{ backgroundColor: p.color, color: p.ink }}
                  >
                    <PersonIcon person={p} size="lg" />
                    <span className="font-bold text-lg">{p.name}</span>
                  </button>
                ))}
              </div>
              <button
                onClick={() => setKidLoginOpen(false)}
                className="px-4 py-2 rounded-xl bg-[#edf6f0] text-xs font-bold cursor-pointer"
              >
                ← Back
              </button>
            </div>
          )}
        </div>
        {pinDialog}
      </section>
    );
  }

  return (
    <section className="fixed inset-0 z-50 bg-gradient-to-b from-[#e9f5ec] to-[#d4ebd9] text-[#1b4332] flex flex-col">
      {/* Top Bar */}
      <header className="flex items-center justify-between gap-2 px-4 py-2.5 bg-[#2d6a4f] text-white shadow shrink-0">
        <div className="min-w-0">
          <h2 className="font-atlas text-base sm:text-lg font-bold truncate">🏡 Home and Garden</h2>
          {isReadOnly && (
            <p className="text-[11px] text-[#fde68a] truncate">
              👀 Campus Guest Read-Only View · Edits &amp; Private Vaults Disabled
            </p>
          )}
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => {
              if (kidLockName) {
                setPinTargetKid(kidLockName);
                setPinUnlockMode(true);
                setPinInput('');
                setPinError(null);
              } else {
                setSelectedName('');
              }
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold shadow-sm cursor-pointer border border-white/40"
            style={{ backgroundColor: activePerson.color, color: activePerson.ink }}
          >
            <PersonIcon person={activePerson} size="sm" />
            {activePerson.name}
          </button>

          {isChancellor && (
            <button
              onClick={() => setAdminOpen((v) => !v)}
              className="px-2.5 py-1 rounded-lg bg-white/15 hover:bg-white/25 text-xs font-semibold border border-white/30 cursor-pointer"
              title="Parent Import & Kid PINs"
            >
              ⚙️
            </button>
          )}

          {!kidLockName && canExitToCampus && onExitToCampus ? (
            <button
              onClick={onExitToCampus}
              className="px-2.5 py-1 rounded-lg bg-white/15 hover:bg-white/25 text-xs font-semibold border border-white/30 cursor-pointer"
            >
              ← Campus
            </button>
          ) : (
            !kidLockName && (
              <button
                onClick={() => void signOutUser()}
                className="px-2.5 py-1 rounded-lg bg-white/15 hover:bg-white/25 text-xs font-semibold border border-white/30 cursor-pointer"
                title={userEmail || 'Sign Out'}
              >
                Sign Out
              </button>
            )
          )}
        </div>
      </header>

      {/* View As Banner */}
      {viewAs && (
        <div className="bg-[#fef3c7] border-b border-[#f59e0b] px-4 py-1.5 text-center text-xs text-[#78350f] flex items-center justify-center gap-3 shrink-0">
          <span>
            👀 Viewing as <strong>{viewAs}</strong> (Read-Only Preview)
          </span>
          <button
            onClick={() => {
              setViewAs('');
              setActiveTab('home');
            }}
            className="px-2.5 py-0.5 rounded bg-white border border-[#d97706] font-bold cursor-pointer"
          >
            ↩ Back to {selectedName}
          </button>
        </div>
      )}

      {/* Chancellor Admin Drawer (Import JSON + Kid PIN Setup) */}
      {adminDrawer}

      {syncError && (
        <div className="bg-red-100 border-b border-red-300 px-4 py-1.5 text-xs text-red-900 text-center">
          ⚠️ {syncError}
        </div>
      )}

      {/* Body Layout: Desktop Left Sidebar + Scrolling Content Area + Mobile Bottom Bar */}
      <div className="flex-1 flex flex-col md:flex-row min-h-0">
        {/* Desktop Sidebar */}
        <nav className="hidden md:flex md:w-52 shrink-0 flex-col gap-1 p-3 bg-white/90 border-r border-[#95d5b2] overflow-y-auto">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                if (activePerson.mode === 'little') speakText(item.label, speakEnabled);
              }}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-left cursor-pointer transition ${
                activeTab === item.id
                  ? 'bg-[#2d6a4f] text-white shadow-sm'
                  : 'text-[#1b4332] hover:bg-[#e9f5ec]'
              }`}
            >
              <span className="text-base">{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-3 sm:p-5 pb-24 md:pb-6">
          <div className="max-w-4xl mx-auto">
            {activeTab === 'home' && (
              <FamilyHomeTab
                activePerson={activePerson}
                isParentActor={isParentAuth && !isReadOnly}
                readOnly={isReadOnly}
                viewAs={viewAs}
                speakEnabled={speakEnabled}
                chores={chores}
                announcements={announcementsData.announcements}
                calendarData={calendarData}
                onToggleSpeak={() => setSpeakEnabled((v) => !v)}
                onSelectViewAs={(kid) => {
                  setViewAs(kid);
                  setActiveTab('home');
                }}
                onToggleChore={async (choreId) => {
                  if (!canEdit) return;
                  const td = todayDayKey();
                  const next = chores.map((c) =>
                    c.id === choreId ? { ...c, checked: { ...c.checked, [td]: !c.checked[td] } } : c
                  );
                  await saveChoresList(choresWeekOf, next, actorEmail);
                }}
                onPostAnnouncement={async (text, forWho) => {
                  if (!canEdit) return;
                  const newAnn = {
                    id: `ann_${Date.now().toString(36)}`,
                    date: new Date().toISOString().slice(0, 10),
                    text,
                    forWho,
                    by: activePerson.name,
                  };
                  await saveAnnouncementsData(
                    {
                      ...announcementsData,
                      announcements: [newAnn, ...announcementsData.announcements],
                    },
                    actorEmail
                  );
                }}
                onSaveCalendarEvents={async (events: CalendarEventItem[]) => {
                  if (!canEdit) return;
                  await saveCalendarData({ ...calendarData, events }, actorEmail);
                }}
                onNavigateTab={(t) => setActiveTab(t as NavPageId)}
              />
            )}

            {activeTab === 'chores' && (
              <FamilyChoresTab
                activePerson={activePerson}
                canEdit={canEdit}
                speakEnabled={speakEnabled}
                weekOf={choresWeekOf}
                chores={chores}
                onToggleChore={async (choreId, day: DayKey) => {
                  if (!canEdit) return;
                  const next = chores.map((c) =>
                    c.id === choreId ? { ...c, checked: { ...c.checked, [day]: !c.checked[day] } } : c
                  );
                  await saveChoresList(choresWeekOf, next, actorEmail);
                }}
                onAddChore={async (inp) => {
                  if (!canEdit) return;
                  const item: ChoreItem = {
                    id: `ch_${Date.now().toString(36)}`,
                    person: inp.person,
                    chore: inp.chore,
                    often: inp.often,
                    steps: inp.steps,
                    daysText: inp.daysText,
                    daysText2: '',
                    room: inp.room,
                    time: inp.time,
                    checked: { Mon: false, Tue: false, Wed: false, Thu: false, Fri: false, Sat: false, Sun: false },
                  };
                  await saveChoresList(choresWeekOf, [...chores, item], actorEmail);
                }}
                onClearWeek={async () => {
                  if (!canEdit) return;
                  const cleared = chores.map((c) => ({
                    ...c,
                    checked: { Mon: false, Tue: false, Wed: false, Thu: false, Fri: false, Sat: false, Sun: false },
                  }));
                  await saveChoresList(choresWeekOf, cleared, actorEmail);
                }}
              />
            )}

            {activeTab === 'meals' && (
              <FamilyMealsTab
                activePerson={activePerson}
                canEdit={canEdit}
                weekOf={mealsData.weekOf}
                mealsWeek={mealsData.week}
                anchors={mealsData.anchors}
                picks={mealsData.picks}
                recipes={recipes}
                pantry={pantryData.items}
                dietaryProfiles={pantryData.dietaryProfiles}
                onToggleFavorite={async (recipeId) => {
                  if (!canEdit) return;
                  const next = recipes.map((r) => {
                    if (r.id !== recipeId) return r;
                    const has = r.favs.includes(activePerson.name);
                    return {
                      ...r,
                      favs: has ? r.favs.filter((f) => f !== activePerson.name) : [...r.favs, activePerson.name],
                    };
                  });
                  await saveRecipesList(next, actorEmail);
                }}
                onAddRecipe={async (rec) => {
                  if (!canEdit) return;
                  const newRec: RecipeItem = {
                    ...rec,
                    id: `rec_${Date.now().toString(36)}`,
                    favs: [],
                    fitsChecked: [],
                  };
                  await saveRecipesList([...recipes, newRec], actorEmail);
                }}
                onAddBundleToGrocery={async (recipe) => {
                  if (!canEdit) return 0;
                  const existingNames = new Set(grocery.filter((g) => !g.got).map((g) => g.item.toLowerCase()));
                  const toAdd: GroceryItem[] = [];
                  recipe.ingredients.forEach((line, idx) => {
                    const clean = line.trim();
                    if (!clean || existingNames.has(clean.toLowerCase())) return;
                    toAdd.push({
                      id: `gr_${Date.now().toString(36)}_${idx}`,
                      item: clean,
                      category: 'Pantry',
                      qty: '',
                      store: 'Walmart',
                      by: activePerson.name,
                      meal: recipe.name,
                      got: false,
                      notes: `For ${recipe.name}`,
                    });
                  });
                  if (toAdd.length) {
                    await saveGroceryList([...grocery, ...toAdd], actorEmail);
                  }
                  return toAdd.length;
                }}
                onSetPantryStatus={async (pantryId, out) => {
                  if (!canEdit) return;
                  const next = pantryData.items.map((p) => (p.id === pantryId ? { ...p, out } : p));
                  await savePantryData(next, pantryData.dietaryProfiles, actorEmail);
                }}
                onPantryToGrocery={async (item) => {
                  if (!canEdit) return;
                  const exists = grocery.some((g) => !g.got && g.item.toLowerCase() === item.item.toLowerCase());
                  if (exists) return;
                  const newItem: GroceryItem = {
                    id: `gr_${Date.now().toString(36)}`,
                    item: item.item,
                    category: item.category || 'Other',
                    qty: '',
                    store: 'Walmart',
                    by: activePerson.name,
                    meal: '',
                    got: false,
                    notes: "From Pantry (we're out)",
                  };
                  await saveGroceryList([...grocery, newItem], actorEmail);
                }}
                onSaveMealPick={async (pick) => {
                  if (!canEdit) return;
                  const filtered = mealsData.picks.filter(
                    (p) => !(p.day === pick.day && p.meal === pick.meal && p.who === pick.who)
                  );
                  await saveMealsData({ ...mealsData, picks: [...filtered, pick] }, actorEmail);
                }}
              />
            )}

            {activeTab === 'grocery' && (
              <FamilyGroceryTab
                activePerson={activePerson}
                canEdit={canEdit}
                items={grocery}
                onToggleGot={async (id) => {
                  if (!canEdit) return;
                  await saveGroceryList(
                    grocery.map((g) => (g.id === id ? { ...g, got: !g.got } : g)),
                    actorEmail
                  );
                }}
                onAddItem={async (inp) => {
                  if (!canEdit) return;
                  const nextItem: GroceryItem = {
                    id: `gr_${Date.now().toString(36)}`,
                    item: inp.item,
                    category: inp.category,
                    qty: inp.qty,
                    store: inp.store,
                    by: activePerson.name,
                    meal: '',
                    got: false,
                    notes: '',
                  };
                  await saveGroceryList([...grocery, nextItem], actorEmail);
                }}
                onClearGot={async () => {
                  if (!canEdit) return;
                  await saveGroceryList(
                    grocery.filter((g) => !g.got),
                    actorEmail
                  );
                }}
              />
            )}

            {activeTab === 'goals' && (
              <FamilyGoalsTab
                activePerson={activePerson}
                canEdit={canEdit}
                goals={goals}
                onAddGoal={async (goal, step) => {
                  if (!canEdit) return;
                  const next: GoalItem = {
                    id: `goal_${Date.now().toString(36)}`,
                    person: activePerson.name,
                    goal,
                    why: '',
                    step,
                    target: '',
                    status: 'Not started',
                    progress: '0%',
                    notes: '',
                    celebrate: '',
                  };
                  await saveGoalsList([...goals, next], actorEmail);
                }}
                onUpdateGoal={async (updated) => {
                  if (!canEdit) return;
                  await saveGoalsList(
                    goals.map((g) => (g.id === updated.id ? updated : g)),
                    actorEmail
                  );
                }}
                onDeleteGoal={async (id) => {
                  if (!canEdit) return;
                  await saveGoalsList(
                    goals.filter((g) => g.id !== id),
                    actorEmail
                  );
                }}
              />
            )}

            {activeTab === 'gifts' && (
              <FamilyGiftsTab
                activePerson={activePerson}
                isParentActor={isParentAuth}
                canEdit={canEdit}
                readOnly={isReadOnly}
                viewAs={viewAs}
                sections={giftSections}
                parentBoughtMap={parentGiftBought}
                onAddGift={async (forPerson, item: Omit<GiftItem, 'id'>) => {
                  if (!canEdit) return;
                  const newItem: GiftItem = { ...item, id: `gf_${Date.now().toString(36)}` };
                  const exists = giftSections.some((s) => s.person === forPerson);
                  const next = exists
                    ? giftSections.map((s) =>
                        s.person === forPerson ? { ...s, items: [...s.items, newItem] } : s
                      )
                    : [...giftSections, { person: forPerson, title: `${forPerson} Wish List`, items: [newItem] }];
                  await saveGiftSections(next, actorEmail);
                }}
                onDeleteGift={async (forPerson, giftId) => {
                  if (!canEdit) return;
                  const next = giftSections.map((s) =>
                    s.person === forPerson ? { ...s, items: s.items.filter((i) => i.id !== giftId) } : s
                  );
                  await saveGiftSections(next, actorEmail);
                }}
                onToggleBought={async (giftId, bought) => {
                  if (!isParentAuth || isReadOnly || viewAs) return;
                  const next = { ...parentGiftBought };
                  if (bought) next[giftId] = `✔ (${activePerson.name})`;
                  else delete next[giftId];
                  await saveParentGiftBought(next, actorEmail);
                }}
              />
            )}

            {activeTab === 'chat' && !viewAs && (
              <FamilyChatTab
                activePerson={activePerson}
                canEdit={canEdit}
                rooms={chatRooms}
                messages={chatMessages}
                onSendMessage={async (chatId, text) => {
                  if (!canEdit) return;
                  await sendFamilyChatMessage(chatId, activePerson.name, text, actorEmail);
                }}
                onCreateRoom={async (name, members) => {
                  if (!canEdit) return;
                  const id = `c_${Date.now().toString(36)}`;
                  await saveChatRooms([...chatRooms, { id, name, members }], actorEmail);
                }}
              />
            )}

            {activeTab === 'links' && <FamilyLinksTab groups={linkGroups} />}

            {activeTab === 'info' && <FamilyInfoTab data={announcementsData} />}

            {(activeTab === 'school' || activeTab === 'quests') && (
              <div className="p-6 rounded-2xl bg-white border-2 border-[#74c69d] text-center space-y-2">
                <div className="text-3xl">{activeTab === 'quests' ? '📜' : '🏫'}</div>
                <h3 className="font-atlas text-lg font-bold text-[#1b4332]">
                  {activeTab === 'quests'
                    ? 'Gabe’s Interactive Quests & Vault of Chambers'
                    : 'Kid School Center & Learning Games'}
                </h3>
                <p className="text-xs text-[#40916c] max-w-md mx-auto leading-relaxed">
                  Arriving next in <strong>v3b</strong>! That update brings in Liam &amp; Oliver’s Math,
                  Spelling &amp; Reverse-Multiply Games, Preston’s Mini Crosswords, Logic Puzzles &amp; Spanish,
                  Chase’s Word of the Day &amp; Python Tips, and Gabe’s full Know Your Dice / Science Units 1–5 /
                  GED Quests.
                </p>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-[#95d5b2] flex overflow-x-auto z-50">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => {
              setActiveTab(item.id);
              if (activePerson.mode === 'little') speakText(item.label, speakEnabled);
            }}
            className={`flex-1 min-w-[66px] py-2 px-1 text-[10px] font-bold flex flex-col items-center gap-0.5 cursor-pointer ${
              activeTab === item.id ? 'bg-[#e9f5ec] text-[#1b4332]' : 'text-[#52796f]'
            }`}
          >
            <span className="text-lg leading-none">{item.icon}</span>
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      {pinDialog}
    </section>
  );
}
