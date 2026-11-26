import { useState } from 'react';
import type { User } from 'firebase/auth';
import { signInWithGoogle, signOutUser } from '../firebase';
import { ASSETS } from '../data/assetMeta';

interface AuthGateProps {
  user: User | null;
  unauthorized: boolean;
}

export function AuthGate({ user, unauthorized }: AuthGateProps) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSignIn() {
    setBusy(true);
    setError(null);
    try {
      await signInWithGoogle();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Sign-in failed. Please try again.';
      setError(msg);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="relative h-screen w-screen flex items-center justify-center p-4 bg-[#211710] overflow-hidden">
      {ASSETS['world-map']?.src && (
        <img
          src={ASSETS['world-map'].src}
          alt=""
          className="absolute inset-0 w-full h-full object-cover opacity-25 blur-[2px] scale-105 pointer-events-none"
        />
      )}
      <div className="relative z-10 parchment-panel rounded-2xl max-w-md w-full p-6 text-center space-y-5">
        <div className="mx-auto w-16 h-16 rounded-full bg-gradient-to-br from-[#ffd166] via-[#c77dff] to-[#00bbf9] p-[3px] shadow-lg">
          <div className="w-full h-full rounded-full bg-[#2b1d13] flex items-center justify-center font-atlas font-bold text-xl text-[#fbe8b5]">
            AI
          </div>
        </div>

        <div className="space-y-1">
          <h1 className="font-atlas text-2xl font-bold text-[#331d0b]">Cairnspire University</h1>
          <p className="text-xs font-semibold uppercase tracking-wider text-[#7c5021]">
            Living Parchment Campus · Stage 0 Ratified
          </p>
        </div>

        {unauthorized && user ? (
          <div className="space-y-4">
            <div className="p-3.5 rounded-xl bg-[#fff4e6] border border-[#b07b42] text-left text-xs text-[#4a2b0f] space-y-1.5">
              <div className="font-bold">Campus Invitation Required</div>
              <p>
                Signed in as <strong>{user.email}</strong>, which is not yet on the Cairnspire
                University or Home &amp; Garden allowlist.
              </p>
              <p className="text-[#7c5021]">
                Per Article III of the Preliminary Bill of Rights, access is strictly restricted to
                authorized accounts.
              </p>
            </div>
            <button
              onClick={() => void signOutUser()}
              className="w-full py-2.5 px-4 rounded-xl bg-[#402c1e] hover:bg-[#573c29] text-[#fbe8b5] font-semibold text-sm transition cursor-pointer"
            >
              Sign Out &amp; Switch Account
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-[#4a2f17] leading-relaxed">
              Sign in with your Google account to enter the 14-hall Campus (Chancellor &amp; Ray) or
              your family sanctuary in <strong>Home and Garden</strong>.
            </p>
            <button
              onClick={() => void handleSignIn()}
              disabled={busy}
              className="w-full py-3 px-4 rounded-xl bg-[#2b1d13] hover:bg-[#3f2a1b] disabled:opacity-60 text-[#fbe8b5] font-semibold text-sm border border-[#a57b42] shadow-md transition flex items-center justify-center gap-2.5 cursor-pointer"
            >
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" aria-hidden="true">
                <path
                  fill="#EA4335"
                  d="M12 5.04c1.94 0 3.68.67 5.05 1.98l3.77-3.77C18.54 1.19 15.55 0 12 0 7.31 0 3.25 2.69 1.28 6.61l4.4 3.41C6.72 7.06 9.14 5.04 12 5.04z"
                />
                <path
                  fill="#4285F4"
                  d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.58l3.88 3.01c2.26-2.09 3.54-5.17 3.54-8.83z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.68 14.02A7.13 7.13 0 0 1 5.31 12c0-.7.12-1.38.37-2.02l-4.4-3.41A11.97 11.97 0 0 0 0 12c0 1.94.46 3.77 1.28 5.43l4.4-3.41z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.95-1.08 7.95-2.91l-3.88-3.01c-1.08.72-2.45 1.16-4.07 1.16-2.86 0-5.28-2.02-6.32-4.73l-4.4 3.41C3.25 21.31 7.31 24 12 24z"
                />
              </svg>
              <span>{busy ? 'Opening Google Sign-In…' : 'Sign in with Google'}</span>
            </button>
            {error && (
              <div className="p-2.5 rounded-lg bg-red-100 border border-red-300 text-xs text-red-800">
                {error}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
