import { useMemo, useState } from 'react';
import {
  DAYS_OF_WEEK,
  FAMILY_CALENDAR_COLORS,
  FAMILY_PEOPLE,
  getWeekDates,
  isChoreDueOnDate,
  isoDateLocal,
  todayDayKey,
  type AnnouncementItem,
  type CalendarEventItem,
  type ChoreItem,
  type FamilyCalendarDoc,
  type FamilyPersonProfile,
} from '../../services/familyHubService';
import { PersonChip, PersonIcon, speakText } from './PersonBadge';

interface FamilyHomeTabProps {
  activePerson: FamilyPersonProfile;
  isParentActor: boolean;
  readOnly: boolean;
  viewAs: string;
  speakEnabled: boolean;
  chores: ChoreItem[];
  announcements: AnnouncementItem[];
  calendarData: FamilyCalendarDoc;
  onToggleSpeak: () => void;
  onSelectViewAs: (kidName: string) => void;
  onToggleChore: (choreId: string) => Promise<void>;
  onPostAnnouncement: (text: string, forWho: string) => Promise<void>;
  onSaveCalendarEvents: (events: CalendarEventItem[]) => Promise<void>;
  onNavigateTab: (tab: string) => void;
}

type CalViewMode = 'week' | 'month' | 'list';

function formatEventTime(ev: CalendarEventItem): string {
  if (ev.allDay || ev.start.length <= 10) return 'All day';
  const dt = new Date(ev.start);
  if (Number.isNaN(dt.getTime())) return ev.start;
  return dt.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
}

function eventDateKey(ev: CalendarEventItem): string {
  return ev.start.slice(0, 10);
}

export function FamilyHomeTab({
  activePerson,
  isParentActor,
  readOnly,
  viewAs,
  speakEnabled,
  chores,
  announcements,
  calendarData,
  onToggleSpeak,
  onSelectViewAs,
  onToggleChore,
  onPostAnnouncement,
  onSaveCalendarEvents,
  onNavigateTab,
}: FamilyHomeTabProps) {
  const canEdit = !readOnly && !viewAs;
  const isParentView = activePerson.mode === 'parent';
  const todayKey = isoDateLocal();
  const todayDay = todayDayKey();

  // Announcements state
  const [annText, setAnnText] = useState('');
  const [annForWho, setAnnForWho] = useState('Everyone');
  const [postingAnn, setPostingAnn] = useState(false);

  // Calendar state
  const [calView, setCalView] = useState<CalViewMode>('week');
  const [calAnchor, setCalAnchor] = useState<Date>(() => new Date());
  const [showRoutineChores, setShowRoutineChores] = useState(false);
  const [filterPerson, setFilterPerson] = useState<string>('');
  const [selectedEvent, setSelectedEvent] = useState<CalendarEventItem | null>(null);
  const [addingEvent, setAddingEvent] = useState(false);
  const [newEvTitle, setNewEvTitle] = useState('');
  const [newEvDate, setNewEvDate] = useState(todayKey);
  const [newEvTime, setNewEvTime] = useState('');
  const [newEvPerson, setNewEvPerson] = useState('');
  const [newEvPlace, setNewEvPlace] = useState('');
  const [newEvNotes, setNewEvNotes] = useState('');

  // Kid calm-dismiss local state for Chase
  const [chaseMorningDismissed, setChaseMorningDismissed] = useState(() => {
    try {
      return localStorage.getItem('hg_chase_ack') === todayKey;
    } catch {
      return false;
    }
  });

  // Today's chores stats per person
  const familyProgress = useMemo(() => {
    return FAMILY_PEOPLE.map((p) => {
      const mineDue = chores.filter(
        (c) => (c.person === p.name || c.person === 'Everyone') && isChoreDueOnDate(c, todayDay, todayKey)
      );
      const doneCount = mineDue.filter((c) => c.checked[todayDay]).length;
      return { profile: p, total: mineDue.length, done: doneCount };
    });
  }, [chores, todayDay, todayKey]);

  const myTodayChores = useMemo(
    () =>
      chores.filter(
        (c) =>
          (c.person === activePerson.name || c.person === 'Everyone') &&
          isChoreDueOnDate(c, todayDay, todayKey)
      ),
    [chores, activePerson.name, todayDay, todayKey]
  );

  // Filtered calendar events
  const visibleEvents = useMemo(() => {
    return (calendarData.events || [])
      .filter((e) => (showRoutineChores ? true : !e.routine))
      .filter((e) => (!filterPerson ? true : e.person === filterPerson || !e.person))
      .sort((a, b) => a.start.localeCompare(b.start));
  }, [calendarData.events, showRoutineChores, filterPerson]);

  const upcomingEvents = useMemo(
    () => visibleEvents.filter((e) => eventDateKey(e) >= todayKey).slice(0, 4),
    [visibleEvents, todayKey]
  );

  const weekDates = useMemo(() => getWeekDates(calAnchor), [calAnchor]);

  async function handleAddAnnouncement() {
    if (!canEdit || !isParentView || !annText.trim()) return;
    setPostingAnn(true);
    try {
      await onPostAnnouncement(annText.trim(), annForWho);
      setAnnText('');
    } finally {
      setPostingAnn(false);
    }
  }

  async function handleAddCalendarEvent() {
    if (!canEdit || !isParentView || !newEvTitle.trim() || !newEvDate) return;
    const isAllDay = !newEvTime.trim();
    const start = isAllDay ? newEvDate : `${newEvDate}T${newEvTime}:00`;
    const ev: CalendarEventItem = {
      id: `loc_${Date.now().toString(36)}`,
      title: newEvTitle.trim(),
      start,
      end: start,
      allDay: isAllDay,
      person: newEvPerson,
      location: newEvPlace.trim(),
      notes: newEvNotes.trim(),
      routine: false,
    };
    await onSaveCalendarEvents([...(calendarData.events || []), ev]);
    setNewEvTitle('');
    setNewEvPlace('');
    setNewEvNotes('');
    setAddingEvent(false);
  }

  async function handleDeleteCalendarEvent(evId: string) {
    if (!canEdit || !isParentView) return;
    await onSaveCalendarEvents((calendarData.events || []).filter((e) => e.id !== evId));
    setSelectedEvent(null);
  }

  // Little Kid Home (Oliver & Liam)
  if (activePerson.mode === 'little') {
    const done = myTodayChores.filter((c) => c.checked[todayDay]).length;
    return (
      <div className="space-y-4">
        <div
          className="p-5 rounded-3xl border-2 border-[#74c69d] text-center space-y-2 shadow-sm"
          style={{ backgroundColor: activePerson.color, color: activePerson.ink }}
        >
          <div className="flex justify-center">
            <PersonIcon person={activePerson} size="lg" />
          </div>
          <h2 className="font-atlas text-2xl font-bold">Hi {activePerson.name}!</h2>
          <p className="text-sm font-medium">
            {done} of {myTodayChores.length} jobs done today ⭐
          </p>
          <div className="flex flex-wrap justify-center gap-2 pt-1">
            <button
              onClick={onToggleSpeak}
              className="px-4 py-2 rounded-full bg-white/85 text-[#1b4332] font-bold text-xs cursor-pointer shadow-sm"
            >
              {speakEnabled ? '🔊 Talking On' : '🔇 Talking Off'}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => {
              speakText('My jobs', speakEnabled);
              onNavigateTab('chores');
            }}
            className="p-5 rounded-2xl bg-white border-2 border-[#74c69d] shadow hover:shadow-md text-center space-y-1 cursor-pointer"
          >
            <div className="text-3xl">🧹</div>
            <div className="font-bold text-base text-[#1b4332]">My Jobs</div>
          </button>
          <button
            onClick={() => {
              speakText('School', speakEnabled);
              onNavigateTab('school');
            }}
            className="p-5 rounded-2xl bg-white border-2 border-[#93c5fd] shadow hover:shadow-md text-center space-y-1 cursor-pointer"
          >
            <div className="text-3xl">🏫</div>
            <div className="font-bold text-base text-[#1e3a8a]">School</div>
          </button>
          <button
            onClick={() => {
              speakText('Wish list', speakEnabled);
              onNavigateTab('gifts');
            }}
            className="p-5 rounded-2xl bg-white border-2 border-[#fbcfe8] shadow hover:shadow-md text-center space-y-1 cursor-pointer"
          >
            <div className="text-3xl">🎁</div>
            <div className="font-bold text-base text-[#831843]">Wish List</div>
          </button>
          <button
            onClick={() => {
              speakText('Fun games', speakEnabled);
              onNavigateTab('links');
            }}
            className="p-5 rounded-2xl bg-white border-2 border-[#fde68a] shadow hover:shadow-md text-center space-y-1 cursor-pointer"
          >
            <div className="text-3xl">🌟</div>
            <div className="font-bold text-base text-[#78350f]">Fun &amp; Games</div>
          </button>
        </div>

        {myTodayChores.length > 0 && (
          <div className="p-4 rounded-2xl bg-white border-2 border-[#74c69d] space-y-2">
            <div className="font-bold text-base text-[#1b4332]">Today’s Checklist</div>
            {myTodayChores.map((c) => {
              const isDone = c.checked[todayDay];
              return (
                <div
                  key={c.id}
                  className="flex items-center gap-3 p-3 rounded-xl bg-[#f4fbf6] border border-[#dcefe2]"
                >
                  <button
                    disabled={!canEdit}
                    onClick={() => void onToggleChore(c.id)}
                    className={`w-9 h-9 rounded-full border-2 font-bold text-lg shrink-0 flex items-center justify-center cursor-pointer disabled:opacity-60 ${
                      isDone
                        ? 'bg-[#2d6a4f] border-[#1b4332] text-white'
                        : 'bg-white border-[#74c69d] text-transparent'
                    }`}
                  >
                    ✔
                  </button>
                  <span className={`text-base font-medium flex-1 ${isDone ? 'line-through text-[#52796f]' : ''}`}>
                    {c.chore}
                  </span>
                  <button
                    onClick={() => speakText(c.chore, true)}
                    className="px-2.5 py-1.5 rounded-lg bg-[#e9f5ec] text-base cursor-pointer"
                    aria-label="Read aloud"
                  >
                    🔊
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  // Hour-based calm tip for Amarette's Corner
  const hour = new Date().getHours();
  const amaretteTip =
    hour < 11
      ? 'Morning drop-off window (~9 AM): tackle one bigger priority task while focus is freshest.'
      : hour < 15
        ? 'Midday buffer before 2:10 PM pickup: lighter tasks, hydration, and a quiet 15-minute reset.'
        : 'Protected evening rhythm: one step at a time, family dinner, and wind down gently.';

  return (
    <div className="space-y-4">
      {/* Greeting Hero & Family Today */}
      <div className="p-4 rounded-2xl bg-white border border-[#95d5b2] shadow-sm space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h2 className="font-atlas text-xl font-bold text-[#1b4332]">
              {activePerson.emoji} Hi {activePerson.name}!
            </h2>
            <p className="text-xs text-[#40916c]">
              {new Date().toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' })} · One
              thing at a time.
            </p>
          </div>
          <div className="flex items-center gap-1.5 overflow-x-auto py-0.5">
            {FAMILY_PEOPLE.map((p) => (
              <span key={p.name} title={p.name}>
                <PersonIcon person={p} size="md" />
              </span>
            ))}
          </div>
        </div>

        {/* Family Today strip */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {familyProgress.map(({ profile, done, total }) => (
            <div
              key={profile.name}
              className="px-2.5 py-1.5 rounded-xl border border-black/10 shrink-0 text-xs flex items-center gap-1.5"
              style={{ backgroundColor: profile.color, color: profile.ink }}
            >
              <PersonIcon person={profile} size="sm" />
              <span className="font-bold">{profile.name}</span>
              <span className="opacity-85">
                {done}/{total}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Personalized Kid Cards */}
      {activePerson.name === 'Preston' && (
        <div className="p-4 rounded-2xl bg-[#f5f3ff] border border-[#c4b5fd] space-y-3">
          <div className="font-bold text-sm text-[#4c1d95]">💻 Preston · My Week (Quiet View)</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-white border border-[#ddd6fe] space-y-1">
              <div className="font-bold text-[#5b21b6]">📚 Due This Week</div>
              {(calendarData.prestonDue || [])
                .filter((d) => !/^class/i.test(d.type))
                .map((d, idx) => (
                  <div key={idx} className="text-[#374151]">
                    <strong>{d.day}:</strong> {d.cls} — {d.what}
                    {d.note ? <span className="text-[#6b7280]"> ({d.note})</span> : null}
                  </div>
                ))}
            </div>
            <div className="p-3 rounded-xl bg-white border border-[#ddd6fe] space-y-1">
              <div className="font-bold text-[#5b21b6]">🏫 Upcoming CCCC Dates</div>
              {(calendarData.ccccCalendar || [])
                .filter((c) => (c.end || c.date) >= todayKey)
                .slice(0, 5)
                .map((c, idx) => (
                  <div key={idx} className="text-[#374151]">
                    <strong>{c.date.slice(5)}:</strong> {c.text}
                  </div>
                ))}
            </div>
          </div>
          <div className="text-[11px] text-[#5b21b6]">
            💡 Light chore day noted: Wednesday (busiest CCCC schedule).
          </div>
        </div>
      )}

      {activePerson.name === 'Chase' && (
        <div className="p-4 rounded-2xl bg-[#f0fdfa] border border-[#99f6e4] space-y-2">
          <div className="flex items-center justify-between gap-2">
            <span className="font-bold text-sm text-[#115e59]">🐱 Chase · Morning Check-In</span>
            {!chaseMorningDismissed && (
              <button
                onClick={() => {
                  try {
                    localStorage.setItem('hg_chase_ack', todayKey);
                  } catch {
                    // ignore
                  }
                  setChaseMorningDismissed(true);
                }}
                className="px-2.5 py-1 rounded-lg bg-[#14b8a6] text-white text-xs font-bold cursor-pointer"
              >
                Got it ✔
              </button>
            )}
          </div>
          {!chaseMorningDismissed ? (
            <div className="text-xs text-[#134e4a] space-y-1">
              {myTodayChores.map((c) => (
                <div key={c.id}>
                  • {c.chore} {c.time ? `(${c.time})` : ''}
                </div>
              ))}
              {announcements.slice(0, 2).map((a) => (
                <div key={a.id} className="text-[#0f766e]">
                  📌 Announcement ({a.date}): {a.text}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-xs text-[#0f766e]">Morning check-in acknowledged for today.</div>
          )}
        </div>
      )}

      {activePerson.name === 'Gabe' && (
        <div className="p-4 rounded-2xl bg-[#f3f4f6] border border-[#9ca3af] space-y-2">
          <div className="font-bold text-sm text-[#1f2937]">🐉 Gabe · Today’s Short List (Calm Mode)</div>
          {myTodayChores[0] ? (
            <div className="p-2.5 rounded-xl bg-white border border-[#d1d5db] text-xs space-y-1">
              <div className="font-bold text-[#111827]">Do this first: {myTodayChores[0].chore}</div>
              {myTodayChores[0].steps && (
                <div className="text-[#4b5563]">First small step: {myTodayChores[0].steps.split('→')[0]}</div>
              )}
            </div>
          ) : (
            <div className="text-xs text-[#4b5563]">Nothing on your list today. That is okay.</div>
          )}
          <div className="text-xs text-[#374151]">
            <strong>No surprises (Next 24h):</strong>{' '}
            {upcomingEvents.length
              ? upcomingEvents
                  .slice(0, 2)
                  .map((e) => `${e.title} (${formatEventTime(e)})`)
                  .join(' · ')
              : 'Quiet day ahead.'}
          </div>
        </div>
      )}

      {/* Amarette's Corner (zero health/medical buttons — those moved cleanly to School of Health!) */}
      {activePerson.name === 'Amarette' && (
        <div className="p-4 rounded-2xl bg-[#fff7ed] border border-[#fed7aa] space-y-2">
          <div className="font-atlas font-bold text-sm text-[#7c2d12]">🐔 My Corner</div>
          <p className="text-xs text-[#9a3412]">{amaretteTip}</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[#7c2d12]">
            <details className="p-2 rounded-lg bg-white/80 border border-[#fdba74]">
              <summary className="font-bold cursor-pointer">🫂 If I’m overloaded</summary>
              <p className="mt-1 text-[11px] leading-relaxed">
                Quiet, dark, comfy spot. Blanket and teddy bear. One task at a time; everything else
                can wait. Ask Ray or a kid to take the next thing.
              </p>
            </details>
            <details className="p-2 rounded-lg bg-white/80 border border-[#fdba74]">
              <summary className="font-bold cursor-pointer">💎 Just for me</summary>
              <p className="mt-1 text-[11px] leading-relaxed">
                Rockhounding, cutting rocks, tending the chickens. A midday 15 minutes counts. Health &amp;
                Oura tools now live privately inside School of Health on Campus.
              </p>
            </details>
          </div>
        </div>
      )}

      {/* Coming Up + Announcements Side by Side */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-[#95d5b2] space-y-2">
          <div className="font-bold text-sm text-[#1b4332]">📅 Coming Up</div>
          {!upcomingEvents.length ? (
            <p className="text-xs text-[#52796f]">No upcoming Family Calendar events loaded yet.</p>
          ) : (
            <div className="space-y-1.5">
              {upcomingEvents.map((ev) => (
                <button
                  key={ev.id}
                  onClick={() => setSelectedEvent(ev)}
                  className="w-full text-left p-2 rounded-xl border border-[#dcefe2] hover:bg-[#f4fbf6] text-xs flex items-center justify-between gap-2 cursor-pointer"
                >
                  <div className="min-w-0">
                    <div className="font-bold text-[#1b4332] truncate">{ev.title}</div>
                    <div className="text-[11px] text-[#40916c]">
                      {eventDateKey(ev)} · {formatEventTime(ev)}
                    </div>
                  </div>
                  {ev.person && (
                    <span
                      className="px-2 py-0.5 rounded-full text-[10px] font-bold shrink-0"
                      style={{ backgroundColor: FAMILY_CALENDAR_COLORS[ev.person] || '#eee' }}
                    >
                      {ev.person}
                    </span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="p-4 rounded-2xl bg-white border border-[#95d5b2] space-y-2">
          <div className="font-bold text-sm text-[#1b4332]">📌 Announcements</div>
          <div className="space-y-1.5 max-h-48 overflow-y-auto">
            {!announcements.length ? (
              <p className="text-xs text-[#52796f]">No announcements yet.</p>
            ) : (
              announcements.slice(0, 6).map((a) => (
                <div key={a.id} className="p-2 rounded-xl bg-[#f4fbf6] border border-[#dcefe2] text-xs">
                  <div className="text-[#1b4332]">{a.text}</div>
                  <div className="text-[10px] text-[#52796f] mt-0.5">
                    For {a.forWho || 'Everyone'} · {a.date} {a.by ? `· by ${a.by}` : ''}
                  </div>
                </div>
              ))
            )}
          </div>
          {canEdit && isParentView && (
            <details className="pt-1">
              <summary className="text-xs font-bold text-[#2d6a4f] cursor-pointer">
                ✍️ Post an announcement
              </summary>
              <div className="mt-2 space-y-1.5">
                <textarea
                  rows={2}
                  value={annText}
                  onChange={(e) => setAnnText(e.target.value)}
                  placeholder="Calm, clear family message..."
                  className="w-full px-2.5 py-1.5 rounded-lg border border-[#95d5b2] text-xs"
                />
                <div className="flex gap-2">
                  <select
                    value={annForWho}
                    onChange={(e) => setAnnForWho(e.target.value)}
                    className="px-2 py-1 rounded-lg border border-[#95d5b2] text-xs"
                  >
                    <option value="Everyone">Everyone</option>
                    {FAMILY_PEOPLE.map((p) => (
                      <option key={p.name} value={p.name}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                  <button
                    disabled={postingAnn || !annText.trim()}
                    onClick={() => void handleAddAnnouncement()}
                    className="px-3 py-1 rounded-lg bg-[#2d6a4f] text-white text-xs font-bold cursor-pointer disabled:opacity-50"
                  >
                    {postingAnn ? 'Posting…' : 'Post'}
                  </button>
                </div>
              </div>
            </details>
          )}
        </div>
      </div>

      {/* Full Family Calendar Card */}
      <div className="p-4 rounded-2xl bg-white border border-[#95d5b2] space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="font-bold text-sm text-[#1b4332]">🗓️ Family Calendar</div>
          <div className="flex flex-wrap items-center gap-1.5">
            {(['week', 'month', 'list'] as CalViewMode[]).map((m) => (
              <button
                key={m}
                onClick={() => setCalView(m)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold cursor-pointer border capitalize ${
                  calView === m
                    ? 'bg-[#2d6a4f] text-white border-[#1b4332]'
                    : 'bg-[#f4fbf6] text-[#1b4332] border-[#b7d8c2]'
                }`}
              >
                {m}
              </button>
            ))}
            {canEdit && isParentView && (
              <button
                onClick={() => setAddingEvent((v) => !v)}
                className="px-2.5 py-1 rounded-lg bg-[#fbbf24] text-[#451a03] text-xs font-bold cursor-pointer"
              >
                ＋ Add Event
              </button>
            )}
          </div>
        </div>

        {/* Navigation + Filters */}
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-1">
            <button
              onClick={() =>
                setCalAnchor(
                  (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate() - (calView === 'month' ? 28 : 7))
                )
              }
              className="px-2.5 py-1 rounded bg-[#edf6f0] font-bold cursor-pointer"
            >
              ‹
            </button>
            <button
              onClick={() => setCalAnchor(new Date())}
              className="px-2.5 py-1 rounded bg-[#edf6f0] font-bold cursor-pointer"
            >
              Today
            </button>
            <button
              onClick={() =>
                setCalAnchor(
                  (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + (calView === 'month' ? 28 : 7))
                )
              }
              className="px-2.5 py-1 rounded bg-[#edf6f0] font-bold cursor-pointer"
            >
              ›
            </button>
            <span className="ml-2 font-bold text-[#1b4332]">
              {calAnchor.toLocaleDateString([], { month: 'long', year: 'numeric' })}
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-1.5">
            <select
              value={filterPerson}
              onChange={(e) => setFilterPerson(e.target.value)}
              className="px-2 py-1 rounded border border-[#b7d8c2] text-xs bg-white"
            >
              <option value="">All family members</option>
              {FAMILY_PEOPLE.map((p) => (
                <option key={p.name} value={p.name}>
                  {p.emoji} {p.name}
                </option>
              ))}
            </select>
            <label className="inline-flex items-center gap-1 text-[11px] text-[#2d6a4f] cursor-pointer">
              <input
                type="checkbox"
                checked={showRoutineChores}
                onChange={(e) => setShowRoutineChores(e.target.checked)}
                className="accent-[#2d6a4f]"
              />
              Show chore reminders
            </label>
          </div>
        </div>

        {/* Parent Add Event Form */}
        {addingEvent && canEdit && isParentView && (
          <div className="p-3 rounded-xl bg-[#f4fbf6] border border-[#74c69d] space-y-2 text-xs">
            <div className="font-bold text-[#1b4332]">Add Family Calendar Event</div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <input
                type="text"
                value={newEvTitle}
                onChange={(e) => setNewEvTitle(e.target.value)}
                placeholder="Event title"
                className="px-2.5 py-1.5 rounded border border-[#95d5b2] bg-white"
              />
              <input
                type="date"
                value={newEvDate}
                onChange={(e) => setNewEvDate(e.target.value)}
                className="px-2.5 py-1.5 rounded border border-[#95d5b2] bg-white"
              />
              <input
                type="time"
                value={newEvTime}
                onChange={(e) => setNewEvTime(e.target.value)}
                className="px-2.5 py-1.5 rounded border border-[#95d5b2] bg-white"
              />
              <select
                value={newEvPerson}
                onChange={(e) => setNewEvPerson(e.target.value)}
                className="px-2.5 py-1.5 rounded border border-[#95d5b2] bg-white"
              >
                <option value="">🏡 Whole Family</option>
                {FAMILY_PEOPLE.map((p) => (
                  <option key={p.name} value={p.name}>
                    {p.emoji} {p.name}
                  </option>
                ))}
              </select>
              <input
                type="text"
                value={newEvPlace}
                onChange={(e) => setNewEvPlace(e.target.value)}
                placeholder="Location (optional)"
                className="px-2.5 py-1.5 rounded border border-[#95d5b2] bg-white"
              />
              <input
                type="text"
                value={newEvNotes}
                onChange={(e) => setNewEvNotes(e.target.value)}
                placeholder="Notes (optional)"
                className="px-2.5 py-1.5 rounded border border-[#95d5b2] bg-white"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => void handleAddCalendarEvent()}
                className="px-3 py-1.5 rounded-lg bg-[#2d6a4f] text-white font-bold cursor-pointer"
              >
                Save Event
              </button>
              <button
                onClick={() => setAddingEvent(false)}
                className="px-3 py-1.5 rounded-lg bg-white border border-[#95d5b2] cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Calendar Grid / List */}
        {calView === 'week' && (
          <div className="grid grid-cols-1 sm:grid-cols-7 gap-2">
            {weekDates.map(({ day, dateKey }) => {
              const dayEvents = visibleEvents.filter((e) => eventDateKey(e) === dateKey);
              const isToday = dateKey === todayKey;
              return (
                <div
                  key={dateKey}
                  className={`p-2 rounded-xl border min-h-[110px] space-y-1 ${
                    isToday ? 'bg-[#e9f5ec] border-[#2d6a4f]' : 'bg-[#fbfdfb] border-[#dcefe2]'
                  }`}
                >
                  <div className="text-[11px] font-bold text-[#1b4332] flex justify-between">
                    <span>{day}</span>
                    <span>{dateKey.slice(8)}</span>
                  </div>
                  {dayEvents.map((e) => (
                    <button
                      key={e.id}
                      onClick={() => setSelectedEvent(e)}
                      className="w-full text-left px-1.5 py-1 rounded text-[10px] font-semibold truncate block cursor-pointer"
                      style={{ backgroundColor: FAMILY_CALENDAR_COLORS[e.person] || '#F3E5B5' }}
                    >
                      {e.allDay ? '' : `${formatEventTime(e)} `}
                      {e.title}
                    </button>
                  ))}
                </div>
              );
            })}
          </div>
        )}

        {calView === 'list' && (
          <div className="space-y-1.5 max-h-64 overflow-y-auto">
            {visibleEvents.filter((e) => e.start.slice(0, 10) >= isoDateLocal(calAnchor)).slice(0, 25).map((e) => (
              <button
                key={e.id}
                onClick={() => setSelectedEvent(e)}
                className="w-full text-left p-2 rounded-xl border border-[#dcefe2] hover:bg-[#f4fbf6] text-xs flex items-center justify-between gap-2 cursor-pointer"
              >
                <div>
                  <span className="font-bold text-[#1b4332]">{eventDateKey(e)}</span> ·{' '}
                  <span className="text-[#40916c]">{formatEventTime(e)}</span> — {e.title}
                </div>
                {e.person && (
                  <span
                    className="px-2 py-0.5 rounded-full text-[10px] font-bold"
                    style={{ backgroundColor: FAMILY_CALENDAR_COLORS[e.person] || '#eee' }}
                  >
                    {e.person}
                  </span>
                )}
              </button>
            ))}
          </div>
        )}

        {calView === 'month' && (() => {
          const y = calAnchor.getFullYear();
          const m = calAnchor.getMonth();
          const first = new Date(y, m, 1);
          const startPad = (first.getDay() + 6) % 7;
          const daysInMonth = new Date(y, m + 1, 0).getDate();
          const cells: Array<string | null> = [];
          for (let i = 0; i < startPad; i++) cells.push(null);
          for (let d = 1; d <= daysInMonth; d++) {
            cells.push(`${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`);
          }
          return (
            <div className="grid grid-cols-7 gap-1 text-[10px]">
              {DAYS_OF_WEEK.map((d) => (
                <div key={d} className="text-center font-bold text-[#40916c] py-0.5">
                  {d}
                </div>
              ))}
              {cells.map((dk, idx) => {
                if (!dk) return <div key={`pad-${idx}`} className="min-h-[54px]" />;
                const evs = visibleEvents.filter((e) => eventDateKey(e) === dk);
                return (
                  <div
                    key={dk}
                    className={`p-1 rounded border min-h-[54px] space-y-0.5 ${
                      dk === todayKey ? 'bg-[#e9f5ec] border-[#2d6a4f]' : 'bg-[#fbfdfb] border-[#e5efe8]'
                    }`}
                  >
                    <div className="font-bold text-[#1b4332]">{Number(dk.slice(8))}</div>
                    {evs.slice(0, 2).map((e) => (
                      <button
                        key={e.id}
                        onClick={() => setSelectedEvent(e)}
                        className="w-full text-left truncate px-1 rounded text-[9px] font-semibold block cursor-pointer"
                        style={{ backgroundColor: FAMILY_CALENDAR_COLORS[e.person] || '#F3E5B5' }}
                      >
                        {e.title}
                      </button>
                    ))}
                    {evs.length > 2 && <div className="text-[9px] text-[#52796f]">+{evs.length - 2}</div>}
                  </div>
                );
              })}
            </div>
          );
        })()}

        {selectedEvent && (
          <div className="p-3 rounded-xl bg-[#eef7f1] border border-[#52b788] text-xs space-y-1.5">
            <div className="flex items-start justify-between gap-2">
              <div className="font-bold text-[#1b4332] text-sm">{selectedEvent.title}</div>
              <button onClick={() => setSelectedEvent(null)} className="underline cursor-pointer">
                Close
              </button>
            </div>
            <div>
              <strong>When:</strong> {eventDateKey(selectedEvent)} · {formatEventTime(selectedEvent)}
            </div>
            {selectedEvent.location && (
              <div>
                <strong>Where:</strong> {selectedEvent.location}
              </div>
            )}
            {selectedEvent.notes && (
              <div className="text-[#355e47] whitespace-pre-line">{selectedEvent.notes}</div>
            )}
            {canEdit && isParentView && (
              <button
                onClick={() => void handleDeleteCalendarEvent(selectedEvent.id)}
                className="px-2.5 py-1 rounded bg-red-600 text-white text-[11px] font-bold cursor-pointer"
              >
                🗑️ Remove Event
              </button>
            )}
          </div>
        )}
      </div>

      {/* View As (Parents Only) */}
      {isParentActor && !viewAs && (
        <div className="p-4 rounded-2xl bg-white border border-[#95d5b2] space-y-2">
          <div className="font-bold text-sm text-[#1b4332]">👀 View As (Read-Only Kid Preview)</div>
          <p className="text-xs text-[#52796f]">
            See any child’s Home and Garden view exactly as they do (read-only).
          </p>
          <div className="flex flex-wrap gap-2">
            {FAMILY_PEOPLE.filter((p) => p.mode !== 'parent').map((p) => (
              <button
                key={p.name}
                onClick={() => onSelectViewAs(p.name)}
                className="cursor-pointer transition hover:scale-[1.03]"
              >
                <PersonChip person={p} />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
