import { useState } from 'react';
import {
  FAMILY_PEOPLE,
  type FamilyPersonProfile,
  type GiftItem,
  type GiftSection,
  type GoalItem,
  type HouseholdAnnouncementsDoc,
  type LinkGroup,
  type PublicGiftClaim,
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
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draftGoal, setDraftGoal] = useState<GoalItem | null>(null);

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
          const pctNum = parseInt(String(g.progress || '0').replace(/[^0-9]/g, ''), 10) || 0;
          const isEditing = editingId === g.id && draftGoal;

          return (
            <div key={g.id} className="p-3.5 rounded-2xl bg-white border border-[#95d5b2] space-y-2 text-xs">
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
                      onClick={() => {
                        if (isEditing) {
                          setEditingId(null);
                          setDraftGoal(null);
                        } else {
                          setEditingId(g.id);
                          setDraftGoal({ ...g });
                        }
                      }}
                      className="px-2 py-0.5 rounded border border-[#95d5b2] cursor-pointer"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => void onDeleteGoal(g.id)}
                      className="px-2 py-0.5 rounded border border-red-200 text-red-700 cursor-pointer"
                    >
                      🗑️
                    </button>
                  </div>
                )}
              </div>

              <div className="w-full h-2 rounded-full bg-[#e5f3ea] overflow-hidden">
                <div
                  className="h-full bg-[#2d6a4f] transition-all"
                  style={{ width: `${Math.min(100, Math.max(0, pctNum))}%` }}
                />
              </div>

              {isEditing ? (
                <div className="p-2.5 rounded-xl bg-[#f4fbf6] border border-[#74c69d] space-y-2">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={draftGoal.goal}
                      onChange={(e) => setDraftGoal({ ...draftGoal, goal: e.target.value })}
                      placeholder="Goal"
                      className="px-2 py-1 rounded border border-[#95d5b2] bg-white"
                    />
                    <input
                      type="text"
                      value={draftGoal.step}
                      onChange={(e) => setDraftGoal({ ...draftGoal, step: e.target.value })}
                      placeholder="Next step"
                      className="px-2 py-1 rounded border border-[#95d5b2] bg-white"
                    />
                    <input
                      type="text"
                      value={draftGoal.why}
                      onChange={(e) => setDraftGoal({ ...draftGoal, why: e.target.value })}
                      placeholder="Why this matters"
                      className="px-2 py-1 rounded border border-[#95d5b2] bg-white"
                    />
                    <input
                      type="text"
                      value={draftGoal.celebrate}
                      onChange={(e) => setDraftGoal({ ...draftGoal, celebrate: e.target.value })}
                      placeholder="How we celebrate"
                      className="px-2 py-1 rounded border border-[#95d5b2] bg-white"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <span>Progress:</span>
                    <input
                      type="range"
                      min={0}
                      max={100}
                      step={5}
                      value={parseInt(String(draftGoal.progress).replace(/[^0-9]/g, ''), 10) || 0}
                      onChange={(e) =>
                        setDraftGoal({ ...draftGoal, progress: `${e.target.value}%` })
                      }
                      className="flex-1 accent-[#2d6a4f]"
                    />
                    <span className="font-bold">{draftGoal.progress}</span>
                  </div>
                  <button
                    onClick={async () => {
                      await onUpdateGoal(draftGoal);
                      setEditingId(null);
                      setDraftGoal(null);
                    }}
                    className="px-3 py-1 rounded bg-[#2d6a4f] text-white font-bold cursor-pointer"
                  >
                    💾 Save Changes
                  </button>
                </div>
              ) : (
                <>
                  {g.why && <div className="text-[#40916c]">Why: {g.why}</div>}
                  {g.step && <div className="text-[#355e47]">Next step: {g.step}</div>}
                  {g.celebrate && <div className="text-[#b45309]">🎉 Celebrate: {g.celebrate}</div>}
                  {g.notes && <div className="text-[#52796f]">{g.notes}</div>}
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// 2. GIFT LISTS TAB (parents-only bought status + shareable /gifts link)
export function FamilyGiftsTab({
  activePerson,
  isParentActor,
  canEdit,
  readOnly,
  viewAs,
  sections,
  parentBoughtMap,
  publicPublished,
  publicClaims,
  onAddGift,
  onUpdateGift,
  onDeleteGift,
  onToggleBought,
  onPublishPublic,
  onUnpublishPublic,
}: {
  activePerson: FamilyPersonProfile;
  isParentActor: boolean;
  canEdit: boolean;
  readOnly: boolean;
  viewAs: string;
  sections: GiftSection[];
  parentBoughtMap: Record<string, string>;
  publicPublished: boolean;
  publicClaims: Record<string, PublicGiftClaim>;
  onAddGift: (forPerson: string, item: Omit<GiftItem, 'id'>) => Promise<void>;
  onUpdateGift: (forPerson: string, item: GiftItem) => Promise<void>;
  onDeleteGift: (forPerson: string, giftId: string) => Promise<void>;
  onToggleBought: (giftId: string, bought: boolean) => Promise<void>;
  onPublishPublic: () => Promise<void>;
  onUnpublishPublic: () => Promise<void>;
}) {
  const showParentBought = isParentActor && !viewAs && !readOnly;
  const [forWho, setForWho] = useState(activePerson.name);
  const [idea, setIdea] = useState('');
  const [link, setLink] = useState('');
  const [price, setPrice] = useState('');
  const [priority, setPriority] = useState('');
  const [editingGift, setEditingGift] = useState<{ person: string; item: GiftItem } | null>(null);
  const [shareBusy, setShareBusy] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const shareUrl =
    typeof window !== 'undefined' ? `${window.location.origin}/gifts` : 'https://cairnspire-university.web.app/gifts';

  return (
    <div className="space-y-4">
      <div className="p-4 rounded-2xl bg-white border border-[#95d5b2] space-y-3">
        <h2 className="font-atlas text-lg font-bold text-[#1b4332]">🎁 Family Gift Lists</h2>
        {showParentBought && (
          <p className="text-[11px] text-[#40916c]">
            Parents-only Bought &amp; Public Reserve status stays completely hidden on kids’ own lists and
            View-As so surprises stay secret!
          </p>
        )}

        {/* Shareable Extended-Family Link Panel (Parents Only) */}
        {showParentBought && (
          <div className="p-3 rounded-xl bg-[#eef6ff] border border-[#93c5fd] space-y-2 text-xs">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="font-bold text-[#1e3a8a]">
                🔗 Shareable Wish List Link for Extended Family
              </div>
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  publicPublished ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-700'
                }`}
              >
                {publicPublished ? 'Live & Shareable' : 'Currently Paused'}
              </span>
            </div>
            <p className="text-[11px] text-[#1e40af]">
              Anyone with this link can view gift ideas (no login needed) and tap “I’ve got this!” to prevent
              duplicate gifts. Kids cannot see reserved/bought items.
            </p>
            <div className="flex flex-wrap items-center gap-2">
              <code className="px-2 py-1 rounded bg-white border border-[#bfdbfe] text-[11px] select-all">
                {shareUrl}
              </code>
              <button
                onClick={() => {
                  void navigator.clipboard?.writeText(shareUrl);
                  setCopiedLink(true);
                  setTimeout(() => setCopiedLink(false), 1800);
                }}
                className="px-2.5 py-1 rounded-lg bg-white border border-[#93c5fd] font-bold text-[#1e3a8a] cursor-pointer"
              >
                {copiedLink ? 'Copied ✔' : '📋 Copy Link'}
              </button>
              <a
                href="/gifts"
                target="_blank"
                rel="noopener noreferrer"
                className="px-2.5 py-1 rounded-lg bg-white border border-[#93c5fd] font-bold text-[#1e3a8a] underline"
              >
                Preview ↗
              </a>
              <button
                disabled={shareBusy}
                onClick={async () => {
                  setShareBusy(true);
                  try {
                    await onPublishPublic();
                  } finally {
                    setShareBusy(false);
                  }
                }}
                className="px-2.5 py-1 rounded-lg bg-[#2563eb] text-white font-bold cursor-pointer disabled:opacity-50"
              >
                {publicPublished ? '🔄 Sync Updates to Public Link' : '🚀 Turn On Public Link'}
              </button>
              {publicPublished && (
                <button
                  disabled={shareBusy}
                  onClick={async () => {
                    setShareBusy(true);
                    try {
                      await onUnpublishPublic();
                    } finally {
                      setShareBusy(false);
                    }
                  }}
                  className="px-2.5 py-1 rounded-lg bg-red-100 text-red-800 font-bold cursor-pointer"
                >
                  Pause Link
                </button>
              )}
            </div>
          </div>
        )}

        {canEdit && (
          <div className="grid grid-cols-1 sm:grid-cols-6 gap-2 text-xs p-3 rounded-xl bg-[#f4fbf6] border border-[#dcefe2]">
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
              className="sm:col-span-2 px-2.5 py-1.5 rounded-lg border border-[#95d5b2] bg-white"
            />
            <input
              type="text"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="Price"
              className="px-2.5 py-1.5 rounded-lg border border-[#95d5b2] bg-white"
            />
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="px-2 py-1.5 rounded-lg border border-[#95d5b2] bg-white"
            >
              <option value="">Priority</option>
              <option value="1">1 (Top!)</option>
              <option value="2">2 (Really want)</option>
              <option value="3">3 (Nice idea)</option>
            </select>
            <button
              onClick={async () => {
                if (!idea.trim()) return;
                await onAddGift(forWho, {
                  idea: idea.trim(),
                  link: link.trim(),
                  price: price.trim(),
                  priority,
                  occasion: forWho === activePerson.name ? '' : `(idea from ${activePerson.name})`,
                });
                setIdea('');
                setLink('');
                setPrice('');
                setPriority('');
              }}
              className="px-3 py-1.5 rounded-lg bg-[#2d6a4f] text-white font-bold cursor-pointer"
            >
              ＋ Add
            </button>
            <input
              type="url"
              value={link}
              onChange={(e) => setLink(e.target.value)}
              placeholder="Store link (optional)"
              className="sm:col-span-6 px-2.5 py-1.5 rounded-lg border border-[#95d5b2] bg-white"
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
                  const pubClaim = publicClaims[it.id.toLowerCase()];
                  const isPublicClaimed = Boolean(pubClaim?.claimed);
                  const canSeeStatus = showParentBought && !isOwnList;
                  const isEditingThis =
                    editingGift?.person === sec.person && editingGift.item.id === it.id;

                  if (isEditingThis && editingGift) {
                    return (
                      <div
                        key={it.id}
                        className="p-2.5 rounded-xl bg-[#f4fbf6] border border-[#74c69d] space-y-2"
                      >
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                          <input
                            type="text"
                            value={editingGift.item.idea}
                            onChange={(e) =>
                              setEditingGift({
                                ...editingGift,
                                item: { ...editingGift.item, idea: e.target.value },
                              })
                            }
                            placeholder="Idea"
                            className="px-2 py-1 rounded border border-[#95d5b2] bg-white sm:col-span-2"
                          />
                          <input
                            type="text"
                            value={editingGift.item.price}
                            onChange={(e) =>
                              setEditingGift({
                                ...editingGift,
                                item: { ...editingGift.item, price: e.target.value },
                              })
                            }
                            placeholder="Price"
                            className="px-2 py-1 rounded border border-[#95d5b2] bg-white"
                          />
                          <input
                            type="url"
                            value={editingGift.item.link}
                            onChange={(e) =>
                              setEditingGift({
                                ...editingGift,
                                item: { ...editingGift.item, link: e.target.value },
                              })
                            }
                            placeholder="Link"
                            className="px-2 py-1 rounded border border-[#95d5b2] bg-white sm:col-span-2"
                          />
                          <input
                            type="text"
                            value={editingGift.item.priority}
                            onChange={(e) =>
                              setEditingGift({
                                ...editingGift,
                                item: { ...editingGift.item, priority: e.target.value },
                              })
                            }
                            placeholder="Priority (1-3)"
                            className="px-2 py-1 rounded border border-[#95d5b2] bg-white"
                          />
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={async () => {
                              await onUpdateGift(editingGift.person, editingGift.item);
                              setEditingGift(null);
                            }}
                            className="px-3 py-1 rounded bg-[#2d6a4f] text-white font-bold cursor-pointer"
                          >
                            💾 Save
                          </button>
                          <button
                            onClick={() => setEditingGift(null)}
                            className="px-2.5 py-1 rounded bg-white border border-[#95d5b2] cursor-pointer"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    );
                  }

                  return (
                    <div
                      key={it.id}
                      className="flex items-center justify-between gap-2 p-2 rounded-xl bg-[#f4fbf6] border border-[#dcefe2]"
                    >
                      <div className="min-w-0">
                        <div
                          className={`font-semibold ${
                            canSeeStatus && (isBought || isPublicClaimed)
                              ? 'line-through text-[#52796f]'
                              : 'text-[#1b4332]'
                          }`}
                        >
                          {it.link ? (
                            <a href={it.link} target="_blank" rel="noopener noreferrer" className="underline">
                              {it.idea} ↗
                            </a>
                          ) : (
                            it.idea
                          )}
                          {it.price ? ` · ${it.price}` : ''}
                          {it.priority ? ` · ⭐P${it.priority}` : ''}
                        </div>
                        {it.occasion && <div className="text-[10px] text-[#52796f]">{it.occasion}</div>}
                        {canSeeStatus && isPublicClaimed && (
                          <div className="text-[10px] font-bold text-[#1d4ed8]">
                            🌐 Reserved via Public Link
                            {pubClaim.claimedBy ? ` by ${pubClaim.claimedBy}` : ''}
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        {canSeeStatus && (
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
                          <>
                            <button
                              onClick={() => setEditingGift({ person: sec.person, item: { ...it } })}
                              className="px-1.5 py-0.5 rounded border border-[#95d5b2] cursor-pointer"
                            >
                              ✏️
                            </button>
                            <button
                              onClick={() => void onDeleteGift(sec.person, it.id)}
                              className="px-1.5 py-0.5 rounded border border-red-200 text-red-700 cursor-pointer"
                            >
                              🗑️
                            </button>
                          </>
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
