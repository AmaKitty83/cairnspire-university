import { useState } from 'react';
import {
  FAMILY_PEOPLE,
  type FamilyPersonProfile,
  type GiftItem,
  type GiftSection,
  type GoalItem,
  type HouseholdAnnouncementsDoc,
  type LinkGroup,
} from '../../services/familyHubService';
import { PersonChip } from './PersonBadge';

// 1. GOALS TAB
export function FamilyGoalsTab({
  activePerson,
  canEdit,
  goals,
  onAddGoal,
  onUpdateGoal,
  onDeleteGoal,
}: {
  activePerson: FamilyPersonProfile;
  canEdit: boolean;
  goals: GoalItem[];
  onAddGoal: (goal: string, step: string) => Promise<void>;
  onUpdateGoal: (item: GoalItem) => Promise<void>;
  onDeleteGoal: (id: string) => Promise<void>;
}) {
  const isParent = activePerson.mode === 'parent';
  const [newGoal, setNewGoal] = useState('');
  const [newStep, setNewStep] = useState('');

  return (
    <div className="space-y-4">
      <div className="p-4 rounded-2xl bg-white border border-[#95d5b2] space-y-3">
        <h2 className="font-atlas text-lg font-bold text-[#1b4332]">🎯 Family Goals</h2>
        {canEdit && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
            <input
              type="text"
              value={newGoal}
              onChange={(e) => setNewGoal(e.target.value)}
              placeholder={`Add a goal (${activePerson.name})...`}
              className="px-2.5 py-1.5 rounded-lg border border-[#95d5b2]"
            />
            <input
              type="text"
              value={newStep}
              onChange={(e) => setNewStep(e.target.value)}
              placeholder="First tiny step"
              className="px-2.5 py-1.5 rounded-lg border border-[#95d5b2]"
            />
            <button
              onClick={async () => {
                if (!newGoal.trim()) return;
                await onAddGoal(newGoal.trim(), newStep.trim());
                setNewGoal('');
                setNewStep('');
              }}
              className="px-3 py-1.5 rounded-lg bg-[#2d6a4f] text-white font-bold cursor-pointer"
            >
              ＋ Add Goal
            </button>
          </div>
        )}
      </div>

      <div className="space-y-2.5">
        {goals.map((g) => {
          const pObj = FAMILY_PEOPLE.find((p) => p.name === g.person);
          const canModify = canEdit && (isParent || g.person === activePerson.name);
          return (
            <div key={g.id} className="p-3 rounded-2xl bg-white border border-[#95d5b2] space-y-1.5 text-xs">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  {pObj ? <PersonChip person={pObj} /> : <strong>{g.person}</strong>}
                  <span className="font-bold text-sm text-[#1b4332]">{g.goal}</span>
                </div>
                {canModify && (
                  <div className="flex items-center gap-1.5">
                    <select
                      value={g.status}
                      onChange={(e) => void onUpdateGoal({ ...g, status: e.target.value })}
                      className="px-2 py-0.5 rounded border border-[#95d5b2] bg-[#f4fbf6]"
                    >
                      <option>Not started</option>
                      <option>In progress</option>
                      <option>Done</option>
                    </select>
                    <button
                      onClick={() => void onDeleteGoal(g.id)}
                      className="px-2 py-0.5 rounded border border-red-200 text-red-700 cursor-pointer"
                    >
                      🗑️
                    </button>
                  </div>
                )}
              </div>
              {g.step && <div className="text-[#355e47]">Next step: {g.step}</div>}
              {g.notes && <div className="text-[#52796f]">{g.notes}</div>}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// 2. GIFT LISTS TAB (parents-only bought status kept strictly isolated in parentBoughtMap!)
export function FamilyGiftsTab({
  activePerson,
  isParentActor,
  canEdit,
  readOnly,
  viewAs,
  sections,
  parentBoughtMap,
  onAddGift,
  onDeleteGift,
  onToggleBought,
}: {
  activePerson: FamilyPersonProfile;
  isParentActor: boolean;
  canEdit: boolean;
  readOnly: boolean;
  viewAs: string;
  sections: GiftSection[];
  parentBoughtMap: Record<string, string>;
  onAddGift: (forPerson: string, item: Omit<GiftItem, 'id'>) => Promise<void>;
  onDeleteGift: (forPerson: string, giftId: string) => Promise<void>;
  onToggleBought: (giftId: string, bought: boolean) => Promise<void>;
}) {
  const showParentBought = isParentActor && !viewAs && !readOnly;
  const [forWho, setForWho] = useState(activePerson.name);
  const [idea, setIdea] = useState('');
  const [link, setLink] = useState('');
  const [price, setPrice] = useState('');

  return (
    <div className="space-y-4">
      <div className="p-4 rounded-2xl bg-white border border-[#95d5b2] space-y-3">
        <h2 className="font-atlas text-lg font-bold text-[#1b4332]">🎁 Family Gift Lists</h2>
        {showParentBought && (
          <p className="text-[11px] text-[#40916c]">
            Parents-only Bought status is hidden on kids’ own lists andView-As so surprises stay secret!
          </p>
        )}
        {canEdit && (
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 text-xs">
            <select
              value={forWho}
              onChange={(e) => setForWho(e.target.value)}
              className="px-2 py-1.5 rounded-lg border border-[#95d5b2] bg-white"
            >
              {FAMILY_PEOPLE.map((p) => (
                <option key={p.name} value={p.name}>
                  For {p.name}
                </option>
              ))}
            </select>
            <input
              type="text"
              value={idea}
              onChange={(e) => setIdea(e.target.value)}
              placeholder="Gift idea"
              className="sm:col-span-2 px-2.5 py-1.5 rounded-lg border border-[#95d5b2]"
            />
            <input
              type="text"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="Price"
              className="px-2.5 py-1.5 rounded-lg border border-[#95d5b2]"
            />
            <button
              onClick={async () => {
                if (!idea.trim()) return;
                await onAddGift(forWho, {
                  idea: idea.trim(),
                  link: link.trim(),
                  price: price.trim(),
                  priority: '',
                  occasion: forWho === activePerson.name ? '' : `(idea from ${activePerson.name})`,
                });
                setIdea('');
                setLink('');
                setPrice('');
              }}
              className="px-3 py-1.5 rounded-lg bg-[#2d6a4f] text-white font-bold cursor-pointer"
            >
              ＋ Add
            </button>
            <input
              type="url"
              value={link}
              onChange={(e) => setLink(e.target.value)}
              placeholder="Link (optional)"
              className="sm:col-span-5 px-2.5 py-1.5 rounded-lg border border-[#95d5b2]"
            />
          </div>
        )}
      </div>

      <div className="space-y-3">
        {sections.map((sec) => {
          const pObj = FAMILY_PEOPLE.find((p) => p.name === sec.person);
          const isOwnList = sec.person === activePerson.name;
          return (
            <div key={sec.person} className="p-4 rounded-2xl bg-white border border-[#95d5b2] space-y-2">
              <div className="flex items-center justify-between">
                {pObj ? <PersonChip person={pObj} /> : <strong>{sec.person}</strong>}
                <span className="text-xs text-[#52796f]">{sec.items.length} ideas</span>
              </div>
              <div className="space-y-1.5 text-xs">
                {sec.items.map((it) => {
                  const isBought = Boolean(parentBoughtMap[it.id]);
                  const canSeeBoughtHere = showParentBought && !isOwnList;
                  return (
                    <div
                      key={it.id}
                      className="flex items-center justify-between gap-2 p-2 rounded-xl bg-[#f4fbf6] border border-[#dcefe2]"
                    >
                      <div className="min-w-0">
                        <div className={`font-semibold ${canSeeBoughtHere && isBought ? 'line-through text-[#52796f]' : 'text-[#1b4332]'}`}>
                          {it.link ? (
                            <a href={it.link} target="_blank" rel="noopener noreferrer" className="underline">
                              {it.idea} ↗
                            </a>
                          ) : (
                            it.idea
                          )}
                          {it.price ? ` · ${it.price}` : ''}
                        </div>
                        {it.occasion && <div className="text-[10px] text-[#52796f]">{it.occasion}</div>}
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        {canSeeBoughtHere && (
                          <button
                            onClick={() => void onToggleBought(it.id, !isBought)}
                            className={`px-2 py-0.5 rounded text-[10px] font-bold cursor-pointer ${
                              isBought ? 'bg-[#2d6a4f] text-white' : 'bg-white border border-[#95d5b2]'
                            }`}
                          >
                            {isBought ? '✔ Covered' : 'Mark Covered'}
                          </button>
                        )}
                        {canEdit && (isParentActor || isOwnList) && (
                          <button
                            onClick={() => void onDeleteGift(sec.person, it.id)}
                            className="px-1.5 py-0.5 rounded border border-red-200 text-red-700 cursor-pointer"
                          >
                            🗑️
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// 3. LINKS & HOUSEHOLD INFO TABS
export function FamilyLinksTab({ groups }: { groups: LinkGroup[] }) {
  return (
    <div className="space-y-3">
      <div className="p-4 rounded-2xl bg-white border border-[#95d5b2]">
        <h2 className="font-atlas text-lg font-bold text-[#1b4332]">🔗 Family Links &amp; Games</h2>
      </div>
      {groups.map((g) => (
        <div key={g.title} className="p-4 rounded-2xl bg-white border border-[#95d5b2] space-y-2">
          <div className="font-bold text-sm text-[#1b4332]">{g.title}</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            {g.links.map((lk, idx) => (
              <div key={idx} className="p-2.5 rounded-xl bg-[#f4fbf6] border border-[#dcefe2]">
                {lk.url ? (
                  <a
                    href={lk.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-bold text-[#1d4ed8] underline"
                  >
                    {lk.name} ↗
                  </a>
                ) : (
                  <div className="font-bold text-[#1b4332]">{lk.name}</div>
                )}
                {lk.notes && <div className="text-[11px] text-[#52796f] mt-0.5">{lk.notes}</div>}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export function FamilyInfoTab({ data }: { data: HouseholdAnnouncementsDoc }) {
  return (
    <div className="space-y-3 text-xs">
      <div className="p-4 rounded-2xl bg-white border border-[#95d5b2]">
        <h2 className="font-atlas text-lg font-bold text-[#1b4332]">📌 Household Info &amp; Contacts</h2>
      </div>
      {data.rules.length > 0 && (
        <div className="p-4 rounded-2xl bg-white border border-[#95d5b2] space-y-1.5">
          <div className="font-bold text-sm text-[#1b4332]">House Rules &amp; Routines</div>
          <ul className="list-disc pl-5 space-y-1 text-[#26382c]">
            {data.rules.map((r, i) => (
              <li key={i}>{r}</li>
            ))}
          </ul>
        </div>
      )}
      {data.info.length > 0 && (
        <div className="p-4 rounded-2xl bg-white border border-[#95d5b2] space-y-1.5">
          <div className="font-bold text-sm text-[#1b4332]">Quick Reference</div>
          {data.info.map((inf, i) => (
            <div key={i} className="p-2 rounded-lg bg-[#f4fbf6]">
              <strong>{inf.item}:</strong> {inf.details}
            </div>
          ))}
        </div>
      )}
      {data.contacts.length > 0 && (
        <div className="p-4 rounded-2xl bg-white border border-[#95d5b2] space-y-1.5">
          <div className="font-bold text-sm text-[#1b4332]">Important Contacts</div>
          {data.contacts.map((c, i) => (
            <div key={i} className="p-2 rounded-lg bg-[#f4fbf6] flex flex-wrap justify-between gap-2">
              <div>
                <strong>{c.name}</strong> {c.notes ? `— ${c.notes}` : ''}
              </div>
              {c.phone && (
                <a href={`tel:${c.phone}`} className="underline text-[#1d4ed8] font-semibold">
                  {c.phone}
                </a>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
