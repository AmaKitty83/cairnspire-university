import { useState } from 'react';
import {
  DAYS_OF_WEEK,
  FAMILY_PEOPLE,
  isChoreDueOnDate,
  isoDateLocal,
  todayDayKey,
  type ChoreItem,
  type DayKey,
  type FamilyPersonProfile,
} from '../../services/familyHubService';
import { PersonChip, speakText } from './PersonBadge';

interface FamilyChoresTabProps {
  activePerson: FamilyPersonProfile;
  canEdit: boolean;
  speakEnabled: boolean;
  weekOf: string;
  chores: ChoreItem[];
  onToggleChore: (choreId: string, day: DayKey) => Promise<void>;
  onAddChore: (input: {
    person: string;
    chore: string;
    often: string;
    steps: string;
    daysText: string;
    room: string;
    time: string;
  }) => Promise<void>;
  onUpdateChore: (updated: ChoreItem) => Promise<void>;
  onDeleteChore: (choreId: string) => Promise<void>;
  onSendMissionsToChat: (text: string) => Promise<void>;
  onClearWeek: () => Promise<void>;
}

type GroupView = 'today' | 'byDay' | 'byRoom' | 'byPerson';

const DELEGATION_SCRIPTS = [
  {
    group: 'Liam & Oliver (Playful & Concrete)',
    script: 'Hey guys! Let’s beat the 3-minute timer together: first pick up shoes, or clear your spot at the table? You pick which one first!',
  },
  {
    group: 'Chase & Preston (Clear When/Then)',
    script: 'Heads up for today: when you wrap up your afternoon break, please knock out your 15-minute reset chore before gaming/screen time. Thanks!',
  },
  {
    group: 'Gabe (Single Step, Zero Pressure)',
    script: 'Hey Gabe — just one small thing when you have a quiet minute today: start just the very first step of your checklist. That’s plenty.',
  },
];

export function FamilyChoresTab({
  activePerson,
  canEdit,
  speakEnabled,
  weekOf,
  chores,
  onToggleChore,
  onAddChore,
  onUpdateChore,
  onDeleteChore,
  onSendMissionsToChat,
  onClearWeek,
}: FamilyChoresTabProps) {
  const isParent = activePerson.mode === 'parent';
  const isLittle = activePerson.mode === 'little';
  const todayDay = todayDayKey();
  const todayKey = isoDateLocal();

  const [view, setView] = useState<GroupView>('today');
  const [selectedDay, setSelectedDay] = useState<DayKey>(todayDay);
  const [showAdd, setShowAdd] = useState(false);
  const [editingChore, setEditingChore] = useState<ChoreItem | null>(null);
  const [chatSentMsg, setChatSentMsg] = useState<string | null>(null);
  const [newPerson, setNewPerson] = useState('Liam');
  const [newChore, setNewChore] = useState('');
  const [newOften, setNewOften] = useState('Daily');
  const [newSteps, setNewSteps] = useState('');
  const [newDays, setNewDays] = useState('Daily');
  const [newRoom, setNewRoom] = useState('Living Room');
  const [newTime, setNewTime] = useState('');

  function flashChatMsg(msg: string) {
    setChatSentMsg(msg);
    setTimeout(() => setChatSentMsg(null), 2400);
  }

  async function sendTodayMissions() {
    if (!canEdit || !isParent) return;
    const dueKids = FAMILY_PEOPLE.filter((p) => p.mode !== 'parent')
      .map((p) => {
        const remaining = chores
          .filter((c) => c.person === p.name && isChoreDueOnDate(c, todayDay, todayKey) && !c.checked[todayDay])
          .map((c) => c.chore);
        return remaining.length ? `• ${p.emoji} ${p.name}: ${remaining.join(', ')}` : '';
      })
      .filter(Boolean);
    const body = dueKids.length
      ? `📋 Today’s Missions (${todayDay}):\n${dueKids.join('\n')}\nTake one small step at a time!`
      : `🌟 Everyone has finished all today’s chores (${todayDay})! Awesome teamwork!`;
    await onSendMissionsToChat(body);
    flashChatMsg('Sent to Family Chat ✔');
  }

  async function submitNewChore() {
    if (!canEdit || !isParent || !newChore.trim()) return;
    await onAddChore({
      person: newPerson,
      chore: newChore.trim(),
      often: newOften,
      steps: newSteps.trim(),
      daysText: newDays.trim() || 'Daily',
      room: newRoom.trim() || 'Other',
      time: newTime.trim(),
    });
    setNewChore('');
    setNewSteps('');
    setShowAdd(false);
  }

  function ChoreRow({ c, day }: { c: ChoreItem; day: DayKey }) {
    const done = c.checked[day];
    const personObj = FAMILY_PEOPLE.find((p) => p.name === c.person);
    const isEditing = editingChore?.id === c.id;
    return (
      <div className="p-2.5 rounded-xl bg-[#f4fbf6] border border-[#dcefe2] space-y-2">
        <div className="flex items-center gap-3">
          <button
            disabled={!canEdit}
            onClick={() => void onToggleChore(c.id, day)}
            aria-label={`Toggle ${c.chore}`}
            className={`w-7 h-7 rounded-full border-2 font-bold text-sm shrink-0 flex items-center justify-center cursor-pointer disabled:opacity-60 transition ${
              done
                ? 'bg-[#2d6a4f] border-[#1b4332] text-white'
                : 'bg-white border-[#74c69d] text-transparent hover:border-[#2d6a4f]'
            }`}
          >
            ✔
          </button>
          <div className="flex-1 min-w-0">
            <div className={`text-xs font-semibold ${done ? 'line-through text-[#52796f]' : 'text-[#1b4332]'}`}>
              {isParent && personObj && c.person !== activePerson.name && (
                <span className="mr-1.5">
                  <PersonChip person={personObj} />
                </span>
              )}
              {c.chore}
            </div>
            {!isLittle && (c.steps || c.time || c.room) && (
              <div className="text-[11px] text-[#40916c] mt-0.5">
                {[c.room && c.room !== 'Other' ? c.room : '', c.time, c.steps].filter(Boolean).join(' · ')}
              </div>
            )}
          </div>
          {isLittle && (
            <button
              onClick={() => speakText(c.chore, speakEnabled || true)}
              className="px-2 py-1 rounded-lg bg-[#e9f5ec] text-sm cursor-pointer"
            >
              🔊
            </button>
          )}
          {canEdit && isParent && (
            <div className="flex gap-1 shrink-0">
              <button
                onClick={() => setEditingChore(isEditing ? null : { ...c })}
                className="px-1.5 py-1 rounded bg-white border border-[#b7d8c2] text-[10px] font-bold cursor-pointer"
                title="Edit chore"
              >
                ✏️
              </button>
              <button
                onClick={() => {
                  if (confirm(`Delete chore "${c.chore}"?`)) void onDeleteChore(c.id);
                }}
                className="px-1.5 py-1 rounded bg-white border border-red-200 text-red-700 text-[10px] font-bold cursor-pointer"
                title="Delete chore"
              >
                🗑️
              </button>
            </div>
          )}
        </div>

        {isEditing && editingChore && (
          <div className="p-2.5 rounded-lg bg-white border border-[#74c69d] space-y-2 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-1.5">
              <select
                value={editingChore.person}
                onChange={(e) => setEditingChore({ ...editingChore, person: e.target.value })}
                className="px-2 py-1 rounded border border-[#95d5b2]"
              >
                {FAMILY_PEOPLE.map((p) => (
                  <option key={p.name} value={p.name}>
                    {p.name}
                  </option>
                ))}
                <option value="Everyone">Everyone</option>
              </select>
              <input
                type="text"
                value={editingChore.chore}
                onChange={(e) => setEditingChore({ ...editingChore, chore: e.target.value })}
                placeholder="Chore"
                className="px-2 py-1 rounded border border-[#95d5b2]"
              />
              <input
                type="text"
                value={editingChore.daysText}
                onChange={(e) => setEditingChore({ ...editingChore, daysText: e.target.value })}
                placeholder="Days"
                className="px-2 py-1 rounded border border-[#95d5b2]"
              />
              <input
                type="text"
                value={editingChore.room}
                onChange={(e) => setEditingChore({ ...editingChore, room: e.target.value })}
                placeholder="Room"
                className="px-2 py-1 rounded border border-[#95d5b2]"
              />
              <input
                type="text"
                value={editingChore.time}
                onChange={(e) => setEditingChore({ ...editingChore, time: e.target.value })}
                placeholder="Time"
                className="px-2 py-1 rounded border border-[#95d5b2]"
              />
              <input
                type="text"
                value={editingChore.steps}
                onChange={(e) => setEditingChore({ ...editingChore, steps: e.target.value })}
                placeholder="Steps"
                className="px-2 py-1 rounded border border-[#95d5b2]"
              />
            </div>
            <div className="flex gap-1.5">
              <button
                onClick={async () => {
                  await onUpdateChore(editingChore);
                  setEditingChore(null);
                }}
                className="px-2.5 py-1 rounded bg-[#2d6a4f] text-white font-bold cursor-pointer"
              >
                Save
              </button>
              <button
                onClick={() => setEditingChore(null)}
                className="px-2.5 py-1 rounded bg-[#edf6f0] font-bold cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Kid / Teen view: clean personal today list with star celebration
  if (!isParent) {
    const mine = chores.filter(
      (c) => (c.person === activePerson.name || c.person === 'Everyone') && isChoreDueOnDate(c, todayDay, todayKey)
    );
    const doneCount = mine.filter((c) => c.checked[todayDay]).length;
    const allDone = mine.length > 0 && doneCount >= mine.length;
    return (
      <div className="p-4 rounded-2xl bg-white border border-[#95d5b2] space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h2 className="font-atlas text-lg font-bold text-[#1b4332]">
              {isLittle ? '🧹 My Jobs Today' : activePerson.mode === 'gabe' ? '🐉 Today, if you can' : '🧹 Today’s Chores'}
            </h2>
            <p className="text-xs text-[#40916c]">
              {doneCount} of {mine.length} done · One small step is enough.
            </p>
          </div>
          {mine.length > 0 && (
            <div className="text-base tracking-tight">
              {mine.map((_, i) => (i < doneCount ? '⭐' : '☆')).join('')}
            </div>
          )}
        </div>
        {allDone && (
          <div className="p-3 rounded-xl bg-emerald-100 border border-emerald-300 text-xs font-bold text-emerald-950 text-center">
            🎉 Awesome work, {activePerson.name}! Every job for today is done!
          </div>
        )}
        {!mine.length ? (
          <div className="p-4 rounded-xl bg-[#f4fbf6] text-xs text-[#2d6a4f] text-center">
            {activePerson.mode === 'gabe'
              ? 'Nothing on your list today. That is okay.'
              : 'All done or nothing due today! 🎉'}
          </div>
        ) : (
          <div className="space-y-2">
            {mine.map((c) => (
              <ChoreRow key={c.id} c={c} day={todayDay} />
            ))}
          </div>
        )}
      </div>
    );
  }

  // Parent view: Today / By Day / By Room / By Person
  const dayChores = chores.filter((c) => isChoreDueOnDate(c, selectedDay, todayKey));
  const doneToday = chores
    .filter((c) => isChoreDueOnDate(c, todayDay, todayKey))
    .filter((c) => c.checked[todayDay]).length;
  const totalToday = chores.filter((c) => isChoreDueOnDate(c, todayDay, todayKey)).length;

  const grownups = dayChores.filter((c) => c.person === 'Amarette' || c.person === 'Ray');
  const kids = dayChores.filter((c) => c.person !== 'Amarette' && c.person !== 'Ray');

  const rooms = Array.from(new Set(chores.map((c) => c.room || 'Other'))).sort();

  return (
    <div className="space-y-4">
      <div className="p-4 rounded-2xl bg-white border border-[#95d5b2] space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h2 className="font-atlas text-lg font-bold text-[#1b4332]">🧹 Family Chores</h2>
            <p className="text-xs text-[#40916c]">
              {doneToday} of {totalToday} due today checked {weekOf ? `· Week of ${weekOf}` : ''}
            </p>
          </div>
          {canEdit && (
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => void sendTodayMissions()}
                className="px-3 py-1.5 rounded-lg bg-[#dbeafe] text-[#1e3a8a] border border-[#93c5fd] text-xs font-bold cursor-pointer"
              >
                📢 Send Today’s Missions to Family Chat
              </button>
              <button
                onClick={() => setShowAdd((v) => !v)}
                className="px-3 py-1.5 rounded-lg bg-[#2d6a4f] text-white text-xs font-bold cursor-pointer"
              >
                ＋ Add Chore
              </button>
              <button
                onClick={() => {
                  if (confirm('Clear all Mon–Sun checkmarks to start a fresh week?')) {
                    void onClearWeek();
                  }
                }}
                className="px-3 py-1.5 rounded-lg bg-[#fef3c7] text-[#92400e] border border-[#fde68a] text-xs font-bold cursor-pointer"
              >
                Clear Week
              </button>
            </div>
          )}
        </div>

        {chatSentMsg && (
          <div className="px-3 py-1.5 rounded-lg bg-emerald-100 text-emerald-900 text-xs font-bold">
            {chatSentMsg}
          </div>
        )}

        <details className="p-3 rounded-xl bg-[#fff7ed] border border-[#fed7aa] text-xs">
          <summary className="font-bold text-[#9a3412] cursor-pointer">
            💬 Calm Delegation Helpers (Phrasing Ideas for Each Kid)
          </summary>
          <div className="mt-2 space-y-2">
            {DELEGATION_SCRIPTS.map((ds) => (
              <div key={ds.group} className="p-2 rounded-lg bg-white border border-[#fed7aa] space-y-1">
                <div className="font-bold text-[#7c2d12]">{ds.group}</div>
                <p className="text-[#431407]">{ds.script}</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      void navigator.clipboard?.writeText(ds.script);
                      flashChatMsg('Script copied ✔');
                    }}
                    className="px-2 py-0.5 rounded bg-[#ffedd5] text-[10px] font-bold cursor-pointer"
                  >
                    📋 Copy
                  </button>
                  {canEdit && (
                    <button
                      onClick={async () => {
                        await onSendMissionsToChat(ds.script);
                        flashChatMsg('Posted to Family Chat ✔');
                      }}
                      className="px-2 py-0.5 rounded bg-[#2d6a4f] text-white text-[10px] font-bold cursor-pointer"
                    >
                      💬 Post to Chat
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </details>

        {/* Mode Toggles */}
        <div className="flex flex-wrap gap-1.5">
          {(
            [
              ['today', 'Today'],
              ['byDay', 'By Day'],
              ['byRoom', 'By Room'],
              ['byPerson', 'By Person'],
            ] as Array<[GroupView, string]>
          ).map(([k, label]) => (
            <button
              key={k}
              onClick={() => {
                setView(k);
                if (k === 'today') setSelectedDay(todayDay);
              }}
              className={`px-3 py-1 rounded-full text-xs font-bold cursor-pointer border ${
                view === k
                  ? 'bg-[#2d6a4f] text-white border-[#1b4332]'
                  : 'bg-[#f4fbf6] text-[#1b4332] border-[#b7d8c2]'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {showAdd && canEdit && (
          <div className="p-3 rounded-xl bg-[#f4fbf6] border border-[#74c69d] space-y-2 text-xs">
            <div className="font-bold text-[#1b4332]">Add New Chore</div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <select
                value={newPerson}
                onChange={(e) => setNewPerson(e.target.value)}
                className="px-2.5 py-1.5 rounded border border-[#95d5b2] bg-white"
              >
                {FAMILY_PEOPLE.map((p) => (
                  <option key={p.name} value={p.name}>
                    {p.name}
                  </option>
                ))}
                <option value="Everyone">Everyone</option>
              </select>
              <input
                type="text"
                value={newChore}
                onChange={(e) => setNewChore(e.target.value)}
                placeholder="Chore name"
                className="px-2.5 py-1.5 rounded border border-[#95d5b2] bg-white"
              />
              <input
                type="text"
                value={newDays}
                onChange={(e) => setNewDays(e.target.value)}
                placeholder="Days (Daily, Mon,Wed,Fri, 1st Sun)"
                className="px-2.5 py-1.5 rounded border border-[#95d5b2] bg-white"
              />
              <input
                type="text"
                value={newRoom}
                onChange={(e) => setNewRoom(e.target.value)}
                placeholder="Room"
                className="px-2.5 py-1.5 rounded border border-[#95d5b2] bg-white"
              />
              <input
                type="text"
                value={newTime}
                onChange={(e) => setNewTime(e.target.value)}
                placeholder="Time of day"
                className="px-2.5 py-1.5 rounded border border-[#95d5b2] bg-white"
              />
              <input
                type="text"
                value={newOften}
                onChange={(e) => setNewOften(e.target.value)}
                placeholder="How often"
                className="px-2.5 py-1.5 rounded border border-[#95d5b2] bg-white"
              />
            </div>
            <input
              type="text"
              value={newSteps}
              onChange={(e) => setNewSteps(e.target.value)}
              placeholder="Steps (e.g., Step 1 → Step 2)"
              className="w-full px-2.5 py-1.5 rounded border border-[#95d5b2] bg-white"
            />
            <div className="flex gap-2">
              <button
                onClick={() => void submitNewChore()}
                className="px-3 py-1.5 rounded-lg bg-[#2d6a4f] text-white font-bold cursor-pointer"
              >
                Save Chore
              </button>
              <button
                onClick={() => setShowAdd(false)}
                className="px-3 py-1.5 rounded-lg bg-white border border-[#95d5b2] cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      {view === 'byDay' && (
        <div className="flex flex-wrap gap-1.5">
          {DAYS_OF_WEEK.map((d) => (
            <button
              key={d}
              onClick={() => setSelectedDay(d)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer border ${
                selectedDay === d
                  ? 'bg-[#1b4332] text-white border-[#1b4332]'
                  : 'bg-white text-[#1b4332] border-[#b7d8c2]'
              }`}
            >
              {d} {d === todayDay ? '•' : ''}
            </button>
          ))}
        </div>
      )}

      {(view === 'today' || view === 'byDay') && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-white border border-[#95d5b2] space-y-2">
            <h3 className="font-bold text-sm text-[#1b4332]">
              Grown-ups ({selectedDay}) · {grownups.filter((c) => c.checked[selectedDay]).length}/{grownups.length}
            </h3>
            <div className="space-y-2">
              {grownups.map((c) => (
                <ChoreRow key={c.id} c={c} day={selectedDay} />
              ))}
            </div>
          </div>
          <div className="p-4 rounded-2xl bg-white border border-[#95d5b2] space-y-2">
            <h3 className="font-bold text-sm text-[#1b4332]">
              Kids ({selectedDay}) · {kids.filter((c) => c.checked[selectedDay]).length}/{kids.length}
            </h3>
            <div className="space-y-2">
              {kids.map((c) => (
                <ChoreRow key={c.id} c={c} day={selectedDay} />
              ))}
            </div>
          </div>
        </div>
      )}

      {view === 'byRoom' && (
        <div className="space-y-3">
          {rooms.map((rm) => {
            const list = chores.filter((c) => (c.room || 'Other') === rm);
            return (
              <div key={rm} className="p-4 rounded-2xl bg-white border border-[#95d5b2] space-y-2">
                <h3 className="font-bold text-sm text-[#1b4332]">
                  {rm} ({list.length})
                </h3>
                <div className="space-y-2">
                  {list.map((c) => (
                    <ChoreRow key={c.id} c={c} day={todayDay} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {view === 'byPerson' && (
        <div className="space-y-3">
          {FAMILY_PEOPLE.map((p) => {
            const list = chores.filter((c) => c.person === p.name);
            return (
              <div key={p.name} className="p-4 rounded-2xl bg-white border border-[#95d5b2] space-y-2">
                <div className="flex items-center justify-between">
                  <PersonChip person={p} />
                  <span className="text-xs text-[#40916c] font-semibold">{list.length} chores</span>
                </div>
                <div className="space-y-2">
                  {list.map((c) => (
                    <ChoreRow key={c.id} c={c} day={todayDay} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
