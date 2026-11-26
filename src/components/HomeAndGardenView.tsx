import { useState } from 'react';
import { ASSETS } from '../data/assetMeta';
import { signOutUser } from '../firebase';

interface HomeAndGardenViewProps {
  canExitToCampus: boolean;
  onExitToCampus?: () => void;
  userEmail?: string | null;
}

interface KidProfile {
  name: string;
  age: number;
  emoji: string;
  bg: string;
  pin: string;
}

const KIDS: KidProfile[] = [
  { name: 'Liam', age: 7, emoji: '🦕', bg: 'bg-[#d8f3dc]', pin: '1234' },
  { name: 'Oliver', age: 5, emoji: '🚀', bg: 'bg-[#fff3b0]', pin: '5678' },
];

export function HomeAndGardenView({
  canExitToCampus,
  onExitToCampus,
  userEmail,
}: HomeAndGardenViewProps) {
  const [selectedKid, setSelectedKid] = useState<KidProfile | null>(null);
  const [enteredPin, setEnteredPin] = useState('');
  const [pinError, setPinError] = useState(false);
  const [activeKid, setActiveKid] = useState<KidProfile | null>(null);
  const [chores, setChores] = useState([
    { id: 'bed', label: 'Make bed & put books on shelf', done: false },
    { id: 'hamper', label: 'Put dirty clothes in hamper', done: false },
    { id: 'pets', label: 'Feed pets & check water bowl', done: false },
  ]);

  function handleDigit(d: string) {
    if (!selectedKid || enteredPin.length >= 4) return;
    const next = enteredPin + d;
    setEnteredPin(next);
    setPinError(false);
    if (next.length === 4) {
      if (next === selectedKid.pin) {
        setActiveKid(selectedKid);
        setEnteredPin('');
      } else {
        setPinError(true);
        setTimeout(() => setEnteredPin(''), 350);
      }
    }
  }

  function resetToPicker() {
    setActiveKid(null);
    setSelectedKid(null);
    setEnteredPin('');
    setPinError(false);
  }

  return (
    <section className="fixed inset-0 z-50 bg-gradient-to-b from-[#e9f5ec] to-[#d4ebd9] text-[#1b4332] flex flex-col overflow-y-auto">
      <div className="flex items-center justify-between gap-2 px-4 py-3 bg-[#2d6a4f] text-white shadow">
        <div className="min-w-0">
          <h2 className="font-atlas text-lg font-bold truncate">Home and Garden</h2>
          <p className="text-xs text-[#b7e4c7] truncate">
            Family Wing Only · Other Campus Buildings Hidden &amp; Server-Locked
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {canExitToCampus && onExitToCampus ? (
            <button
              onClick={onExitToCampus}
              className="px-3 py-1.5 rounded-lg bg-white/15 hover:bg-white/25 text-xs font-semibold border border-white/30 cursor-pointer"
            >
              Exit Preview → Campus
            </button>
          ) : (
            <button
              onClick={() => void signOutUser()}
              className="px-3 py-1.5 rounded-lg bg-white/15 hover:bg-white/25 text-xs font-semibold border border-white/30 cursor-pointer"
              title={userEmail || 'Sign out'}
            >
              Sign Out
            </button>
          )}
        </div>
      </div>

      {!activeKid ? (
        <div className="max-w-lg w-full mx-auto p-5 space-y-5">
          <div className="flex flex-col items-center text-center space-y-2">
            {ASSETS['crop-home-garden']?.src && (
              <img
                src={ASSETS['crop-home-garden'].src}
                alt="Home and Garden"
                className="w-44 h-auto rounded-xl border-2 border-[#74c69d] shadow-md"
              />
            )}
            <h3 className="font-atlas text-xl font-bold text-[#1b4332]">Who is checking in?</h3>
            <p className="text-xs text-[#2d6a4f]">
              Tap your picture and enter your secret PIN (only parents can set or change PINs).
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {KIDS.map((kid) => (
              <button
                key={kid.name}
                onClick={() => {
                  setSelectedKid(kid);
                  setEnteredPin('');
                  setPinError(false);
                }}
                className="p-4 rounded-2xl bg-white border-2 border-[#74c69d] shadow hover:shadow-md flex flex-col items-center gap-2 transition cursor-pointer"
              >
                <div
                  className={`w-16 h-16 rounded-full ${kid.bg} flex items-center justify-center text-3xl`}
                >
                  {kid.emoji}
                </div>
                <div className="font-bold text-base">{kid.name}</div>
                <div className="text-xs text-[#40916c]">
                  Age {kid.age} · Demo PIN: {kid.pin}
                </div>
              </button>
            ))}
          </div>

          {selectedKid && (
            <div className="bg-white rounded-2xl p-4 border-2 border-[#52b788] shadow space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm">
                  Enter {selectedKid.name}’s 4-Digit PIN
                </span>
                <button
                  onClick={() => {
                    setSelectedKid(null);
                    setEnteredPin('');
                  }}
                  className="text-xs text-[#52796f] underline cursor-pointer"
                >
                  Switch Person
                </button>
              </div>

              <div className="flex justify-center gap-3 py-1 text-2xl tracking-widest font-mono text-[#1b4332]">
                {[0, 1, 2, 3].map((i) => (i < enteredPin.length ? '●' : '○')).join(' ')}
              </div>

              {pinError && (
                <div className="text-center text-xs font-semibold text-red-600">
                  Try again! Ask Mom or Dad if you forgot your PIN.
                </div>
              )}

              <div className="grid grid-cols-3 gap-2 max-w-[240px] mx-auto">
                {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((d) => (
                  <button
                    key={d}
                    onClick={() => handleDigit(d)}
                    className="py-3 rounded-xl bg-[#edf6f0] hover:bg-[#d8f3dc] font-bold text-lg cursor-pointer"
                  >
                    {d}
                  </button>
                ))}
                <button
                  onClick={() => {
                    setEnteredPin('');
                    setPinError(false);
                  }}
                  className="py-3 rounded-xl bg-[#f4e4c1] font-semibold text-xs cursor-pointer"
                >
                  Clear
                </button>
                <button
                  onClick={() => handleDigit('0')}
                  className="py-3 rounded-xl bg-[#edf6f0] hover:bg-[#d8f3dc] font-bold text-lg cursor-pointer"
                >
                  0
                </button>
                <button
                  onClick={() => setEnteredPin((p) => p.slice(0, -1))}
                  className="py-3 rounded-xl bg-[#f4e4c1] font-semibold text-xs cursor-pointer"
                >
                  ⌫
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="max-w-lg w-full mx-auto p-5 space-y-4">
          <div className="flex items-center justify-between bg-white rounded-2xl p-4 border border-[#74c69d] shadow-sm">
            <div>
              <h3 className="font-atlas text-lg font-bold">
                Welcome to Home and Garden, {activeKid.name}!
              </h3>
              <p className="text-xs text-[#40916c]">No campus map visible · Parent-locked PIN</p>
            </div>
            <button
              onClick={resetToPicker}
              className="px-3 py-1.5 rounded-lg bg-[#d8f3dc] text-xs font-semibold text-[#1b4332] cursor-pointer"
            >
              Switch
            </button>
          </div>

          <div className="bg-white rounded-2xl p-4 border border-[#74c69d] space-y-2.5">
            <div className="font-bold text-sm">Today’s Chores (v1 Preview)</div>
            {chores.map((c) => (
              <label
                key={c.id}
                className="flex items-center gap-3 p-2.5 rounded-xl bg-[#f4fbf6] cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={c.done}
                  onChange={() =>
                    setChores((prev) =>
                      prev.map((item) => (item.id === c.id ? { ...item, done: !item.done } : item))
                    )
                  }
                  className="w-5 h-5 accent-[#2d6a4f]"
                />
                <span className={`text-sm ${c.done ? 'line-through text-[#52796f]' : ''}`}>
                  {c.label}
                </span>
              </label>
            ))}
          </div>

          <div className="bg-white rounded-2xl p-4 border border-[#74c69d] space-y-2">
            <div className="font-bold text-sm">Family Chat (Home and Garden Only)</div>
            <div className="text-xs bg-[#edf6f0] p-2.5 rounded-xl">
              <strong>Mom:</strong> Great job on chores today! 🌟
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
