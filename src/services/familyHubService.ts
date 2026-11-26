import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  limit,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  type Timestamp,
  type Unsubscribe,
} from 'firebase/firestore';
import { auth, db } from '../firebase';
import { importHealthBundle, type HealthImportSection } from './healthService';

export type FamilyMode = 'parent' | 'little' | 'teen' | 'gabe';
export type DayKey = 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat' | 'Sun';

export const DAYS_OF_WEEK: DayKey[] = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export interface FamilyPersonProfile {
  name: string;
  emoji: string;
  color: string;
  ink: string;
  darkBg?: string;
  mode: FamilyMode;
  kid: boolean;
  birth?: string;
}

// Parents first, then kids youngest -> oldest (Oliver, Liam, Chase, Gabe, Preston).
// Zero private emails or PINs live in source code!
export const FAMILY_PEOPLE: FamilyPersonProfile[] = [
  { name: 'Amarette', emoji: '🐔', color: '#F6D6AD', ink: '#2B2A27', mode: 'parent', kid: false },
  { name: 'Ray', emoji: '🐺', color: '#BFD7EA', ink: '#2B2A27', mode: 'parent', kid: false },
  { name: 'Oliver', emoji: '🎃', color: '#FFD3C2', ink: '#2B2A27', mode: 'little', kid: true, birth: '2021-10-31' },
  { name: 'Liam', emoji: '🟣', color: '#F7C6DA', ink: '#2B2A27', mode: 'little', kid: true, birth: '2019-06-05' },
  { name: 'Chase', emoji: '🐱', color: '#A6DFD5', ink: '#2B2A27', mode: 'teen', kid: false, birth: '2012-01-29' },
  { name: 'Gabe', emoji: '🐉', color: '#33383D', ink: '#F4F4F2', mode: 'gabe', kid: false, birth: '2010-11-16' },
  { name: 'Preston', emoji: '💻', color: '#D2BEF0', ink: '#2B2A27', mode: 'teen', kid: false, birth: '2009-08-07' },
];

export const FAMILY_CALENDAR_COLORS: Record<string, string> = {
  '': '#F3E5B5',
  Amarette: '#F6D6AD',
  Ray: '#BFD7EA',
  Oliver: '#FFD3C2',
  Liam: '#F9D9E5',
  Chase: '#BEE8E0',
  Gabe: '#C5CACF',
  Preston: '#DCCDF4',
};

export interface ChoreItem {
  id: string;
  person: string;
  chore: string;
  often: string;
  steps: string;
  daysText: string;
  daysText2: string;
  room: string;
  time: string;
  checked: Record<DayKey, boolean>;
}

export interface GroceryItem {
  id: string;
  item: string;
  category: string;
  qty: string;
  store: string;
  by: string;
  meal: string;
  got: boolean;
  notes: string;
}

export interface MealWeekRow {
  day: string;
  breakfast: string;
  lunch: string;
  dinner: string;
  safe: string;
  cook: string;
  notes: string;
}

export interface AnchorMealRow {
  day: string;
  meal: string;
  setup: string;
  backups: string;
  notes: string;
}

export interface MealPickRow {
  day: string;
  meal: string;
  who: string;
  choice: string;
  addons: string;
  by: string;
}

export interface RecipeItem {
  id: string;
  name: string;
  cuisine: string;
  protein: string;
  ingredients: string[];
  steps: string[];
  time: number;
  link: string;
  safe: boolean;
  tags: string;
  favs: string[];
  source: string;
  serves: string;
  backups: string;
  fitsChecked: string[];
}

export interface PantryItem {
  id: string;
  item: string;
  category: string;
  source: string;
  how: string;
  alsoMatches: string;
  out: boolean;
}

export interface DietaryProfile {
  person: string;
  avoid: string;
  allow: string;
  notes: string;
  safe: string;
  textures: string;
  allergies: string;
}

export interface AnnouncementItem {
  id: string;
  date: string;
  text: string;
  forWho: string;
  by: string;
}

export interface HouseholdAnnouncementsDoc {
  announcements: AnnouncementItem[];
  info: Array<{ item: string; details: string }>;
  rules: string[];
  contacts: Array<{ name: string; phone: string; link: string; notes: string }>;
}

export interface GoalItem {
  id: string;
  person: string;
  goal: string;
  why: string;
  step: string;
  target: string;
  status: string;
  progress: string;
  notes: string;
  celebrate: string;
}

export interface GiftItem {
  id: string;
  idea: string;
  link: string;
  price: string;
  priority: string;
  occasion: string;
}

export interface GiftSection {
  person: string;
  title: string;
  items: GiftItem[];
}

export interface LinkGroup {
  title: string;
  links: Array<{ name: string; url: string; who: string; type: string; notes: string }>;
}

export interface CalendarEventItem {
  id: string;
  title: string;
  start: string;
  end: string;
  allDay: boolean;
  person: string;
  location: string;
  notes: string;
  routine?: boolean;
}

export interface ReminderSetting {
  person: string;
  style: string;
  when: string;
  choreTime: string;
  lightDay: string;
  planDays: string;
  changeDays: string;
  aheadHours: string;
  beforeMin: string;
  checklist: string;
  notes: string;
}

export interface PrestonDueItem {
  day: string;
  cls: string;
  what: string;
  type: string;
  note: string;
}

export interface CcccEvent {
  date: string;
  end: string;
  text: string;
  term: string;
  source: string;
}

export interface FamilyCalendarDoc {
  events: CalendarEventItem[];
  reminders: ReminderSetting[];
  prestonDue: PrestonDueItem[];
  ccccCalendar: CcccEvent[];
}

export interface ChatRoom {
  id: string;
  name: string;
  members: string[];
}

export interface ChatMessage {
  id: string;
  chatId: string;
  sender: string;
  text: string;
  ts: string;
  createdAt?: Timestamp | null;
}

export interface FamilyHubBundle extends HealthImportSection {
  version: string;
  exportedAt: string;
  homeAndGarden: {
    chores: { weekOf: string; items: ChoreItem[] };
    grocery: { items: GroceryItem[] };
    meals: { weekOf: string; week: MealWeekRow[]; anchors: AnchorMealRow[]; picks: MealPickRow[] };
    recipes: { items: RecipeItem[] };
    pantry: { items: PantryItem[]; dietaryProfiles: DietaryProfile[] };
    announcements: HouseholdAnnouncementsDoc;
    goals: { items: GoalItem[] };
    gifts: { sections: GiftSection[] };
    links: { groups: LinkGroup[] };
    calendar: FamilyCalendarDoc;
    chats: { rooms: ChatRoom[]; messages: Array<Omit<ChatMessage, 'id' | 'createdAt'>> };
  };
  homeAndGardenParents?: {
    giftBought?: Record<string, string>;
  };
}

// ============================================================================
// DATE & CHORE SCHEDULE HELPERS
// ============================================================================

export function todayDayKey(d = new Date()): DayKey {
  const map: DayKey[] = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  return map[d.getDay()];
}

export function isoDateLocal(d = new Date()): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function getWeekDates(anchor = new Date()): Array<{ day: DayKey; dateKey: string }> {
  const jsDay = anchor.getDay(); // Sun=0..Sat=6
  const monOffset = (jsDay + 6) % 7;
  const mon = new Date(anchor.getFullYear(), anchor.getMonth(), anchor.getDate() - monOffset);
  return DAYS_OF_WEEK.map((day, idx) => {
    const dt = new Date(mon.getFullYear(), mon.getMonth(), mon.getDate() + idx);
    return { day, dateKey: isoDateLocal(dt) };
  });
}

function parseMonthlySpecs(raw: string): Array<{ nth: number | 'last'; dayIdx: number }> | null {
  const parts = raw.toLowerCase().split(',').map((x) => x.trim()).filter(Boolean);
  const specs: Array<{ nth: number | 'last'; dayIdx: number }> = [];
  const dayNames = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
  for (const p of parts) {
    const m = /^(1st|2nd|3rd|4th|last)\s+(mon|tue|wed|thu|fri|sat|sun)/.exec(p);
    if (!m) return null;
    const nth = m[1] === 'last' ? 'last' : parseInt(m[1][0], 10);
    specs.push({ nth, dayIdx: dayNames.indexOf(m[2]) });
  }
  return specs.length ? specs : null;
}

function matchesMonthly(specs: Array<{ nth: number | 'last'; dayIdx: number }>, dateKey: string): boolean {
  const [y, m, d] = dateKey.split('-').map(Number);
  const dt = new Date(y, m - 1, d);
  const monBased = (dt.getDay() + 6) % 7;
  for (const sp of specs) {
    if (sp.dayIdx !== monBased) continue;
    if (sp.nth === 'last') {
      const nextWeek = new Date(y, m - 1, d + 7);
      if (nextWeek.getMonth() !== dt.getMonth()) return true;
    } else {
      const nthOfMonth = Math.floor((d - 1) / 7) + 1;
      if (nthOfMonth === sp.nth) return true;
    }
  }
  return false;
}

function parseWeekdayList(raw: string): boolean[] {
  const s = raw.trim().toLowerCase();
  if (!s || s === 'daily' || s === 'every day') return DAYS_OF_WEEK.map(() => true);
  if (s.includes('weekday')) return [true, true, true, true, true, false, false];
  if (s.includes('weekend')) return [false, false, false, false, false, true, true];
  const m = DAYS_OF_WEEK.map((d) => s.includes(d.toLowerCase()));
  return m.some(Boolean) ? m : DAYS_OF_WEEK.map(() => true);
}

export function isChoreDueOnDate(chore: ChoreItem, day: DayKey, dateKey: string): boolean {
  const effectiveText = dateKey >= '2026-11-02' && chore.daysText2.trim()
    ? chore.daysText2
    : chore.daysText;
  const mon = parseMonthlySpecs(effectiveText);
  if (mon) return matchesMonthly(mon, dateKey);
  const mask = parseWeekdayList(effectiveText);
  return mask[DAYS_OF_WEEK.indexOf(day)];
}

// ============================================================================
// REALTIME SUBSCRIPTIONS
// ============================================================================

export function subscribeChores(
  cb: (data: { weekOf: string; items: ChoreItem[] }) => void,
  onError?: (err: Error) => void
): Unsubscribe {
  return onSnapshot(
    doc(db, 'home_and_garden', 'chores'),
    (snap) => {
      if (!snap.exists()) return cb({ weekOf: '', items: [] });
      const d = snap.data() as { weekOf?: string; items?: ChoreItem[] };
      cb({ weekOf: d.weekOf || '', items: Array.isArray(d.items) ? d.items : [] });
    },
    (err) => onError?.(err)
  );
}

export function subscribeGrocery(
  cb: (items: GroceryItem[]) => void,
  onError?: (err: Error) => void
): Unsubscribe {
  return onSnapshot(
    doc(db, 'home_and_garden', 'grocery'),
    (snap) => {
      if (!snap.exists()) return cb([]);
      const d = snap.data() as { items?: GroceryItem[] };
      cb(Array.isArray(d.items) ? d.items : []);
    },
    (err) => onError?.(err)
  );
}

export function subscribeMeals(
  cb: (data: { weekOf: string; week: MealWeekRow[]; anchors: AnchorMealRow[]; picks: MealPickRow[] }) => void,
  onError?: (err: Error) => void
): Unsubscribe {
  return onSnapshot(
    doc(db, 'home_and_garden', 'meals'),
    (snap) => {
      if (!snap.exists()) return cb({ weekOf: '', week: [], anchors: [], picks: [] });
      const d = snap.data() as {
        weekOf?: string;
        week?: MealWeekRow[];
        anchors?: AnchorMealRow[];
        picks?: MealPickRow[];
      };
      cb({
        weekOf: d.weekOf || '',
        week: Array.isArray(d.week) ? d.week : [],
        anchors: Array.isArray(d.anchors) ? d.anchors : [],
        picks: Array.isArray(d.picks) ? d.picks : [],
      });
    },
    (err) => onError?.(err)
  );
}

export function subscribeRecipes(
  cb: (items: RecipeItem[]) => void,
  onError?: (err: Error) => void
): Unsubscribe {
  return onSnapshot(
    doc(db, 'home_and_garden', 'recipes'),
    (snap) => {
      if (!snap.exists()) return cb([]);
      const d = snap.data() as { items?: RecipeItem[] };
      cb(Array.isArray(d.items) ? d.items : []);
    },
    (err) => onError?.(err)
  );
}

export function subscribePantry(
  cb: (data: { items: PantryItem[]; dietaryProfiles: DietaryProfile[] }) => void,
  onError?: (err: Error) => void
): Unsubscribe {
  return onSnapshot(
    doc(db, 'home_and_garden', 'pantry'),
    (snap) => {
      if (!snap.exists()) return cb({ items: [], dietaryProfiles: [] });
      const d = snap.data() as { items?: PantryItem[]; dietaryProfiles?: DietaryProfile[] };
      cb({
        items: Array.isArray(d.items) ? d.items : [],
        dietaryProfiles: Array.isArray(d.dietaryProfiles) ? d.dietaryProfiles : [],
      });
    },
    (err) => onError?.(err)
  );
}

export function subscribeAnnouncements(
  cb: (data: HouseholdAnnouncementsDoc) => void,
  onError?: (err: Error) => void
): Unsubscribe {
  return onSnapshot(
    doc(db, 'home_and_garden', 'announcements'),
    (snap) => {
      if (!snap.exists()) return cb({ announcements: [], info: [], rules: [], contacts: [] });
      const d = snap.data() as Partial<HouseholdAnnouncementsDoc>;
      cb({
        announcements: Array.isArray(d.announcements) ? d.announcements : [],
        info: Array.isArray(d.info) ? d.info : [],
        rules: Array.isArray(d.rules) ? d.rules : [],
        contacts: Array.isArray(d.contacts) ? d.contacts : [],
      });
    },
    (err) => onError?.(err)
  );
}

export function subscribeGoals(
  cb: (items: GoalItem[]) => void,
  onError?: (err: Error) => void
): Unsubscribe {
  return onSnapshot(
    doc(db, 'home_and_garden', 'goals'),
    (snap) => {
      if (!snap.exists()) return cb([]);
      const d = snap.data() as { items?: GoalItem[] };
      cb(Array.isArray(d.items) ? d.items : []);
    },
    (err) => onError?.(err)
  );
}

export function subscribeGifts(
  cb: (sections: GiftSection[]) => void,
  onError?: (err: Error) => void
): Unsubscribe {
  return onSnapshot(
    doc(db, 'home_and_garden', 'gifts'),
    (snap) => {
      if (!snap.exists()) return cb([]);
      const d = snap.data() as { sections?: GiftSection[] };
      cb(Array.isArray(d.sections) ? d.sections : []);
    },
    (err) => onError?.(err)
  );
}

export function subscribeParentGiftBought(
  cb: (bought: Record<string, string>) => void,
  onError?: (err: Error) => void
): Unsubscribe {
  return onSnapshot(
    doc(db, 'home_and_garden_parents', 'gift_bought'),
    (snap) => {
      if (!snap.exists()) return cb({});
      const d = snap.data() as { bought?: Record<string, string> };
      cb(d.bought && typeof d.bought === 'object' ? d.bought : {});
    },
    (err) => onError?.(err)
  );
}

export function subscribeKidPins(
  cb: (pins: Record<string, string>) => void,
  onError?: (err: Error) => void
): Unsubscribe {
  return onSnapshot(
    doc(db, 'home_and_garden_parents', 'kid_pins'),
    (snap) => {
      if (!snap.exists()) return cb({});
      const d = snap.data() as { pins?: Record<string, string> };
      cb(d.pins && typeof d.pins === 'object' ? d.pins : {});
    },
    (err) => onError?.(err)
  );
}

export function subscribeLinks(
  cb: (groups: LinkGroup[]) => void,
  onError?: (err: Error) => void
): Unsubscribe {
  return onSnapshot(
    doc(db, 'home_and_garden', 'links'),
    (snap) => {
      if (!snap.exists()) return cb([]);
      const d = snap.data() as { groups?: LinkGroup[] };
      cb(Array.isArray(d.groups) ? d.groups : []);
    },
    (err) => onError?.(err)
  );
}

export function subscribeCalendar(
  cb: (data: FamilyCalendarDoc) => void,
  onError?: (err: Error) => void
): Unsubscribe {
  return onSnapshot(
    doc(db, 'home_and_garden', 'calendar'),
    (snap) => {
      if (!snap.exists()) {
        return cb({ events: [], reminders: [], prestonDue: [], ccccCalendar: [] });
      }
      const d = snap.data() as Partial<FamilyCalendarDoc>;
      cb({
        events: Array.isArray(d.events) ? d.events : [],
        reminders: Array.isArray(d.reminders) ? d.reminders : [],
        prestonDue: Array.isArray(d.prestonDue) ? d.prestonDue : [],
        ccccCalendar: Array.isArray(d.ccccCalendar) ? d.ccccCalendar : [],
      });
    },
    (err) => onError?.(err)
  );
}

export function subscribeChatRooms(
  cb: (rooms: ChatRoom[]) => void,
  onError?: (err: Error) => void
): Unsubscribe {
  return onSnapshot(
    doc(db, 'home_and_garden', 'chats'),
    (snap) => {
      if (!snap.exists()) {
        return cb([{ id: 'family', name: 'Family Chat', members: FAMILY_PEOPLE.map((p) => p.name) }]);
      }
      const d = snap.data() as { rooms?: ChatRoom[] };
      const rooms = Array.isArray(d.rooms) && d.rooms.length
        ? d.rooms
        : [{ id: 'family', name: 'Family Chat', members: FAMILY_PEOPLE.map((p) => p.name) }];
      cb(rooms);
    },
    (err) => onError?.(err)
  );
}

export function subscribeChatMessages(
  cb: (messages: ChatMessage[]) => void,
  onError?: (err: Error) => void
): Unsubscribe {
  const q = query(
    collection(db, 'home_and_garden', 'chats', 'messages'),
    orderBy('ts', 'desc'),
    limit(200)
  );
  return onSnapshot(
    q,
    (snap) => {
      const list = snap.docs
        .map((d) => ({ id: d.id, ...(d.data() as Omit<ChatMessage, 'id'>) }))
        .reverse();
      cb(list);
    },
    (err) => onError?.(err)
  );
}

// ============================================================================
// MUTATIONS
// ============================================================================

export async function saveChoresList(
  weekOf: string,
  items: ChoreItem[],
  actorEmail: string
): Promise<void> {
  await setDoc(doc(db, 'home_and_garden', 'chores'), {
    weekOf,
    items,
    updatedAt: serverTimestamp(),
    updatedBy: actorEmail.trim().toLowerCase(),
  });
}

export async function saveGroceryList(items: GroceryItem[], actorEmail: string): Promise<void> {
  await setDoc(doc(db, 'home_and_garden', 'grocery'), {
    items,
    updatedAt: serverTimestamp(),
    updatedBy: actorEmail.trim().toLowerCase(),
  });
}

export async function saveMealsData(
  data: { weekOf: string; week: MealWeekRow[]; anchors: AnchorMealRow[]; picks: MealPickRow[] },
  actorEmail: string
): Promise<void> {
  await setDoc(doc(db, 'home_and_garden', 'meals'), {
    ...data,
    updatedAt: serverTimestamp(),
    updatedBy: actorEmail.trim().toLowerCase(),
  });
}

export async function saveRecipesList(items: RecipeItem[], actorEmail: string): Promise<void> {
  await setDoc(doc(db, 'home_and_garden', 'recipes'), {
    items,
    updatedAt: serverTimestamp(),
    updatedBy: actorEmail.trim().toLowerCase(),
  });
}

export async function savePantryData(
  items: PantryItem[],
  dietaryProfiles: DietaryProfile[],
  actorEmail: string
): Promise<void> {
  await setDoc(doc(db, 'home_and_garden', 'pantry'), {
    items,
    dietaryProfiles,
    updatedAt: serverTimestamp(),
    updatedBy: actorEmail.trim().toLowerCase(),
  });
}

export async function saveAnnouncementsData(
  data: HouseholdAnnouncementsDoc,
  actorEmail: string
): Promise<void> {
  await setDoc(doc(db, 'home_and_garden', 'announcements'), {
    ...data,
    updatedAt: serverTimestamp(),
    updatedBy: actorEmail.trim().toLowerCase(),
  });
}

export async function saveGoalsList(items: GoalItem[], actorEmail: string): Promise<void> {
  await setDoc(doc(db, 'home_and_garden', 'goals'), {
    items,
    updatedAt: serverTimestamp(),
    updatedBy: actorEmail.trim().toLowerCase(),
  });
}

export async function saveGiftSections(sections: GiftSection[], actorEmail: string): Promise<void> {
  await setDoc(doc(db, 'home_and_garden', 'gifts'), {
    sections,
    updatedAt: serverTimestamp(),
    updatedBy: actorEmail.trim().toLowerCase(),
  });
}

export async function saveParentGiftBought(
  bought: Record<string, string>,
  actorEmail: string
): Promise<void> {
  await setDoc(doc(db, 'home_and_garden_parents', 'gift_bought'), {
    bought,
    updatedAt: serverTimestamp(),
    updatedBy: actorEmail.trim().toLowerCase(),
  });
}

export async function saveKidPins(
  pins: Record<string, string>,
  actorEmail: string
): Promise<void> {
  await setDoc(doc(db, 'home_and_garden_parents', 'kid_pins'), {
    pins,
    updatedAt: serverTimestamp(),
    updatedBy: actorEmail.trim().toLowerCase(),
  });
}

export async function saveCalendarData(data: FamilyCalendarDoc, actorEmail: string): Promise<void> {
  await setDoc(doc(db, 'home_and_garden', 'calendar'), {
    ...data,
    updatedAt: serverTimestamp(),
    updatedBy: actorEmail.trim().toLowerCase(),
  });
}

export async function saveChatRooms(rooms: ChatRoom[], actorEmail: string): Promise<void> {
  await setDoc(doc(db, 'home_and_garden', 'chats'), {
    rooms,
    updatedAt: serverTimestamp(),
    updatedBy: actorEmail.trim().toLowerCase(),
  });
}

export async function sendFamilyChatMessage(
  chatId: string,
  sender: string,
  text: string,
  actorEmail: string
): Promise<void> {
  const clean = text.trim().slice(0, 1000);
  if (!clean) return;
  await addDoc(collection(db, 'home_and_garden', 'chats', 'messages'), {
    chatId,
    sender,
    text: clean,
    ts: new Date().toISOString(),
    createdAt: serverTimestamp(),
    updatedBy: actorEmail.trim().toLowerCase(),
  });
}

export interface PublicGiftClaim {
  giftId: string;
  claimed: boolean;
  claimedBy: string;
}

export function subscribePublicWishList(
  cb: (sections: GiftSection[]) => void,
  onError?: (err: Error) => void
): Unsubscribe {
  return onSnapshot(
    doc(db, 'public_gifts', 'family_wishlist'),
    (snap) => {
      if (!snap.exists()) return cb([]);
      const d = snap.data() as { sections?: GiftSection[] };
      cb(Array.isArray(d.sections) ? d.sections : []);
    },
    (err) => onError?.(err)
  );
}

export function subscribePublicGiftClaims(
  cb: (claims: Record<string, PublicGiftClaim>) => void,
  onError?: (err: Error) => void
): Unsubscribe {
  return onSnapshot(
    collection(db, 'public_gifts_claims'),
    (snap) => {
      const map: Record<string, PublicGiftClaim> = {};
      snap.forEach((d) => {
        const data = d.data() as { claimed?: boolean; claimedBy?: string };
        map[d.id] = {
          giftId: d.id,
          claimed: Boolean(data.claimed),
          claimedBy: data.claimedBy || '',
        };
      });
      cb(map);
    },
    (err) => onError?.(err)
  );
}

export async function publishPublicWishList(
  sections: GiftSection[],
  actorEmail: string
): Promise<void> {
  const email = (actorEmail || auth.currentUser?.email || '').trim().toLowerCase();
  const sanitized = sections.map((s) => ({
    person: s.person,
    title: s.title,
    items: s.items.map((it) => ({
      id: it.id.toLowerCase().replace(/[^a-z0-9_-]/g, '_'),
      idea: it.idea,
      link: it.link || '',
      price: it.price || '',
      priority: it.priority || '',
      occasion: it.occasion || '',
    })),
  }));
  await setDoc(doc(db, 'public_gifts', 'family_wishlist'), {
    sections: sanitized,
    updatedAt: serverTimestamp(),
    updatedBy: email,
  });
}

export async function unpublishPublicWishList(): Promise<void> {
  await deleteDoc(doc(db, 'public_gifts', 'family_wishlist'));
}

export async function togglePublicGiftClaim(
  giftId: string,
  claimed: boolean,
  claimedBy: string
): Promise<void> {
  const cleanId = giftId.toLowerCase().replace(/[^a-z0-9_-]/g, '_').slice(0, 64);
  await setDoc(doc(db, 'public_gifts_claims', cleanId), {
    claimed,
    claimedBy: claimed ? claimedBy.trim().slice(0, 60) : '',
    updatedAt: serverTimestamp(),
  });
}

export async function deleteChatMessage(messageId: string): Promise<void> {
  await deleteDoc(doc(db, 'home_and_garden', 'chats', 'messages', messageId));
}

export async function importFamilyHubBundle(
  bundle: FamilyHubBundle,
  actorEmail: string
): Promise<{ counts: Record<string, number> }> {
  const user = auth.currentUser;
  if (!user || !user.email) {
    throw new Error('Not signed in to Firebase Auth. Please refresh and sign in as amarette83@gmail.com.');
  }
  await user.getIdToken(true);

  const email = (actorEmail || user.email).trim().toLowerCase();
  const hg = bundle.homeAndGarden;
  const sanitize = <T,>(val: T): T => JSON.parse(JSON.stringify(val ?? null)) as T;

  const writeStep = async (
    label: string,
    path: string[],
    payload: Record<string, unknown>,
    merge = false
  ): Promise<void> => {
    try {
      const cleanPayload = sanitize(payload);
      await setDoc(
        doc(db, path[0], ...path.slice(1)),
        {
          ...cleanPayload,
          updatedAt: serverTimestamp(),
          updatedBy: email,
        },
        merge ? { merge: true } : {}
      );
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      throw new Error(`Import step "${label}" failed (${user.email}): ${msg}`);
    }
  };

  await writeStep('home_and_garden/chores', ['home_and_garden', 'chores'], {
    weekOf: hg.chores?.weekOf || '',
    items: hg.chores?.items || [],
  });
  await writeStep('home_and_garden/grocery', ['home_and_garden', 'grocery'], {
    items: hg.grocery?.items || [],
  });
  await writeStep('home_and_garden/meals', ['home_and_garden', 'meals'], {
    weekOf: hg.meals?.weekOf || '',
    week: hg.meals?.week || [],
    anchors: hg.meals?.anchors || [],
    picks: hg.meals?.picks || [],
  });
  await writeStep('home_and_garden/recipes', ['home_and_garden', 'recipes'], {
    items: hg.recipes?.items || [],
  });
  await writeStep('home_and_garden/pantry', ['home_and_garden', 'pantry'], {
    items: hg.pantry?.items || [],
    dietaryProfiles: hg.pantry?.dietaryProfiles || [],
  });
  await writeStep('home_and_garden/announcements', ['home_and_garden', 'announcements'], {
    announcements: hg.announcements?.announcements || [],
    info: hg.announcements?.info || [],
    rules: hg.announcements?.rules || [],
    contacts: hg.announcements?.contacts || [],
  });
  await writeStep('home_and_garden/goals', ['home_and_garden', 'goals'], {
    items: hg.goals?.items || [],
  });
  await writeStep('home_and_garden/gifts', ['home_and_garden', 'gifts'], {
    sections: hg.gifts?.sections || [],
  });
  await writeStep('home_and_garden/links', ['home_and_garden', 'links'], {
    groups: hg.links?.groups || [],
  });
  await writeStep('home_and_garden/calendar', ['home_and_garden', 'calendar'], {
    events: hg.calendar?.events || [],
    reminders: hg.calendar?.reminders || [],
    prestonDue: hg.calendar?.prestonDue || [],
    ccccCalendar: hg.calendar?.ccccCalendar || [],
  });
  await writeStep('home_and_garden/chats', ['home_and_garden', 'chats'], {
    rooms: hg.chats?.rooms || [],
  });
  await writeStep('home_and_garden_parents/gift_bought', ['home_and_garden_parents', 'gift_bought'], {
    bought: bundle.homeAndGardenParents?.giftBought || {},
  });

  // Merge on deterministic message IDs so any previously written createdAt stays untouched
  const msgs = hg.chats?.messages || [];
  for (let i = 0; i < msgs.length; i++) {
    const m = msgs[i];
    await writeStep(
      `home_and_garden/chats/messages/imp_${i + 1}`,
      ['home_and_garden', 'chats', 'messages', `imp_${i + 1}`],
      {
        chatId: m.chatId,
        sender: m.sender,
        text: m.text,
        ts: m.ts,
      },
      true
    );
  }

  await importHealthBundle(bundle, email);

  return {
    counts: {
      chores: hg.chores?.items?.length || 0,
      grocery: hg.grocery?.items?.length || 0,
      recipes: hg.recipes?.items?.length || 0,
      pantry: hg.pantry?.items?.length || 0,
      events: hg.calendar?.events?.length || 0,
      messages: msgs.length,
      healthDays: bundle.privateHealthOwner?.healthFitnessDays?.days?.length || 0,
    },
  };
}
