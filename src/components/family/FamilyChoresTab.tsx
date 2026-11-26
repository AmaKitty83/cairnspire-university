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
  onClearWeek: () => Promise<void>;
}

type GroupView = 'today' | 'byDay' | 'byRoom' | 'byPerson';

export function FamilyChoresTab({
  activePerson,
  canEdit,
  speakEnabled,
  weekOf,
  chores,
  onToggleChore,
  onAddChore,
  onClearWeek,
}: FamilyChoresTabProps) {
  const isParent = activePerson.mode === 'parent';
  const isLittle = activePerson.mode === 'little';
  const todayDay = todayDayKey();
  const todayKey = isoDateLocal();

  const [view, setView] = useState<GroupView>('today');
  const [selectedDay, setSelectedDay] = useState<DayKey>(todayDay);
  const [showAdd, setShowAdd] = useState(false);
  const [newPerson, setNewPerson] = useState('Liam');
  const [newChore, setNewChore] = useState('');
  const [newOften, setNewOften] = useState('Daily');
  const [newSteps, setNewSteps] = useState('');
  const [newDays, setNewDays] = useState('Daily');
  const [newRoom, setNewRoom] = useState('Living Room');
  const [newTime, setNewTime] = useState('');

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
    return (
      <div className="flex items-center gap-3 p-2.5 rounded-xl bg-[#f4fbf6] border border-[#dcefe2]">
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
      </div>
    );
  }

  // Kid / Teen view: clean personal today list
  if (!isParent) {
    const mine = chores.filter(
      (c) => (c.person === activePerson.name || c.person === 'Everyone') && isChoreDueOnDate(c, todayDay, todayKey)
    );
    const doneCount = mine.filter((c) => c.checked[todayDay]).length;
    return (
      <div className="p-4 rounded-2xl bg-white border border-[#95d5b2] space-y-3">
        <div>
          <h2 className="font-atlas text-lg font-bold text-[#1b4332]">
            {isLittle ? '🧹 My Jobs Today' : activePerson.mode === 'gabe' ? '🐉 Today, if you can' : '🧹 Today’s Chores'}
          </h2>
          <p className="text-xs text-[#40916c]">
            {doneCount} of {mine.length} done · One small step is enough.
          </p>
        </div>
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
            <div className="flex gap-2">
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
