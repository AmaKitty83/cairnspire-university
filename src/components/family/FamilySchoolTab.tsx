import { useMemo, useState } from 'react';
import {
  CODING_TIPS_LIST,
  CROSSWORDS_LIST,
  LITTLE_KID_SCHOOL,
  LOGIC_PUZZLES_LIST,
  SPANISH_WORDS_LIST,
  WOTD_LIST,
} from '../../data/schoolContent';
import {
  FAMILY_PEOPLE,
  isoDateLocal,
  type CalendarEventItem,
  type FamilyPersonProfile,
} from '../../services/familyHubService';
import type { SpellingWordsDoc } from '../../services/questsService';
import { ComicStudio } from './ComicStudio';
import { PersonChip, PersonIcon, speakText } from './PersonBadge';

interface FamilySchoolTabProps {
  activePerson: FamilyPersonProfile;
  isParentActor: boolean;
  canEdit: boolean;
  viewAs: string;
  readOnly: boolean;
  speakEnabled: boolean;
  spellingWords: SpellingWordsDoc;
  calendarEvents: CalendarEventItem[];
  onSaveSpelling: (kid: 'Liam' | 'Oliver', weekOf: string, words: string[]) => Promise<void>;
  onOpenQuests: () => void;
}

type LittleGameKind = 'spell' | 'match' | 'sight' | 'math' | 'comic';

interface QuizQuestion {
  ask: string;
  say: string;
  bigPrompt?: string;
  opts: Array<{ label: string; ok: boolean }>;
}

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function dayIndexSince(epochStr = '2026-01-01'): number {
  const now = new Date();
  const ep = new Date(`${epochStr}T00:00:00`);
  return Math.max(0, Math.floor((now.getTime() - ep.getTime()) / 86400000));
}

function xwNumberGrid(grid: string[]) {
  const N = grid.length;
  let n = 0;
  const num: Record<string, number> = {};
  const across: Array<{ n: number; cells: Array<[number, number]> }> = [];
  const down: Array<{ n: number; cells: Array<[number, number]> }> = [];

  for (let r = 0; r < N; r++) {
    for (let c = 0; c < N; c++) {
      if (grid[r][c] === '#') continue;
      const sa = (c === 0 || grid[r][c - 1] === '#') && c + 1 < N && grid[r][c + 1] !== '#';
      const sd = (r === 0 || grid[r - 1][c] === '#') && r + 1 < N && grid[r + 1][c] !== '#';
      if (sa || sd) {
        n++;
        num[`${r},${c}`] = n;
        if (sa) {
          const cells: Array<[number, number]> = [];
          let k = c;
          while (k < N && grid[r][k] !== '#') cells.push([r, k++]);
          across.push({ n, cells });
        }
        if (sd) {
          const cells: Array<[number, number]> = [];
          let j = r;
          while (j < N && grid[j][c] !== '#') cells.push([j++, c]);
          down.push({ n, cells });
        }
      }
    }
  }
  return { num, across, down };
}

export function FamilySchoolTab({
  activePerson,
  isParentActor,
  canEdit,
  viewAs,
  readOnly,
  speakEnabled,
  spellingWords,
  calendarEvents,
  onSaveSpelling,
  onOpenQuests,
}: FamilySchoolTabProps) {
  const isParentView = activePerson.mode === 'parent';
  const showGabeTile = (isParentAuthVisible() && !viewAs && !readOnly) || activePerson.name === 'Gabe';
  function isParentAuthVisible() {
    return isParentActor && isParentView;
  }

  const [pickedKid, setPickedKid] = useState<'Oliver' | 'Liam' | 'Chase' | 'Preston'>('Liam');
  const shownKid = isParentView ? pickedKid : activePerson.name;

  // Little Kid game states
  const [gameKind, setGameKind] = useState<LittleGameKind | null>(null);
  const [roundIdx, setRoundIdx] = useState(0);
  const [quizItems, setQuizItems] = useState<QuizQuestion[]>([]);
  const [spellList, setSpellList] = useState<string[]>([]);
  const [spellTyped, setSpellTyped] = useState('');
  const [spellTilesUsed, setSpellTilesUsed] = useState<number[]>([]);
  const [fullAlphabet, setFullAlphabet] = useState(() => {
    try {
      return localStorage.getItem('hg_spell_az') === '1';
    } catch {
      return false;
    }
  });
  const [gameMsg, setGameMsg] = useState('');
  const [tries, setTries] = useState(0);
  const [mathGameOpen, setMathGameOpen] = useState(false);

  // Parent Spelling Editor state
  const kidForSpell = shownKid === 'Oliver' ? 'Oliver' : 'Liam';
  const [spellWeekDraft, setSpellWeekDraft] = useState(spellingWords[kidForSpell]?.weekOf || '');
  const [spellWordsDraft, setSpellWordsDraft] = useState(
    (spellingWords[kidForSpell]?.words || []).join('\n')
  );
  const [savedSpellMsg, setSavedSpellMsg] = useState(false);

  // Preston / Chase states
  const dIdx = dayIndexSince('2026-01-01');
  const [xwOffset, setXwOffset] = useState(0);
  const [logicOffset, setLogicOffset] = useState(0);
  const [showLogicHint, setShowLogicHint] = useState(false);
  const [showLogicAns, setShowLogicAns] = useState(false);
  const [showSpanish, setShowSpanish] = useState(true);

  const curXw = CROSSWORDS_LIST[(Math.floor(dIdx / 3) + xwOffset) % CROSSWORDS_LIST.length];
  const xwInfo = useMemo(() => xwNumberGrid(curXw.grid), [curXw]);
  const [xwFill, setXwFill] = useState<Record<string, string>>({});
  const [xwSel, setXwSel] = useState<[number, number]>([0, 0]);
  const [xwMsg, setXwMsg] = useState('');

  // Gabe's own School tile opens Quests
  if (!isParentView && activePerson.name === 'Gabe') {
    const gabeProfile = FAMILY_PEOPLE.find((p) => p.name === 'Gabe')!;
    return (
      <div className="p-5 rounded-3xl bg-white border-2 border-[#74c69d] space-y-3 text-center">
        <h2 className="font-atlas text-xl font-bold text-[#1b4332]">🏫 School</h2>
        <button
          onClick={onOpenQuests}
          className="px-6 py-4 rounded-2xl shadow font-bold text-base inline-flex items-center gap-2 cursor-pointer"
          style={{ backgroundColor: gabeProfile.color, color: gabeProfile.ink }}
        >
          <PersonIcon person={gabeProfile} size="md" />
          Open My Quests 📜
        </button>
        <p className="text-xs text-[#40916c]">Your D&amp;D math &amp; science quests live in Quests.</p>
      </div>
    );
  }

  function startLittleGame(kind: LittleGameKind) {
    const kid = shownKid === 'Oliver' ? 'Oliver' : 'Liam';
    const kit = LITTLE_KID_SCHOOL[kid];
    setGameKind(kind);
    setRoundIdx(0);
    setGameMsg('');
    setTries(0);
    setSpellTyped('');
    setSpellTilesUsed([]);

    if (kind === 'spell') {
      const bank = spellingWords[kid]?.words?.length ? spellingWords[kid].words : kit.starter;
      const chosen = shuffle(bank).slice(0, 5);
      while (chosen.length < 5 && bank.length) chosen.push(bank[chosen.length % bank.length]);
      setSpellList(chosen);
      speakText(chosen[0] || '', speakEnabled);
      return;
    }

    if (kind === 'comic') {
      return;
    }

    const items: QuizQuestion[] = [];
    if (kind === 'match') {
      if (kid === 'Oliver') {
        const letters = shuffle('ABCDEFGHIJKLMNOPRSTW'.split('')).slice(0, 5);
        letters.forEach((L) => {
          const decoys = shuffle('ABCDEFGHIJKLMNOPRSTW'.split('').filter((x) => x !== L)).slice(0, 2);
          items.push({
            ask: 'Find the little letter!',
            say: `Find little ${L.toLowerCase()}`,
            bigPrompt: L,
            opts: shuffle([L, ...decoys]).map((x) => ({ label: x.toLowerCase(), ok: x === L })),
          });
        });
      } else {
        const picks = shuffle(kit.pics).slice(0, 5);
        picks.forEach(([word, emoji]) => {
          const decoys = shuffle(kit.pics.filter((p) => p[0] !== word)).slice(0, 2);
          items.push({
            ask: 'Which word goes with the picture?',
            say: 'Which word goes with the picture?',
            bigPrompt: emoji,
            opts: shuffle([[word, emoji], ...decoys]).map((p) => ({ label: p[0], ok: p[0] === word })),
          });
        });
      }
    } else if (kind === 'sight') {
      shuffle(kit.sight)
        .slice(0, 5)
        .forEach((wd) => {
          const decoys = shuffle(kit.sight.filter((x) => x !== wd)).slice(0, 2);
          items.push({
            ask: 'Listen, then find the word!',
            say: `Find the word ${wd}`,
            bigPrompt: '👂',
            opts: shuffle([wd, ...decoys]).map((x) => ({ label: x, ok: x === wd })),
          });
        });
    } else if (kind === 'math') {
      for (let i = 0; i < 5; i++) {
        const add = Math.random() < 0.55;
        let a: number;
        let b: number;
        let ans: number;
        let q: string;
        if (add) {
          a = 1 + Math.floor(Math.random() * 12);
          b = 1 + Math.floor(Math.random() * Math.min(9, 20 - a));
          ans = a + b;
          q = `${a} + ${b}`;
        } else {
          a = 5 + Math.floor(Math.random() * 16);
          b = 1 + Math.floor(Math.random() * Math.min(9, a));
          ans = a - b;
          q = `${a} − ${b}`;
        }
        const opts = [ans];
        while (opts.length < 3) {
          const n = ans + [-3, -2, -1, 1, 2, 3][Math.floor(Math.random() * 6)];
          if (n >= 0 && n <= 20 && !opts.includes(n)) opts.push(n);
        }
        items.push({
          ask: 'Pick the answer!',
          say: q.replace('−', 'take away').replace('+', 'plus'),
          bigPrompt: `${q} = ?`,
          opts: shuffle(opts).map((x) => ({ label: String(x), ok: x === ans })),
        });
      }
    }
    setQuizItems(items);
    if (items[0]) speakText(items[0].say, speakEnabled);
  }

  return (
    <div className="space-y-4">
      {/* Parent Kid Selector */}
      {isParentView && (
        <div className="p-4 rounded-2xl bg-white border border-[#95d5b2] space-y-2.5">
          <div className="font-atlas font-bold text-base text-[#1b4332]">🏫 Kid School Center</div>
          <p className="text-xs text-[#40916c]">Pick a child to see their learning space:</p>
          <div className="flex flex-wrap gap-2">
            {FAMILY_PEOPLE.filter((p) => p.kid || p.mode === 'teen' || (p.name === 'Gabe' && showGabeTile)).map((p) => {
              if (p.name === 'Gabe') {
                return (
                  <button
                    key="Gabe"
                    onClick={onOpenQuests}
                    className="cursor-pointer transition hover:scale-[1.03]"
                  >
                    <PersonChip person={p} />
                  </button>
                );
              }
              return (
                <button
                  key={p.name}
                  onClick={() => {
                    const nextKid = p.name as 'Oliver' | 'Liam' | 'Chase' | 'Preston';
                    setPickedKid(nextKid);
                    setGameKind(null);
                    if (nextKid === 'Oliver' || nextKid === 'Liam') {
                      setSpellWeekDraft(spellingWords[nextKid]?.weekOf || '');
                      setSpellWordsDraft((spellingWords[nextKid]?.words || []).join('\n'));
                    }
                  }}
                  className={`cursor-pointer rounded-full ${
                    pickedKid === p.name ? 'ring-2 ring-[#1b4332]' : 'opacity-80 hover:opacity-100'
                  }`}
                >
                  <PersonChip person={p} />
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* LITTLE KIDS: LIAM & OLIVER */}
      {(shownKid === 'Liam' || shownKid === 'Oliver') && (() => {
        const kid = shownKid;
        const kit = LITTLE_KID_SCHOOL[kid];
        const kidWords = spellingWords[kid]?.words || [];
        const pObj = FAMILY_PEOPLE.find((p) => p.name === kid)!;

        // Active mini-game view
        if (gameKind) {
          // 1. Finished round
          if (gameKind !== 'comic' && roundIdx >= 5) {
            return (
              <div className="p-6 rounded-3xl bg-white border-2 border-[#74c69d] text-center space-y-3">
                <div className="text-5xl">🌟</div>
                <h3 className="font-atlas text-xl font-bold text-[#1b4332]">All done for now!</h3>
                <p className="text-sm text-[#40916c]">Nice trying! You can rest or play again later.</p>
                <div className="flex flex-wrap gap-2 justify-center">
                  <button
                    onClick={() => startLittleGame(gameKind)}
                    className="px-4 py-2 rounded-xl bg-[#2d6a4f] text-white font-bold text-xs cursor-pointer"
                  >
                    🔁 Play Again
                  </button>
                  <button
                    onClick={() => setGameKind(null)}
                    className="px-4 py-2 rounded-xl bg-[#edf6f0] text-[#1b4332] font-bold text-xs cursor-pointer"
                  >
                    ← Back to School
                  </button>
                </div>
              </div>
            );
          }

          // 2. Spelling Game
          if (gameKind === 'spell') {
            const targetWord = spellList[roundIdx] || '';
            const shuffledLetters = targetWord.split('').map((c, idx) => ({ c, idx }));
            return (
              <div className="p-5 rounded-3xl bg-white border-2 border-[#74c69d] space-y-4 text-center">
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => setGameKind(null)}
                    className="px-3 py-1 rounded-xl bg-[#edf6f0] text-xs font-bold cursor-pointer"
                  >
                    ← Games
                  </button>
                  <span className="text-xs font-bold text-[#40916c]">Word {roundIdx + 1} of 5</span>
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-bold text-[#1b4332]">Listen, then spell the word!</p>
                  <button
                    onClick={() => speakText(targetWord, true)}
                    className="px-5 py-3 rounded-2xl bg-[#d8f3dc] text-2xl cursor-pointer shadow-sm"
                  >
                    🔊 Hear Word
                  </button>
                </div>

                <div className="text-2xl tracking-widest font-mono font-bold text-[#1b4332] min-h-[36px]">
                  {spellTyped || '_____'}
                </div>

                {!fullAlphabet ? (
                  <div className="flex flex-wrap gap-2 justify-center">
                    {shuffledLetters.map(({ c, idx }) => {
                      const used = spellTilesUsed.includes(idx);
                      return (
                        <button
                          key={idx}
                          disabled={used}
                          onClick={() => {
                            const nextPos = spellTyped.length;
                            if (c.toLowerCase() === targetWord[nextPos]?.toLowerCase()) {
                              const nextStr = spellTyped + c;
                              setSpellTyped(nextStr);
                              setSpellTilesUsed((u) => [...u, idx]);
                              setGameMsg('');
                              if (nextStr.length >= targetWord.length) {
                                setGameMsg(`🌟 Great job spelling “${targetWord}”!`);
                                speakText(`Great job! You spelled ${targetWord}`, speakEnabled);
                                setTimeout(() => {
                                  setRoundIdx((i) => i + 1);
                                  setSpellTyped('');
                                  setSpellTilesUsed([]);
                                  setGameMsg('');
                                  if (spellList[roundIdx + 1]) speakText(spellList[roundIdx + 1], speakEnabled);
                                }, 1400);
                              }
                            } else {
                              setGameMsg('Good try! Try another letter 🙂');
                            }
                          }}
                          className="w-12 h-12 rounded-xl bg-[#f4fbf6] border-2 border-[#74c69d] font-bold text-xl cursor-pointer disabled:opacity-30"
                        >
                          {c}
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="flex flex-wrap gap-1.5 justify-center max-w-md mx-auto">
                      {'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').map((ch) => (
                        <button
                          key={ch}
                          onClick={() => setSpellTyped((s) => (s.length < 20 ? s + ch.toLowerCase() : s))}
                          className="w-9 h-10 rounded-lg bg-[#f4fbf6] border border-[#74c69d] font-bold text-sm cursor-pointer"
                        >
                          {ch}
                        </button>
                      ))}
                      <button
                        onClick={() => setSpellTyped((s) => s.slice(0, -1))}
                        className="px-3 h-10 rounded-lg bg-[#fef3c7] border border-[#f59e0b] font-bold text-xs cursor-pointer"
                      >
                        ⌫
                      </button>
                    </div>
                    <button
                      onClick={() => {
                        if (spellTyped.toLowerCase() === targetWord.toLowerCase()) {
                          setGameMsg(`🌟 Nice work! “${targetWord}”`);
                          setTimeout(() => {
                            setRoundIdx((i) => i + 1);
                            setSpellTyped('');
                            setGameMsg('');
                          }, 1300);
                        } else {
                          setGameMsg(`Almost! Want another try? Target: ${targetWord}`);
                        }
                      }}
                      className="px-4 py-2 rounded-xl bg-[#2d6a4f] text-white font-bold text-xs cursor-pointer"
                    >
                      ✅ Check
                    </button>
                  </div>
                )}

                {gameMsg && <div className="text-sm font-bold text-[#15803d]">{gameMsg}</div>}

                <label className="inline-flex items-center gap-2 text-xs text-[#40916c] cursor-pointer pt-2">
                  <input
                    type="checkbox"
                    checked={fullAlphabet}
                    onChange={(e) => {
                      const on = e.target.checked;
                      setFullAlphabet(on);
                      setSpellTyped('');
                      setSpellTilesUsed([]);
                      try {
                        localStorage.setItem('hg_spell_az', on ? '1' : '0');
                      } catch {
                        // ignore
                      }
                    }}
                    className="accent-[#2d6a4f]"
                  />
                  Challenge: full alphabet keyboard
                </label>
              </div>
            );
          }

          // 3. Rich Comic Studio
          if (gameKind === 'comic') {
            return (
              <ComicStudio
                kid={kid}
                starterLines={kit.lines}
                speakEnabled={speakEnabled}
                onBack={() => setGameKind(null)}
              />
            );
          }

          // 4. Multiple-choice gentle rounds (match, sight, math)
          const q = quizItems[roundIdx];
          return (
            <div className="p-5 rounded-3xl bg-white border-2 border-[#74c69d] space-y-4 text-center">
              <div className="flex items-center justify-between">
                <button
                  onClick={() => setGameKind(null)}
                  className="px-3 py-1 rounded-xl bg-[#edf6f0] text-xs font-bold cursor-pointer"
                >
                  ← Games
                </button>
                <span className="text-xs font-bold text-[#40916c]">Question {roundIdx + 1} of 5</span>
              </div>

              <div className="text-base font-bold text-[#1b4332]">
                {q?.ask}{' '}
                <button
                  onClick={() => speakText(q?.say || '', true)}
                  className="px-2 py-1 rounded-lg bg-[#edf6f0] cursor-pointer"
                >
                  🔊
                </button>
              </div>

              {q?.bigPrompt && <div className="text-5xl font-bold py-2">{q.bigPrompt}</div>}

              <div className="grid grid-cols-3 gap-3 max-w-md mx-auto">
                {q?.opts.map((o, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      if (o.ok) {
                        setGameMsg('🌟 Nice trying!');
                        speakText('Nice trying!', speakEnabled);
                        setTimeout(() => {
                          const nx = roundIdx + 1;
                          setRoundIdx(nx);
                          setGameMsg('');
                          setTries(0);
                          if (quizItems[nx]) speakText(quizItems[nx].say, speakEnabled);
                        }, 1100);
                      } else {
                        const nextTries = tries + 1;
                        setTries(nextTries);
                        setGameMsg(nextTries >= 2 ? 'Hint: have another gentle look! 🙂' : 'Try another one 🙂');
                      }
                    }}
                    className="py-4 rounded-2xl bg-[#f4fbf6] hover:bg-[#d8f3dc] border-2 border-[#74c69d] text-xl font-bold cursor-pointer"
                  >
                    {o.label}
                  </button>
                ))}
              </div>
              {gameMsg && <div className="text-sm font-bold text-[#15803d]">{gameMsg}</div>}
            </div>
          );
        }

        // Little Kid School Hub Menu
        return (
          <div className="space-y-4">
            <div
              className="p-5 rounded-3xl border-2 border-[#74c69d] text-center space-y-1.5"
              style={{ backgroundColor: pObj.color, color: pObj.ink }}
            >
              <PersonIcon person={pObj} size="lg" />
              <h3 className="font-atlas text-xl font-bold">{kid}’s School Fun</h3>
              <p className="text-xs">Pick a game. Play a little, then rest. 🌱</p>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-[#95d5b2] space-y-3">
              <div className="font-bold text-sm text-[#1b4332]">🎮 Games</div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-center text-xs">
                <button
                  onClick={() => startLittleGame('spell')}
                  className="p-3 rounded-2xl bg-[#f4fbf6] hover:bg-[#d8f3dc] border border-[#95d5b2] space-y-1 cursor-pointer"
                >
                  <div className="text-2xl">🔤</div>
                  <div className="font-bold">My Words</div>
                </button>
                <button
                  onClick={() => startLittleGame('match')}
                  className="p-3 rounded-2xl bg-[#f4fbf6] hover:bg-[#d8f3dc] border border-[#95d5b2] space-y-1 cursor-pointer"
                >
                  <div className="text-2xl">{kid === 'Oliver' ? '🔠' : '🖼️'}</div>
                  <div className="font-bold">{kid === 'Oliver' ? 'Letter Match' : 'Word Match'}</div>
                </button>
                <button
                  onClick={() => startLittleGame('sight')}
                  className="p-3 rounded-2xl bg-[#f4fbf6] hover:bg-[#d8f3dc] border border-[#95d5b2] space-y-1 cursor-pointer"
                >
                  <div className="text-2xl">👀</div>
                  <div className="font-bold">Sight Words</div>
                </button>
                <button
                  onClick={() => startLittleGame('math')}
                  className="p-3 rounded-2xl bg-[#f4fbf6] hover:bg-[#d8f3dc] border border-[#95d5b2] space-y-1 cursor-pointer"
                >
                  <div className="text-2xl">➕</div>
                  <div className="font-bold">Math within 20</div>
                </button>
                <button
                  onClick={() => startLittleGame('comic')}
                  className="p-3 rounded-2xl bg-[#f4fbf6] hover:bg-[#d8f3dc] border border-[#95d5b2] space-y-1 cursor-pointer"
                >
                  <div className="text-2xl">🎨</div>
                  <div className="font-bold">Comic Studio</div>
                </button>
                <button
                  onClick={() => setMathGameOpen(true)}
                  className="p-3 rounded-2xl bg-[#fef3c7] hover:bg-[#fde68a] border border-[#f59e0b] space-y-1 cursor-pointer"
                >
                  <div className="text-2xl">🎮</div>
                  <div className="font-bold">Mirror Math Game</div>
                </button>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-[#95d5b2] space-y-2 text-xs">
              <div className="font-bold text-sm text-[#1b4332]">
                📝 {kid}’s Words This Week{' '}
                {spellingWords[kid]?.weekOf ? `(${spellingWords[kid].weekOf})` : ''}
              </div>
              {kidWords.length ? (
                <div className="flex flex-wrap gap-1.5">
                  {kidWords.map((w) => (
                    <button
                      key={w}
                      onClick={() => speakText(w, true)}
                      className="px-2.5 py-1 rounded-full bg-[#e9f5ec] border border-[#74c69d] font-bold cursor-pointer"
                    >
                      🔊 {w}
                    </button>
                  ))}
                </div>
              ) : (
                <p className="text-[#40916c]">Using starter practice words until a grown-up adds weekly words.</p>
              )}
            </div>

            <div className="p-4 rounded-2xl bg-white border border-[#95d5b2] space-y-2 text-xs">
              <div className="font-bold text-sm text-[#1b4332]">🔗 More to Explore</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {kit.links.map((lk) => (
                  <a
                    key={lk.name}
                    href={lk.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 rounded-xl bg-[#f4fbf6] border border-[#dcefe2] flex items-center gap-2 underline font-bold text-[#1d4ed8]"
                  >
                    <span className="text-lg no-underline">{lk.icon}</span>
                    <span>
                      {lk.name} ↗<div className="text-[10px] font-normal text-[#52796f]">{lk.note}</div>
                    </span>
                  </a>
                ))}
              </div>
            </div>

            {canEdit && isParentView && (
              <div className="p-4 rounded-2xl bg-[#f4fbf6] border border-[#74c69d] space-y-2 text-xs">
                <div className="font-bold text-sm text-[#1b4332]">✏️ Edit {kid}’s Weekly Spelling Words</div>
                <input
                  type="text"
                  value={spellWeekDraft}
                  onChange={(e) => setSpellWeekDraft(e.target.value)}
                  placeholder="Week of (e.g., Nov 30)"
                  className="w-full px-2.5 py-1.5 rounded-lg border border-[#95d5b2] bg-white"
                />
                <textarea
                  rows={4}
                  value={spellWordsDraft}
                  onChange={(e) => setSpellWordsDraft(e.target.value)}
                  placeholder="One word per line"
                  className="w-full px-2.5 py-1.5 rounded-lg border border-[#95d5b2] bg-white"
                />
                <div className="flex items-center gap-2">
                  <button
                    onClick={async () => {
                      const list = spellWordsDraft
                        .split('\n')
                        .map((x) => x.trim())
                        .filter(Boolean)
                        .slice(0, 20);
                      await onSaveSpelling(kid, spellWeekDraft.trim(), list);
                      setSavedSpellMsg(true);
                      setTimeout(() => setSavedSpellMsg(false), 1800);
                    }}
                    className="px-3 py-1.5 rounded-lg bg-[#2d6a4f] text-white font-bold cursor-pointer"
                  >
                    💾 Save Words
                  </button>
                  {savedSpellMsg && <span className="text-emerald-700 font-bold">Saved ✔</span>}
                </div>
              </div>
            )}
          </div>
        );
      })()}

      {/* CHASE: WORD OF THE DAY + PYTHON TIPS + HCEC */}
      {shownKid === 'Chase' && (() => {
        const w = WOTD_LIST[dIdx % WOTD_LIST.length];
        const tip = CODING_TIPS_LIST[dIdx % CODING_TIPS_LIST.length];
        return (
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-white border border-[#95d5b2] space-y-2 text-xs">
              <div className="font-bold text-sm text-[#1b4332]">📖 Word of the Day</div>
              <div className="text-xl font-bold text-[#0f766e]">
                {w.word}{' '}
                <button onClick={() => speakText(w.word, true)} className="text-sm cursor-pointer">
                  🔊
                </button>
              </div>
              <div className="text-[#40916c]">
                {w.pron} · <span className="px-2 py-0.5 rounded bg-[#f0fdfa] font-bold">{w.pos}</span>
              </div>
              <p className="text-sm text-[#1b4332]">{w.def}</p>
              <p className="italic text-[#355e47]">“{w.example}”</p>
              <div className="p-2 rounded-lg bg-[#f4fbf6] text-[11px]">🌱 Origin: {w.origin}</div>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-[#95d5b2] space-y-2 text-xs">
              <div className="font-bold text-sm text-[#1b4332]">💻 Python Code Tip of the Day</div>
              <div className="font-bold text-[#115e59]">{tip.title}</div>
              <p>{tip.tip}</p>
              {tip.code && (
                <pre className="p-3 rounded-xl bg-slate-900 text-emerald-300 overflow-x-auto text-[11px]">
                  {tip.code}
                </pre>
              )}
            </div>
          </div>
        );
      })()}

      {/* PRESTON: MINI CROSSWORD + LOGIC PUZZLE + SPANISH WOTD */}
      {shownKid === 'Preston' && (() => {
        const logic = LOGIC_PUZZLES_LIST[(Math.floor(dIdx / 3) + logicOffset) % LOGIC_PUZZLES_LIST.length];
        const sp = SPANISH_WORDS_LIST[dIdx % SPANISH_WORDS_LIST.length];
        return (
          <div className="space-y-4 text-xs">
            {/* 7x7 Crossword */}
            <div className="p-4 rounded-2xl bg-white border border-[#95d5b2] space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="font-bold text-sm text-[#4c1d95]">🧩 Crossword · {curXw.title}</div>
                <button
                  onClick={() => {
                    setXwOffset((o) => o + 1);
                    setXwFill({});
                    setXwMsg('');
                  }}
                  className="px-2.5 py-1 rounded bg-[#f5f3ff] border border-[#c4b5fd] text-[11px] font-bold cursor-pointer"
                >
                  Next Mini →
                </button>
              </div>

              <div className="grid grid-cols-7 gap-1 max-w-[280px] mx-auto">
                {curXw.grid.map((rowStr, r) =>
                  rowStr.split('').map((ch, c) => {
                    const key = `${r},${c}`;
                    if (ch === '#') {
                      return <div key={key} className="aspect-square bg-slate-900 rounded" />;
                    }
                    const sel = xwSel[0] === r && xwSel[1] === c;
                    return (
                      <div
                        key={key}
                        onClick={() => setXwSel([r, c])}
                        className={`relative aspect-square border rounded flex items-center justify-center font-bold text-sm cursor-pointer ${
                          sel ? 'bg-[#ede9fe] border-[#6d28d9]' : 'bg-white border-slate-300'
                        }`}
                      >
                        {xwInfo.num[key] && (
                          <span className="absolute top-0 left-0.5 text-[8px] text-slate-500">
                            {xwInfo.num[key]}
                          </span>
                        )}
                        <input
                          maxLength={1}
                          value={xwFill[key] || ''}
                          onChange={(e) => {
                            const val = e.target.value.replace(/[^a-zA-Z]/g, '').toUpperCase();
                            setXwFill((prev) => ({ ...prev, [key]: val }));
                          }}
                          className="w-full h-full text-center bg-transparent font-bold uppercase focus:outline-none"
                        />
                      </div>
                    );
                  })
                )}
              </div>

              <div className="flex flex-wrap gap-2 justify-center">
                <button
                  onClick={() => {
                    let wrong = 0;
                    curXw.grid.forEach((rowStr, r) =>
                      rowStr.split('').forEach((ch, c) => {
                        const k = `${r},${c}`;
                        if (ch !== '#' && xwFill[k] && xwFill[k] !== ch) wrong++;
                      })
                    );
                    setXwMsg(wrong === 0 ? 'Everything filled so far looks right ✔' : `${wrong} square(s) need another look.`);
                  }}
                  className="px-2.5 py-1 rounded bg-[#f5f3ff] border border-[#c4b5fd] font-bold cursor-pointer"
                >
                  ✔ Check
                </button>
                <button
                  onClick={() => {
                    const [r, c] = xwSel;
                    const ans = curXw.grid[r]?.[c];
                    if (ans && ans !== '#') setXwFill((p) => ({ ...p, [`${r},${c}`]: ans }));
                  }}
                  className="px-2.5 py-1 rounded bg-white border border-slate-300 cursor-pointer"
                >
                  Reveal Square
                </button>
              </div>
              {xwMsg && <div className="text-center font-bold text-[#4c1d95]">{xwMsg}</div>}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px]">
                <div>
                  <div className="font-bold text-[#5b21b6] mb-1">Across</div>
                  {curXw.across.map(([num, clue]) => (
                    <div key={`a-${num}`}>
                      <strong>{num}.</strong> {clue}
                    </div>
                  ))}
                </div>
                <div>
                  <div className="font-bold text-[#5b21b6] mb-1">Down</div>
                  {curXw.down.map(([num, clue]) => (
                    <div key={`d-${num}`}>
                      <strong>{num}.</strong> {clue}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Logic Puzzle */}
            <div className="p-4 rounded-2xl bg-white border border-[#95d5b2] space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-[#1b4332]">🧠 Logic Puzzle · {logic.title}</span>
                <button
                  onClick={() => {
                    setLogicOffset((o) => o + 1);
                    setShowLogicHint(false);
                    setShowLogicAns(false);
                  }}
                  className="px-2 py-0.5 rounded bg-[#edf6f0] font-bold cursor-pointer"
                >
                  Next →
                </button>
              </div>
              <p className="text-xs leading-relaxed">{logic.puzzle}</p>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowLogicHint((v) => !v)}
                  className="px-2.5 py-1 rounded bg-[#edf6f0] font-bold cursor-pointer"
                >
                  💡 Hint
                </button>
                <button
                  onClick={() => setShowLogicAns((v) => !v)}
                  className="px-2.5 py-1 rounded bg-[#edf6f0] font-bold cursor-pointer"
                >
                  👀 Reveal Answer
                </button>
              </div>
              {showLogicHint && <div className="p-2 rounded bg-[#fef9c3]">Hint: {logic.hint}</div>}
              {showLogicAns && <div className="p-2 rounded bg-[#d8f3dc] font-semibold">{logic.answer}</div>}
            </div>

            {/* Optional Spanish Word of the Day */}
            {showSpanish ? (
              <div className="p-4 rounded-2xl bg-white border border-[#95d5b2] space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-[#1b4332]">🇪🇸 Spanish Word of the Day</span>
                  <button onClick={() => setShowSpanish(false)} className="underline cursor-pointer">
                    Hide
                  </button>
                </div>
                <div className="text-lg font-bold text-[#1d4ed8]">
                  {sp.es} — <span className="text-[#1b4332] font-normal">{sp.en}</span>{' '}
                  <button onClick={() => speakText(sp.es, true)} className="cursor-pointer">
                    🔊
                  </button>
                </div>
                <div className="italic">“{sp.ex}”</div>
                <div className="text-[#52796f]">{sp.exEn}</div>
              </div>
            ) : (
              <button onClick={() => setShowSpanish(true)} className="underline text-[#1b4332] cursor-pointer">
                🇪🇸 Show Spanish Word of the Day
              </button>
            )}
          </div>
        );
      })()}

      {/* SCHOOL EVENTS PREVIEW */}
      {(shownKid === 'Chase' || shownKid === 'Preston') && (
        <div className="p-4 rounded-2xl bg-white border border-[#95d5b2] space-y-2 text-xs">
          <div className="font-bold text-sm text-[#1b4332]">📅 Upcoming School Dates ({shownKid})</div>
          {calendarEvents
            .filter(
              (e) =>
                e.start.slice(0, 10) >= isoDateLocal() &&
                /school|cccc|hcec|exam|holiday|break|workday|early|release|preston|chase/i.test(
                  `${e.title} ${e.location}`
                )
            )
            .slice(0, 8)
            .map((e) => (
              <div key={e.id} className="p-2 rounded bg-[#f4fbf6] border border-[#dcefe2]">
                <strong>{e.start.slice(0, 10)}:</strong> {e.title}
              </div>
            ))}
        </div>
      )}

      {/* Fullscreen Reverse-Multiply MathGame modal */}
      {mathGameOpen && (
        <div className="fixed inset-0 z-[80] bg-slate-950 flex flex-col">
          <div className="p-2 flex justify-end bg-slate-900 border-b border-slate-700">
            <button
              onClick={() => setMathGameOpen(false)}
              className="px-4 py-1.5 rounded-lg bg-white text-slate-900 font-bold text-xs cursor-pointer"
            >
              ✕ Close Math Game
            </button>
          </div>
          <iframe src="/quests/MathGame.html" title="Mirror Math Game" className="flex-1 w-full border-0" />
        </div>
      )}
    </div>
  );
}
