import { initializeApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  signOut,
  type User,
} from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

export async function signInWithGoogle(): Promise<void> {
  try {
    await signInWithPopup(auth, googleProvider);
  } catch (err: unknown) {
    const code = (err as { code?: string })?.code || '';
    if (
      code === 'auth/popup-blocked' ||
      code === 'auth/operation-not-supported-in-this-environment'
    ) {
      await signInWithRedirect(auth, googleProvider);
      return;
    }
    throw err;
  }
}

export async function signOutUser(): Promise<void> {
  await signOut(auth);
}

export type CampusRole = 'chancellor' | 'university' | 'guest' | 'family' | 'unauthorized';

function parseEmailList(raw: string | undefined): Set<string> {
  if (!raw) return new Set();
  return new Set(
    raw
      .split(',')
      .map((s) => s.trim().toLowerCase())
      .filter(Boolean)
  );
}

const CHANCELLOR_EMAILS = parseEmailList(
  import.meta.env.VITE_CHANCELLOR_EMAILS || 'amarette83@gmail.com'
);
const UNIVERSITY_EMAILS = parseEmailList(import.meta.env.VITE_UNIVERSITY_EMAILS);
const GUEST_EMAILS = parseEmailList(import.meta.env.VITE_GUEST_EMAILS);
const FAMILY_EMAILS = parseEmailList(import.meta.env.VITE_FAMILY_EMAILS);

export function resolveUserRole(user: User | null): CampusRole {
  const email = user?.email?.trim().toLowerCase();
  if (!email) return 'unauthorized';
  if (CHANCELLOR_EMAILS.has(email)) return 'chancellor';
  if (UNIVERSITY_EMAILS.has(email)) return 'university';
  if (GUEST_EMAILS.has(email)) return 'guest';
  if (FAMILY_EMAILS.has(email)) return 'family';
  return 'unauthorized';
}
