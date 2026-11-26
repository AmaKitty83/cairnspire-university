import { useEffect, useState } from 'react';
import {
  FAMILY_PEOPLE,
  subscribePublicGiftClaims,
  subscribePublicWishList,
  togglePublicGiftClaim,
  type GiftSection,
  type PublicGiftClaim,
} from '../services/familyHubService';
import { PersonIcon } from './family/PersonBadge';

export function PublicGiftsPage() {
  const [sections, setSections] = useState<GiftSection[]>([]);
  const [claims, setClaims] = useState<Record<string, PublicGiftClaim>>({});
  const [loaded, setLoaded] = useState(false);
  const [errMsg, setErrMsg] = useState<string | null>(null);
  const [selectedPerson, setSelectedPerson] = useState<string>('ALL');
  const [claimingId, setClaimingId] = useState<string | null>(null);
  const [claimerName, setClaimerName] = useState('');
  const [savingId, setSavingId] = useState<string | null>(null);

  useEffect(() => {
    const onErr = (e: Error) => {
      setErrMsg(e.message);
      setLoaded(true);
    };
    const u1 = subscribePublicWishList((secs) => {
      setSections(secs);
      setLoaded(true);
    }, onErr);
    const u2 = subscribePublicGiftClaims(setClaims, onErr);
    return () => {
      u1();
      u2();
    };
  }, []);

  async function handleReserve(giftId: string, claimed: boolean) {
    setSavingId(giftId);
    setErrMsg(null);
    try {
      await togglePublicGiftClaim(giftId, claimed, claimerName.trim());
      setClaimingId(null);
      setClaimerName('');
    } catch (err: unknown) {
      setErrMsg(err instanceof Error ? err.message : 'Could not update claim.');
    } finally {
      setSavingId(null);
    }
  }

  const orderedSections = [...sections].sort((a, b) => {
    const ai = FAMILY_PEOPLE.findIndex((p) => p.name === a.person);
    const bi = FAMILY_PEOPLE.findIndex((p) => p.name === b.person);
    return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi);
  });

  const shownSections =
    selectedPerson === 'ALL'
      ? orderedSections
      : orderedSections.filter((s) => s.person === selectedPerson);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f5fbf7] via-[#fffdf7] to-[#eff6ff] text-[#1b4332] pb-12">
      <header className="bg-[#2d6a4f] text-white px-4 py-5 shadow-md">
        <div className="max-w-3xl mx-auto text-center space-y-1">
          <h1 className="font-atlas text-2xl sm:text-3xl font-bold">🎁 Family Wish Lists</h1>
          <p className="text-xs sm:text-sm text-[#d8f3dc]">
            Shared by the family — tap <strong>“I’ve got this!”</strong> on an item so relatives
            don’t accidentally buy duplicates! (The kids can’t see what’s reserved.)
          </p>
        </div>
      </header>

      <main className="max-w-3xl mx-auto p-4 sm:p-6 space-y-5">
        {errMsg && (
          <div className="p-3 rounded-xl bg-red-100 border border-red-300 text-xs text-red-900">
            ⚠️ {errMsg}
          </div>
        )}

        {!loaded ? (
          <div className="p-8 rounded-2xl bg-white border border-[#95d5b2] text-center text-sm text-[#40916c]">
            Loading family wish lists…
          </div>
        ) : !orderedSections.length ? (
          <div className="p-8 rounded-2xl bg-white border-2 border-dashed border-[#95d5b2] text-center space-y-2">
            <div className="text-3xl">🌱</div>
            <h2 className="font-atlas text-lg font-bold text-[#1b4332]">
              Wish List Sharing Is Currently Paused
            </h2>
            <p className="text-xs text-[#40916c]">
              Ask Amarette or Ray to tap <strong>“Publish / Sync Shareable Link”</strong> on the
              Wish List page if you were expecting to see gift ideas here!
            </p>
          </div>
        ) : (
          <>
            {/* Person Filter Pills */}
            <div className="flex flex-wrap gap-2 justify-center">
              <button
                onClick={() => setSelectedPerson('ALL')}
                className={`px-3 py-1.5 rounded-full text-xs font-bold cursor-pointer border ${
                  selectedPerson === 'ALL'
                    ? 'bg-[#2d6a4f] text-white border-[#1b4332]'
                    : 'bg-white text-[#1b4332] border-[#95d5b2]'
                }`}
              >
                Everyone ({orderedSections.reduce((s, x) => s + x.items.length, 0)})
              </button>
              {orderedSections.map((s) => {
                const p = FAMILY_PEOPLE.find((x) => x.name === s.person);
                return (
                  <button
                    key={s.person}
                    onClick={() => setSelectedPerson(s.person)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold cursor-pointer border ${
                      selectedPerson === s.person ? 'ring-2 ring-[#1b4332]' : 'opacity-85 hover:opacity-100'
                    }`}
                    style={{
                      backgroundColor: p?.color || '#edf6f0',
                      color: p?.ink || '#1b4332',
                      borderColor: '#95d5b2',
                    }}
                  >
                    {p && <PersonIcon person={p} size="sm" />}
                    {s.person} ({s.items.length})
                  </button>
                );
              })}
            </div>

            {shownSections.map((sec) => {
              const p = FAMILY_PEOPLE.find((x) => x.name === sec.person);
              return (
                <div
                  key={sec.person}
                  className="p-4 sm:p-5 rounded-3xl bg-white border-2 border-[#b7e4c7] shadow-sm space-y-3"
                >
                  <div className="flex items-center justify-between gap-2 pb-2 border-b border-[#e5f3ea]">
                    <div className="flex items-center gap-2">
                      {p && <PersonIcon person={p} size="md" />}
                      <h2 className="font-atlas text-lg font-bold text-[#1b4332]">
                        {sec.person}’s Wish List
                      </h2>
                    </div>
                    <span className="text-xs text-[#40916c] font-semibold">
                      {sec.items.length} ideas
                    </span>
                  </div>

                  {!sec.items.length ? (
                    <p className="text-xs text-[#52796f]">No gift ideas added yet.</p>
                  ) : (
                    <div className="space-y-2.5">
                      {sec.items.map((it) => {
                        const cl = claims[it.id];
                        const isClaimed = Boolean(cl?.claimed);
                        return (
                          <div
                            key={it.id}
                            className={`p-3 rounded-2xl border space-y-2 transition ${
                              isClaimed
                                ? 'bg-[#f0fdf4] border-[#86efac]'
                                : 'bg-[#f8fcf9] border-[#dcefe2]'
                            }`}
                          >
                            <div className="flex flex-wrap items-start justify-between gap-2">
                              <div className="min-w-0 flex-1 space-y-0.5">
                                <div className="font-bold text-sm text-[#1b4332]">
                                  {it.link ? (
                                    <a
                                      href={it.link}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="underline text-[#1d4ed8] hover:text-[#1e40af]"
                                    >
                                      {it.idea} ↗
                                    </a>
                                  ) : (
                                    it.idea
                                  )}
                                </div>
                                <div className="flex flex-wrap gap-2 text-[11px] text-[#40916c]">
                                  {it.price && <span>💲 {it.price}</span>}
                                  {it.priority && <span>⭐ Priority {it.priority}</span>}
                                  {it.occasion && <span>🎉 {it.occasion}</span>}
                                </div>
                              </div>

                              {isClaimed ? (
                                <div className="flex items-center gap-2 shrink-0">
                                  <span className="px-2.5 py-1 rounded-full bg-[#16a34a] text-white text-[11px] font-bold">
                                    ✔ Reserved{cl.claimedBy ? ` (${cl.claimedBy})` : ''}
                                  </span>
                                  <button
                                    disabled={savingId === it.id}
                                    onClick={() => void handleReserve(it.id, false)}
                                    className="text-[11px] text-[#52796f] underline cursor-pointer"
                                  >
                                    Undo
                                  </button>
                                </div>
                              ) : (
                                <button
                                  onClick={() => {
                                    setClaimingId(it.id);
                                    setClaimerName('');
                                  }}
                                  className="px-3 py-1.5 rounded-xl bg-[#2d6a4f] hover:bg-[#1b4332] text-white text-xs font-bold shrink-0 cursor-pointer"
                                >
                                  🎁 I’ve got this!
                                </button>
                              )}
                            </div>

                            {claimingId === it.id && !isClaimed && (
                              <div className="p-2.5 rounded-xl bg-white border border-[#95d5b2] flex flex-wrap items-center gap-2 text-xs">
                                <input
                                  type="text"
                                  value={claimerName}
                                  onChange={(e) => setClaimerName(e.target.value)}
                                  placeholder="Your name (optional, e.g. Grandma)"
                                  className="flex-1 min-w-[160px] px-2.5 py-1 rounded-lg border border-[#95d5b2]"
                                />
                                <button
                                  disabled={savingId === it.id}
                                  onClick={() => void handleReserve(it.id, true)}
                                  className="px-3 py-1 rounded-lg bg-[#16a34a] text-white font-bold cursor-pointer"
                                >
                                  {savingId === it.id ? 'Saving…' : 'Confirm Reserved'}
                                </button>
                                <button
                                  onClick={() => setClaimingId(null)}
                                  className="px-2.5 py-1 rounded-lg bg-[#edf6f0] cursor-pointer"
                                >
                                  Cancel
                                </button>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </>
        )}
      </main>
    </div>
  );
}
